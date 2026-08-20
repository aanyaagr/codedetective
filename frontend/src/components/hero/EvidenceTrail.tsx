"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Link2, Fingerprint, Shield, Target, AlertTriangle, Lock, Check } from "lucide-react";
import { completeCase, discoverEvidence, getActiveCase, getProgress, startCase, updateStage, type Evidence, type CaseSummary } from "../../lib/api";

const image = "/hero-noir.png";

export default function EvidenceTrail() {
  const [caseData, setCaseData] = useState<CaseSummary | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [stage, setStage] = useState("BRIEFING");
  const [xp, setXp] = useState(0);
  const [rank, setRank] = useState("ROOKIE");
  const [level, setLevel] = useState(1);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [{ case: activeCase, progress, evidence: caseEvidence }, progressData] = await Promise.all([getActiveCase(), getProgress()]);
        setCaseData(activeCase); setEvidence(caseEvidence); setStage(progress?.currentStage || "BRIEFING");
        setXp(progressData.xp); setRank(progressData.rank); setLevel(progressData.level);
        const saved = await fetchProgress(activeCase.id);
        setDiscovered(saved);
        if (!progress) await startCase(activeCase.id);
      } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load investigation."); }
      finally { setBusy(false); }
    })();
  }, []);

  async function fetchProgress(id: string) {
    const token = typeof window !== "undefined" ? localStorage.getItem("codedetective_token") : null;
    if (!token) return [];
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/cases/${id}/progress`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.discoveredEvidence || []).map((item: { evidenceId: string }) => item.evidenceId);
  }

  async function revealEvidence(id: string) {
    if (!caseData) return;
    try { const result = await discoverEvidence(caseData.id, id); setDiscovered((items) => items.includes(id) ? items : [...items, id]); setSelectedEvidence(id); setMessage(`${result.evidence.code} discovered.`); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not discover evidence."); }
  }

  async function advance() {
    if (!caseData) return;
    const index = caseData.stages.indexOf(stage);
    const next = caseData.stages[index + 1];
    if (!next) return;
    if (stage === "EVIDENCE") return complete();
    try { await updateStage(caseData.id, next); setStage(next); setMessage(`Stage advanced to ${next}.`); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Stage could not advance."); }
  }

  async function complete() {
    if (!caseData) return;
    try { await updateStage(caseData.id, "SOLVE"); const result = await completeCase(caseData.id); setXp(result.xp); setRank(result.rank); setLevel(result.level); setStage("SOLVE"); setMessage(result.alreadyCompleted ? "Case already completed." : `CASE SOLVED — +${result.xpAwarded} XP.`); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Case cannot be completed yet."); }
  }

  const selected = useMemo(() => evidence.find((item) => item.id === selectedEvidence) || evidence[0], [evidence, selectedEvidence]);
  const progressPercent = Math.min(100, Math.round((discovered.length / Math.max(evidence.length, 1)) * 100));

  if (!caseData && !message) return <main className="evidence-page"><div className="evidence-header"><div className="evidence-heading"><div className="evidence-kicker"><span /> EVIDENCE DIVISION <span /></div><h1>EVIDENCE TRAIL</h1><p>LOADING LIVE INVESTIGATION...</p></div></div></main>;

  return (
    <main className="evidence-page">
      <div className="evidence-casebar"><div>CASE #{caseData?.number || "—"}: {caseData?.title || "UNAVAILABLE"}</div><div className="evidence-case-status"><span>STATUS: {stage === "SOLVE" ? "CASE SOLVED" : "INVESTIGATION IN PROGRESS"}</span><span className="case-separator">•</span><span className="wire-status">BACKEND CONNECTED</span></div></div>
      <section className="evidence-header">
        <Link href="/case-board" className="back-case-button"><ArrowLeft size={16} /> BACK TO CASE BOARD</Link>
        <div className="evidence-heading"><div className="evidence-kicker"><span /> EVIDENCE DIVISION <span /></div><h1>EVIDENCE TRAIL</h1><p>{caseData?.description}</p></div>
        <div className="detective-status"><div className="detective-icon"><Shield size={36} /></div><div><div className="status-heading">DETECTIVE STATUS</div><div className="rank-row">RANK: <strong>{rank}</strong></div><div className="xp-row"><span>LEVEL {level}</span><span>{xp} XP</span></div><div className="xp-bar"><div style={{ width: `${Math.min(100, (xp % 500) / 5)}%` }} /></div></div></div>
      </section>
      <section className="evidence-layout">
        <div className="evidence-main">
          <div className="investigation-board"><div className="board-title">INVESTIGATION BOARD</div>{evidence.map((item, index) => <EvidenceCard key={item.id} evidence={item} position={`evidence-${["one","two","three","four"][index] || "one"}`} selected={selectedEvidence === item.id} discovered={discovered.includes(item.id)} onClick={() => revealEvidence(item.id)} />)}<div className="red-thread thread-one" /><div className="red-thread thread-two" /><div className="red-thread thread-three" /><div className="red-thread thread-four" /></div>
          <div className="evidence-inventory"><div className="inventory-title"><Search size={15} /> EVIDENCE INVENTORY</div><div className="inventory-items">{evidence.map((item) => <button key={item.id} className={`inventory-card ${selectedEvidence === item.id ? "inventory-selected" : ""}`} onClick={() => revealEvidence(item.id)}><span className="inventory-number">{item.code.replace("EV-", "")}</span><img src={image} alt={item.code} />{discovered.includes(item.id) && <span className="inventory-check"><Check size={12} /></span>}</button>)}{[...Array(Math.max(0, 2 - evidence.length))].map((_, i) => <div className="inventory-locked" key={i}><Lock size={20} /><span>EVIDENCE</span><small>LOCKED</small></div>)}</div></div>
          <div className="connect-area"><div className="connect-info"><Fingerprint size={48} /><div><h3>CONNECT THE EVIDENCE TO REVEAL THE TRUTH.</h3><p>{discovered.length} / {evidence.length} pieces discovered.</p></div></div><div className="connect-actions"><button className="connect-button" onClick={advance} disabled={busy || (stage === "EVIDENCE" && discovered.length < evidence.length)}><Link2 size={18} /> {stage === "EVIDENCE" ? "SOLVE CASE" : `CONTINUE: ${stage}`}</button><Link href="/lesson" className="lesson-button">CONTINUE TO MINI LESSON <span>→</span></Link></div></div>
          {message && <div className="evidence-panel" role="status">{message}</div>}
        </div>
        <aside className="evidence-sidebar">
          <div className="evidence-panel"><h3>INVESTIGATION PROGRESS</h3><div className="progress-content"><div className="progress-circle"><strong>{discovered.length} / {evidence.length}</strong><span>EVIDENCE<br />DISCOVERED</span></div><div className="progress-list"><div><span className="progress-dot green" /> Evidence Found <strong>{discovered.length}</strong></div><div><span className="progress-dot amber" /> Current Stage <strong>{stage}</strong></div><div><span className="progress-dot blue" /> Progress <strong>{progressPercent}%</strong></div><div><span className="progress-dot red" /> Case Solved <strong>{stage === "SOLVE" ? "1" : "0"}</strong></div></div></div></div>
          <div className="evidence-panel threat-panel"><h3><AlertTriangle size={18} /> THREAT LEVEL</h3><div className="threat-bar">{[1,2,3,4,5,6,7,8,9].map((item) => <span key={item} className={item <= Math.max(1, Math.round(progressPercent / 10)) ? "active" : ""} />)}</div><strong>{progressPercent}%</strong></div>
          <div className="evidence-panel objective-panel"><h3><Target size={18} /> CASE OBJECTIVE</h3><p>{caseData?.objective}</p><div className="investigation-active"><span /> {stage === "SOLVE" ? "CASE COMPLETE" : "INVESTIGATION ACTIVE"}</div></div>
          {selected && <div className="evidence-panel selected-panel"><h3>SELECTED EVIDENCE</h3><div className="selected-content"><img src={image} alt={selected.code} /><div><h4>{selected.code}</h4><span>{caseData?.concept}</span><p>{selected.text}</p><button className="examine-button" onClick={() => revealEvidence(selected.id)}><Search size={15} /> {discovered.includes(selected.id) ? "DISCOVERED" : "EXAMINE CLUE"}</button></div></div></div>}
        </aside>
      </section>
    </main>
  );
}

function EvidenceCard({ evidence, position, selected, discovered, onClick }: { evidence: Evidence; position: string; selected: boolean; discovered: boolean; onClick: () => void }) {
  return <button className={`board-evidence ${position} ${selected ? "board-selected" : ""}`} onClick={onClick}><span className="pin" /><span className="evidence-number">{evidence.code.replace("EV-", "")}</span><img src={image} alt={evidence.code} /><div className="board-card-footer"><strong>{evidence.code}</strong><span>{discovered ? evidence.text : "CLICK TO EXAMINE"}</span></div><span className="zoom-icon">{discovered ? <Check size={16} /> : <Search size={16} />}</span></button>;
}
