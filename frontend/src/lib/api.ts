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

export type CaseSummary = { id: string; number: string; title: string; description: string; difficulty: string; xpReward: number; prerequisiteCaseId: string | null; stages: string[]; concept: string; locked: boolean; challenge: { id: string; language: string; starterCode: string; tests: Array<{ id: string; name: string; stdin?: string; hidden?: boolean }> } };
export type Evidence = { id: string; code: string; text: string };
export type RunResult = { status: string; stdout: string; stderr: string; testsPassed: number; testsTotal: number; score: number; passed: boolean };
export type Progress = { xp: number; level: number; rank: string; streak: number; casesSolved: number; mastery: Record<string, unknown>; unlockedCaseIds: string[] };
export type CaseProgress = { currentStage: string; completedStages: string[]; completed: boolean };

export const getCases = () => apiFetch<{ cases: CaseSummary[] }>("/cases");
export const getCase = (id: string) => apiFetch<{ case: CaseSummary; progress: CaseProgress | null; evidence: Evidence[] }>(`/cases/${id}`);
export const getCaseProgress = (id: string) => apiFetch<{ locked: boolean; progress: CaseProgress | null; discoveredEvidence: Array<{ caseId: string; evidenceId: string; discoveredAt: string }> }>(`/cases/${id}/progress`);
export const getProgress = () => apiFetch<Progress>("/progress");
export const startCase = (id: string) => apiFetch<{ progress: CaseProgress }>(`/cases/${id}/start`, { method: "POST" });
export const updateStage = (id: string, stage: string) => apiFetch<{ progress: CaseProgress }>(`/cases/${id}/stage`, { method: "POST", body: JSON.stringify({ stage }) });
export const discoverEvidence = (id: string, evidenceId: string) => apiFetch<{ evidence: Evidence }>(`/cases/${id}/evidence/${evidenceId}/discover`, { method: "POST" });
export const completeCase = (id: string) => apiFetch<{ completed: boolean; alreadyCompleted?: boolean; xpAwarded?: number; xp: number; rank: string; level: number; nextCaseUnlocked: string | null }>(`/cases/${id}/complete`, { method: "POST" });
export const runCode = (challengeId: string, code: string) => apiFetch<RunResult>("/code/run", { method: "POST", body: JSON.stringify({ challengeId, code }) });
export const submitCode = (challengeId: string, code: string) => apiFetch<RunResult & { submissionId: string }>("/code/submit", { method: "POST", body: JSON.stringify({ challengeId, code }) });
