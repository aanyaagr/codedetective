const express = require("express");
const { query, update, insert } = require("../services/db");
const { authRequired } = require("../middleware/auth");
const { rankForXp } = require("../services/progression");
const router = express.Router();
router.use(authRequired);

async function getProgress(userId) { return (await query("progress", { filters: { user_id: userId }, limit: 1 }))[0]; }
async function getCase(id) { return (await query("cases", { filters: { id }, limit: 1 }))[0]; }
async function buildCase(c) {
  const challenge = (await query("challenges", { filters: { case_id: c.id }, limit: 1 }))[0];
  const tests = challenge ? await query("challenge_tests", { filters: { challenge_id: challenge.id } }) : [];
  const evidence = await query("evidence", { filters: { case_id: c.id } });
  return { ...c, stages: c.stages || [], lesson: c.lesson || {}, resolution: c.resolution || {}, challenge: challenge ? { id: challenge.id, language: challenge.language, starterCode: challenge.starter_code, hint: challenge.hint, tests: tests.map(({ expected_output, ...t }) => ({ ...t, expectedOutput: undefined })) } : null, evidence };
}
function safeCase(c) {
  return { ...c, challenge: c.challenge ? { ...c.challenge, tests: c.challenge.tests.map(t => { const { expected_output, expectedOutput, ...safe } = t; return safe; }) } : null, evidence: undefined };
}

router.get("/", async (req, res, next) => {
  try {
    const p = await getProgress(req.user.sub);
    const cases = await query("cases");
    res.json({ cases: await Promise.all(cases.map(async c => ({ ...safeCase(await buildCase(c)), locked: !(p?.unlocked_case_ids || []).includes(c.id) }))) });
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const c = await getCase(req.params.id), p = await getProgress(req.user.sub);
    if (!c) return res.status(404).json({ error: "Case not found" });
    if (!(p?.unlocked_case_ids || []).includes(c.id)) return res.status(403).json({ error: "Case is locked" });
    const full = await buildCase(c), state = p.completed_stages?.[c.id] || { currentStage: c.stages[0], completedStages: [], completed: false };
    res.json({ case: safeCase(full), progress: state, evidence: (full.evidence || []).map(({ condition, ...e }) => e) });
  } catch (e) { next(e); }
});

router.get("/:id/progress", async (req, res, next) => {
  try {
    const c = await getCase(req.params.id), p = await getProgress(req.user.sub);
    if (!c) return res.status(404).json({ error: "Case not found" });
    const submissions = await query("submissions", { filters: { user_id: req.user.sub, case_id: c.id }, order: { column: "created_at", ascending: false }, limit: 1 });
    const discovered = (p?.discovered_evidence || []).filter(x => x.caseId === c.id);
    res.json({ locked: !(p?.unlocked_case_ids || []).includes(c.id), progress: p?.completed_stages?.[c.id] || null, discoveredEvidence: discovered, latestSubmission: submissions[0] || null });
  } catch (e) { next(e); }
});

router.post("/:id/start", async (req, res, next) => {
  try {
    const c = await getCase(req.params.id), p = await getProgress(req.user.sub);
    if (!c) return res.status(404).json({ error: "Case not found" });
    if (!(p?.unlocked_case_ids || []).includes(c.id)) return res.status(403).json({ error: "Case is locked" });
    const state = p.completed_stages?.[c.id] || { currentStage: c.stages[0], completedStages: [], completed: false };
    const stages = { ...(p.completed_stages || {}), [c.id]: state };
    await update("progress", { user_id: req.user.sub }, { completed_stages: stages });
    res.json({ progress: state });
  } catch (e) { next(e); }
});

router.post("/:id/stage", async (req, res, next) => {
  try {
    const { stage } = req.body || {}, c = await getCase(req.params.id), p = await getProgress(req.user.sub);
    if (!c) return res.status(404).json({ error: "Case not found" });
    if (!p?.unlocked_case_ids?.includes(c.id)) return res.status(403).json({ error: "Case is locked" });
    const nextIndex = c.stages.indexOf(stage); if (nextIndex < 0) return res.status(400).json({ error: "Invalid case stage" });
    const state = p.completed_stages?.[c.id] || { currentStage: c.stages[0], completedStages: [], completed: false };
    if (nextIndex > c.stages.indexOf(state.currentStage) + 1) return res.status(409).json({ error: "Case stages must be completed in order", currentStage: state.currentStage });
    state.currentStage = stage; state.completedStages = [...new Set([...(state.completedStages || []), stage])];
    await update("progress", { user_id: req.user.sub }, { completed_stages: { ...(p.completed_stages || {}), [c.id]: state } });
    res.json({ progress: state });
  } catch (e) { next(e); }
});

