const express = require("express");
const { read, update } = require("../services/store");
const { authRequired } = require("../middleware/auth");
const { rankForXp } = require("../services/progression");

const router = express.Router();
router.use(authRequired);

function getProgress(data, userId) {
  return data.progress.find((item) => item.userId === userId);
}

function safeCase(caseData) {
  const { challenge, ...rest } = caseData;
  return {
    ...rest,
    challenge: {
      id: challenge.id,
      language: challenge.language,
      starterCode: challenge.starterCode,
      hint: challenge.hint,
      tests: challenge.tests.map(({ expectedOutput, ...test }) => test)
    }
  };
}

function ensureCaseProgress(progress, caseData) {
  progress.completedStages = progress.completedStages || {};
  return progress.completedStages[caseData.id] || {
    currentStage: caseData.stages[0],
    completedStages: [],
    completed: false
  };
}

router.get("/", (req, res) => {
  const data = read();
  const progress = getProgress(data, req.user.sub);
  res.json({
    cases: data.cases.map((caseData) => ({
      ...safeCase(caseData),
      locked: !(progress?.unlockedCaseIds || []).includes(caseData.id)
    }))
  });
});

router.get("/:id", (req, res) => {
  const data = read();
  const caseData = data.cases.find((item) => item.id === req.params.id);
  const progress = getProgress(data, req.user.sub);
  if (!caseData) return res.status(404).json({ error: "Case not found" });
  if (!(progress?.unlockedCaseIds || []).includes(caseData.id)) return res.status(403).json({ error: "Case is locked" });

  res.json({
    case: safeCase(caseData),
    progress: ensureCaseProgress(progress, caseData),
    evidence: caseData.evidence.map(({ condition, ...evidence }) => evidence)
  });
});

router.get("/:id/progress", (req, res) => {
  const data = read();
  const caseData = data.cases.find((item) => item.id === req.params.id);
  const progress = getProgress(data, req.user.sub);
  if (!caseData) return res.status(404).json({ error: "Case not found" });

  const caseProgress = progress?.completedStages?.[caseData.id] || null;
  const discoveredEvidence = (progress?.discoveredEvidence || []).filter((item) => item.caseId === caseData.id);
  const submissions = data.submissions.filter((item) => item.userId === req.user.sub && item.caseId === caseData.id);
  const latestSubmission = submissions[submissions.length - 1] || null;

  res.json({
    locked: !(progress?.unlockedCaseIds || []).includes(caseData.id),
    progress: caseProgress,
    discoveredEvidence,
    latestSubmission
  });
});

router.post("/:id/start", (req, res) => {
  const data = read();
  const caseData = data.cases.find((item) => item.id === req.params.id);
  const progress = getProgress(data, req.user.sub);
  if (!caseData) return res.status(404).json({ error: "Case not found" });
  if (!(progress?.unlockedCaseIds || []).includes(caseData.id)) return res.status(403).json({ error: "Case is locked" });

  const state = ensureCaseProgress(progress, caseData);
  progress.completedStages[caseData.id] = state;
  update(() => data);
  res.json({ progress: state });
});

router.post("/:id/stage", (req, res) => {
  const { stage } = req.body || {};
  const data = read();
  const caseData = data.cases.find((item) => item.id === req.params.id);
  const progress = getProgress(data, req.user.sub);
  if (!caseData) return res.status(404).json({ error: "Case not found" });
  if (!progress?.unlockedCaseIds?.includes(caseData.id)) return res.status(403).json({ error: "Case is locked" });

  const nextIndex = caseData.stages.indexOf(stage);
  if (nextIndex < 0) return res.status(400).json({ error: "Invalid case stage" });

  const state = ensureCaseProgress(progress, caseData);
  const currentIndex = caseData.stages.indexOf(state.currentStage);
  if (nextIndex > currentIndex + 1) {
    return res.status(409).json({ error: "Case stages must be completed in order", currentStage: state.currentStage });
  }

  state.currentStage = stage;
  state.completedStages = [...new Set([...(state.completedStages || []), stage])];
  progress.completedStages[caseData.id] = state;
  update(() => data);
  res.json({ progress: state });
});

