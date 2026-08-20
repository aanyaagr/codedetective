"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, FileText, Search, Code2, Star, Target, Timer, BookOpen, Link2, Puzzle } from "lucide-react";
import { getActiveCase, getCaseProgress, getProgress, type CaseSummary, type Progress, type Submission } from "@/lib/api";

export default function CaseReport() {
  const [caseData, setCaseData] = useState<CaseSummary | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [discovered, setDiscovered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const active = await getActiveCase();
        const [caseProgress, overall] = await Promise.all([getCaseProgress(active.case.id), getProgress()]);
        setCaseData(active.case); setSubmission(caseProgress.latestSubmission); setDiscovered(caseProgress.discoveredEvidence.length); setProgress(overall);
      } catch (err) { setError(err instanceof Error ? err.message : "Unable to load case report."); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <main className="case-report-page"><section className="report-container"><h1>LOADING CASE REPORT...</h1></section></main>;
  if (!caseData) return <main className="case-report-page"><section className="report-container"><h1>CASE REPORT UNAVAILABLE</h1><p>{error}</p></section></main>;

  const solved = submission?.passed === true;
  const tests = submission ? `${submission.testsPassed} / ${submission.testsTotal}` : "—";

  return (
    <main className="case-report-page">
      <header className="report-nav"><div className="report-brand"><span className="brand-symbol">◎</span><span>CODEDETECTIVE</span></div><nav className="report-links"><Link href="/case-board">CASE BOARD</Link><Link href="/evidence">EVIDENCE TRAIL</Link><Link href="/lesson">LESSON</Link><Link href="/exercise">EXERCISE</Link><Link href="/code-lab">CODE LAB</Link><span className="active">RESOLUTION</span></nav><div className="report-xp"><div><span className="xp-label">XP</span><strong>{progress?.xp || 0} XP</strong></div><div className="rank"><small>RANK</small><strong>{progress?.rank || "ROOKIE"}</strong></div></div></header>
      <section className="report-container">
        <div className="report-heading"><div><div className="report-kicker">CASE REPORT</div><div className="case-number">CASE #{caseData.number}</div><h1>{caseData.title}</h1><p>{caseData.description}</p></div><div className="solved-badge"><div className="solved-icon"><Check size={20} /></div><div><small>CASE STATUS</small><strong>{solved ? "SOLVED" : "IN PROGRESS"}</strong></div></div></div>
        <div className="report-grid">
          <section className="report-card summary-card"><ReportTitle icon="≡" title="CASE SUMMARY" /><div className="summary-content"><p>{caseData.objective}</p><div className="fingerprint"><div className="fingerprint-inner">◉</div></div></div></section>
          <section className="report-card"><ReportTitle icon="▥" title="PERFORMANCE OVERVIEW" /><div className="performance-list"><PerformanceRow icon="◉" label="Evidence Discovered" value={`${discovered} / ${caseData.evidenceCount || discovered}`} /><PerformanceRow icon="◉" label="Mini Lesson" value="Backend tracked" green /><PerformanceRow icon="⌘" label="Exercise" value={submission ? "Submitted" : "Pending"} green={!!submission} /><PerformanceRow icon="✓" label="Code Lab" value={tests} green={solved} /></div></section>
          <section className="report-card"><ReportTitle icon="⌕" title="ROOT CAUSE" /><h2 className="cause-title">{caseData.resolution.rootCause}</h2><p className="cause-description">{caseData.resolution.fixSummary}</p></section>
          <section className="report-card"><ReportTitle icon="</>" title="YOUR FIX" /><div className="code-label">BEFORE</div><div className="code-box">{caseData.resolution.beforeCode}</div><div className="fix-arrow">↓</div><div className="code-label after">AFTER</div><div className="code-box fixed">{caseData.resolution.afterCode}</div><div className="tests-passed"><Check size={16} /><span>TESTS PASSED</span><strong>{tests}</strong></div></section>
          <section className="report-card test-card"><ReportTitle icon="⌬" title="TEST CASE RESULTS" /><div className="test-table"><div className="test-header"><span>Result</span><span>Passed</span><span>Total</span><span>Score</span></div><div className="test-row"><span>Latest submission</span><span>{submission?.testsPassed ?? 0}</span><span>{submission?.testsTotal ?? 0}</span><span>{submission?.score ?? 0}%</span></div></div></section>
          <section className="report-card evidence-card"><ReportTitle icon="⌁" title="EVIDENCE CONNECTED" /><div className="evidence-grid">{caseData.evidence.map((item) => <div className="evidence-item" key={item.id}><div className="evidence-icon">✓</div><div className="evidence-check"><Check size={12} /></div><strong>{item.code}</strong><small>{item.text}</small></div>)}</div></section>
          <section className="report-card metrics-card"><ReportTitle icon="◎" title="INVESTIGATION METRICS" /><div className="metrics-grid"><Metric value={`${submission?.score ?? 0}%`} label="CODE SCORE" icon="☆" /><Metric value={`+${solved ? caseData.xpReward : 0} XP`} label="CASE REWARD" icon="◎" /><Metric value={`${discovered}`} label="EVIDENCE FOUND" icon="◷" /></div></section>
        </div>
        {error && <div className="report-card"><p>{error}</p></div>}
        <div className="report-actions"><Link href="/resolution" className="report-download"><ArrowLeft size={17} /> BACK TO CASE RESOLUTION</Link><button className="report-download" onClick={() => window.print()}><FileText size={17} /> PRINT / SAVE REPORT</button><Link href="/case-board" className="next-case">CONTINUE TO NEXT CASE <span>→</span></Link></div>
      </section>
    </main>
  );
}

function ReportTitle({ icon, title }: { icon: string; title: string }) { return <div className="report-title"><span className="report-title-icon">{icon}</span><span>{title}</span></div>; }
function PerformanceRow({ icon, label, value, green = false }: { icon: string; label: string; value: string; green?: boolean }) { return <div className="performance-row"><div className="performance-label"><span className="performance-icon">{icon}</span><span>{label}</span></div><strong className={green ? "green-text" : ""}>{value}</strong></div>; }
function Metric({ icon, value, label }: { icon: string; value: string; label: string }) { return <div className="metric"><span className="metric-icon">{icon}</span><strong>{value}</strong><small>{label}</small></div>; }
