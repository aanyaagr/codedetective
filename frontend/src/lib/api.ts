const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("codedetective_token") : null;
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body as T;
}

export type LessonSection = { title: string; description: string };
export type Lesson = { title: string; subtitle: string; clue: string; sections: LessonSection[]; hint: string };
export type Resolution = { rootCause: string; fixSummary: string; beforeCode: string; afterCode: string; successMessage: string };
export type ChallengeTest = { id: string; name: string; stdin?: string; hidden?: boolean };
export type Challenge = { id: string; language: string; starterCode: string; hint: string; tests: ChallengeTest[] };
export type CaseSummary = {
  id: string; seasonId: string; number: string; title: string; description: string; objective: string; difficulty: string; xpReward: number;
  prerequisiteCaseId: string | null; stages: string[]; concept: string; locked: boolean; lesson: Lesson; challenge: Challenge; resolution: Resolution;
};
export type Evidence = { id: string; code: string; text: string };
export type RunTest = { id: string; name: string; passed: boolean; hidden?: boolean };
export type RunResult = { status: string; stdout: string; stderr: string; testsPassed: number; testsTotal: number; score: number; passed: boolean; tests?: RunTest[] };
export type Progress = { xp: number; level: number; rank: string; streak: number; casesSolved: number; mastery: Record<string, unknown>; unlockedCaseIds: string[] };
export type CaseProgress = { currentStage: string; completedStages: string[]; completed: boolean };
export type Submission = { id: string; passed: boolean; score: number; testsPassed: number; testsTotal: number; createdAt: string };

export type CodeLabCase = {
  id: string;
  caseNumber: number;
  title: string;
  course: string;
  topic: string;
  difficulty: string;
  codingChallenge: {
    id: string;
    title: string;
    description: string;
    starterCode: string;
    language: string;
  };
  rewards: {
    xp: number;
    badge: string;
    unlockNextCase: boolean;
  };
};

type CaseResponse = {
  case: CaseSummary;
  progress: CaseProgress | null;
  evidence: Evidence[];
};

function normalizeCaseId(id: string) {
  const match = id.match(/^case[-_]?0*(\d+)$/i);
  return match ? `case-${match[1].padStart(3, "0")}` : id;
}

function normalizeChallengeId(id: string) {
  const match = id.match(/^(?:case|challenge)[-_]?0*(\d+)$/i);
  return match ? `challenge-${match[1].padStart(3, "0")}` : id;
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
    rewards: {
      xp: caseData.xpReward,
      badge: caseData.concept,
      unlockNextCase: true,
    },
  };
}

export const getCases = () => apiFetch<{ cases: CaseSummary[] }>("/cases");

export async function getCase(id: string) {
  const response = await apiFetch<CaseResponse>(`/cases/${normalizeCaseId(id)}`);
  return { ...response, data: toCodeLabCase(response.case) };
}

export const getCaseProgress = (id: string) => apiFetch<{ locked: boolean; progress: CaseProgress | null; discoveredEvidence: Array<{ caseId: string; evidenceId: string; discoveredAt: string }>; latestSubmission: Submission | null }>(`/cases/${normalizeCaseId(id)}/progress`);
export const getProgress = () => apiFetch<Progress>("/progress");

export async function getActiveCase() {
  const storedId = typeof window !== "undefined" ? localStorage.getItem("codedetective_active_case") : null;
  const cases = await getCases();
  const selected = cases.cases.find((item) => item.id === storedId && !item.locked) || cases.cases.find((item) => !item.locked);
  if (!selected) throw new Error("No unlocked investigation is available.");
  if (typeof window !== "undefined") localStorage.setItem("codedetective_active_case", selected.id);
  return getCase(selected.id);
}

export async function startCase(id: string) {
  const normalizedId = normalizeCaseId(id);
  const result = await apiFetch<{ progress: CaseProgress }>(`/cases/${normalizedId}/start`, { method: "POST" });
  if (typeof window !== "undefined") localStorage.setItem("codedetective_active_case", normalizedId);
  return result;
}

export const updateStage = (id: string, stage: string) => apiFetch<{ progress: CaseProgress }>(`/cases/${normalizeCaseId(id)}/stage`, { method: "POST", body: JSON.stringify({ stage }) });
export const completeLesson = (id: string) => apiFetch<{ completed: boolean; progress: CaseProgress }>(`/cases/${normalizeCaseId(id)}/lesson/complete`, { method: "POST" });
export const discoverEvidence = (id: string, evidenceId: string) => apiFetch<{ evidence: Evidence }>(`/cases/${normalizeCaseId(id)}/evidence/${evidenceId}/discover`, { method: "POST" });
export const completeCase = (id: string) => apiFetch<{ completed: boolean; alreadyCompleted?: boolean; xpAwarded?: number; xp: number; rank: string; level: number; nextCaseUnlocked: string | null }>(`/cases/${normalizeCaseId(id)}/complete`, { method: "POST" });

export const runCode = (challengeId: string, code: string) => apiFetch<RunResult>("/code/run", { method: "POST", body: JSON.stringify({ challengeId: normalizeChallengeId(challengeId), code }) });

export async function submitCode(challengeId: string, code: string) {
  const result = await apiFetch<RunResult & { submissionId: string }>("/code/submit", {
    method: "POST",
    body: JSON.stringify({ challengeId: normalizeChallengeId(challengeId), code }),
  });
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
