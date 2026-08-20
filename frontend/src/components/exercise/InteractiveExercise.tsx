"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Briefcase, FileText, Terminal, Lightbulb, Target, RotateCcw, Play, CheckCircle2, MessageCircle, Fingerprint, Code2 } from "lucide-react";
import { getActiveCase, runCode, submitCode, type CaseSummary, type Evidence, type RunResult } from "@/lib/api";

export default function InteractiveExercise() {
  const [caseData, setCaseData] = useState<CaseSummary | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getActiveCase()
      .then(({ case: data, evidence: caseEvidence }) => { setCaseData(data); setEvidence(caseEvidence); setCode(data.challenge.starterCode); })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load exercise."))
      .finally(() => setLoading(false));
  }, []);

  async function run() {
    if (!caseData) return;
    setRunning(true); setError("");
    try { setResult(await runCode(caseData.challenge.id, code)); }
    catch (err) { setError(err instanceof Error ? err.message : "Code execution failed."); }
    finally { setRunning(false); }
  }

  async function submit() {
    if (!caseData) return;
    setSubmitting(true); setError("");
    try { setResult(await submitCode(caseData.challenge.id, code)); }
    catch (err) { setError(err instanceof Error ? err.message : "Submission failed."); }
    finally { setSubmitting(false); }
  }

  if (loading) return <main className="exercise-page"><div className="exercise-title"><span className="exercise-kicker">INTERACTIVE EXERCISE</span><h1>LOADING CASE...</h1></div></main>;
  if (!caseData) return <main className="exercise-page"><div className="exercise-title"><span className="exercise-kicker">INTERACTIVE EXERCISE</span><h1>UNABLE TO LOAD CASE</h1><p>{error}</p></div></main>;

  const passed = result?.passed === true;

  return (
    <main className="exercise-page">
      <header className="exercise-topbar"><div className="exercise-case"><div className="exercise-fingerprint"><Fingerprint size={42} /></div><div><span className="case-number">CASE #{caseData.number}</span><h2>{caseData.title}</h2></div></div><div className="exercise-title"><span className="exercise-kicker">INTERACTIVE EXERCISE</span><h1>DEBUG THE SUSPECT</h1><p>{caseData.description}</p><strong>{caseData.objective}</strong></div></header>
      <section className="exercise-grid">
        <aside className="exercise-left"><div className="exercise-panel evidence-panel"><h3><Briefcase size={18} /> CASE EVIDENCE</h3>{evidence.map((item) => <div className="evidence-mini-card" key={item.id}><FileText size={25} /><div><strong>{item.code}</strong><span>Forensic clue</span></div><p>{item.text}</p></div>)}</div><div className="exercise-tip"><div className="tip-title"><Lightbulb size={18} /> TIP</div><p>{caseData.challenge.hint}</p></div></aside>
        <section className="exercise-center"><div className="code-panel"><div className="code-header"><h3>SUSPECT CODE</h3><span>{caseData.challenge.language}</span></div><textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} className="code-editor" /><div className="code-legend"><span><i className="legend-red" /> Edit the suspect code</span><span><i className="legend-green" /> Run the tests</span></div></div><div className="exercise-actions"><button className="exercise-action reset" onClick={() => { setCode(caseData.challenge.starterCode); setResult(null); }}><RotateCcw size={21} /><span>RESET<small>Restore starter code</small></span></button><button className="exercise-action hint" onClick={() => setHintVisible(!hintVisible)}><Lightbulb size={21} /><span>HINT<small>Get a subtle hint</small></span></button><button className="exercise-action run" onClick={run} disabled={running}><Play size={22} fill="currentColor" /><span>{running ? "RUNNING..." : "RUN CODE"}<small>Test your fix</small></span></button><button className="exercise-action submit" onClick={submit} disabled={submitting || !passed}><CheckCircle2 size={21} /><span>{submitting ? "SUBMITTING..." : "SUBMIT FIX"}<small>Save the solution</small></span></button></div>{hintVisible && <div className="exercise-hint"><Lightbulb size={20} /><div><strong>DETECTIVE TIP</strong><p>{caseData.challenge.hint}</p></div></div>}{error && <div className="exercise-hint"><Terminal size={20} /><div><strong>BACKEND ERROR</strong><p>{error}</p></div></div>}{result && <div className="exercise-hint"><CheckCircle2 size={20} /><div><strong>{passed ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}</strong><p>{result.testsPassed}/{result.testsTotal} tests passed · score {result.score}</p></div></div>}<Link href="/lesson" className="exercise-back"><ArrowLeft size={18} /> BACK TO MINI LESSON</Link></section>
        <aside className="exercise-right"><div className="exercise-panel mission-panel"><h3><Target size={18} /> YOUR MISSION</h3>{caseData.stages.map((stage, index) => <div className={`mission-step ${result?.passed && stage === "CODE" ? "active" : index < 4 ? "active" : ""}`} key={stage}><span>{index + 1}</span><div><strong>{stage}</strong><p>{index < 4 ? "Investigation stage" : "Locked until prerequisites are complete"}</p></div></div>)}</div><div className="exercise-panel tests-panel"><h3><Code2 size={18} /> TEST CASES</h3>{caseData.challenge.tests.map((test, index) => { const state = result?.tests?.find((item) => item.id === test.id); return <div className="test-row" key={test.id}><span>{index + 1}</span><code>{test.name}</code><strong className={state?.passed ? "test-pass" : state ? "test-fail" : ""}>{state ? (state.passed ? "PASS" : "FAIL") : "PENDING"}</strong></div>; })}</div><div className="assistant-panel"><div className="assistant-character">🕵️</div><div><h3>DETECTIVE ASSISTANT</h3><p>Need a hint? Use the backend-provided clue for this case.</p><button onClick={() => setHintVisible(true)}><MessageCircle size={16} /> ASK FOR HINT</button></div></div><Link href="/code-lab" className="continue-code-button">CONTINUE TO CODE LAB <ArrowRight size={18} /></Link></aside>
      </section>
    </main>
  );
}
