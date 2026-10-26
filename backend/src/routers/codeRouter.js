const express = require("express");
const { query, insert, update } = require("../services/db");
const { authRequired } = require("../middleware/auth");
const { executeChallenge } = require("../services/codeExecution");
const router = express.Router();
router.use(authRequired);

async function findChallenge(id) {
  const challenge = (await query("challenges", { filters: { id }, limit: 1 }))[0];
  if (!challenge) return null;
  const c = (await query("cases", { filters: { id: challenge.case_id }, limit: 1 }))[0];
  const tests = await query("challenge_tests", { filters: { challenge_id: id } });
  const evidence = await query("evidence", { filters: { case_id: c.id } });
  return { case: c, challenge: { id: challenge.id, language: challenge.language, starterCode: challenge.starter_code, hint: challenge.hint, tests: tests.map(t => ({ id: t.id, name: t.name, stdin: t.stdin, expectedOutput: t.expected_output, hidden: t.hidden })) }, evidence };
}
async function getProgress(userId) { return (await query("progress", { filters: { user_id: userId }, limit: 1 }))[0]; }

router.post("/run", async (req, res, next) => {
  try {
    const { challengeId, code } = req.body || {}, f = await findChallenge(challengeId), p = await getProgress(req.user.sub);
    if (!f) return res.status(404).json({ error: "Challenge not found" });
    if (!p?.unlocked_case_ids?.includes(f.case.id)) return res.status(403).json({ error: "Case is locked" });
    const r = await executeChallenge(f.challenge, code);
    res.json({ status: r.status, stdout: r.stdout || "", stderr: r.stderr || "", testsPassed: r.testsPassed ?? 0, testsTotal: r.testsTotal ?? f.challenge.tests.length, score: r.score ?? 0, passed: !!r.passed, tests: r.tests || [] });
  } catch (e) { next(e); }
});

router.post("/submit", async (req, res, next) => {
  try {
    const { challengeId, code } = req.body || {}, f = await findChallenge(challengeId), p = await getProgress(req.user.sub);
    if (!f) return res.status(404).json({ error: "Challenge not found" });
    if (!p?.unlocked_case_ids?.includes(f.case.id)) return res.status(403).json({ error: "Case is locked" });
    const r = await executeChallenge(f.challenge, code);
    const submission = await insert("submissions", { user_id: req.user.sub, challenge_id: challengeId, case_id: f.case.id, passed: !!r.passed, score: r.score || 0, tests_passed: r.testsPassed || 0, tests_total: r.testsTotal || f.challenge.tests.length });
    const condition = r.passed ? "passed_all_tests" : "failed_test";
    const discovered = [...(p.discovered_evidence || [])];
    for (const e of f.evidence.filter(x => x.condition === condition)) {
      if (!discovered.some(x => x.caseId === f.case.id && x.evidenceId === e.id)) discovered.push({ caseId: f.case.id, evidenceId: e.id, discoveredAt: new Date().toISOString() });
    }
    let stages = p.completed_stages || {};
    if (r.passed) {
      const s = stages[f.case.id] || { currentStage: "CODE", completedStages: [], completed: false };
      s.currentStage = "EVIDENCE"; s.completedStages = [...new Set([...(s.completedStages || []), "CODE", "EVIDENCE"])];
      stages = { ...stages, [f.case.id]: s };
    }
    await update("progress", { user_id: req.user.sub }, { discovered_evidence: discovered, completed_stages: stages });
    res.json({ ...r, submissionId: submission.id });
  } catch (e) { next(e); }
});
module.exports = router;
