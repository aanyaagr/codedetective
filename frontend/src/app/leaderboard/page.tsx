"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Crown,
  Medal,
  RefreshCw,
  Shield,
  Star,
  Trophy,
} from "lucide-react";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/api";
import { useAuthUser, useHydrated } from "@/lib/auth";
import { SignInGate } from "@/components/ui/SignInGate";

const RANK_STYLES = {
  1: "border-amber-500/60 bg-amber-500/[0.07]",
  2: "border-slate-400/40 bg-slate-300/[0.04]",
  3: "border-orange-700/50 bg-orange-700/[0.05]",
} as const;

function formatXp(xp: number) {
  return new Intl.NumberFormat("en-IN").format(xp);
}

function PodiumCard({
  entry,
  position,
}: {
  entry: LeaderboardEntry;
  position: 1 | 2 | 3;
}) {
  const icon =
    position === 1 ? (
      <Crown className="h-6 w-6 text-amber-300" />
    ) : position === 2 ? (
      <Medal className="h-6 w-6 text-slate-300" />
    ) : (
      <Medal className="h-6 w-6 text-orange-400" />
    );

  return (
    <article
      className={`relative overflow-hidden rounded-xl border p-5 ${
        RANK_STYLES[position]
      } ${entry.isCurrentUser ? "ring-2 ring-red-500/70" : ""}`}
    >
      <div className="absolute right-4 top-4 text-[10px] font-mono font-black tracking-[0.2em] text-slate-500">
        #{position}
      </div>

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/30">
        {icon}
      </div>

      <p className="mb-1 text-[10px] font-mono font-black uppercase tracking-[0.22em] text-red-400">
        {entry.rank}
      </p>
      <h2 className="truncate text-xl font-black uppercase tracking-wide text-[#F5F2ED]">
        {entry.name}
        {entry.isCurrentUser && <span className="ml-2 rounded bg-red-600 px-1.5 py-0.5 align-middle font-mono text-[11px] tracking-wider text-white">YOU</span>}
      </h2>
      <p className="mt-1 font-mono text-xs text-slate-400">{entry.casesSolved} {entry.casesSolved === 1 ? "case" : "cases"} solved · {entry.evidenceFound} evidence</p>
      <div className="mt-3 flex items-center gap-2 font-mono text-sm font-bold text-amber-300">
        <Star className="h-4 w-4 fill-current" />
        {formatXp(entry.xp)} XP
      </div>
    </article>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div className={`grid grid-cols-[48px_minmax(0,1fr)_96px] sm:grid-cols-[56px_minmax(0,1fr)_120px_140px] items-center gap-3 sm:gap-4 border-t border-white/[0.07] px-4 sm:px-5 py-4 first:border-t-0 ${entry.isCurrentUser ? "bg-red-950/25 shadow-[inset_3px_0_0_#dc2626]" : ""} ${entry.xp === 0 ? "opacity-60" : ""}`}>
      <span className="font-mono text-sm font-black text-slate-400">
        #{entry.position}
      </span>
      <div className="min-w-0">
        <p className="truncate font-mono text-sm font-bold uppercase tracking-wide text-[#F5F2ED]">
          {entry.name}
          {entry.isCurrentUser && <span className="ml-2 rounded bg-red-600 px-1.5 py-0.5 font-mono text-[11px] tracking-wider text-white">YOU</span>}
        </p>
        <p className="mt-0.5 font-mono text-xs text-slate-500">{entry.casesSolved} solved · {entry.evidenceFound} evidence</p>
      </div>
      <span className="text-right font-mono text-sm font-bold text-amber-300">
        {formatXp(entry.xp)} XP
      </span>
      <span className="hidden sm:block text-right text-xs font-mono font-black uppercase tracking-[0.12em] text-slate-400">
        {entry.rank}
      </span>
    </div>
  );
}

