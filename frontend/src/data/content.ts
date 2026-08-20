export interface NavLink {
  label: string;
  href: string;
}

export interface EvidenceNode {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  paperType: "dossier" | "clue-card" | "polaroid" | "code-snippet" | "solved-seal";
  stamp: string;
  stampColor: "red" | "amber" | "cyan" | "emerald";
  annotation: string;
  annotationAuthor: string;
  rotation: string;
  description: string;
}

export interface JourneyStage {
  number: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  icon: string;
  paperType: "dossier" | "memo" | "photo" | "terminal" | "evidence" | "badge";
  rotation: string;
}

export interface LoopArtifact {
  id: string;
  number: string;
  phase: string;
  title: string;
  subtitle: string;
  artifactName: string;
  description: string;
  clueSnippet: string;
  tapeColor?: "hazard" | "masking";
  rotation: string;
}

export interface DetectivePartnerInfo {
  name: string;
  alias: string;
  quote: string;
  subQuote: string;
  status: string;
  badgeNumber: string;
  currentClue: string;
}

export interface AiDossier {
  id: string;
  codeName: string;
  title: string;
  quote: string;
  description: string;
  clearance: string;
  specialty: string;
  icon: string;
  accentColor: "amber" | "cyan" | "emerald" | "purple" | "rose" | "orange";
  stamp: string;
}

export const NAV_LINKS = [
  {
    label: "CASE BOARD",
    href: "/case-board",
  },
  {
    label: "EVIDENCE TRAIL",
    href: "/evidence",
  },
  {
    label: "LEADERBOARD",
    href: "/leaderboard",
  },
];

export const HERO_CASE_FILE = {
  headerBadge: "CONFIDENTIAL // EYES ONLY",
  fileNumber: "CASE FILE #001",
  caseTitle: "THE MISSING ALGORITHM",
  status: "UNSOLVED",
  difficulty: "MEDIUM",
  evidenceCount: "03",
  precinct: "PRECINCT #404 FORENSICS",
  headline: ["EVERY BUG", "LEAVES A CLUE."],
  supportingCopy: "Learn to code. Follow the evidence. Solve the mystery.",
  primaryCta: "OPEN CASE FILE →",
  secondaryCta: "HOW IT WORKS",
  pinnedNotes: [
    {
      id: "note-1",
      title: "PRIME SUSPECT",
      text: "Memory trace corrupted at 0x4F92. Infinite recursion pattern.",
      rotation: "rotate-2",
      tape: "masking",
    },
    {
      id: "note-2",
      title: "FORENSIC LEAD",
      text: "Duplicate entries inserted on line 6. Check condition boundary.",
      rotation: "-rotate-3",
      tape: "hazard",
    },
  ],
};

export const EVIDENCE_TRAIL_STEPS: EvidenceNode[] = [
  {
    id: "step-1",
    stepNumber: "01",
    title: "CASE",
    subtitle: "The Incident Report",
    paperType: "dossier",
    stamp: "OPEN INCIDENT",
    stampColor: "red",
    annotation: "System crash at 02:41 AM. Who modified the core loop?",
    annotationAuthor: "Lead Detective",
    rotation: "-rotate-2",
    description: "Read the criminal briefing, assess the system breach, and inspect initial stack traces.",
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "CLUE",
    subtitle: "Forensic Observation",
    paperType: "polaroid",
    stamp: "SUSPICIOUS",
    stampColor: "amber",
    annotation: "Even indices are duplicating in the report buffer.",
    annotationAuthor: "Evidence Tech",
    rotation: "rotate-3",
    description: "Scan variables, detect memory leaks, and discover hidden edge cases left by the culprit.",
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "EVIDENCE",
    subtitle: "Physical Proofs",
    paperType: "clue-card",
    stamp: "EXHIBIT B",
    stampColor: "cyan",
    annotation: "Array length is 7 instead of 5. Math doesn't lie.",
    annotationAuthor: "Forensics",
    rotation: "-rotate-1",
    description: "Compile verified assertions, snapshot test failures, and link findings with red thread.",
  },
  {
    id: "step-4",
    stepNumber: "04",
    title: "CODE",
    subtitle: "Live Investigation IDE",
    paperType: "code-snippet",
    stamp: "EXECUTING",
    stampColor: "amber",
    annotation: "Fixing conditional branch eliminates duplicate entries.",
    annotationAuthor: "Agent Syntax",
    rotation: "rotate-2",
    description: "Write real Python/TypeScript logic in your IDE to reconstruct and patch the broken system.",
  },
  {
    id: "step-5",
    stepNumber: "05",
    title: "SOLUTION",
    subtitle: "Case Clearance",
    paperType: "solved-seal",
    stamp: "CASE CLOSED",
    stampColor: "emerald",
    annotation: "100% tests passing. +250 XP & Investigator Shield unlocked.",
    annotationAuthor: "Chief Inspector",
    rotation: "-rotate-2",
    description: "Execute the final suite, earn detective ranks, claim bounties, and unlock the next case.",
  },
];

