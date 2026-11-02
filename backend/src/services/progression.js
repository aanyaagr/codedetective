const { STAGES } = require("../data/cases");

const XP_PER_LEVEL = 500;

function rankForXp(xp) {
  if (xp >= 5000) return "CHIEF INSPECTOR";
  if (xp >= 3000) return "INSPECTOR";
  if (xp >= 1500) return "SENIOR DETECTIVE";
  if (xp >= 500) return "DETECTIVE";
  return "ROOKIE";
}

const levelForXp = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;

// Stages a player may set directly. EVIDENCE and SOLVE are granted by the server
// (a passing submission / closing the case), so they can't be skipped to.
const SELF_SERVE_STAGES = ["BRIEFING", "LEARN", "INVESTIGATE", "CODE"];

function caseState(progress, caseId) {
  const s = progress?.completed_stages?.[caseId];
  return {
    currentStage: s?.currentStage || "BRIEFING",
    completedStages: s?.completedStages || [],
    completed: !!s?.completed,
    hintsUsed: s?.hintsUsed || 0,
    started: !!s,
  };
}

/** Returns a new completed_stages object with `caseId` moved forward to `stage` (never backwards). */
function advanceStage(progress, caseId, stage, extra = {}) {
  const all = { ...(progress?.completed_stages || {}) };
  const prev = all[caseId] || { currentStage: "BRIEFING", completedStages: [], completed: false, hintsUsed: 0 };
  const target = Math.max(STAGES.indexOf(prev.currentStage), STAGES.indexOf(stage));
  all[caseId] = { ...prev, currentStage: STAGES[target], completedStages: STAGES.slice(0, target + 1), ...extra };
  return all;
}

function caseStatus(progress, caseId) {
  if (!(progress?.unlocked_case_ids || []).includes(caseId)) return "locked";
  const s = caseState(progress, caseId);
  if (s.completed) return "solved";
  if (s.started && s.currentStage !== "BRIEFING") return "in_progress";
  return "available";
}

const discoveredIds = (progress, caseId) =>
  (progress?.discovered_evidence || []).filter((x) => x.caseId === caseId).map((x) => x.evidenceId);

/** Returns a new discovered_evidence array with `ids` added (no duplicates). */
function withDiscovered(progress, caseId, ids) {
  const list = [...(progress?.discovered_evidence || [])];
  const added = [];
  for (const id of ids) {
    if (!list.some((x) => x.caseId === caseId && x.evidenceId === id)) {
      list.push({ caseId, evidenceId: id, discoveredAt: new Date().toISOString() });
      added.push(id);
    }
  }
  return { list, added };
}

// ---- client-safe views (camelCase, matching frontend/src/lib/api.ts) ----

function publicTests(tests) {
  return [...tests]
    .sort((a, b) => Number(a.hidden) - Number(b.hidden) || String(a.id).localeCompare(String(b.id)))
    .map((t) =>
      t.hidden
        ? { id: t.id, name: t.name, hidden: true }
        : { id: t.id, name: t.name, hidden: false, stdin: t.stdin || "", expectedOutput: t.expected_output }
    );
}

function publicEvidence(evidenceRows, progress, caseId) {
  const found = new Set(discoveredIds(progress, caseId));
  return [...evidenceRows]
    .sort((a, b) => String(a.code).localeCompare(String(b.code)))
    .map((e) => ({ id: e.id, code: e.code, condition: e.condition, discovered: found.has(e.id), text: found.has(e.id) ? e.text : null }));
}

function caseSummary(c, challenge, tests, evidenceRows, progress) {
  const state = caseState(progress, c.id);
  const status = caseStatus(progress, c.id);
  const hints = Array.isArray(challenge?.hints) && challenge.hints.length ? challenge.hints : challenge?.hint ? [challenge.hint] : [];
  return {
    id: c.id,
    seasonId: c.season_id,
    number: c.number,
    title: c.title,
    description: c.description,
    objective: c.objective,
    difficulty: c.difficulty,
    xpReward: c.xp_reward,
    prerequisiteCaseId: c.prerequisite_case_id,
    stages: c.stages?.length ? c.stages : STAGES,
    concept: c.concept,
    lesson: c.lesson || {},
    resolution: c.resolution || {},
    status,
    locked: status === "locked",
    currentStage: state.currentStage,
    evidenceTotal: evidenceRows.length,
    evidenceFound: discoveredIds(progress, c.id).length,
    hintsAvailable: hints.length,
    challenge: challenge
      ? { id: challenge.id, language: challenge.language, starterCode: challenge.starter_code, hint: hints[0] || "", tests: publicTests(tests) }
      : null,
  };
}

module.exports = {
  XP_PER_LEVEL, STAGES, SELF_SERVE_STAGES,
  rankForXp, levelForXp, caseState, advanceStage, caseStatus,
  discoveredIds, withDiscovered, publicEvidence, publicTests, caseSummary,
};
