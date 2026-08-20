"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, CalendarDays, FileSearch, FolderOpen, Lock, Shield, Star } from "lucide-react";
import { getCases, startCase, type CaseSummary } from "@/lib/api";
import { getStoredUser, type User } from "@/lib/auth";

export default function LiveCaseBoard() {
  const router = useRouter();
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    if (!stored) { setLoading(false); return; }
    getCases().then(r => setCases(r.cases)).catch(e => setError(e instanceof Error ? e.message : "Unable to load cases")).finally(() => setLoading(false));
  }, []);

  const active = cases.find(c => !c.locked) || cases[0];
  const xp = user?.xp || 0;
  const xpInLevel = xp % 500;
  const xpPercent = Math.min(100, Math.round((xpInLevel / 500) * 100));

  async function begin() {
    if (!active) return;
    setStarting(true);
    try { await startCase(active.id); router.push("/evidence"); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to start case"); }
    finally { setStarting(false); }
  }

  if (!user) return <section className="case-board"><div className="max-w-3xl mx-auto p-10 text-center"><h2>CASE BOARD</h2><p className="mt-3">Sign in to load live investigations and save your progress.</p><button onClick={() => router.push("/login")} className="mt-5 rounded-lg bg-amber-500 px-5 py-2 font-black text-black">ENTER THE BUREAU</button></div></section>;
  if (loading) return <section className="case-board"><div className="p-10 text-center font-mono text-amber-400">LOADING INVESTIGATION BOARD...</div></section>;
  if (error) return <section className="case-board"><div className="p-10 text-center text-red-400 font-mono">{error}</div></section>;
  if (!active) return <section className="case-board"><div className="p-10 text-center">No investigations are currently available.</div></section>;

  return (
    <section className="case-board">
      <div className="case-board-header">
        <div className="case-board-heading"><div className="case-board-kicker"><span className="case-board-kicker-line" />INVESTIGATION BOARD<span className="case-board-kicker-line" /></div><h2>CASE BOARD</h2><p>SELECT YOUR NEXT INVESTIGATION</p></div>
        <div className="detective-status"><div className="detective-status-icon"><Shield size={28} /></div><div className="detective-status-info"><span className="detective-status-label">DETECTIVE STATUS</span><div className="detective-rank">RANK: <strong>{user.rank}</strong></div><div className="xp-row"><span>XP: {xp}</span><span>{xpPercent}%</span></div><div className="xp-bar"><div className="xp-progress" style={{ width: `${xpPercent}%` }} /></div></div></div>
      </div>

      <div className="case-main-layout">
        <div className="case-dossier">
          <div className="dossier-paper">
            <div className="dossier-top"><div className="case-number">CASE FILE <span>#{active.number}</span></div><div className="case-status"><span />{active.locked ? "LOCKED" : "UNSOLVED"}</div></div>
            <div className="dossier-content"><div className="dossier-copy"><div className="classified-stamp">CLASSIFIED</div><h3>{active.title}</h3><p>{active.description}</p><p className="dossier-highlight">Find the bug. Restore the truth.</p></div><div className="case-photo"><div className="photo-pin" /><img src="/hero-noir.png" alt="Case evidence" /><div className="photo-caption">CENTRAL DATA SYSTEM<span>LIVE CASE FILE</span></div></div></div>
            <div className="dossier-stats">
              <div className="dossier-stat"><Shield size={25} /><div><span>DIFFICULTY</span><strong>{active.difficulty}</strong></div></div>
              <div className="dossier-stat"><CalendarDays size={25} /><div><span>STAGES</span><strong>{active.stages.length}</strong></div></div>
              <div className="dossier-stat"><Star size={27} /><div><span>REWARD</span><strong>+{active.xpReward} XP</strong></div></div>
            </div>
            <div className="dossier-actions"><button disabled={starting} onClick={begin} className="begin-investigation"><ArrowRight size={21} />{starting ? "OPENING FILE..." : "BEGIN INVESTIGATION"}<ArrowRight size={21} /></button><button onClick={() => router.push(`/evidence?case=${active.id}`)} className="case-details-button"><FileSearch size={18} />VIEW CASE DETAILS</button></div>
          </div>
        </div>

        <div className="case-intel">
          <div className="intel-panel"><div className="panel-title">CASE INTEL</div><div className="intel-stats"><div className="intel-stat"><AlertTriangle /><span>THREAT LEVEL</span><strong>{active.difficulty}</strong></div><div className="intel-stat"><CalendarDays /><span>STAGES</span><strong>{active.stages.length}</strong></div><div className="intel-stat"><Star /><span>REWARD</span><strong>+{active.xpReward} XP</strong></div><div className="intel-stat"><FolderOpen /><span>CONCEPT</span><strong>{active.concept}</strong></div></div></div>
          <div className="intel-panel summary-panel"><div className="panel-title">CASE SUMMARY</div><p>{active.description}</p><div className="investigation-seal">BUREAU OF CODE<br />INVESTIGATION</div></div>
          <div className="intel-panel"><div className="panel-title">INVESTIGATION FLOW</div><div className="intel-brief">{active.stages.slice(0, 3).map((stage, i) => <div key={stage}><span>{i + 1}</span><strong>{stage}</strong><span>STAGE</span></div>)}</div></div>
        </div>
      </div>

      <div className="upcoming-cases"><div className="upcoming-heading"><span /><h3>CASES UNDER INVESTIGATION</h3><span /></div><div className="case-cards">{cases.slice(1, 4).map(c => <div className="locked-case" key={c.id}><div className="locked-case-image" style={{ backgroundImage: "url('/hero-noir.png')" }} /><div className="locked-overlay" /><div className="locked-case-content"><span className="locked-number">#{c.number}</span><h4>{c.title}</h4><div className="locked-label">{c.locked ? <><Lock size={14} />LOCKED</> : "AVAILABLE"}</div><span className="required">{c.locked ? `REQUIRED: ${c.prerequisiteCaseId || "PREVIOUS CASE"}` : `REWARD: +${c.xpReward} XP`}</span></div></div>)}</div></div>
    </section>
  );
}
