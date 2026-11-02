"use client";

import { useSyncExternalStore } from "react";
import { apiFetch, AUTH_EVENT, TOKEN_KEY, USER_KEY } from "./api";

export type User = { id: string; name: string; email: string; xp: number; rank: string; level: number; casesSolved?: number };

function saveSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export async function login(email: string, password: string) {
  const result = await apiFetch<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  saveSession(result.token, result.user);
  return result.user;
}

export async function register(name: string, email: string, password: string) {
  const result = await apiFetch<{ token: string; user: User }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  saveSession(result.token, result.user);
  return result.user;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

/** Re-fetches the signed-in user (fresh XP / rank) and notifies every subscriber. */
export async function refreshUser(): Promise<User | null> {
  if (typeof window === "undefined" || !localStorage.getItem(TOKEN_KEY)) return null;
  try {
    const { user } = await apiFetch<{ user: User }>("/auth/me");
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event(AUTH_EVENT));
    return user;
  } catch {
    return null;
  }
}

let cachedRaw: string | null = null;
let cachedUser: User | null = null;

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TOKEN_KEY) ? localStorage.getItem(USER_KEY) : null;
  if (raw === cachedRaw) return cachedUser;
  cachedRaw = raw;
  try {
    cachedUser = raw ? (JSON.parse(raw) as User) : null;
  } catch {
    cachedUser = null;
  }
  return cachedUser;
}

function subscribe(callback: () => void) {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
const noopSubscribe = () => () => {};

/** The signed-in user, or null. Always null during server render and hydration (no mismatch). */
export function useAuthUser(): User | null {
  return useSyncExternalStore(subscribe, getStoredUser, () => null);
}

/** False during server render and hydration, true once running in the browser. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
