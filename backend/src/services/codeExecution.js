const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const PYTHON = process.env.PYTHON_BIN || (process.platform === "win32" ? "python" : "python3");
const TIMEOUT_MS = Number(process.env.CODE_TIMEOUT_MS || 3000);
const MAX_OUTPUT = 16 * 1024;

function runPython(code, stdin = "") {
  return new Promise((resolve) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codedetective-"));
    const file = path.join(dir, `${crypto.randomUUID()}.py`);
    fs.writeFileSync(file, code, { encoding: "utf8", mode: 0o600 });

    const child = spawn(PYTHON, ["-I", file], {
      cwd: dir,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";
    let done = false;

    const finish = (result) => {
      if (done) return;
      done = true;
      try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) {}
      resolve(result);
    };

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finish({ status: "timeout", stdout: stdout.slice(0, MAX_OUTPUT), stderr: "Execution timed out" });
    }, TIMEOUT_MS);

    child.stdout.on("data", (chunk) => { stdout = (stdout + chunk.toString()).slice(0, MAX_OUTPUT); });
    child.stderr.on("data", (chunk) => { stderr = (stderr + chunk.toString()).slice(0, MAX_OUTPUT); });
    child.on("error", (error) => { clearTimeout(timer); finish({ status: "error", stdout, stderr: error.message }); });
    child.on("close", (exitCode) => {
      clearTimeout(timer);
      finish({ status: exitCode === 0 ? "completed" : "runtime_error", exitCode, stdout, stderr });
    });

    child.stdin.write(String(stdin));
    child.stdin.end();
  });
}

const normalize = (value) => String(value ?? "").replace(/\r\n/g, "\n").trim();

async function executeChallenge(challenge, code) {
  if (typeof code !== "string" || code.length > 20000) {
    return { status: "rejected", error: "Code must be a string under 20,000 characters" };
  }
  if (challenge.language !== "python") {
    return { status: "unsupported", error: "Only Python is enabled in the MVP" };
  }

  const tests = [];
  let firstStdout = "";
  let firstStderr = "";

  for (const test of challenge.tests) {
    const result = await runPython(code, test.stdin || "");
    firstStdout ||= result.stdout || "";
    firstStderr ||= result.stderr || "";
    tests.push({
      id: test.id,
      name: test.name,
      hidden: !!test.hidden,
      passed: result.status === "completed" && normalize(test.expectedOutput) === normalize(result.stdout)
    });
  }

  const testsPassed = tests.filter((test) => test.passed).length;
  const testsTotal = tests.length;
  const passed = testsTotal > 0 && testsPassed === testsTotal;

  return {
    status: passed ? "completed" : "failed_tests",
    stdout: firstStdout.slice(0, MAX_OUTPUT),
    stderr: firstStderr.slice(0, MAX_OUTPUT),
    testsPassed,
    testsTotal,
    score: testsTotal ? Math.round((testsPassed / testsTotal) * 100) : 0,
    passed,
    tests
  };
}

module.exports = { executeChallenge };
