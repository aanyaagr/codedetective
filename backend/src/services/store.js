const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

const initialData = {
  users: [],
  sessions: [],
  seasons: [{ id: "season-1", number: 1, title: "Python Foundations", language: "python", unlocked: true }],
  cases: [
    {
      id: "case-001",
      seasonId: "season-1",
      number: "001",
      title: "THE DUPLICATE REPORTS",
      description: "The automated record system is duplicating critical case files.",
      objective: "Find why the report buffer contains duplicates and repair the loop so every report is unique.",
      difficulty: "MEDIUM",
      xpReward: 250,
      prerequisiteCaseId: null,
      stages: ["BRIEFING", "LEARN", "INVESTIGATE", "CODE", "EVIDENCE", "SOLVE"],
      concept: "loops and conditions",
      lesson: {
        title: "LOOPS AND CONDITIONS",
        subtitle: "Your investigation points toward a repeated action that should only happen once.",
        clue: "The same report is appended twice whenever the loop reaches an even value.",
        sections: [
          { title: "LOOPS", description: "A loop repeats a block of code for each value in a sequence or until a condition changes." },
          { title: "CONDITIONS", description: "A condition decides whether a block should run. If the condition is too broad, the block may execute when it should not." },
          { title: "INVARIANTS", description: "An invariant is a rule that must remain true. Here, every report should appear exactly once." }
        ],
        hint: "Trace one even iteration carefully. Ask whether the same value is appended more than once."
      },
      challenge: {
        id: "challenge-001",
        language: "python",
        starterCode: "reports = []\n\nfor r in range(1, 6):\n    reports.append(r)\n    if r % 2 == 0:\n        reports.append(r)\n\nprint(\"Case Output:\", reports)",
        hint: "The duplicate is created by the extra append inside the even-number condition.",
        tests: [
          { id: "test-1", name: "No duplicate reports", stdin: "", expectedOutput: "Case Output: [1, 2, 3, 4, 5]" },
          { id: "test-hidden-1", name: "Hidden uniqueness invariant", stdin: "", expectedOutput: "Case Output: [1, 2, 3, 4, 5]", hidden: true }
        ]
      },
      evidence: [
        { id: "ev-01", code: "EV-01", text: "The loop triggers a duplicate push on even iterations.", condition: "failed_test" },
        { id: "ev-02", code: "EV-02", text: "The output buffer violates the five-item uniqueness invariant.", condition: "failed_test" },
        { id: "ev-03", code: "EV-03", text: "A corrected loop produces exactly five unique reports.", condition: "passed_all_tests" }
      ],
      resolution: {
        rootCause: "The loop appends the current report a second time when the value is even.",
        fixSummary: "Keep the single append inside the loop and remove the duplicate append branch.",
        beforeCode: "reports.append(r)\nif r % 2 == 0:\n    reports.append(r)",
        afterCode: "reports.append(r)",
        successMessage: "The corrected loop produces exactly five unique reports."
      }
    }
  ],
  progress: [],
  submissions: [],
  xpTransactions: []
};

function initializeStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) write(initialData);
}

function read() {
  initializeStore();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function write(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

function update(mutator) {
  const data = read();
  const result = mutator(data) || data;
  write(result);
  return result;
}

module.exports = { initializeStore, read, write, update };
