// End-to-end API tests:  npm test   (needs python3 on PATH)
// Runs against the local development store by default. With SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY set it runs against that database instead — use a
// throwaway project, because test users are created.
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");

const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "cd-test-"));
process.env.DATA_DIR = DATA_DIR;
process.env.JWT_SECRET = process.env.JWT_SECRET || `test-secret-${Date.now()}`;
delete process.env.ANTHROPIC_API_KEY;
const app = require("../src/app");

let server;
let base;
before(async () => {
  server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}/api`;
});
after(() => { server.close(); fs.rmSync(DATA_DIR, { recursive: true, force: true }); });

async function api(p, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(base + p, { method, headers, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, body: await res.json() };
}
let seq = 0;
const register = async (name) =>
  (await api("/auth/register", { method: "POST", body: { name, email: `${name}-${Date.now()}-${seq++}@test.dev`, password: "secret123" } })).body;

const FIX = {
  "challenge-001": 'reports = []\nfor r in range(1, 6):\n    reports.append(r)\nprint("Case Output:", reports)\n',
  "challenge-002": 'deposits = [int(x) for x in input().split()]\nprint("Vault total:", sum(deposits))\n',
  "challenge-003": 'watchlist = ["moriarty", "adler", "moran"]\nnames = input().split(",")\nprint("Flagged:", sum(1 for n in names if n.strip().lower() in watchlist))\n',
};
const solve = async (token, caseId, challengeId) => {
  await api("/code/submit", { method: "POST", token, body: { challengeId, code: FIX[challengeId] } });
  return (await api(`/cases/${caseId}/complete`, { method: "POST", token })).body;
};

test("auth: register, me, login, validation, malformed tokens", async () => {
  const { token, user } = await register("ada");
  assert.ok(token);
  assert.equal(user.rank, "ROOKIE");
  assert.equal((await api("/auth/me", { token })).body.user.id, user.id);
  assert.equal((await api("/auth/login", { method: "POST", body: { email: user.email, password: "secret123" } })).status, 200);
  assert.equal((await api("/auth/login", { method: "POST", body: { email: user.email, password: "nope" } })).status, 401);
  assert.equal((await api("/auth/register", { method: "POST", body: { name: "x", email: user.email, password: "secret123" } })).status, 409);
  assert.equal((await api("/auth/register", { method: "POST", body: { name: "x", email: "bad", password: "secret123" } })).status, 400);
  assert.equal((await api("/cases", { token: "garbage.token.value" })).status, 401);
  assert.equal((await api("/cases", { token: "a.%%%.b" })).status, 401);
});

test("cases: content is complete, ordered, and does not leak answers", async () => {
  const { token } = await register("bea");
  const { cases } = (await api("/cases", { token })).body;
  assert.deepEqual(cases.map((c) => c.id), ["case-001", "case-002", "case-003"]);
  assert.deepEqual(cases.map((c) => c.status), ["available", "locked", "locked"]);
  for (const c of cases) {
    assert.ok(c.lesson.title && c.lesson.sections.length === 3, `${c.id} lesson content`);
    assert.ok(c.resolution.rootCause, `${c.id} resolution content`);
    assert.equal(c.hintsAvailable, 3);
    const hidden = c.challenge.tests.filter((t) => t.hidden);
    assert.ok(hidden.length >= 1 && hidden.every((t) => t.expectedOutput === undefined && t.stdin === undefined));
    assert.ok(c.challenge.tests.filter((t) => !t.hidden).every((t) => typeof t.expectedOutput === "string"));
  }
  const detail = (await api("/cases/case-001", { token })).body;
  assert.ok(detail.evidence.every((e) => e.text === null && e.discovered === false), "undiscovered evidence is sealed");
  assert.equal((await api("/cases/case-002", { token })).status, 403);
  assert.equal((await api("/cases/nope", { token })).status, 404);
});

test("full investigation: evidence → lesson → run → hints → submit → resolve → unlock", async () => {
  const { token } = await register("cal");
  assert.equal((await api("/cases/case-001/start", { method: "POST", token })).body.progress.currentStage, "BRIEFING");

  assert.equal((await api("/cases/case-001/evidence/ev-02/discover", { method: "POST", token })).status, 403, "sealed evidence");
  const ev1 = await api("/cases/case-001/evidence/ev-01/discover", { method: "POST", token });
  assert.equal(ev1.status, 200);
  assert.match(ev1.body.evidence.text, /even iterations/);

  const lesson = (await api("/cases/case-001/lesson/complete", { method: "POST", token })).body;
  assert.equal(lesson.progress.currentStage, "INVESTIGATE");

  // Players can't grant themselves the server-only stages, and can't close early.
  assert.equal((await api("/cases/case-001/stage", { method: "POST", token, body: { stage: "SOLVE" } })).status, 400);
  assert.equal((await api("/cases/case-001/complete", { method: "POST", token })).status, 409);

  const starter = (await api("/cases/case-001", { token })).body.case.challenge.starterCode;
  const bad = (await api("/code/run", { method: "POST", token, body: { challengeId: "challenge-001", code: starter } })).body;
  assert.equal(bad.passed, false);
  assert.match(bad.stdout, /\[1, 2, 2, 3, 4, 4, 5\]/);
  assert.deepEqual(bad.evidenceDiscovered.map((e) => e.code), ["EV-02"]);
  assert.equal(bad.tests[0].expectedOutput, "Case Output: [1, 2, 3, 4, 5]");
  assert.equal(bad.tests[1].expectedOutput, undefined, "hidden test output never leaks");

  const hints = [];
  for (let i = 0; i < 4; i++) hints.push((await api("/assistant/case-001/hint", { method: "POST", token })).body);
  assert.deepEqual(hints.map((h) => h.level), [1, 2, 3, 3]);
  assert.notEqual(hints[0].hint, hints[2].hint, "hints get stronger");
  assert.equal(hints[3].exhausted, true);
  const ask = (await api("/assistant/case-001/ask", { method: "POST", token, body: { question: "where is the bug?", code: starter } })).body;
  assert.equal(ask.source, "case-notes");

  const good = (await api("/code/submit", { method: "POST", token, body: { challengeId: "challenge-001", code: FIX["challenge-001"] } })).body;
  assert.equal(good.passed, true);
  assert.ok(good.submissionId);
  assert.equal(good.progress.currentStage, "EVIDENCE");

  const prog = (await api("/cases/case-001/progress", { token })).body;
  assert.equal(prog.latestSubmission.testsPassed, 2, "submission is returned in camelCase");
  assert.equal(prog.latestSubmission.passed, true);
  assert.equal(prog.discoveredEvidence.length, 3);

  const done = (await api("/cases/case-001/complete", { method: "POST", token })).body;
  assert.equal(done.xpAwarded, 250);
  assert.equal(done.nextCaseUnlocked, "case-002");
  const again = (await api("/cases/case-001/complete", { method: "POST", token })).body;
  assert.equal(again.alreadyCompleted, true);
  assert.equal(again.xp, 250, "XP is not awarded twice");

  const cases = (await api("/cases", { token })).body.cases;
  assert.deepEqual(cases.map((c) => c.status), ["solved", "available", "locked"]);
  const me = (await api("/progress", { token })).body;
  assert.equal(me.xp, 250);
  assert.equal(me.casesSolved, 1);
});

test("per-test stdin and anti-cheat: input-driven tests use each test's input", async () => {
  const { token } = await register("dee");
  await solve(token, "case-001", "challenge-001");
  await solve(token, "case-002", "challenge-002");
  const starter2 = (await api("/cases/case-002", { token })).body.case.challenge.starterCode;
  const r2 = (await api("/code/run", { method: "POST", token, body: { challengeId: "challenge-002", code: starter2 } })).body;
  assert.equal(r2.stdout.trim(), "Vault total: 510");
  assert.equal(r2.testsPassed, 0);
  const cheat = (await api("/code/run", { method: "POST", token, body: { challengeId: "challenge-003", code: 'print("Flagged: 3")' } })).body;
  assert.equal(cheat.passed, false, "hard-coding the sample output fails the hidden test");
  const r3 = (await api("/code/run", { method: "POST", token, body: { challengeId: "challenge-003", code: FIX["challenge-003"] } })).body;
  assert.equal(r3.passed, true);
});

test("sandbox: player code cannot read server secrets; errors and timeouts are reported", async () => {
  const { token } = await register("eve");
  const leak = (await api("/code/run", { method: "POST", token, body: { challengeId: "challenge-001", code: "import os\nprint(os.environ.get('JWT_SECRET'), os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))" } })).body;
  assert.equal(leak.stdout.trim(), "None None");
  const err = (await api("/code/run", { method: "POST", token, body: { challengeId: "challenge-001", code: "print(undefined_name)" } })).body;
  assert.equal(err.status, "runtime_error");
  assert.match(err.stderr, /NameError/);
  assert.doesNotMatch(err.stderr, /codedetective-/, "temp paths are hidden");
  const loop = (await api("/code/run", { method: "POST", token, body: { challengeId: "challenge-001", code: "while True:\n    pass" } })).body;
  assert.equal(loop.status, "timeout");
});

test("leaderboard: real ranking, shared positions, inactive last, current user always present", async () => {
  const a = await register("zed");
  const b = await register("yan");
  await solve(a.token, "case-001", "challenge-001");
  await solve(b.token, "case-001", "challenge-001");
  const idle = await register("idle");
  const lb = (await api("/progress/leaderboard?limit=100", { token: idle.token })).body;
  const zed = lb.leaderboard.find((r) => r.name === "zed");
  const yan = lb.leaderboard.find((r) => r.name === "yan");
  assert.equal(zed.position, yan.position, "equal records share a position");
  assert.equal(lb.leaderboard[lb.leaderboard.length - 1].xp, 0, "inactive detectives are last");
  assert.equal(lb.me.name, "idle");
  assert.equal(lb.me.isCurrentUser, true);
  assert.equal(lb.leaderboard[0].userId, undefined, "user ids are not exposed");
  const small = (await api("/progress/leaderboard?limit=1", { token: idle.token })).body;
  assert.equal(small.leaderboard.length, 1);
  assert.equal(small.me.name, "idle", "me is returned even outside the top list");
});
