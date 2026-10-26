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
import { apiFetch } from "@/lib/api";

type LeaderboardEntry = {
  name: string;
  xp: number;
  rank: string;
};

type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[];
};

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
      }`}
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
      </h2>
      <div className="mt-3 flex items-center gap-2 font-mono text-sm font-bold text-amber-300">
        <Star className="h-4 w-4 fill-current" />
        {formatXp(entry.xp)} XP
      </div>
    </article>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div className="grid grid-cols-[56px_minmax(0,1fr)_120px_120px] items-center gap-4 border-t border-white/[0.07] px-5 py-4 first:border-t-0">
      <span className="font-mono text-sm font-black text-slate-500">
        #{entry.rank}
      </span>
      <div className="min-w-0">
        <p className="truncate font-mono text-sm font-bold uppercase tracking-wide text-[#F5F2ED]">
          {entry.name}
        </p>
      </div>
      <span className="text-right font-mono text-sm font-bold text-amber-300">
        {formatXp(entry.xp)} XP
      </span>
      <span className="text-right text-[10px] font-mono font-black uppercase tracking-[0.16em] text-slate-500">
        {entry.rank}
      </span>
    </div>
  );
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<LeaderboardResponse>(
        "/progress/leaderboard",
      );

      setEntries((response.leaderboard || []).slice(0, 15));
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError("Unable to load the detective leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const podium = entries.slice(0, 3);
  const remaining = entries.slice(3, 15);

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

        {loading ? (
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
                  key={`${entry.name}-${entry.rank}`}
                  entry={entry}
                  position={(index + 1) as 1 | 2 | 3}
                />
              ))}
            </section>

            {remaining.length > 0 && (
              <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0C11]/70">
                <div className="grid grid-cols-[56px_minmax(0,1fr)_120px_120px] gap-4 border-b border-red-950/50 bg-black/20 px-5 py-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                  <span>RANK</span>
                  <span>DETECTIVE</span>
                  <span className="text-right">XP</span>
                  <span className="text-right">CLASS</span>
                </div>

                {remaining.map((entry) => (
                  <LeaderboardRow key={`${entry.name}-${entry.rank}`} entry={entry} />
                ))}
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