router.post("/:id/lesson/complete", async (req, res, next) => {
  try {
    const c = await getCase(req.params.id), p = await getProgress(req.user.sub);
    if (!c) return res.status(404).json({ error: "Case not found" });
    if (!p?.unlocked_case_ids?.includes(c.id)) return res.status(403).json({ error: "Case is locked" });
    const state = p.completed_stages?.[c.id] || { currentStage: c.stages[0], completedStages: [], completed: false };
    state.currentStage = "INVESTIGATE"; state.completedStages = [...new Set([...(state.completedStages || []), "LEARN", "INVESTIGATE"])];
    await update("progress", { user_id: req.user.sub }, { completed_lessons: [...new Set([...(p.completed_lessons || []), c.id])], completed_stages: { ...(p.completed_stages || {}), [c.id]: state } });
    res.json({ completed: true, progress: state });
  } catch (e) { next(e); }
});

router.post("/:id/evidence/:evidenceId/discover", async (req, res, next) => {
  try {
    const c = await getCase(req.params.id), p = await getProgress(req.user.sub);
    if (!c) return res.status(404).json({ error: "Case not found" });
    if (!p?.unlocked_case_ids?.includes(c.id)) return res.status(403).json({ error: "Case is locked" });
    const e = (await query("evidence", { filters: { id: req.params.evidenceId, case_id: c.id }, limit: 1 }))[0];
    if (!e) return res.status(404).json({ error: "Evidence not found" });
    const discovered = [...(p.discovered_evidence || [])];
    if (!discovered.some(x => x.caseId === c.id && x.evidenceId === e.id)) discovered.push({ caseId: c.id, evidenceId: e.id, discoveredAt: new Date().toISOString() });
    await update("progress", { user_id: req.user.sub }, { discovered_evidence: discovered });
    res.json({ evidence: { id: e.id, code: e.code, text: e.text } });
  } catch (e) { next(e); }
});

router.post("/:id/complete", async (req, res, next) => {
  try {
    const c = await getCase(req.params.id), p = await getProgress(req.user.sub);
    if (!c) return res.status(404).json({ error: "Case not found" });
    if (!p?.unlocked_case_ids?.includes(c.id)) return res.status(403).json({ error: "Case is locked" });
    const state = p.completed_stages?.[c.id];
    const challenge = (await query("challenges", { filters: { case_id: c.id }, limit: 1 }))[0];
    const passed = challenge && (await query("submissions", { filters: { user_id: req.user.sub, challenge_id: challenge.id, passed: true }, limit: 1 })).length;
    if (!state?.completedStages?.includes("SOLVE") || !passed) return res.status(409).json({ error: "Complete the case stages and pass the coding challenge first" });
    if (state.completed) return res.json({ alreadyCompleted: true, progress: p });
    const xp = (p.xp || 0) + c.xp_reward, next = (await query("cases", { filters: { prerequisite_case_id: c.id } }))[0];
    const unlocked = [...new Set([...(p.unlocked_case_ids || []), ...(next ? [next.id] : [])])];
    state.completed = true;
    await update("progress", { user_id: req.user.sub }, { xp, rank: rankForXp(xp), level: Math.floor(xp / 500) + 1, cases_solved: (p.cases_solved || 0) + 1, unlocked_case_ids: unlocked, completed_stages: { ...(p.completed_stages || {}), [c.id]: state } });
    await insert("xp_transactions", { user_id: req.user.sub, case_id: c.id, amount: c.xp_reward, reason: "case_completed" });
    res.json({ completed: true, xpAwarded: c.xp_reward, xp, rank: rankForXp(xp), level: Math.floor(xp / 500) + 1, nextCaseUnlocked: next?.id || null });
  } catch (e) { next(e); }
});
module.exports = router;
