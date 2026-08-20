"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Code2, FileText, Link2, Search, Star, Target, Timer, BookOpen, Puzzle } from "lucide-react";
import { getActiveCase, getCaseProgress, getProgress, type CaseSummary, type Progress, type Submission } from "@/lib/api";

export default function CaseResolution() {
  const [caseData, setCaseData] = useState<CaseSummary | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [discovered, setDiscovered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [{ case: data }, caseProgress, overall] = await Promise.all([getActiveCase(), getActiveCase().then(({ case: active }) => getCaseProgress(active.id)), getProgress()]);
        setCaseData(data); setSubmission(caseProgress.latestSubmission); setDiscovered(caseProgress.discoveredEvidence.length); setProgress(overall);
      } catch (err) { setError(err instanceof Error ? err.message : "Unable to load case resolution."); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <main className="resolution-page"><section className="resolution-hero"><h1>LOADING CASE FILE...</h1></section></main>;
  if (!caseData) return <main className="resolution-page"><section className="resolution-hero"><h1>CASE FILE UNAVAILABLE</h1><p>{error}</p></section></main>;

  const solved = submission?.passed === true;
  const reward = solved ? caseData.xpReward : 0;

  return (
    <main className="resolution-page">
      <nav className="resolution-nav"><div className="resolution-brand"><div className="brand-fingerprint">◎</div><span>CODEDETECTIVE</span></div><div className="resolution-nav-links"><Link href="/case-board">CASE BOARD</Link><Link href="/evidence">EVIDENCE TRAIL</Link><Link href="/lesson">LESSON</Link><Link href="/exercise">EXERCISE</Link><Link href="/code-lab">CODE LAB</Link><span className="resolution-active">RESOLUTION</span></div><div className="resolution-xp"><div><span>XP</span><strong>{progress?.xp || 0} XP</strong><div className="resolution-xp-bar"><div style={{ width: `${Math.min(100, ((progress?.xp || 0) % 500) / 5)}%` }} /></div></div><div className="resolution-rank"><span>{progress?.rank || "ROOKIE"}</span><small>RANK</small></div></div></nav>

      <section className="resolution-case-info"><span>CASE #{caseData.number}</span><h2>{caseData.title}</h2><p><strong>Difficulty:</strong> {caseData.difficulty}</p></section>
      <section className="resolution-hero"><div className="resolution-check"><Check size={56} strokeWidth={2.5} /></div><h1>{solved ? "CASE CLOSED" : "CASE IN PROGRESS"}</h1><div className="resolution-divider"><span /><Star size={13} fill="currentColor" /><span /></div><h3>{solved ? "INVESTIGATION COMPLETE" : "INVESTIGATION STATUS"}</h3><p>{solved ? caseData.resolution.successMessage : caseData.objective}</p></section>

      <section className="resolution-results"><div className="resolution-result"><div className="resolution-section-title"><Search size={19} /><span>THE ROOT CAUSE</span></div><div className="resolution-red-line" /><h2>{caseData.resolution.rootCause}</h2><p>{caseData.resolution.fixSummary}</p></div><div className="resolution-result"><div className="resolution-section-title"><Code2 size={19} /><span>YOUR FIX</span></div><div className="resolution-red-line" /><span className="code-label before">BEFORE</span><div className="resolution-code">{caseData.resolution.beforeCode}</div><div className="resolution-arrow">↓</div><span className="code-label after">AFTER</span><div className="resolution-code fixed">{caseData.resolution.afterCode}</div><div className="tests-passed"><Check size={16} /><span>TESTS PASSED</span><strong>{submission ? `${submission.testsPassed} / ${submission.testsTotal}` : "—"}</strong></div></div></section>

      <section className="resolution-journey"><div className="journey-heading"><span /><h2>INVESTIGATION JOURNEY</h2><span /></div><div className="journey-track"><div className="journey-step completed"><div className="journey-icon"><Search size={21} /></div><strong>Evidence</strong><span>Collected</span><small>{discovered}</small></div><div className="journey-line red" /><div className="journey-step completed"><div className="journey-icon"><Link2 size={21} /></div><strong>Lesson</strong><span>Completed</span><small><BookOpen size={14} /></small></div><div className="journey-line gold" /><div className="journey-step completed"><div className="journey-icon"><Puzzle size={21} /></div><strong>Exercise</strong><span>{submission ? "Tested" : "Pending"}</span><small>{submission ? `${submission.testsPassed}/${submission.testsTotal}` : "—"}</small></div><div className="journey-line green" /><div className={`journey-step ${solved ? "solved" : ""}`}><div className="journey-icon"><Star size={21} /></div><strong>Case</strong><span>{solved ? "Solved" : "Open"}</span></div></div></section>

      <section className="resolution-stats"><div className="resolution-stat"><Star size={23} /><div><strong>+{reward} XP</strong><span>{solved ? "CASE COMPLETED" : "REWARD AVAILABLE"}</span></div></div><div className="resolution-stat"><Target size={23} /><div><strong>{submission?.score || 0}%</strong><span>CODE SCORE</span></div></div><div className="resolution-stat"><Timer size={23} /><div><strong>{submission ? submission.testsPassed : 0}/{submission ? submission.testsTotal : 0}</strong><span>TESTS PASSED</span></div></div></section>

      {error && <div className="resolution-result"><p>{error}</p></div>}
      <section className="resolution-actions"><Link href="/case-board" className="resolution-secondary-button"><ArrowLeft size={17} /> VIEW CASE BOARD</Link><Link href="/resolution/report" className="resolution-secondary-button"><FileText size={18} /> VIEW FULL CASE REPORT</Link><Link href="/case-board" className="resolution-primary-button">CONTINUE TO NEXT CASE <ArrowRight size={18} /></Link></section>
    </main>
  );
}
