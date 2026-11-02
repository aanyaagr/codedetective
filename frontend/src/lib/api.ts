// Typed client for the CodeDetective API — the single frontend/backend contract layer.
//
// NEXT_PUBLIC_API_URL may be given with or without "/api" ("http://localhost:5001" or
// "http://localhost:5001/api/" both work). Defaults to the local backend.
function resolveApiBase(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001").trim().replace(/\/+$/, "");
  return /\/api$/.test(raw) ? raw : `${raw}/api`;
}

export const API_BASE = resolveApiBase();
export const TOKEN_KEY = "codedetective_token";
export const USER_KEY = "codedetective_user";
export const ACTIVE_CASE_KEY = "codedetective_active_case";
export const AUTH_EVENT = "codedetective:auth";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Can't reach the CodeDetective server. Check that the backend is running and NEXT_PUBLIC_API_URL is correct.", 0);
  }
  const body = await response.json().catch(() => ({}));

  // Expired or invalid session: clear it so pages fall back to their signed-out state.
  if (response.status === 401 && token && typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
    throw new ApiError("Your session expired. Please sign in again.", 401);
  }
  if (!response.ok) throw new ApiError(body.error || `Request failed (${response.status})`, response.status);
  return body as T;
}

// ---------- types ----------

export type CaseStatus = "locked" | "available" | "in_progress" | "solved";
export type LessonSection = { title: string; description: string };
export type Lesson = { title: string; subtitle: string; clue: string; sections: LessonSection[]; hint: string };
export type Resolution = { rootCause: string; fixSummary: string; beforeCode: string; afterCode: string; successMessage: string };
export type ChallengeTest = { id: string; name: string; stdin?: string; expectedOutput?: string; hidden?: boolean };
export type Challenge = { id: string; language: string; starterCode: string; hint: string; tests: ChallengeTest[] };
export type CaseSummary = {
  id: string; seasonId: string; number: string; title: string; description: string; objective: string; difficulty: string; xpReward: number;
  prerequisiteCaseId: string | null; stages: string[]; concept: string; locked: boolean; lesson: Lesson; challenge: Challenge; resolution: Resolution;
  status: CaseStatus; currentStage: string; evidenceTotal: number; evidenceFound: number; hintsAvailable: number;
};
export type EvidenceCondition = "investigate" | "failed_test" | "passed_all_tests";
/** `text` is null until the evidence has been discovered. */
export type Evidence = { id: string; code: string; text: string | null; condition?: EvidenceCondition; discovered?: boolean };
export type RunTest = { id: string; name: string; passed: boolean; hidden?: boolean; stdin?: string; expectedOutput?: string; actualOutput?: string; status?: string };
export type RunResult = {
  status: string; stdout: string; stderr: string; stdin?: string; testsPassed: number; testsTotal: number; score: number; passed: boolean; tests?: RunTest[];
  submissionId?: string | null; evidenceDiscovered?: Array<{ id: string; code: string; text: string }>; progress?: CaseProgress;
};
export type Progress = { xp: number; level: number; rank: string; streak: number; casesSolved: number; evidenceFound?: number; mastery: Record<string, unknown>; unlockedCaseIds: string[] };
export type CaseProgress = { currentStage: string; completedStages: string[]; completed: boolean; hintsUsed?: number; started?: boolean };
export type Submission = { id: string; passed: boolean; score: number; testsPassed: number; testsTotal: number; createdAt: string };
export type CompleteResult = { completed: boolean; alreadyCompleted?: boolean; xpAwarded?: number; xp: number; rank: string; level: number; nextCaseUnlocked: string | null };
export type LeaderboardEntry = { position: number; name: string; xp: number; rank: string; level: number; casesSolved: number; evidenceFound: number; lastSolvedAt: string | null; isCurrentUser: boolean };
export type Leaderboard = { leaderboard: LeaderboardEntry[]; me: LeaderboardEntry | null; totalDetectives: number; activeDetectives: number };

export type CodeLabCase = {
  id: string;
  caseNumber: number;
  title: string;
  course: string;
  topic: string;
  difficulty: string;
  codingChallenge: { id: string; title: string; description: string; starterCode: string; language: string };
  rewards: { xp: number; badge: string; unlockNextCase: boolean };
};

export type CaseResponse = { case: CaseSummary; progress: CaseProgress | null; evidence: Evidence[] };

// ---------- id helpers ----------

export function normalizeCaseId(id: string) {
  const match = id.match(/^case[-_]?0*(\d+)$/i);
  return match ? `case-${match[1].padStart(3, "0")}` : id;
}

function normalizeChallengeId(id: string) {
  const match = id.match(/^(?:case|challenge)[-_]?0*(\d+)$/i);
  return match ? `challenge-${match[1].padStart(3, "0")}` : id;
}

/** File name shown in editor tabs, e.g. "challenge.py". */
export function challengeFilename(language: string) {
  const ext: Record<string, string> = { python: "py", javascript: "js", typescript: "ts", java: "java", c: "c", cpp: "cpp" };
  return `challenge.${ext[language?.toLowerCase()] || language || "txt"}`;
}

