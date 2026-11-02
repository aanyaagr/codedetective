"use client";

import { useCallback, useEffect, useState } from "react";
import { getActiveCase, type CaseResponse } from "./api";
import { useAuthUser, useHydrated } from "./auth";

type State = { userId: string; data: CaseResponse | null; error: string };

/**
 * Loads the player's active case (see getActiveCase). `reload()` refreshes in the
 * background without flashing the loading state; `setData` applies local updates.
 */
export function useActiveCase() {
  const user = useAuthUser();
  const hydrated = useHydrated();
  const userId = user?.id ?? null;
  const [state, setState] = useState<State | null>(null);
  const [token, setToken] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getActiveCase()
      .then((data) => { if (!cancelled) setState({ userId, data, error: "" }); })
      .catch((e) => { if (!cancelled) setState({ userId, data: null, error: e instanceof Error ? e.message : "Unable to load the case file." }); });
    return () => { cancelled = true; };
  }, [userId, token]);

  const setData = useCallback((update: (d: CaseResponse) => CaseResponse) => {
    setState((s) => (s?.data ? { ...s, data: update(s.data) } : s));
  }, []);
  const reload = useCallback(() => setToken((t) => t + 1), []);

  const current = state && state.userId === userId ? state : null;
  const signedOut = hydrated && !user;
  return {
    user,
    signedOut,
    loading: !hydrated || (!signedOut && !current),
    error: current?.error ?? "",
    data: current?.data ?? null,
    setData,
    reload,
  };
}
