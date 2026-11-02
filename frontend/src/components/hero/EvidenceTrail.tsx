"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Check, Fingerprint, Link2, Lock, Search, Shield, Target } from "lucide-react";
import { completeCase, discoverEvidence, getProgress, updateStage, type Evidence, type Progress } from "@/lib/api";
import { refreshUser } from "@/lib/auth";
import { useActiveCase } from "@/lib/useActiveCase";
import { CaseFileStatus, SignInGate } from "@/components/ui/SignInGate";

const image = "/hero-noir.png";
const POSITIONS = ["evidence-one", "evidence-two", "evidence-three", "evidence-four"];

const sealedHint = (e: Evidence) =>
  e.condition === "failed_test" ? "SEALED · RUN THE SUSPECT CODE" : e.condition === "passed_all_tests" ? "SEALED · PASS EVERY TEST" : "CLICK TO EXAMINE";

export default function EvidenceTrail() {
  const router = useRouter();
  const { signedOut, loading, error, data, setData, reload } = useActiveCase();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [overall, setOverall] = useState<Progress | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const caseId = data?.case.id;
  const stageAtLoad = data?.progress?.currentStage;

  // Opening the board starts the investigation.
  useEffect(() => {
    if (!caseId || (stageAtLoad && stageAtLoad !== "BRIEFING")) return;
    updateStage(caseId, "BRIEFING").then(({ progress }) => setData((d) => ({ ...d, progress }))).catch(() => {});
  }, [caseId, stageAtLoad, setData]);

  useEffect(() => {
    if (caseId) getProgress().then(setOverall).catch(() => {});
  }, [caseId]);

  if (signedOut) return <main className="evidence-page"><SignInGate title="SIGN IN TO OPEN THE EVIDENCE TRAIL" /></main>;
  if (loading || error || !data) return <main className="evidence-page"><CaseFileStatus loading={loading} error={error} onRetry={reload} /></main>;

  const { case: c, evidence } = data;
  const stages = data.progress?.completedStages || [];
  const stage = data.progress?.currentStage || "BRIEFING";
  const solved = data.progress?.completed === true;
  const cracked = stages.includes("EVIDENCE");
  const lessonDone = stages.includes("LEARN");
  const discovered = evidence.filter((e) => e.discovered);
  const selected = evidence.find((e) => e.id === selectedId) || evidence.find((e) => e.discovered) || evidence[0];
  const progressPercent = Math.round((discovered.length / Math.max(evidence.length, 1)) * 100);
  // Threat = how much of the bug is still at large: falls as evidence is found, 0 once solved.
  const threat = solved ? 0 : Math.max(10, 100 - progressPercent);
  const threatBars = Math.round((threat / 100) * 9);
  const xp = overall?.xp ?? 0;

  async function examine(e: Evidence) {
    setSelectedId(e.id);
    if (e.discovered) return;
    if (e.condition && e.condition !== "investigate") {
      setMessage(e.condition === "failed_test"
        ? `${e.code} is sealed. Run the suspect code in the Exercise or Code Lab to uncover it.`
        : `${e.code} is sealed. Submit a fix that passes every test to uncover it.`);
      return;
    }
    try {
      const r = await discoverEvidence(c.id, e.id);
      setData((d) => ({ ...d, evidence: d.evidence.map((x) => (x.id === e.id ? { ...x, ...r.evidence, discovered: true } : x)) }));
      setMessage(`${r.evidence.code} discovered: ${r.evidence.text}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not examine that evidence.");
    }
  }

  async function closeCase() {
    setBusy(true);
    try {
      const r = await completeCase(c.id);
      setMessage(r.alreadyCompleted ? "This case is already closed." : `CASE SOLVED — +${r.xpAwarded} XP.${r.nextCaseUnlocked ? " A new case file is waiting on the Case Board." : ""}`);
      reload();
      getProgress().then(setOverall).catch(() => {});
      refreshUser();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "The case cannot be closed yet.");
    } finally {
      setBusy(false);
    }
  }

  // The main action always points at the next real step of the investigation.
  let primary: { label: string; onClick: () => void; disabled?: boolean };
  if (solved) primary = { label: "CASE CLOSED · VIEW RESOLUTION", onClick: () => router.push("/resolution") };
  else if (cracked) primary = { label: busy ? "CLOSING CASE..." : "SOLVE CASE", onClick: closeCase, disabled: busy };
  else if (discovered.length === 0) primary = { label: "EXAMINE THE FIRST CLUE", onClick: () => { const first = evidence.find((e) => e.condition === "investigate") || evidence[0]; if (first) examine(first); } };
  else if (!lessonDone) primary = { label: "CONTINUE: MINI LESSON", onClick: () => router.push("/lesson") };
  else primary = { label: "CONTINUE: DEBUG THE CODE", onClick: () => router.push("/exercise") };

  return (
    <main className="evidence-page">
      <div className="evidence-casebar">
        <div>CASE #{c.number}: {c.title}</div>
        <div className="evidence-case-status">
          <span>STATUS: {solved ? "CASE SOLVED" : cracked ? "BUG NEUTRALIZED — READY TO CLOSE" : "INVESTIGATION IN PROGRESS"}</span>
          <span className="case-separator">•</span>
          <span className="wire-status">STAGE: {stage}</span>
        </div>
      </div>
      <section className="evidence-header">
        <Link href="/case-board" className="back-case-button"><ArrowLeft size={16} /> BACK TO CASE BOARD</Link>
        <div className="evidence-heading"><div className="evidence-kicker"><span /> EVIDENCE DIVISION <span /></div><h1>EVIDENCE TRAIL</h1><p>{c.description}</p></div>
        <div className="detective-status">
          <div className="detective-icon"><Shield size={36} /></div>
          <div>
            <div className="status-heading">DETECTIVE STATUS</div>
            <div className="rank-row">RANK: <strong>{overall?.rank ?? "ROOKIE"}</strong></div>
            <div className="xp-row"><span>LEVEL {overall?.level ?? 1}</span><span>{xp} XP</span></div>
            <div className="xp-bar"><div style={{ width: `${Math.min(100, (xp % 500) / 5)}%` }} /></div>
          </div>
        </div>
      </section>
      <section className="evidence-layout">
        <div className="evidence-main">
          <EvidenceBoard evidence={evidence} question={c.objective} selectedId={selected?.id ?? null} onExamine={examine} />
          <div className="evidence-inventory">
            <div className="inventory-title"><Search size={15} /> EVIDENCE INVENTORY</div>
            <div className="inventory-items">
              {evidence.map((item) =>
                item.discovered ? (
                  <button key={item.id} className={`inventory-card ${selected?.id === item.id ? "inventory-selected" : ""}`} onClick={() => examine(item)} aria-label={`${item.code}: ${item.text}`}>
                    <span className="inventory-number">{item.code.replace("EV-", "")}</span>
                    <img src={image} alt="" />
                    <span className="inventory-check"><Check size={12} /></span>
                  </button>
                ) : (
                  <button key={item.id} className={`inventory-locked ${selected?.id === item.id ? "inventory-selected" : ""}`} onClick={() => examine(item)} aria-label={`${item.code} sealed`}>
                    <Lock size={20} /><span>{item.code}</span><small>SEALED</small>
                  </button>
                )
              )}
            </div>
          </div>
          <div className="connect-area">
            <div className="connect-info">
              <Fingerprint size={48} />
              <div><h3>{solved ? "THE TRUTH IS REVEALED." : "CONNECT THE EVIDENCE TO REVEAL THE TRUTH."}</h3><p>{discovered.length} / {evidence.length} pieces discovered.</p></div>
            </div>
            <div className="connect-actions">
              <button className="connect-button" onClick={primary.onClick} disabled={primary.disabled}><Link2 size={18} /> {primary.label}</button>
              {primary.label === "CONTINUE: MINI LESSON" ? (
                <Link href="/exercise" className="lesson-button">SKIP TO EXERCISE <span>→</span></Link>
              ) : (
                <Link href="/lesson" className="lesson-button">{lessonDone ? "REVIEW MINI LESSON" : "CONTINUE TO MINI LESSON"} <span>→</span></Link>
              )}
            </div>
          </div>
          {message && <div className="evidence-panel evidence-message" role="status">{message}</div>}
        </div>
        <aside className="evidence-sidebar">
          <div className="evidence-panel">
            <h3>INVESTIGATION PROGRESS</h3>
            <div className="progress-content">
              <div className="progress-circle" style={{ "--progress": `${progressPercent}%` } as CSSProperties}><strong>{discovered.length} / {evidence.length}</strong><span>EVIDENCE<br />DISCOVERED</span></div>
              <div className="progress-list">
                <div><span className="progress-dot green" /> Evidence Found <strong>{discovered.length}</strong></div>
                <div><span className="progress-dot amber" /> Current Stage <strong>{stage}</strong></div>
                <div><span className="progress-dot blue" /> Progress <strong>{progressPercent}%</strong></div>
                <div><span className="progress-dot red" /> Cases Solved <strong>{overall?.casesSolved ?? 0}</strong></div>
              </div>
            </div>
          </div>
          <div className="evidence-panel threat-panel">
            <h3><AlertTriangle size={18} /> THREAT LEVEL</h3>
            <div className="threat-bar">{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <span key={i} className={i <= threatBars ? "active" : ""} />)}</div>
            <strong>{threat}%</strong>
            <p className="threat-caption">{solved ? "Bug neutralized. No active threat." : "How much of the bug is still at large. Uncover evidence to bring it down."}</p>
          </div>
          <div className="evidence-panel objective-panel">
            <h3><Target size={18} /> CASE OBJECTIVE</h3>
            <p>{c.objective}</p>
            <div className="investigation-active"><span /> {solved ? "CASE COMPLETE" : "INVESTIGATION ACTIVE"}</div>
          </div>
          {selected && (
            <div className="evidence-panel selected-panel">
              <h3>SELECTED EVIDENCE</h3>
              <div className="selected-content">
                <img src={image} alt="" className={selected.discovered ? "" : "selected-sealed"} />
                <div>
                  <h4>{selected.code}</h4>
                  <span>{selected.discovered ? c.concept : "Sealed evidence"}</span>
                  <p>{selected.discovered ? selected.text : selected.condition === "failed_test" ? "Uncovered when you run the suspect code." : selected.condition === "passed_all_tests" ? "Uncovered when your fix passes every test." : "Not examined yet. Examine the clue to read the report."}</p>
                  {selected.discovered ? (
                    <span className="examine-button examine-done"><Check size={15} /> DISCOVERED</span>
                  ) : selected.condition === "investigate" ? (
                    <button className="examine-button" onClick={() => examine(selected)}><Search size={15} /> EXAMINE CLUE</button>
                  ) : (
                    <Link className="examine-button" href="/exercise"><Search size={15} /> GO TO EXERCISE</Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

type Line = { x1: number; y1: number; x2: number; y2: number; lit: boolean };

/** Cork board: pinned cards, the case question, and red thread drawn between their real pin positions. */
function EvidenceBoard({ evidence, question, selectedId, onExamine }: { evidence: Evidence[]; question: string; selectedId: string | null; onExamine: (e: Evidence) => void }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const litKey = evidence.map((e) => (e.discovered ? 1 : 0)).join("");

  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const b = board.getBoundingClientRect();
    const pin = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - b.left, y: r.top + 4 - b.top }; };
    const cards = cardRefs.current.slice(0, evidence.length).map((el, i) => (el ? { p: pin(el), lit: !!evidence[i].discovered } : null)).filter(Boolean) as Array<{ p: { x: number; y: number }; lit: boolean }>;
    const note = noteRef.current;
    const next: Line[] = [];
    if (note && note.offsetParent !== null) {
      const n = pin(note);
      for (const card of cards) next.push({ x1: card.p.x, y1: card.p.y, x2: n.x, y2: n.y, lit: card.lit });
    } else {
      for (let i = 0; i < cards.length - 1; i++) next.push({ x1: cards[i].p.x, y1: cards[i].p.y, x2: cards[i + 1].p.x, y2: cards[i + 1].p.y, lit: cards[i].lit && cards[i + 1].lit });
    }
    setLines(next);
  }, [evidence]);

  useLayoutEffect(() => {
    measure();
    const board = boardRef.current;
    if (!board || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure, litKey]);

  return (
    <div className="investigation-board" ref={boardRef}>
      <div className="board-title">INVESTIGATION BOARD</div>
      <svg className="evidence-threads" aria-hidden="true">
        {lines.map((l, i) => {
          const sag = Math.min(60, Math.hypot(l.x2 - l.x1, l.y2 - l.y1) * 0.12);
          return <path key={i} d={`M ${l.x1} ${l.y1} Q ${(l.x1 + l.x2) / 2} ${(l.y1 + l.y2) / 2 + sag} ${l.x2} ${l.y2}`} className={l.lit ? "thread-lit" : "thread-dim"} />;
        })}
      </svg>
      {evidence.map((item, index) => (
        <button
          key={item.id}
          ref={(el: HTMLButtonElement | null) => { cardRefs.current[index] = el; }}
          className={`board-evidence ${POSITIONS[index] || POSITIONS[0]} ${selectedId === item.id ? "board-selected" : ""} ${item.discovered ? "" : "board-sealed"}`}
          onClick={() => onExamine(item)}
          aria-label={item.discovered ? `${item.code}: ${item.text}` : `${item.code}: ${sealedHint(item)}`}
        >
          <span className="pin" />
          <span className="evidence-number">{item.code.replace("EV-", "")}</span>
          <img src={image} alt="" />
          <div className="board-card-footer"><strong>{item.code}</strong><span>{item.discovered ? item.text : sealedHint(item)}</span></div>
          <span className="zoom-icon">{item.discovered ? <Check size={16} /> : item.condition === "investigate" ? <Search size={16} /> : <Lock size={15} />}</span>
        </button>
      ))}
      <div className="board-question question-one" ref={noteRef}><span className="pin" />{question}</div>
    </div>
  );
}
