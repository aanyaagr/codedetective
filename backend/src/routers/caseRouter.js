const express = require("express");
const { query, update, insert } = require("../services/db");
const { authRequired } = require("../middleware/auth");
const {
  rankForXp, levelForXp, SELF_SERVE_STAGES, caseState, advanceStage,
  withDiscovered, publicEvidence, caseSummary,
} = require("../services/progression");
const { loadAllCases, loadCase, getProgress } = require("../services/caseData");

const router = express.Router();
router.use(authRequired);

const toSubmission = (s) =>
  s ? { id: s.id, passed: !!s.passed, score: Number(s.score) || 0, testsPassed: s.tests_passed || 0, testsTotal: s.tests_total || 0, createdAt: s.created_at } : null;

/** Loads the case + caller's progress, or sends an error response and returns null. */
async function load(req, res, { allowLocked = false } = {}) {
  const [data, p] = await Promise.all([loadCase(req.params.id), getProgress(req.user.sub)]);
  if (!data) { res.status(404).json({ error: "Case not found" }); return null; }
  if (!p) { res.status(401).json({ error: "Detective profile not found. Please sign in again." }); return null; }
  if (!allowLocked && !(p.unlocked_case_ids || []).includes(data.case.id)) {
    res.status(403).json({ error: "Case is locked. Solve the previous case first." });
    return null;
  }
  return { ...data, p };
}

const fullCase = ({ case: c, challenge, tests, evidence, p }) => ({
  case: caseSummary(c, challenge, tests, evidence, p),
  progress: caseState(p, c.id),
  evidence: publicEvidence(evidence, p, c.id),
});

router.get("/", async (req, res, next) => {
  try {
    const [all, p] = await Promise.all([loadAllCases(), getProgress(req.user.sub)]);
    res.json({ cases: all.map((x) => caseSummary(x.case, x.challenge, x.tests, x.evidence, p)) });
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const ctx = await load(req, res);
    if (ctx) res.json(fullCase(ctx));
  } catch (e) { next(e); }
});

router.get("/:id/progress", async (req, res, next) => {
  try {
    const ctx = await load(req, res, { allowLocked: true });
    if (!ctx) return;
    const { case: c, p } = ctx;
    const latest = await query("submissions", { filters: { user_id: req.user.sub, case_id: c.id }, order: { column: "created_at", ascending: false }, limit: 1 });
    const passing = await query("submissions", { filters: { user_id: req.user.sub, case_id: c.id, passed: true }, order: { column: "created_at", ascending: false }, limit: 1 });
    res.json({
      locked: !(p.unlocked_case_ids || []).includes(c.id),
      progress: caseState(p, c.id),
      discoveredEvidence: (p.discovered_evidence || []).filter((x) => x.caseId === c.id),
      latestSubmission: toSubmission(latest[0]),
      bestSubmission: toSubmission(passing[0] || latest[0]),
    });
  } catch (e) { next(e); }
});

router.post("/:id/start", async (req, res, next) => {
  try {
    const ctx = await load(req, res);
    if (!ctx) return;
    const stages = advanceStage(ctx.p, ctx.case.id, "BRIEFING");
    await update("progress", { user_id: req.user.sub }, { completed_stages: stages });
    res.json({ progress: caseState({ completed_stages: stages }, ctx.case.id) });
  } catch (e) { next(e); }
});

router.post("/:id/stage", async (req, res, next) => {
  try {
    const ctx = await load(req, res);
    if (!ctx) return;
    const { stage } = req.body || {};
    if (!SELF_SERVE_STAGES.includes(stage)) {
      return res.status(400).json({ error: "That stage is unlocked by passing the coding challenge." });
    }
    const stages = advanceStage(ctx.p, ctx.case.id, stage);
    await update("progress", { user_id: req.user.sub }, { completed_stages: stages });
    res.json({ progress: caseState({ completed_stages: stages }, ctx.case.id) });
  } catch (e) { next(e); }
});

router.post("/:id/lesson/complete", async (req, res, next) => {
  try {
    const ctx = await load(req, res);
    if (!ctx) return;
    const { case: c, p } = ctx;
    const stages = advanceStage(p, c.id, "INVESTIGATE");
    await update("progress", { user_id: req.user.sub }, {
      completed_lessons: [...new Set([...(p.completed_lessons || []), c.id])],
      completed_stages: stages,
    });
    res.json({ completed: true, progress: caseState({ completed_stages: stages }, c.id) });
  } catch (e) { next(e); }
});

router.post("/:id/evidence/:evidenceId/discover", async (req, res, next) => {
  try {
    const ctx = await load(req, res);
    if (!ctx) return;
    const { case: c, p, evidence } = ctx;
    const e = evidence.find((x) => x.id === req.params.evidenceId);
    if (!e) return res.status(404).json({ error: "Evidence not found" });
    const already = (p.discovered_evidence || []).some((x) => x.caseId === c.id && x.evidenceId === e.id);
    if (!already && e.condition !== "investigate") {
      const how = e.condition === "failed_test" ? "Run the suspect code to uncover it." : "Submit a fix that passes every test to uncover it.";
      return res.status(403).json({ error: `${e.code} is still sealed. ${how}`, condition: e.condition });
    }
    const { list } = withDiscovered(p, c.id, [e.id]);
    await update("progress", { user_id: req.user.sub }, { discovered_evidence: list });
    res.json({ evidence: { id: e.id, code: e.code, text: e.text, condition: e.condition, discovered: true } });
  } catch (err) { next(err); }
});

router.post("/:id/complete", async (req, res, next) => {
  try {
    const ctx = await load(req, res);
    if (!ctx) return;
    const { case: c, p, challenge, evidence } = ctx;
    const state = caseState(p, c.id);
    if (state.completed) {
      return res.json({ completed: true, alreadyCompleted: true, xpAwarded: 0, xp: p.xp || 0, rank: rankForXp(p.xp || 0), level: levelForXp(p.xp || 0), nextCaseUnlocked: null });
    }
    const passed = challenge && (await query("submissions", { select: "id", filters: { user_id: req.user.sub, challenge_id: challenge.id, passed: true }, limit: 1 })).length;
    if (!passed) return res.status(409).json({ error: "Submit a fix that passes every test before closing the case." });

    const completedAt = new Date().toISOString();
    const stages = advanceStage(p, c.id, "SOLVE", { completed: true, completedAt });
    const xp = (p.xp || 0) + c.xp_reward;
    const nextCases = (await loadAllCases()).filter((x) => x.case.prerequisite_case_id === c.id).map((x) => x.case.id);
    const unlocked = [...new Set([...(p.unlocked_case_ids || []), ...nextCases])];
    const { list } = withDiscovered(p, c.id, evidence.map((e) => e.id));
    await update("progress", { user_id: req.user.sub }, {
      xp,
      rank: rankForXp(xp),
      level: levelForXp(xp),
      cases_solved: Object.values(stages).filter((s) => s.completed).length,
      unlocked_case_ids: unlocked,
      completed_stages: stages,
      discovered_evidence: list,
    });
    await insert("xp_transactions", { user_id: req.user.sub, case_id: c.id, amount: c.xp_reward, reason: "case_completed" });
    res.json({ completed: true, xpAwarded: c.xp_reward, xp, rank: rankForXp(xp), level: levelForXp(xp), nextCaseUnlocked: nextCases.find((id) => !(p.unlocked_case_ids || []).includes(id)) || null });
  } catch (e) { next(e); }
});

module.exports = router;