export const INVESTIGATION_JOURNEY_STAGES: JourneyStage[] = [
  {
    number: "01",
    title: "BRIEFING",
    subtitle: "Open the Case Dossier",
    tag: "INCIDENT REPORT",
    description: "Read the criminal briefing, review initial evidence logs, and assess the damage.",
    icon: "folder",
    paperType: "dossier",
    rotation: "-rotate-1",
  },
  {
    number: "02",
    title: "LEARN",
    subtitle: "Master the Technique",
    tag: "FIELD MANUAL",
    description: "Acquire the exact programming theory, syntax patterns, and algorithms needed.",
    icon: "book",
    paperType: "memo",
    rotation: "rotate-2",
  },
  {
    number: "03",
    title: "INVESTIGATE",
    subtitle: "Examine the Scene",
    tag: "FORENSIC TRACE",
    description: "Inspect faulty memory traces, inspect suspicious variables, and isolate anomalies.",
    icon: "search",
    paperType: "photo",
    rotation: "-rotate-2",
  },
  {
    number: "04",
    title: "CODE",
    subtitle: "Write & Execute",
    tag: "TERMINAL LAB",
    description: "Write your solution directly in the Python IDE, execute tests, and refactor.",
    icon: "code",
    paperType: "terminal",
    rotation: "rotate-1",
  },
  {
    number: "05",
    title: "EVIDENCE",
    subtitle: "Assemble Proof",
    tag: "CHAIN OF CUSTODY",
    description: "Compile verified test assertions, memory snapshots, and forensic proofs.",
    icon: "fingerprint",
    paperType: "evidence",
    rotation: "-rotate-1",
  },
  {
    number: "06",
    title: "SOLVE",
    subtitle: "Close the Case",
    tag: "CASE CLOSED",
    description: "Submit your verdict, collect XP bounty, advance rank, and unlock higher-tier mysteries.",
    icon: "trophy",
    paperType: "badge",
    rotation: "rotate-2",
  },
];

export const GAMEPLAY_LOOP_ARTIFACTS: LoopArtifact[] = [
  {
    id: "loop-1",
    number: "01",
    phase: "BRIEF",
    title: "Incident Dossier",
    subtitle: "Understand The Mystery",
    artifactName: "PRECINCT DISPATCH MEMO",
    description: "Review client statements, server autopsy logs, and determine the crime scene parameters.",
    clueSnippet: "FILE://CRIME_SCENE_MEMO.TXT",
    tapeColor: "masking",
    rotation: "-rotate-1",
  },
  {
    id: "loop-2",
    number: "02",
    phase: "INVESTIGATE",
    title: "Crime Scene Inspection",
    subtitle: "Find The Forensic Anomaly",
    artifactName: "LOG TRACE SCREENSHOT",
    description: "Inspect variable timelines and find exactly where expected logic deviates from reality.",
    clueSnippet: "ERR: DUPLICATE_ENTRY_AT_0x4",
    tapeColor: "hazard",
    rotation: "rotate-2",
  },
  {
    id: "loop-3",
    number: "03",
    phase: "LEARN",
    title: "Field Manual Rules",
    subtitle: "Acquire The Programming Tool",
    artifactName: "ACADEMY CODES & METRICS",
    description: "Learn algorithmic patterns, data structures, and debugging heuristics needed to solve.",
    clueSnippet: "SECTION 4: LOOP INVARIANTS",
    tapeColor: "masking",
    rotation: "-rotate-2",
  },
  {
    id: "loop-4",
    number: "04",
    phase: "CODE",
    title: "Tactical Code Lab",
    subtitle: "Write The Patch In IDE",
    artifactName: "TERMINAL MAIN.PY",
    description: "Write real production code, experiment with hypotheses, and run live test assertions.",
    clueSnippet: "def patch_duplicate_records():",
    tapeColor: "masking",
    rotation: "rotate-1",
  },
  {
    id: "loop-5",
    number: "05",
    phase: "CONNECT",
    title: "Evidence Board Weave",
    subtitle: "Tie Clues With Red Thread",
    artifactName: "CHAIN OF CUSTODY LOG",
    description: "Connect verified assertions to build an airtight case that proves the bug is eliminated.",
    clueSnippet: "ASSERT: BUFFER.LENGTH == 5",
    tapeColor: "hazard",
    rotation: "-rotate-1",
  },
  {
    id: "loop-6",
    number: "06",
    phase: "SOLVE",
    title: "Case Clearance Stamp",
    subtitle: "Collect XP & Advance Rank",
    artifactName: "HONORARY BADGE DIPLOMA",
    description: "Close the case file, collect XP bounties, and climb from Rookie to Chief Inspector.",
    clueSnippet: "VERDICT: 100% CLEARANCE",
    tapeColor: "masking",
    rotation: "rotate-2",
  },
];

