const express = require("express");
const { query } = require("../services/db");
const { authRequired } = require("../middleware/auth");
const { rankForXp, levelForXp, caseSummary } = require("../services/progression");
const { loadAllCases, getProgress } = require("../services/caseData");

const router = express.Router();
router.use(authRequired);

function stats(p) {
  const xp = p?.xp || 0;
  return {
    xp,
    level: levelForXp(xp),
    rank: rankForXp(xp),
    streak: p?.streak || 0,
    casesSolved: p?.cases_solved || 0,
    evidenceFound: (p?.discovered_evidence || []).length,
    mastery: p?.mastery || {},
    unlockedCaseIds: p?.unlocked_case_ids || [],
  };
}

router.get("/", async (req, res, next) => {
  try {
    res.json(stats(await getProgress(req.user.sub)));
  } catch (e) { next(e); }
});

router.get("/dashboard", async (req, res, next) => {
  try {
    const [p, all, users] = await Promise.all([
      getProgress(req.user.sub),
      loadAllCases(),
      query("users", { select: "id,name", filters: { id: req.user.sub }, limit: 1 }),
    ]);
    res.json({ user: users[0]?.name || null, ...stats(p), cases: all.map((x) => caseSummary(x.case, x.challenge, x.tests, x.evidence, p)) });
  } catch (e) { next(e); }
});

// Ranking: XP ↓, cases solved ↓, evidence ↓; ties broken by who got there first, then join date.
// Detectives with no activity are listed after everyone with progress. Equal XP + cases +
// evidence share a position (1, 2, 2, 4). The caller's own row is always returned as `me`.
router.get("/leaderboard", async (req, res, next) => {
  try {
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
    const [users, progress, solves] = await Promise.all([
      query("users", { select: "id,name,created_at" }),
      query("progress", { select: "user_id,xp,cases_solved,discovered_evidence" }),
      query("xp_transactions", { select: "user_id,created_at", order: { column: "created_at", ascending: false } }),
    ]);
    const byUser = new Map(progress.map((p) => [p.user_id, p]));
    const lastSolve = new Map();
    for (const t of solves) if (!lastSolve.has(t.user_id)) lastSolve.set(t.user_id, t.created_at);

    const rows = users.map((u) => {
      const p = byUser.get(u.id) || {};
      const xp = p.xp || 0;
      return {
        userId: u.id,
        name: u.name,
        xp,
        rank: rankForXp(xp),
        level: levelForXp(xp),
        casesSolved: p.cases_solved || 0,
        evidenceFound: (p.discovered_evidence || []).length,
        lastSolvedAt: lastSolve.get(u.id) || null,
        joinedAt: u.created_at,
      };
    });
    const far = "9999-12-31";
    rows.sort((a, b) =>
      b.xp - a.xp ||
      b.casesSolved - a.casesSolved ||
      b.evidenceFound - a.evidenceFound ||
      String(a.lastSolvedAt || far).localeCompare(String(b.lastSolvedAt || far)) ||
      String(a.joinedAt || far).localeCompare(String(b.joinedAt || far))
    );
    let position = 0;
    rows.forEach((r, i) => {
      const prev = rows[i - 1];
      if (!prev || prev.xp !== r.xp || prev.casesSolved !== r.casesSolved || prev.evidenceFound !== r.evidenceFound) position = i + 1;
      r.position = position;
      r.isCurrentUser = r.userId === req.user.sub;
    });
    const strip = ({ userId, joinedAt, ...rest }) => rest;
    const me = rows.find((r) => r.isCurrentUser);
    res.json({
      leaderboard: rows.slice(0, limit).map(strip),
      me: me ? strip(me) : null,
      totalDetectives: rows.length,
      activeDetectives: rows.filter((r) => r.xp > 0 || r.evidenceFound > 0).length,
    });
  } catch (e) { next(e); }
});

module.exports = router;