router.post("/:id/lesson/complete", (req, res) => {
  const data = read();
  const caseData = data.cases.find((item) => item.id === req.params.id);
  const progress = getProgress(data, req.user.sub);
  if (!caseData) return res.status(404).json({ error: "Case not found" });
  if (!progress?.unlockedCaseIds?.includes(caseData.id)) return res.status(403).json({ error: "Case is locked" });

  const state = ensureCaseProgress(progress, caseData);
  state.currentStage = "INVESTIGATE";
  state.completedStages = [...new Set([...(state.completedStages || []), "LEARN", "INVESTIGATE"])];
  progress.completedLessons = [...new Set([...(progress.completedLessons || []), caseData.id])];
  progress.completedStages[caseData.id] = state;
  update(() => data);
  res.json({ completed: true, progress: state });
});

router.post("/:id/evidence/:evidenceId/discover", (req, res) => {
  const data = read();
  const caseData = data.cases.find((item) => item.id === req.params.id);
  const progress = getProgress(data, req.user.sub);
  if (!caseData) return res.status(404).json({ error: "Case not found" });
  if (!progress?.unlockedCaseIds?.includes(caseData.id)) return res.status(403).json({ error: "Case is locked" });

  const evidence = caseData.evidence.find((item) => item.id === req.params.evidenceId);
  if (!evidence) return res.status(404).json({ error: "Evidence not found" });

  progress.discoveredEvidence = progress.discoveredEvidence || [];
  if (!progress.discoveredEvidence.some((item) => item.caseId === caseData.id && item.evidenceId === evidence.id)) {
    progress.discoveredEvidence.push({ caseId: caseData.id, evidenceId: evidence.id, discoveredAt: new Date().toISOString() });
  }
  update(() => data);
  res.json({ evidence: { id: evidence.id, code: evidence.code, text: evidence.text } });
});

router.post("/:id/complete", (req, res) => {
  const data = read();
  const caseData = data.cases.find((item) => item.id === req.params.id);
  const progress = getProgress(data, req.user.sub);
  if (!caseData) return res.status(404).json({ error: "Case not found" });
  if (!progress?.unlockedCaseIds?.includes(caseData.id)) return res.status(403).json({ error: "Case is locked" });

  const state = ensureCaseProgress(progress, caseData);
  const solvedSubmission = [...data.submissions].reverse().find(
    (submission) => submission.userId === req.user.sub && submission.challengeId === caseData.challenge.id && submission.passed
  );
  if (!state.completedStages?.includes("SOLVE") || !solvedSubmission) {
    return res.status(409).json({ error: "Complete the case stages and pass the coding challenge first" });
  }

  if (state.completed) return res.json({ alreadyCompleted: true, progress });

  state.completed = true;
  progress.xp += caseData.xpReward;
  progress.rank = rankForXp(progress.xp);
  progress.level = Math.floor(progress.xp / 500) + 1;
  progress.casesSolved += 1;

  const next = data.cases.find((item) => item.prerequisiteCaseId === caseData.id);
  if (next && !progress.unlockedCaseIds.includes(next.id)) progress.unlockedCaseIds.push(next.id);

  data.xpTransactions.push({
    id: `${Date.now()}-${req.user.sub}`,
    userId: req.user.sub,
    caseId: caseData.id,
    amount: caseData.xpReward,
    reason: "case_completed",
    createdAt: new Date().toISOString()
  });

  update(() => data);
  res.json({
    completed: true,
    xpAwarded: caseData.xpReward,
    xp: progress.xp,
    rank: progress.rank,
    level: progress.level,
    nextCaseUnlocked: next?.id || null
  });
});

module.exports = router;
