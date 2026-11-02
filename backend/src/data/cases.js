// Single source of truth for case content (seasons, cases, challenges, tests, evidence).
//
// Used by:
//   - `npm run seed`                  → upserts this content into Supabase
//   - `npm run seed:sql`              → regenerates supabase/seed.sql from it
//   - the local development database  → seeded automatically when Supabase is not configured
//
// Evidence conditions:
//   "investigate"       — can be examined on the Evidence Trail
//   "failed_test"       — uncovered when a run/submission fails
//   "passed_all_tests"  — uncovered by a passing submission
//
// Hints are progressive: the assistant reveals them one at a time (gentle → explicit).

const STAGES = ["BRIEFING", "LEARN", "INVESTIGATE", "CODE", "EVIDENCE", "SOLVE"];

const SEASONS = [{ id: "season-1", number: 1, title: "Python Foundations", language: "python", unlocked: true }];

const CASES = [
  {
    id: "case-001",
    season_id: "season-1",
    number: "001",
    title: "THE DUPLICATE REPORTS",
    description: "The automated record system is duplicating critical case files. Every even-numbered report is being filed twice.",
    objective: "Find why the report buffer contains duplicates and repair the loop so every report is unique.",
    difficulty: "EASY",
    xp_reward: 250,
    prerequisite_case_id: null,
    stages: STAGES,
    concept: "loops and conditions",
    lesson: {
      title: "LOOPS AND CONDITIONS",
      subtitle: "Your investigation points toward a repeated action that should only happen once.",
      clue: "The same report is appended twice whenever the loop reaches an even value.",
      sections: [
        { title: "LOOPS", description: "A loop repeats a block of code for each value in a sequence or until a condition changes." },
        { title: "CONDITIONS", description: "A condition decides whether a block should run. If the condition is too broad, the block may execute when it should not." },
        { title: "INVARIANTS", description: "An invariant is a rule that must remain true. Here, every report should appear exactly once." },
      ],
      hint: "Trace one even iteration carefully. Ask whether the same value is appended more than once.",
    },
    resolution: {
      rootCause: "The loop appends the current report a second time when the value is even.",
      fixSummary: "Keep the single append inside the loop and remove the duplicate append branch.",
      beforeCode: "reports.append(r)\nif r % 2 == 0:\n    reports.append(r)",
      afterCode: "reports.append(r)",
      successMessage: "The corrected loop produces exactly five unique reports.",
    },
    challenge: {
      id: "challenge-001",
      language: "python",
      starter_code: "reports = []\n\nfor r in range(1, 6):\n    reports.append(r)\n    if r % 2 == 0:\n        reports.append(r)\n\nprint(\"Case Output:\", reports)\n",
      hint: "Count the append() calls. How many can run in a single pass of the loop?",
      hints: [
        "Count the append() calls. How many can run in a single pass of the loop?",
        "The extra entries only appear for even numbers. Look at what happens inside the `if r % 2 == 0:` branch.",
        "The duplicate is created by the extra append inside the even-number condition. Every report is already appended once above it, so that branch should not append again.",
      ],
      tests: [
        { id: "test-1", name: "No duplicate reports", stdin: "", expected_output: "Case Output: [1, 2, 3, 4, 5]", hidden: false },
        { id: "test-hidden-1", name: "Hidden uniqueness invariant", stdin: "", expected_output: "Case Output: [1, 2, 3, 4, 5]", hidden: true },
      ],
    },
    evidence: [
      { id: "ev-01", code: "EV-01", text: "The loop triggers a duplicate push on even iterations.", condition: "investigate" },
      { id: "ev-02", code: "EV-02", text: "The output buffer violates the five-item uniqueness invariant.", condition: "failed_test" },
      { id: "ev-03", code: "EV-03", text: "A corrected loop produces exactly five unique reports.", condition: "passed_all_tests" },
    ],
  },
  {
    id: "case-002",
    season_id: "season-1",
    number: "002",
    title: "THE MISSING DEPOSIT",
    description: "The vault ledger reports less money than was deposited. One deposit vanishes every night — always the first one.",
    objective: "Find out why the vault total is short and fix the loop so every deposit is counted.",
    difficulty: "MEDIUM",
    xp_reward: 300,
    prerequisite_case_id: "case-001",
    stages: STAGES,
    concept: "list indexing and range()",
    lesson: {
      title: "INDEXES AND RANGE",
      subtitle: "Your investigation points toward a loop that starts counting in the wrong place.",
      clue: "The missing amount always equals the very first deposit of the night.",
      sections: [
        { title: "INDEX 0", description: "Python lists start counting at 0. The first item of a list lives at position 0, not 1." },
        { title: "RANGE(A, B)", description: "range(a, b) produces a, a + 1, … up to b − 1. The start value is included; the end value is not." },
        { title: "DIRECT LOOPS", description: "for item in items: walks every element without any index, so nothing can be skipped by accident." },
      ],
      hint: "Write down which indexes range(1, len(deposits)) produces for a list of five deposits.",
    },
    resolution: {
      rootCause: "The loop starts at index 1, so the deposit at index 0 is never added to the total.",
      fixSummary: "Start the range at 0 — or loop over the deposits directly — so every deposit is counted.",
      beforeCode: "for i in range(1, len(deposits)):\n    total += deposits[i]",
      afterCode: "for amount in deposits:\n    total += amount",
      successMessage: "Every deposit is counted and the vault total balances.",
    },
    challenge: {
      id: "challenge-002",
      language: "python",
      starter_code: "# Deposits arrive as one line of numbers, e.g. \"120 75 300\"\ndeposits = [int(x) for x in input().split()]\n\ntotal = 0\nfor i in range(1, len(deposits)):\n    total += deposits[i]\n\nprint(\"Vault total:\", total)\n",
      hint: "Compare the number of deposits with the number of times the loop body actually runs.",
      hints: [
        "Compare the number of deposits with the number of times the loop body actually runs.",
        "Which index does range(1, len(deposits)) start from — and where does the first deposit live?",
        "The loop skips index 0. Start the range at 0, or loop over the list directly with `for amount in deposits:`.",
      ],
      tests: [
        { id: "test-2-1", name: "Counts every nightly deposit", stdin: "120 75 300 45 90", expected_output: "Vault total: 630", hidden: false },
        { id: "test-2-2", name: "Single deposit night", stdin: "500", expected_output: "Vault total: 500", hidden: false },
        { id: "test-2-hidden", name: "Hidden ledger audit", stdin: "5 5 5 5", expected_output: "Vault total: 20", hidden: true },
      ],
    },
    evidence: [
      { id: "ev-2-01", code: "EV-01", text: "Five deposits were logged, but only four were added to the total.", condition: "investigate" },
      { id: "ev-2-02", code: "EV-02", text: "The missing amount always equals the first deposit — the loop never reads index 0.", condition: "failed_test" },
      { id: "ev-2-03", code: "EV-03", text: "With every index counted, the vault total matches the deposits exactly.", condition: "passed_all_tests" },
    ],
  },
  {
    id: "case-003",
    season_id: "season-1",
    number: "003",
    title: "THE CASE-SENSITIVE SUSPECT",
    description: "Known suspects are walking straight past the watchlist scanner. The scanner only flags names typed in lowercase.",
    objective: "Fix the scanner so suspects are flagged no matter how their names are capitalised.",
    difficulty: "MEDIUM",
    xp_reward: 350,
    prerequisite_case_id: "case-002",
    stages: STAGES,
    concept: "string normalisation",
    lesson: {
      title: "COMPARING STRINGS",
      subtitle: "Your investigation points toward two names that look the same to people but not to Python.",
      clue: "Every suspect who slipped through had a capital letter in their name.",
      sections: [
        { title: "CASE MATTERS", description: "\"Moriarty\" == \"moriarty\" is False — uppercase and lowercase letters are different characters." },
        { title: ".STRIP()", description: "Returns a copy of the string without spaces at the start and end." },
        { title: ".LOWER()", description: "Returns a copy of the string in lowercase, so differently-typed names compare equal." },
      ],
      hint: "Print each name right before it is checked against the watchlist. Does it look exactly like the watchlist entry?",
    },
    resolution: {
      rootCause: "Names were compared exactly as typed, but the watchlist stores every name in lowercase.",
      fixSummary: "Normalise each name with .strip().lower() before checking it against the watchlist.",
      beforeCode: "name = name.strip()\nif name in watchlist:",
      afterCode: "name = name.strip().lower()\nif name in watchlist:",
      successMessage: "Every suspect is flagged, however their name was typed.",
    },
    challenge: {
      id: "challenge-003",
      language: "python",
      starter_code: "watchlist = [\"moriarty\", \"adler\", \"moran\"]\n\n# Names arrive comma-separated, e.g. \"Moriarty, holmes\"\nnames = input().split(\",\")\n\nflagged = []\nfor name in names:\n    name = name.strip()\n    if name in watchlist:\n        flagged.append(name)\n\nprint(\"Flagged:\", len(flagged))\n",
      hint: "Print each name just before the comparison. Does it look exactly like the watchlist entry?",
      hints: [
        "Print each name just before the comparison. Does it look exactly like the watchlist entry?",
        "The watchlist is lowercase, but the incoming names are not. Spaces are already stripped — what else differs?",
        "Normalise each name before checking it: `name = name.strip().lower()`.",
      ],
      tests: [
        { id: "test-3-1", name: "Flags mixed-case suspects", stdin: "Moriarty, holmes, ADLER, moran", expected_output: "Flagged: 3", hidden: false },
        { id: "test-3-2", name: "Ignores innocent names", stdin: "Watson, Hudson", expected_output: "Flagged: 0", hidden: false },
        { id: "test-3-hidden", name: "Hidden checkpoint sweep", stdin: "MORAN,Watson , adler", expected_output: "Flagged: 2", hidden: true },
      ],
    },
    evidence: [
      { id: "ev-3-01", code: "EV-01", text: "Suspect names were entered with capital letters, but the watchlist is all lowercase.", condition: "investigate" },
      { id: "ev-3-02", code: "EV-02", text: "\"ADLER\" and \"adler\" are compared as different strings, so the scanner lets her through.", condition: "failed_test" },
      { id: "ev-3-03", code: "EV-03", text: "Normalised names are flagged correctly, whatever their capitalisation.", condition: "passed_all_tests" },
    ],
  },
];

/** Flattens the nested content into rows for each database table. */
function seedRows() {
  const cases = [];
  const challenges = [];
  const tests = [];
  const evidence = [];
  for (const c of CASES) {
    const { challenge, evidence: ev, ...caseRow } = c;
    cases.push(caseRow);
    const { tests: t, ...challengeRow } = challenge;
    challenges.push({ ...challengeRow, case_id: c.id });
    for (const test of t) tests.push({ ...test, challenge_id: challenge.id });
    for (const e of ev) evidence.push({ ...e, case_id: c.id });
  }
  return { seasons: SEASONS, cases, challenges, challenge_tests: tests, evidence };
}

module.exports = { CASES, SEASONS, STAGES, seedRows };
