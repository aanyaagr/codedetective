const express = require("express");
const { insert, update } = require("../services/db");
const { authRequired } = require("../middleware/auth");
const { executeChallenge } = require("../services/codeExecution");
const { advanceStage, caseState, withDiscovered } = require("../services/progression");
const { loadCaseByChallenge, getProgress } = require("../services/caseData");

const router = express.Router();
router.use(authRequired);

const toRunnable = (challenge, tests) => ({
  id: challenge.id,
  language: challenge.language,
  tests: [...tests]
    .sort((a, b) => Number(a.hidden) - Number(b.hidden) || String(a.id).localeCompare(String(b.id)))
    .map((t) => ({ id: t.id, name: t.name, stdin: t.stdin || "", expectedOutput: t.expected_output, hidden: !!t.hidden })),
});

// Evidence earned by a run: failing uncovers "failed_test" clues; a passing submission uncovers everything.
function evidenceFor(evidence, result, isSubmit) {
  if (result.passed && isSubmit) return evidence.map((e) => e.id);
  if (!result.passed) return evidence.filter((e) => e.condition === "failed_test").map((e) => e.id);
  return [];
}

async function handle(req, res, next, isSubmit) {
  try {
    const { challengeId, code } = req.body || {};
    const data = await loadCaseByChallenge(String(challengeId || ""));
    if (!data || !data.challenge) return res.status(404).json({ error: "Challenge not found" });
    const before = await getProgress(req.user.sub);
    if (!(before?.unlocked_case_ids || []).includes(data.case.id)) return res.status(403).json({ error: "Case is locked" });

    // Execute first, then re-read progress so a slow run can't overwrite newer progress.
    const result = await executeChallenge(toRunnable(data.challenge, data.tests), code);
    const p = await getProgress(req.user.sub);
    const c = data.case;

    let submissionId = null;
    if (isSubmit) {
      const submission = await insert("submissions", {
        user_id: req.user.sub, challenge_id: data.challenge.id, case_id: c.id, passed: !!result.passed,
        score: result.score || 0, tests_passed: result.testsPassed || 0, tests_total: result.testsTotal || data.tests.length,
      });
      submissionId = submission.id;
    }
    let stages = advanceStage(p, c.id, "CODE");
    if (isSubmit && result.passed) stages = advanceStage({ completed_stages: stages }, c.id, "EVIDENCE");
    const { list, added } = withDiscovered(p, c.id, evidenceFor(data.evidence, result, isSubmit));
    await update("progress", { user_id: req.user.sub }, { completed_stages: stages, discovered_evidence: list });

    res.json({
      ...result,
      submissionId,
      evidenceDiscovered: data.evidence.filter((e) => added.includes(e.id)).map((e) => ({ id: e.id, code: e.code, text: e.text })),
      progress: caseState({ completed_stages: stages }, c.id),
    });
  } catch (e) {
    next(e);
  }
}

router.post("/run", (req, res, next) => handle(req, res, next, false));
router.post("/submit", (req, res, next) => handle(req, res, next, true));

module.exports = router;
