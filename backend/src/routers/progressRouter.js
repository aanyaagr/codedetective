const express = require("express");
const { query } = require("../services/db");
const { authRequired } = require("../middleware/auth");
const { rankForXp } = require("../services/progression");
const router = express.Router();
router.use(authRequired);

router.get("/", async (req, res, next) => {
  try {
    const p = (await query("progress", { filters: { user_id: req.user.sub }, limit: 1 }))[0] || {};
    res.json({ xp: p.xp || 0, level: p.level || 1, rank: p.rank || rankForXp(p.xp || 0), streak: p.streak || 0, casesSolved: p.cases_solved || 0, mastery: p.mastery || {}, unlockedCaseIds: p.unlocked_case_ids || [] });
  } catch (e) { next(e); }
});

router.get("/dashboard", async (req, res, next) => {
  try {
    const p = (await query("progress", { filters: { user_id: req.user.sub }, limit: 1 }))[0] || { xp: 0, level: 1, rank: "ROOKIE", unlocked_case_ids: [] };
    const user = (await query("users", { filters: { id: req.user.sub }, limit: 1 }))[0];
    const cases = await query("cases");
    res.json({ user: user?.name, xp: p.xp || 0, level: p.level || 1, rank: p.rank || rankForXp(p.xp || 0), streak: p.streak || 0, casesSolved: p.cases_solved || 0, cases: cases.map(({ lesson, resolution, ...c }) => ({ ...c, locked: !(p.unlocked_case_ids || []).includes(c.id) })) });
  } catch (e) { next(e); }
});

router.get("/leaderboard", async (req, res, next) => {
  try {
    const users = await query("users");
    const progress = await query("progress");
    const byUser = new Map(progress.map(p => [p.user_id, p]));
    const leaderboard = users.map(u => { const p = byUser.get(u.id) || {}; return { name: u.name, xp: p.xp || 0, rank: p.rank || rankForXp(p.xp || 0) }; }).sort((a,b) => b.xp - a.xp).slice(0,20);
    res.json({ leaderboard });
  } catch (e) { next(e); }
});
module.exports = router;
