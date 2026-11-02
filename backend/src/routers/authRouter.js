const express = require("express");
const crypto = require("crypto");
const { query, insert } = require("../services/db");
const { hashPassword, verifyPassword, signToken, verifyToken } = require("../services/auth");
const { SECRET, tokenFrom } = require("../middleware/auth");
const { rankForXp, levelForXp } = require("../services/progression");
const { loadAllCases } = require("../services/caseData");

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function publicUser(user) {
  const p = (await query("progress", { filters: { user_id: user.id }, limit: 1 }))[0] || {};
  const xp = p.xp || 0;
  return { id: user.id, name: user.name, email: user.email, xp, rank: rankForXp(xp), level: levelForXp(xp), casesSolved: p.cases_solved || 0 };
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    const cleanName = String(name || "").trim().slice(0, 40);
    const normalized = String(email || "").trim().toLowerCase();
    if (!cleanName) return res.status(400).json({ error: "Choose a detective name." });
    if (!EMAIL_RE.test(normalized)) return res.status(400).json({ error: "Enter a valid email address." });
    if (String(password || "").length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });
    if ((await query("users", { select: "id", filters: { email: normalized }, limit: 1 })).length) {
      return res.status(409).json({ error: "That email is already registered. Sign in instead." });
    }

    let user;
    try {
      user = await insert("users", { id: crypto.randomUUID(), name: cleanName, email: normalized, password_hash: hashPassword(String(password)) });
    } catch (err) {
      if (err.code === "23505") return res.status(409).json({ error: "That email is already registered. Sign in instead." });
      throw err;
    }
    const firstCase = (await loadAllCases()).find((x) => !x.case.prerequisite_case_id);
    await insert("progress", {
      user_id: user.id, xp: 0, level: 1, rank: "ROOKIE", streak: 0, cases_solved: 0, mastery: {}, completed_lessons: [],
      completed_stages: {}, discovered_evidence: [], unlocked_case_ids: firstCase ? [firstCase.case.id] : [],
    });
    res.status(201).json({ token: signToken({ sub: user.id, name: user.name }, SECRET), user: await publicUser(user) });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const user = (await query("users", { filters: { email: String(email || "").trim().toLowerCase() }, limit: 1 }))[0];
    if (!user || !verifyPassword(String(password || ""), user.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    res.json({ token: signToken({ sub: user.id, name: user.name }, SECRET), user: await publicUser(user) });
  } catch (e) {
    next(e);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const payload = verifyToken(tokenFrom(req), SECRET);
    const user = payload && (await query("users", { filters: { id: payload.sub }, limit: 1 }))[0];
    if (!user) return res.status(401).json({ error: "Authentication required" });
    res.json({ user: await publicUser(user) });
  } catch (e) {
    next(e);
  }
});

router.post("/logout", (req, res) => res.json({ success: true }));

module.exports = router;
