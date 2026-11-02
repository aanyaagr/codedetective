// Loads case content from the database. Content tables are small, so the list view
// loads everything in four queries instead of several queries per case.
const { query } = require("./db");

const byNumber = (a, b) => String(a.number).localeCompare(String(b.number), undefined, { numeric: true });

async function loadAllCases() {
  const [cases, challenges, tests, evidence] = await Promise.all([
    query("cases"),
    query("challenges"),
    query("challenge_tests"),
    query("evidence"),
  ]);
  return cases.sort(byNumber).map((c) => {
    const challenge = challenges.find((x) => x.case_id === c.id) || null;
    return {
      case: c,
      challenge,
      tests: challenge ? tests.filter((t) => t.challenge_id === challenge.id) : [],
      evidence: evidence.filter((e) => e.case_id === c.id),
    };
  });
}

async function loadCase(id) {
  const c = (await query("cases", { filters: { id }, limit: 1 }))[0];
  if (!c) return null;
  const [challenge] = await query("challenges", { filters: { case_id: id }, limit: 1 });
  const [tests, evidence] = await Promise.all([
    challenge ? query("challenge_tests", { filters: { challenge_id: challenge.id } }) : [],
    query("evidence", { filters: { case_id: id } }),
  ]);
  return { case: c, challenge: challenge || null, tests, evidence };
}

async function loadCaseByChallenge(challengeId) {
  const challenge = (await query("challenges", { filters: { id: challengeId }, limit: 1 }))[0];
  return challenge ? loadCase(challenge.case_id) : null;
}

async function getProgress(userId) {
  return (await query("progress", { filters: { user_id: userId }, limit: 1 }))[0] || null;
}

module.exports = { loadAllCases, loadCase, loadCaseByChallenge, getProgress };