function toCodeLabCase(caseData: CaseSummary): CodeLabCase {
  return {
    id: caseData.id,
    caseNumber: Number(caseData.number),
    title: caseData.title,
    course: caseData.seasonId,
    topic: caseData.concept,
    difficulty: caseData.difficulty,
    codingChallenge: {
      id: caseData.challenge.id,
      title: caseData.title,
      description: caseData.objective,
      starterCode: caseData.challenge.starterCode,
      language: caseData.challenge.language,
    },
    rewards: { xp: caseData.xpReward, badge: caseData.concept, unlockNextCase: true },
  };
}

// ---------- endpoints ----------

const post = (body?: unknown): RequestInit => ({ method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });

export const getCases = () => apiFetch<{ cases: CaseSummary[] }>("/cases");

export async function getCase(id: string) {
  const response = await apiFetch<CaseResponse>(`/cases/${normalizeCaseId(id)}`);
  return { ...response, data: toCodeLabCase(response.case) };
}

export const getCaseProgress = (id: string) =>
  apiFetch<{ locked: boolean; progress: CaseProgress | null; discoveredEvidence: Array<{ caseId: string; evidenceId: string; discoveredAt: string }>; latestSubmission: Submission | null; bestSubmission?: Submission | null }>(`/cases/${normalizeCaseId(id)}/progress`);
export const getProgress = () => apiFetch<Progress>("/progress");
export const getLeaderboard = (limit = 25) => apiFetch<Leaderboard>(`/progress/leaderboard?limit=${limit}`);

/** Remember which case the player is working on (used by every step of the investigation). */
export function setActiveCase(id: string) {
  if (typeof window !== "undefined") localStorage.setItem(ACTIVE_CASE_KEY, normalizeCaseId(id));
}

/** Default case to show: in progress first, then the next unsolved one, then the most recent solved one. */
export function pickActiveCase(cases: CaseSummary[]): CaseSummary | undefined {
  return (
    cases.find((c) => c.status === "in_progress") ||
    cases.find((c) => c.status === "available") ||
    [...cases].reverse().find((c) => c.status === "solved") ||
    cases.find((c) => !c.locked)
  );
}

/**
 * Loads the case the player is working on: `?case=` in the URL wins, then the remembered
 * active case, then the best default. Locked cases are never selected.
 */
export async function getActiveCase() {
  const fromUrl = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("case") : null;
  const stored = typeof window !== "undefined" ? localStorage.getItem(ACTIVE_CASE_KEY) : null;
  const { cases } = await getCases();
  const unlocked = (id: string | null) => (id ? cases.find((c) => c.id === normalizeCaseId(id) && !c.locked) : undefined);
  const selected = unlocked(fromUrl) || unlocked(stored) || pickActiveCase(cases);
  if (!selected) throw new Error("No unlocked investigation is available.");
  setActiveCase(selected.id);
  return getCase(selected.id);
}

export async function startCase(id: string) {
  const result = await apiFetch<{ progress: CaseProgress }>(`/cases/${normalizeCaseId(id)}/start`, post());
  setActiveCase(id);
  return result;
}

export const updateStage = (id: string, stage: string) => apiFetch<{ progress: CaseProgress }>(`/cases/${normalizeCaseId(id)}/stage`, post({ stage }));
export const completeLesson = (id: string) => apiFetch<{ completed: boolean; progress: CaseProgress }>(`/cases/${normalizeCaseId(id)}/lesson/complete`, post());
export const discoverEvidence = (id: string, evidenceId: string) => apiFetch<{ evidence: Evidence }>(`/cases/${normalizeCaseId(id)}/evidence/${evidenceId}/discover`, post());
export const completeCase = (id: string) => apiFetch<CompleteResult>(`/cases/${normalizeCaseId(id)}/complete`, post());

export const runCode = (challengeId: string, code: string) => apiFetch<RunResult>("/code/run", post({ challengeId: normalizeChallengeId(challengeId), code }));

export async function submitCode(challengeId: string, code: string) {
  const result = await apiFetch<RunResult & { submissionId: string }>("/code/submit", post({ challengeId: normalizeChallengeId(challengeId), code }));
  return {
    ...result,
    result: {
      success: result.passed,
      output: [result.stdout, result.stderr].filter(Boolean).join("\n"),
      passed: result.passed,
      score: result.score,
    },
  };
}

export const requestHint = (caseId: string) =>
  apiFetch<{ hint: string; level: number; total: number; exhausted: boolean }>(`/assistant/${normalizeCaseId(caseId)}/hint`, post());
export const askAssistant = (caseId: string, question: string, code: string, lastRun?: unknown) =>
  apiFetch<{ answer: string; source: "ai" | "case-notes" }>(`/assistant/${normalizeCaseId(caseId)}/ask`, post({ question, code, lastRun }));

// ---------- per-case code drafts (shared by the Exercise and the Code Lab) ----------

const draftKey = (caseId: string) => {
  let user = "anon";
  try { user = JSON.parse(localStorage.getItem(USER_KEY) || "{}").id || "anon"; } catch { /* ignore */ }
  return `codedetective_draft_${user}_${normalizeCaseId(caseId)}`;
};
export function loadDraft(caseId: string): string | null {
  try { return localStorage.getItem(draftKey(caseId)); } catch { return null; }
}
export function saveDraft(caseId: string, code: string, starterCode: string) {
  try {
    if (code === starterCode) localStorage.removeItem(draftKey(caseId));
    else localStorage.setItem(draftKey(caseId), code);
  } catch { /* storage unavailable */ }
}
