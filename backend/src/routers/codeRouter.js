const express = require("express");
const { read, update } = require("../services/store");
const { authRequired } = require("../middleware/auth");
const { executeChallenge } = require("../services/codeExecution");

const router = express.Router();
router.use(authRequired);

function find(d, id) {
  for (const c of d.cases) {
    if (c.challenge.id === id) return { case: c, challenge: c.challenge };
  }
  return null;
}

router.post("/run", async (req, res, next) => {
  try {
    const { challengeId, code } = req.body || {};
    const d = read();
    const f = find(d, challengeId);
    const p = d.progress.find((x) => x.userId === req.user.sub);

    if (!f) return res.status(404).json({ error: "Challenge not found" });
    if (!p?.unlockedCaseIds.includes(f.case.id)) return res.status(403).json({ error: "Case is locked" });

    const r = await executeChallenge(f.challenge, code);
    res.json({
      status: r.status,
      stdout: r.stdout || "",
      stderr: r.stderr || "",
      testsPassed: r.testsPassed ?? 0,
      testsTotal: r.testsTotal ?? f.challenge.tests.length,
      score: r.score ?? 0,
      passed: !!r.passed,
      tests: r.tests || []
    });
  } catch (e) {
    next(e);
  }
});

router.post("/submit", async (req, res, next) => {
  try {
    const { challengeId, code } = req.body || {};
    const d = read();
    const f = find(d, challengeId);
    const p = d.progress.find((x) => x.userId === req.user.sub);

    if (!f) return res.status(404).json({ error: "Challenge not found" });
    if (!p?.unlockedCaseIds.includes(f.case.id)) return res.status(403).json({ error: "Case is locked" });

    const r = await executeChallenge(f.challenge, code);
    const submission = {
      id: `${Date.now()}-${req.user.sub}`,
      userId: req.user.sub,
      challengeId,
      caseId: f.case.id,
      passed: r.passed,
      score: r.score,
      testsPassed: r.testsPassed,
      testsTotal: r.testsTotal,
      createdAt: new Date().toISOString()
    };

    d.submissions.push(submission);
    p.discoveredEvidence = p.discoveredEvidence || [];
    const condition = r.passed ? "passed_all_tests" : "failed_test";

    for (const e of f.case.evidence.filter((x) => x.condition === condition)) {
      if (!p.discoveredEvidence.some((x) => x.caseId === f.case.id && x.evidenceId === e.id)) {
        p.discoveredEvidence.push({ caseId: f.case.id, evidenceId: e.id, discoveredAt: new Date().toISOString() });
      }
    }

    if (r.passed) {
      p.completedStages = p.completedStages || {};
      const s = p.completedStages[f.case.id] || { currentStage: "CODE", completedStages: [], completed: false };
      s.currentStage = "EVIDENCE";
      s.completedStages = [...new Set([...(s.completedStages || []), "CODE", "EVIDENCE"] )];
      p.completedStages[f.case.id] = s;
    }

    update(() => d);
    res.json({ ...r, submissionId: submission.id });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
