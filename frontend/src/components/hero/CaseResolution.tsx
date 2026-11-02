"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Code2, FileText, Link2, Search, Star, Target, Timer, BookOpen, Puzzle } from "lucide-react";
import { completeCase, getCaseProgress, getProgress, setActiveCase, type CompleteResult, type Progress, type Submission } from "@/lib/api";
import { refreshUser } from "@/lib/auth";
import { useActiveCase } from "@/lib/useActiveCase";
import { CaseFileStatus, SignInGate } from "@/components/ui/SignInGate";

type Extra = { caseId: string; submission: Submission | null; discovered: number; overall: Progress | null; closed: CompleteResult | null; error: string };

export default function CaseResolution() {
  const { signedOut, loading, error, data, reload } = useActiveCase();
  const [extra, setExtra] = useState<Extra | null>(null);
  const caseId = data?.case.id;
  const alreadyCompleted = data?.progress?.completed === true;

  // Load submission/evidence stats; if the fix passed but the case isn't closed yet, close it now (awards XP once).
  useEffect(() => {
    if (!caseId) return;
    let cancelled = false;
    (async () => {
      try {
        const cp = await getCaseProgress(caseId);
        const best = cp.bestSubmission ?? cp.latestSubmission;
        let closed: CompleteResult | null = null;
        if (best?.passed && !alreadyCompleted) {
          closed = await completeCase(caseId);
          refreshUser();
        }
        const [overall, after] = await Promise.all([getProgress(), closed ? getCaseProgress(caseId) : Promise.resolve(cp)]);
        if (!cancelled) setExtra({ caseId, submission: best, discovered: after.discoveredEvidence.length, overall, closed, error: "" });
      } catch (err) {
        if (!cancelled) setExtra({ caseId, submission: null, discovered: 0, overall: null, closed: null, error: err instanceof Error ? err.message : "Unable to load case resolution." });
      }
    })();
    return () => { cancelled = true; };
  }, [caseId, alreadyCompleted]);

  if (signedOut) return <main className="resolution-page"><SignInGate title="SIGN IN TO VIEW THE CASE RESOLUTION" /></main>;
  const ready = data && extra && extra.caseId === data.case.id;
  if (loading || error || !data || !ready) return <main className="resolution-page"><CaseFileStatus loading={!error} error={error} onRetry={reload} /></main>;

  const caseData = data.case;
  const r = caseData.resolution || ({} as typeof caseData.resolution);
  const { submission, discovered, overall, closed } = extra;
  const solved = alreadyCompleted || closed?.completed === true;
  const reward = solved ? caseData.xpReward : 0;
  const nextCase = closed?.nextCaseUnlocked ?? null;
  const lessonDone = (data.progress?.completedStages || []).includes("LEARN");

  return (
    <main className="resolution-page">
      <nav className="resolution-nav">
        <div className="resolution-brand"><div className="brand-fingerprint">◎</div><span>CODEDETECTIVE</span></div>
        <div className="resolution-nav-links"><Link href="/case-board">CASE BOARD</Link><Link href="/evidence">EVIDENCE TRAIL</Link><Link href="/lesson">LESSON</Link><Link href="/exercise">EXERCISE</Link><Link href="/code-lab">CODE LAB</Link><span className="resolution-active">RESOLUTION</span></div>
        <div className="resolution-xp">
          <div><span>XP</span><strong>{overall?.xp || 0} XP</strong><div className="resolution-xp-bar"><div style={{ width: `${Math.min(100, ((overall?.xp || 0) % 500) / 5)}%` }} /></div></div>
          <div className="resolution-rank"><span>{overall?.rank || "ROOKIE"}</span><small>RANK</small></div>
        </div>
      </nav>

      <section className="resolution-case-info"><span>CASE #{caseData.number}</span><h2>{caseData.title}</h2><p><strong>Difficulty:</strong> {caseData.difficulty}</p></section>
      <section className={`resolution-hero ${solved ? "" : "is-open"}`}>
        <div className="resolution-check">{solved ? <Check size={56} strokeWidth={2.5} /> : <Search size={50} />}</div>
        <h1>{solved ? "CASE CLOSED" : "CASE IN PROGRESS"}</h1>
        <div className="resolution-divider"><span /><Star size={13} fill="currentColor" /><span /></div>
        <h3>{solved ? "INVESTIGATION COMPLETE" : "INVESTIGATION STATUS"}</h3>
        <p>{solved ? r.successMessage || "The bug is neutralized." : submission ? "Your latest fix doesn't pass every test yet. Head back to the Code Lab." : "Submit a fix that passes every test to close this case."}</p>
        {closed && !closed.alreadyCompleted && <p className="resolution-award">+{closed.xpAwarded} XP AWARDED{nextCase ? " · NEXT CASE UNLOCKED" : ""}</p>}
      </section>

      {solved ? (
        <section className="resolution-results">
          <div className="resolution-result"><div className="resolution-section-title"><Search size={19} /><span>THE ROOT CAUSE</span></div><div className="resolution-red-line" /><h2>{r.rootCause}</h2><p>{r.fixSummary}</p></div>
          <div className="resolution-result">
            <div className="resolution-section-title"><Code2 size={19} /><span>YOUR FIX</span></div><div className="resolution-red-line" />
            <span className="code-label before">BEFORE</span><div className="resolution-code">{r.beforeCode}</div>
            <div className="resolution-arrow">↓</div>
            <span className="code-label after">AFTER</span><div className="resolution-code is-fixed">{r.afterCode}</div>
            <div className="tests-passed"><Check size={16} /><span>TESTS PASSED</span><strong>{submission ? `${submission.testsPassed} / ${submission.testsTotal}` : "—"}</strong></div>
          </div>
        </section>
      ) : (
        <section className="resolution-results">
          <div className="resolution-result"><div className="resolution-section-title"><Search size={19} /><span>THE ROOT CAUSE</span></div><div className="resolution-red-line" /><h2>Classified until the case is solved.</h2><p>Pass every test — including the hidden ones — to unseal the investigator&apos;s report.</p></div>
          <div className="resolution-result"><div className="resolution-section-title"><Code2 size={19} /><span>YOUR FIX</span></div><div className="resolution-red-line" /><div className="tests-passed"><Target size={16} /><span>LATEST SUBMISSION</span><strong>{submission ? `${submission.testsPassed} / ${submission.testsTotal}` : "NONE YET"}</strong></div></div>
        </section>
      )}

      <section className="resolution-journey">
        <div className="journey-heading"><span /><h2>INVESTIGATION JOURNEY</h2><span /></div>
        <div className="journey-track">
          <div className={`journey-step ${discovered > 0 ? "completed" : ""}`}><div className="journey-icon"><Search size={21} /></div><strong>Evidence</strong><span>Collected</span><small>{discovered}/{data.evidence.length}</small></div>
          <div className="journey-line red" />
          <div className={`journey-step ${lessonDone ? "completed" : ""}`}><div className="journey-icon"><Link2 size={21} /></div><strong>Lesson</strong><span>{lessonDone ? "Completed" : "Pending"}</span><small><BookOpen size={14} /></small></div>
          <div className="journey-line gold" />
          <div className={`journey-step ${submission ? "completed" : ""}`}><div className="journey-icon"><Puzzle size={21} /></div><strong>Exercise</strong><span>{submission ? "Tested" : "Pending"}</span><small>{submission ? `${submission.testsPassed}/${submission.testsTotal}` : "—"}</small></div>
          <div className="journey-line green" />
          <div className={`journey-step ${solved ? "solved" : ""}`}><div className="journey-icon"><Star size={21} /></div><strong>Case</strong><span>{solved ? "Solved" : "Open"}</span></div>
        </div>
      </section>

      <section className="resolution-stats">
        <div className="resolution-stat"><Star size={23} /><div><strong>+{reward} XP</strong><span>{solved ? "CASE COMPLETED" : `+${caseData.xpReward} XP AVAILABLE`}</span></div></div>
        <div className="resolution-stat"><Target size={23} /><div><strong>{submission?.score || 0}%</strong><span>CODE SCORE</span></div></div>
        <div className="resolution-stat"><Timer size={23} /><div><strong>{submission ? submission.testsPassed : 0}/{submission ? submission.testsTotal : 0}</strong><span>TESTS PASSED</span></div></div>
      </section>

      {extra.error && <div className="resolution-result"><p>{extra.error}</p></div>}
      <section className="resolution-actions">
        <Link href="/case-board" className="resolution-secondary-button"><ArrowLeft size={17} /> VIEW CASE BOARD</Link>
        <Link href="/resolution/report" className="resolution-secondary-button"><FileText size={18} /> VIEW FULL CASE REPORT</Link>
        {solved ? (
          <Link href="/case-board" onClick={() => { if (nextCase) setActiveCase(nextCase); }} className="resolution-primary-button">{nextCase ? "OPEN THE NEXT CASE" : "CONTINUE TO NEXT CASE"} <ArrowRight size={18} /></Link>
        ) : (
          <Link href="/code-lab" className="resolution-primary-button">BACK TO CODE LAB <ArrowRight size={18} /></Link>
        )}
      </section>
    </main>
  );
}
