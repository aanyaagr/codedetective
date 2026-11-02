"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, CalendarDays, Check, FileSearch, FolderOpen, Lock, Shield, Star } from "lucide-react";
import { ACTIVE_CASE_KEY, getCases, getProgress, pickActiveCase, setActiveCase, startCase, type CaseStatus, type CaseSummary, type Progress } from "@/lib/api";
import { useAuthUser, useHydrated } from "@/lib/auth";
import { SignInGate } from "@/components/ui/SignInGate";

/** Where to continue a case in the investigation flow. */
function routeForCase(c: CaseSummary): string {
  if (c.status === "solved") return "/resolution";
  switch (c.currentStage) {
    case "EVIDENCE":
    case "SOLVE":
      return "/resolution";
    case "CODE":
      return "/code-lab";
    case "LEARN":
    case "INVESTIGATE":
      return "/exercise";
    default:
      return "/evidence";
  }
}

/** Case to show first: ?case= in the URL, then the remembered active case, then the best default. */
function preferredCaseId(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("case") || localStorage.getItem(ACTIVE_CASE_KEY);
}

type Board = { userId: string; cases: CaseSummary[]; progress: Progress | null; error: string };

const STATUS_LABEL: Record<CaseStatus, string> = {
  locked: "LOCKED",
  available: "UNSOLVED",
  in_progress: "IN PROGRESS",
  solved: "SOLVED",
};