export default function LeaderboardPage() {
  const user = useAuthUser();
  const hydrated = useHydrated();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [me, setMe] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getLeaderboard(15)
      .then((response) => {
        if (cancelled) return;
        setEntries(response.leaderboard || []);
        setMe(response.me);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load leaderboard:", err);
        setError(err instanceof Error ? err.message : "Unable to load the detective leaderboard.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId, refreshToken]);

  const loadLeaderboard = () => { setLoading(true); setRefreshToken((t) => t + 1); };

  // Only detectives with progress earn a podium spot.
  const podium = entries.filter((e) => e.xp > 0).slice(0, 3);
  const remaining = entries.filter((e) => !podium.includes(e));
  const meOutside = me && !entries.some((e) => e.isCurrentUser) ? me : null;

  if (hydrated && !user) {
    return (
      <main className="min-h-screen bg-[#07080C] text-slate-200 py-10">
        <SignInGate title="SIGN IN TO SEE THE DETECTIVE LEADERBOARD" message="Rankings are built from every detective's verified XP, solved cases and evidence." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080C] text-slate-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 border-b border-red-950/60 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-red-500">
              BUREAU RANKINGS // LIVE
            </p>
            <h1 className="font-mono text-4xl font-black uppercase tracking-[0.08em] text-[#F5F2ED] sm:text-5xl">
              DETECTIVE LEADERBOARD
            </h1>
            <p className="mt-3 max-w-2xl font-mono text-sm leading-6 text-slate-500">
              The 15 detectives with the highest verified XP currently hold the top positions in the bureau.
            </p>
          </div>

          <button
            type="button"
            onClick={loadLeaderboard}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-red-900/60 bg-black/30 px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-slate-300 transition hover:border-red-500/70 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            REFRESH
          </button>
        </div>

        {!hydrated || loading ? (
          <section className="rounded-xl border border-white/[0.08] bg-[#0A0C11]/70 p-12 text-center">
            <Trophy className="mx-auto mb-4 h-8 w-8 animate-pulse text-amber-400" />
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-slate-500">
              Retrieving bureau rankings...
            </p>
          </section>
        ) : error ? (
          <section className="rounded-xl border border-red-900/60 bg-red-950/10 p-10 text-center">
            <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-red-500" />
            <h2 className="font-mono text-lg font-black uppercase tracking-wider text-red-400">
              RANKING FILE UNAVAILABLE
            </h2>
            <p className="mx-auto mt-2 max-w-md font-mono text-sm text-slate-500">
              {error}
            </p>
            <button
              type="button"
              onClick={loadLeaderboard}
              className="mt-6 rounded-md border border-red-600/60 px-5 py-2 font-mono text-xs font-black uppercase tracking-wider text-red-300 hover:bg-red-950/30"
            >
              TRY AGAIN
            </button>
          </section>
        ) : entries.length === 0 ? (
          <section className="rounded-xl border border-white/[0.08] bg-[#0A0C11]/70 p-12 text-center">
            <Shield className="mx-auto mb-4 h-8 w-8 text-slate-600" />
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-slate-500">
              No detectives have been ranked yet.
            </p>
          </section>
        ) : (
          <>
            <section className="mb-8 grid gap-4 md:grid-cols-3">
              {podium.map((entry, index) => (
                <PodiumCard
                  key={`${entry.position}-${entry.name}-${index}`}
                  entry={entry}
                  position={Math.min(3, entry.position) as 1 | 2 | 3}
                />
              ))}
            </section>

            {(remaining.length > 0 || meOutside) && (
              <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0C11]/70">
                <div className="grid grid-cols-[48px_minmax(0,1fr)_96px] sm:grid-cols-[56px_minmax(0,1fr)_120px_140px] gap-3 sm:gap-4 border-b border-red-950/50 bg-black/20 px-4 sm:px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  <span>#</span>
                  <span>DETECTIVE</span>
                  <span className="text-right">XP</span>
                  <span className="hidden sm:block text-right">CLASS</span>
                </div>

                {remaining.map((entry, index) => (
                  <LeaderboardRow key={`${entry.position}-${entry.name}-${index}`} entry={entry} />
                ))}
                {meOutside && (
                  <>
                    <div className="border-t border-white/[0.07] px-5 py-2 text-center font-mono text-slate-600">⋯</div>
                    <LeaderboardRow entry={meOutside} />
                  </>
                )}
              </section>
            )}
          </>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/case-board"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/10 px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-400 transition hover:border-red-900/60 hover:text-red-300"
          >
            <ArrowLeft className="h-4 w-4" />
            VIEW CASE BOARD
          </Link>
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-red-600/60 bg-red-600 px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-white transition hover:bg-red-500"
          >
            RETURN TO ACADEMY
          </Link>
        </div>
      </div>
    </main>
  );
}
