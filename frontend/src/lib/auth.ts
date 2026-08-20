import { apiFetch } from "./api";

export type User = { id: string; name: string; email: string; xp: number; rank: string; level: number };

export async function login(email: string, password: string) {
  const result = await apiFetch<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("codedetective_token", result.token);
  localStorage.setItem("codedetective_user", JSON.stringify(result.user));
  return result.user;
}

export async function register(name: string, email: string, password: string) {
  const result = await apiFetch<{ token: string; user: User }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  localStorage.setItem("codedetective_token", result.token);
  localStorage.setItem("codedetective_user", JSON.stringify(result.user));
  return result.user;
}

export function logout() {
  localStorage.removeItem("codedetective_token");
  localStorage.removeItem("codedetective_user");
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("codedetective_user");
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}