function Header({ rank, xp }: { rank?: string; xp?: number }) {
  const xpInLevel = (xp || 0) % 500;
  const xpPercent = Math.min(100, Math.round((xpInLevel / 500) * 100));
  return (
    <div className="case-board-header">
      <div className="case-board-heading">
        <div className="case-board-kicker"><span className="case-board-kicker-line" />INVESTIGATION BOARD<span className="case-board-kicker-line" /></div>
        <h2>CASE BOARD</h2>
        <p>SELECT YOUR NEXT INVESTIGATION</p>
      </div>
      {rank !== undefined && (
        <div className="detective-status">
          <div className="detective-status-icon"><Shield size={28} /></div>
          <div className="detective-status-info">
            <span className="detective-status-label">DETECTIVE STATUS</span>
            <div className="detective-rank">RANK: <strong>{rank}</strong></div>
            <div className="xp-row"><span>XP: {xp}</span><span>{xpInLevel}/500 TO NEXT LEVEL</span></div>
            <div className="xp-bar"><div className="xp-progress" style={{ width: `${xpPercent}%` }} /></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveCaseBoard() {
  const router = useRouter();
  const user = useAuthUser();
  const hydrated = useHydrated();
  const [board, setBoard] = useState<Board | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [actionError, setActionError] = useState("");
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    Promise.all([getCases(), getProgress()])
      .then(([{ cases }, progress]) => { if (!cancelled) setBoard({ userId, cases, progress, error: "" }); })
      .catch((e) => { if (!cancelled) setBoard({ userId, cases: [], progress: null, error: e instanceof Error ? e.message : "Unable to load cases" }); });
    return () => { cancelled = true; };
  }, [userId]);

  const data = board && board.userId === userId ? board : null;
  const cases = useMemo(() => data?.cases ?? [], [data]);
  const preferred = selectedId ?? (data ? preferredCaseId() : null);
  const active = cases.find((c) => c.id === preferred && !c.locked) || pickActiveCase(cases);

  async function begin() {
    if (!active || active.locked) return;
    setStarting(true);
    setActionError("");
    try {
      if (active.status === "available") await startCase(active.id);
      else setActiveCase(active.id);
      router.push(routeForCase(active));
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Unable to open the case file");
      setStarting(false);
    }
  }

  // ---- non-data states (same section chrome so the page keeps its look) ----
  if (!hydrated || (user && !data)) {
    return (
      <section id="case-board" className="case-board">
        <Header />
        <div className="cd-status" role="status"><span className="cd-status-dot" /> LOADING INVESTIGATION BOARD…</div>
      </section>
    );
  }
  if (!user) {
    return (
      <section id="case-board" className="case-board">
        <Header />
        <SignInGate title="SIGN IN TO LOAD LIVE INVESTIGATIONS" message="Open real case files, run your fixes against hidden tests, and climb the detective leaderboard." />
      </section>
    );
  }
  if (data?.error || !active) {
    return (
      <section id="case-board" className="case-board">
        <Header />
        <div className="cd-status cd-status-error" role="alert">
          <strong>TRANSMISSION FAILED</strong>
          <span>{data?.error || "No investigations are currently available."}</span>
        </div>
      </section>
    );
  }

  const progress = data!.progress;
  const others = cases.filter((c) => c.id !== active.id);
  const actionLabel = active.status === "solved" ? "REVIEW CASE FILE" : active.status === "in_progress" ? "RESUME INVESTIGATION" : "BEGIN INVESTIGATION";
  const titleOf = (id: string | null) => {
    const c = cases.find((x) => x.id === id);
    return c ? `#${c.number} ${c.title}` : "PREVIOUS CASE";
  };

  return (
    <section id="case-board" className="case-board">
      <Header rank={progress?.rank ?? user.rank} xp={progress?.xp ?? user.xp} />

      <div className="case-main-layout">
        <div className="case-dossier">
          <div className="dossier-paper">
            <div className="dossier-top">
              <div className="case-number">CASE FILE <span>#{active.number}</span></div>
              <div className={`case-status case-status-${active.status}`}><span />{STATUS_LABEL[active.status]}</div>
            </div>
            <div className="dossier-content">
              <div className="dossier-copy">
                <div className="classified-stamp">{active.status === "solved" ? "CLOSED" : "CLASSIFIED"}</div>
                <h3>{active.title}</h3>
                <p>{active.description}</p>
                <p className="dossier-highlight">{active.status === "solved" ? "Case closed. The truth is restored." : "Find the bug. Restore the truth."}</p>
              </div>
              <div className="case-photo">
                <div className="photo-pin" />
                <img src="/hero-noir.png" alt="Case evidence" />
                <div className="photo-caption">CENTRAL DATA SYSTEM<span>{active.evidenceFound}/{active.evidenceTotal} EVIDENCE</span></div>
              </div>
            </div>
            <div className="dossier-stats">
              <div className="dossier-stat"><Shield size={25} /><div><span>DIFFICULTY</span><strong>{active.difficulty}</strong></div></div>
              <div className="dossier-stat"><CalendarDays size={25} /><div><span>LANGUAGE</span><strong>{(active.challenge?.language || "python").toUpperCase()}</strong></div></div>
              <div className="dossier-stat"><Star size={27} /><div><span>REWARD</span><strong>+{active.xpReward} XP</strong></div></div>
            </div>
            <div className="dossier-actions">
              <button disabled={starting} onClick={begin} className="begin-investigation">
                <ArrowRight size={21} />{starting ? "OPENING FILE..." : actionLabel}<ArrowRight size={21} />
              </button>
              <button onClick={() => { setActiveCase(active.id); router.push("/evidence"); }} className="case-details-button">
                <FileSearch size={18} />VIEW CASE DETAILS
              </button>
            </div>
            {actionError && <div className="cd-inline-error" role="alert">{actionError}</div>}
          </div>
        </div>

        <div className="case-intel">
          <div className="intel-panel">
            <div className="panel-title">CASE INTEL</div>
            <div className="intel-stats">
              <div className="intel-stat"><AlertTriangle /><span>THREAT LEVEL</span><strong>{active.difficulty}</strong></div>
              <div className="intel-stat"><CalendarDays /><span>STAGES</span><strong>{active.stages.length}</strong></div>
              <div className="intel-stat"><Star /><span>REWARD</span><strong>+{active.xpReward} XP</strong></div>
              <div className="intel-stat"><FolderOpen /><span>CONCEPT</span><strong>{active.concept}</strong></div>
            </div>
          </div>
          <div className="intel-panel summary-panel">
            <div className="panel-title">CASE OBJECTIVE</div>
            <p>{active.objective}</p>
            <div className="investigation-seal">BUREAU OF CODE<br />INVESTIGATION</div>
          </div>
          <div className="intel-panel">
            <div className="panel-title">INVESTIGATION FLOW</div>
            <div className="intel-brief intel-brief-flow">
              {active.stages.map((stage, i) => {
                const reached = active.stages.indexOf(active.currentStage) >= i && active.status !== "available";
                const current = stage === active.currentStage && active.status === "in_progress";
                return (
                  <div key={stage} className={`${reached ? "flow-reached" : ""} ${current ? "flow-current" : ""}`}>
                    <span>{i + 1}</span><strong>{stage}</strong><span>{active.status === "solved" || (reached && !current) ? "DONE" : current ? "CURRENT" : "STAGE"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="upcoming-cases">
        <div className="upcoming-heading"><span /><h3>CASES UNDER INVESTIGATION</h3><span /></div>
        <div className="case-cards">
          {others.map((c) => (
            <button
              type="button"
              className={`locked-case locked-case-${c.status}`}
              key={c.id}
              disabled={c.locked}
              onClick={() => { setSelectedId(c.id); setActiveCase(c.id); window.scrollTo({ top: document.getElementById("case-board")?.offsetTop ?? 0, behavior: "smooth" }); }}
              aria-label={c.locked ? `Case ${c.number} locked` : `Select case ${c.number}: ${c.title}`}
            >
              <div className="locked-case-image" style={{ backgroundImage: "url('/hero-noir.png')" }} />
              <div className="locked-overlay" />
              <div className="locked-case-content">
                <span className="locked-number">#{c.number}</span>
                <h4>{c.title}</h4>
                <div className="locked-label">
                  {c.status === "locked" && <><Lock size={14} />LOCKED</>}
                  {c.status === "solved" && <><Check size={14} />SOLVED</>}
                  {c.status === "in_progress" && <>IN PROGRESS</>}
                  {c.status === "available" && <>AVAILABLE</>}
                </div>
                <span className="required">
                  {c.locked ? `REQUIRED: SOLVE ${titleOf(c.prerequisiteCaseId)}` : c.status === "solved" ? `+${c.xpReward} XP EARNED` : `REWARD: +${c.xpReward} XP · CLICK TO SELECT`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
