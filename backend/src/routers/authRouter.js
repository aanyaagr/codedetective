const express = require("express");
const crypto = require("crypto");
const { query, insert } = require("../services/db");
const { hashPassword, verifyPassword, signToken } = require("../services/auth");
const { SECRET } = require("../middleware/auth");

const router = express.Router();

async function publicUser(user) {
  const rows = await query("progress", { filters: { user_id: user.id }, limit: 1 });
  const p = rows[0] || {};
  return { id: user.id, name: user.name, email: user.email, xp: p.xp || 0, rank: p.rank || "ROOKIE", level: p.level || 1 };
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password || String(password).length < 6) return res.status(400).json({ error: "Name, email and a password of at least 6 characters are required" });
    const normalized = String(email).trim().toLowerCase();
    if ((await query("users", { filters: { email: normalized }, limit: 1 })).length) return res.status(409).json({ error: "Email already registered" });
    const user = await insert("users", { id: crypto.randomUUID(), name: String(name).trim().slice(0, 80), email: normalized, password_hash: hashPassword(String(password)) });
    await insert("progress", { user_id: user.id, xp: 0, level: 1, rank: "ROOKIE", streak: 0, cases_solved: 0, mastery: {}, completed_lessons: [], completed_stages: {}, discovered_evidence: [], unlocked_case_ids: ["case-001"] });
    res.status(201).json({ token: signToken({ sub: user.id, name: user.name }, SECRET), user: await publicUser(user) });
  } catch (e) { next(e); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const rows = await query("users", { filters: { email: String(email || "").trim().toLowerCase() }, limit: 1 });
    const user = rows[0];
    if (!user || !verifyPassword(String(password || ""), user.password_hash)) return res.status(401).json({ error: "Invalid email or password" });
    res.json({ token: signToken({ sub: user.id, name: user.name }, SECRET), user: await publicUser(user) });
  } catch (e) { next(e); }
});

router.get("/me", async (req, res, next) => {
  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    const { verifyToken } = require("../services/auth");
    const p = verifyToken(token, SECRET);
    const user = p && (await query("users", { filters: { id: p.sub }, limit: 1 }))[0];
    if (!user) return res.status(401).json({ error: "Authentication required" });
    res.json({ user: await publicUser(user) });
  } catch (e) { next(e); }
});

router.post("/logout", (req, res) => res.json({ success: true }));
module.exports = router;
