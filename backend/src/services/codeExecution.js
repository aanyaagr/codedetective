// Runs player-submitted Python in a short-lived child process.
// Safety measures for the MVP: isolated mode (-I), a temp working dir, a hard timeout,
// output caps, and a scrubbed environment so code cannot read server secrets such as
// JWT_SECRET via os.environ. This is NOT a full sandbox — for a public deployment run
// the backend in a container with no network and limited CPU/memory.
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const PYTHON = process.env.PYTHON_BIN || (process.platform === "win32" ? "python" : "python3");
const TIMEOUT_MS = Number(process.env.CODE_TIMEOUT_MS || 3000);
const MAX_OUTPUT = 16 * 1024;
const MAX_CODE = 20000;

function childEnv() {
  const env = { PATH: process.env.PATH || "", PYTHONIOENCODING: "utf-8", PYTHONDONTWRITEBYTECODE: "1" };
  if (process.platform === "win32") {
    env.SYSTEMROOT = process.env.SYSTEMROOT;
    env.TEMP = os.tmpdir();
  }
  return env;
}

function runPython(code, stdin = "") {
  return new Promise((resolve) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codedetective-"));
    const file = path.join(dir, `${crypto.randomUUID()}.py`);
    fs.writeFileSync(file, code, { encoding: "utf8", mode: 0o600 });
    let child;
    try {
      child = spawn(PYTHON, ["-I", file], { cwd: dir, env: childEnv(), windowsHide: true, stdio: ["pipe", "pipe", "pipe"] });
    } catch (err) {
      fs.rmSync(dir, { recursive: true, force: true });
      return resolve({ status: "error", stdout: "", stderr: `Could not start Python (${PYTHON}): ${err.message}` });
    }
    let stdout = "";
    let stderr = "";
    let done = false;
    const finish = (result) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) { /* ignore */ }
      resolve(result);
    };
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finish({ status: "timeout", stdout: stdout.slice(0, MAX_OUTPUT), stderr: `Execution timed out after ${TIMEOUT_MS / 1000}s — check for an infinite loop.` });
    }, TIMEOUT_MS);
    child.stdout.on("data", (c) => { stdout = (stdout + c.toString()).slice(0, MAX_OUTPUT); });
    child.stderr.on("data", (c) => { stderr = (stderr + c.toString()).slice(0, MAX_OUTPUT); });
    child.on("error", (e) => finish({
      status: "error",
      stdout,
      stderr: e.code === "ENOENT" ? `Python was not found on the server (PYTHON_BIN=${PYTHON}).` : e.message,
    }));
    child.on("close", (exitCode) => finish({
      status: exitCode === 0 ? "completed" : "runtime_error",
      exitCode,
      stdout,
      // Hide the temp file path from tracebacks.
      stderr: stderr.split(file).join("challenge.py"),
    }));
    child.stdin.on("error", () => { /* process may exit before reading stdin */ });
    child.stdin.end(String(stdin ?? ""));
  });
}

const normalize = (v) => String(v ?? "").replace(/\r\n/g, "\n").split("\n").map((l) => l.trimEnd()).join("\n").trim();

async function executeChallenge(challenge, code) {
  const total = challenge.tests.length;
  if (typeof code !== "string" || code.length > MAX_CODE) {
    return { status: "rejected", stdout: "", stderr: `Code must be text under ${MAX_CODE.toLocaleString()} characters.`, testsPassed: 0, testsTotal: total, score: 0, passed: false, tests: [] };
  }
  if (challenge.language !== "python") {
    return { status: "unsupported", stdout: "", stderr: "Only Python is enabled in this version.", testsPassed: 0, testsTotal: total, score: 0, passed: false, tests: [] };
  }

  // Run once per distinct stdin, sequentially, so tests sharing input share a run.
  const runs = new Map();
  for (const t of challenge.tests) {
    const key = t.stdin || "";
    if (!runs.has(key)) runs.set(key, await runPython(code, key));
  }

  const tests = challenge.tests.map((t) => {
    const run = runs.get(t.stdin || "");
    const passed = run.status === "completed" && normalize(run.stdout) === normalize(t.expectedOutput);
    return t.hidden
      ? { id: t.id, name: t.name, hidden: true, passed }
      : { id: t.id, name: t.name, hidden: false, passed, stdin: t.stdin || "", expectedOutput: t.expectedOutput, actualOutput: normalize(run.stdout), status: run.status };
  });

  // The console shows the run of the first visible test (what the player sees when they press Run).
  const firstVisible = challenge.tests.find((t) => !t.hidden) || challenge.tests[0];
  const shown = runs.get(firstVisible.stdin || "");
  const failedRun = [...runs.values()].find((r) => r.status !== "completed");
  const testsPassed = tests.filter((t) => t.passed).length;

  return {
    status: failedRun ? failedRun.status : "completed",
    stdout: shown.stdout,
    stderr: failedRun ? failedRun.stderr : shown.stderr,
    stdin: firstVisible.stdin || "",
    testsPassed,
    testsTotal: total,
    score: Math.round((testsPassed / total) * 100),
    passed: testsPassed === total,
    tests,
  };
}

module.exports = { executeChallenge, runPython };
