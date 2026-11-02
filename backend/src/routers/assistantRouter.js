// Detective AI Assistant.
//  POST /api/assistant/:caseId/hint → the next progressive hint (gentle first, explicit last)
//  POST /api/assistant/:caseId/ask  → free-form question about the player's code. Uses Claude
//      when ANTHROPIC_API_KEY is set; otherwise answers from the case's hint notes.
const express = require("express");
const { update } = require("../services/db");
const { authRequired } = require("../middleware/auth");
const { advanceStage, caseState } = require("../services/progression");
const { loadCase, getProgress } = require("../services/caseData");

const router = express.Router();
router.use(authRequired);

const API_URL = (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/+$/, "") + "/v1/messages";
const MODEL = process.env.ASSISTANT_MODEL || "claude-haiku-5-5";

const hintsOf = (challenge) =>
  Array.isArray(challenge?.hints) && challenge.hints.length ? challenge.hints : challenge?.hint ? [challenge.hint] : [];

async function load(req, res) {
  const [data, p] = await Promise.all([loadCase(req.params.caseId), getProgress(req.user.sub)]);
  if (!data) { res.status(404).json({ error: "Case not found" }); return null; }
  if (!(p?.unlocked_case_ids || []).includes(data.case.id)) { res.status(403).json({ error: "Case is locked" }); return null; }
  return { ...data, p, hints: hintsOf(data.challenge) };
}

router.post("/:caseId/hint", async (req, res, next) => {
  try {
    const ctx = await load(req, res);
    if (!ctx) return;
    const { case: c, p, hints } = ctx;
    if (!hints.length) return res.status(404).json({ error: "No hints are filed for this case." });
    const used = caseState(p, c.id).hintsUsed;
    const level = Math.min(used + 1, hints.length);
    const stages = advanceStage(p, c.id, "BRIEFING", { hintsUsed: Math.max(used, level) });
    await update("progress", { user_id: req.user.sub }, { completed_stages: stages });
    res.json({ hint: hints[level - 1], level, total: hints.length, exhausted: level >= hints.length });
  } catch (e) { next(e); }
});

function systemPrompt(c, hints, hintsUsed) {
  return [
    `You are Detective Archer, a senior investigator partnering with a student in "CodeDetective Academy", a game where programming bugs are crime cases.`,
    `Case #${c.number} — ${c.title}. Objective: ${c.objective} Concept: ${c.concept}.`,
    `Investigator notes (the true cause, for you only): ${hints[hints.length - 1] || c.resolution?.rootCause || ""}`,
    `The student has used ${hintsUsed} of ${hints.length} hints.`,
    `Rules: guide, don't solve. Never write the corrected program or the exact fixed line. Point at the suspicious line or ask a pointed question instead.`,
    `Give more direct guidance only if the student has used most hints. If asked about something unrelated to programming or this case, steer back to the case.`,
    `Stay in character as a calm noir detective, but be clear and concrete. At most 90 words, plain text.`,
  ].join("\n");
}

function fallbackAnswer(hints, hintsUsed) {
  const h = hints[Math.max(0, Math.min(hintsUsed, hints.length) - 1)] || hints[0] || "Run the code and compare its output with the expected output.";
  return `My line to headquarters is down, so I'm working from the case notes: ${h} Ask for another hint when you need a stronger lead.`;
}

router.post("/:caseId/ask", async (req, res, next) => {
  try {
    const ctx = await load(req, res);
    if (!ctx) return;
    const { case: c, p, hints } = ctx;
    const hintsUsed = caseState(p, c.id).hintsUsed;
    const question = String(req.body?.question || "").trim().slice(0, 600);
    const code = String(req.body?.code || "").slice(0, 6000);
    const lastRun = req.body?.lastRun ? JSON.stringify(req.body.lastRun).slice(0, 1500) : "not run yet";
    if (!question) return res.status(400).json({ error: "Ask the detective a question." });
    if (!process.env.ANTHROPIC_API_KEY) return res.json({ answer: fallbackAnswer(hints, hintsUsed), source: "case-notes" });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        signal: controller.signal,
        headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 300,
          system: systemPrompt(c, hints, hintsUsed),
          messages: [{ role: "user", content: `My current code:\n\`\`\`python\n${code}\n\`\`\`\nLast run result: ${lastRun}\n\nMy question: ${question}` }],
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("[assistant] API error", response.status, body?.error?.message || "");
        return res.json({ answer: fallbackAnswer(hints, hintsUsed), source: "case-notes" });
      }
      const answer = (body.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      res.json({ answer: answer || fallbackAnswer(hints, hintsUsed), source: answer ? "ai" : "case-notes" });
    } catch (err) {
      console.error("[assistant] request failed:", err.message);
      res.json({ answer: fallbackAnswer(hints, hintsUsed), source: "case-notes" });
    } finally {
      clearTimeout(timer);
    }
  } catch (e) { next(e); }
});

module.exports = router;