export const DETECTIVE_PARTNER: DetectivePartnerInfo = {
  name: "DETECTIVE ARCHER",
  alias: "PRECINCT LEAD INVESTIGATOR",
  quote: "I found something unusual. Examine the loop before you make your conclusion.",
  subQuote: "The suspect code is generating duplicate records on every even integer pass.",
  status: "ACTIVE ON DISPATCH",
  badgeNumber: "BADGE #8492",
  currentClue: "Line 6 is executing an auxiliary append inside the conditional branch.",
};

export const CASE_LAB_PREVIEW = {
  caseId: "CASE #001",
  title: "THE DUPLICATE REPORTS",
  difficulty: "MEDIUM",
  evidenceFound: [
    { id: "ev-1", label: "Loop duplicates even numbers", code: "EV-01" },
    { id: "ev-2", label: "Output buffer contains 7 elements instead of 5", code: "EV-02" },
  ],
  code: `reports = []

# Iterating through precinct logs
for r in range(1, 6):
    reports.append(r)
    if r % 2 == 0:
        reports.append(r)  # CLUE: Duplicating even IDs!

print("Case Output:", reports)`,
  fixedCode: `reports = []

# Bug neutralized: Single record insertion
for r in range(1, 6):
    reports.append(r)

print("Case Output:", reports)`,
  output: "[1, 2, 2, 3, 4, 4, 5]",
  fixedOutput: "[1, 2, 3, 4, 5]",
  testCases: [
    { name: "Test 1: Odd Numbers Push Once", passed: true },
    { name: "Test 2: Even Numbers No Duplication", passed: false },
    { name: "Test 3: Final Buffer Size == 5", passed: false },
  ],
};

export const CASE_LAB_MOCK_DATA = {
  caseNumber: "CASE #001",
  title: "THE DUPLICATE REPORTS",
  difficulty: "MEDIUM",
  tabs: ["BRIEFING", "LEARN", "INVESTIGATE", "CODE", "EVIDENCE", "SOLVE"],
  briefing: {
    title: "INCIDENT BRIEFING",
    incidentId: "INC-894-PY",
    description: "The automated record system is duplicating critical case files.",
    objectiveLabel: "MISSION OBJECTIVE",
    objectiveText: "Write correct code so that each report is appended only once.",
    hintsCount: 2,
    hints: ["Modulo check is doubling even IDs.", "Remove redundant append."],
  },
  editor: {
    fileName: "case_07_engine.py",
    code: CASE_LAB_PREVIEW.code,
    fixedCode: CASE_LAB_PREVIEW.fixedCode,
  },
  output: CASE_LAB_PREVIEW.output,
  fixedOutput: CASE_LAB_PREVIEW.fixedOutput,
  evidence: [
    { id: 1, text: "Loop triggers duplicate push on even iterations.", code: "EV-01" },
    { id: 2, text: "Array length 7 violates uniqueness invariant.", code: "EV-02" },
  ],
  assistant: {
    name: "DETECTIVE ARCHER",
    initialMessage: "Examine the loop before you make your conclusion.",
    solvedMessage: "Case file cleared!",
  },
};

export const AI_DOSSIERS: AiDossier[] = [
  {
    id: "detective-assistant",
    codeName: "AGENT 'ARCHER'",
    title: "DETECTIVE ASSISTANT",
    quote: "Need a hint? Ask the detective.",
    description: "Delivers layered investigative hints and socratic guidance.",
    clearance: "CLEARANCE LEVEL 4",
    specialty: "Socratic Inquiry",
    icon: "detective",
    accentColor: "cyan",
    stamp: "LEAD SLEUTH",
  },
  {
    id: "code-mentor",
    codeName: "AGENT 'SYNTAX'",
    title: "CODE MENTOR",
    quote: "The compiler found something.",
    description: "Pinpoints syntax defects and structural bugs.",
    clearance: "CLEARANCE LEVEL 5",
    specialty: "Forensic Analysis",
    icon: "terminal",
    accentColor: "emerald",
    stamp: "CODE FORENSICS",
  },
];

export const COMPARISON_REPORT = {
  badge: "FORENSIC AUDIT // REPORT #902-B",
  headline: "WHY CODEDETECTIVE?",
  subheadline: "Not Just A Course. A Forensic Investigation.",
  traditional: {
    status: "STATUS: PASSIVE",
    label: "TRADITIONAL LEARNING",
    stamp: "OUTDATED",
    steps: [
      { label: "WATCH", detail: "Lecture" },
      { label: "READ", detail: "Notes" },
      { label: "PRACTICE", detail: "Exercises" },
      { label: "TEST", detail: "Exam" },
    ],
  },
  codedetective: {
    status: "STATUS: ACTIVE",
    label: "CODEDETECTIVE",
    stamp: "FIELD PROTOCOL",
    steps: [
      { label: "INVESTIGATE", detail: "Case" },
      { label: "LEARN", detail: "Technique" },
      { label: "CODE", detail: "Patch" },
      { label: "PROVE", detail: "Evidence" },
    ],
  },
};
