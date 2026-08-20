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
        <section className="exercise-center"><div className="code-panel"><div className="code-header"><h3>SUSPECT CODE</h3><span>{caseData.challenge.language}</span></div><textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} className="code-editor" /><div className="code-legend"><span><i className="legend-red" /> Edit the suspect code</span><span><i className="legend-green" /> Run the tests</span></div></div><div className="exercise-actions"><button type="button" className="exercise-action reset" onClick={() => { setCode(caseData.challenge.starterCode); setResult(null); }}><RotateCcw size={21} /><span>RESET<small>Restore starter code</small></span></button><button type="button" className="exercise-action hint" onClick={() => setHintVisible(!hintVisible)}><Lightbulb size={21} /><span>HINT<small>Get a subtle hint</small></span></button><button type="button" className="exercise-action run" onClick={run} disabled={running}><Play size={22} fill="currentColor" /><span>{running ? "RUNNING..." : "RUN CODE"}<small>Test your fix</small></span></button><button type="button" className="exercise-action submit" onClick={submit} disabled={submitting || !passed}><CheckCircle2 size={21} /><span>{submitting ? "SUBMITTING..." : "SUBMIT FIX"}<small>Save the solution</small></span></button></div>{hintVisible && <div className="exercise-hint"><Lightbulb size={20} /><div><strong>DETECTIVE TIP</strong><p>{caseData.challenge.hint}</p></div></div>}{error && <div className="exercise-hint"><Terminal size={20} /><div><strong>BACKEND ERROR</strong><p>{error}</p></div></div>}{result && <div className="exercise-hint"><CheckCircle2 size={20} /><div><strong>{passed ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}</strong><p>{result.testsPassed}/{result.testsTotal} tests passed · score {result.score}</p></div></div>}<Link href="/lesson" className="exercise-back"><ArrowLeft size={18} /> BACK TO MINI LESSON</Link></section>
        <aside className="exercise-right"><div className="exercise-panel mission-panel"><h3><Target size={18} /> YOUR MISSION</h3>{caseData.stages.map((stage, index) => <div className={`mission-step ${result?.passed && stage === "CODE" ? "active" : index < 4 ? "active" : ""}`} key={stage}><span>{index + 1}</span><div><strong>{stage}</strong><p>{index < 4 ? "Investigation stage" : "Locked until prerequisites are complete"}</p></div></div>)}</div><div className="exercise-panel tests-panel"><h3><Code2 size={18} /> TEST CASES</h3>{caseData.challenge.tests.map((test, index) => { const state = result?.tests?.find((item) => item.id === test.id); return <div className="test-row" key={test.id}><span>{index + 1}</span><code>{test.name}</code><strong className={state?.passed ? "test-pass" : state ? "test-fail" : ""}>{state ? (state.passed ? "PASS" : "FAIL") : "PENDING"}</strong></div>; })}</div><div className="assistant-panel"><div className="assistant-character">🕵️</div><div><h3>DETECTIVE ASSISTANT</h3><p>Need a hint? Use the backend-provided clue for this case.</p><button type="button" onClick={() => setHintVisible(true)}><MessageCircle size={16} /> ASK FOR HINT</button></div></div><Link href="/code-lab" className="continue-code-button">CONTINUE TO CODE LAB <ArrowRight size={18} /></Link></aside>
      </section>

      <style jsx global>{`
        .exercise-page {
          width: 100%;
          max-width: 100%;
          min-height: 100vh;
          padding: clamp(24px, 3vw, 42px) clamp(16px, 3vw, 42px) 56px;
          box-sizing: border-box;
          overflow-x: clip;
        }

        .exercise-topbar {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto clamp(24px, 3vw, 38px);
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: clamp(20px, 3vw, 56px);
          align-items: end;
        }

        .exercise-grid {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 2fr) minmax(0, 0.95fr);
          gap: clamp(14px, 1.5vw, 24px);
          align-items: start;
        }

        .exercise-left,
        .exercise-center,
        .exercise-right {
          min-width: 0;
          width: 100%;
        }

        .exercise-left,
        .exercise-right,
        .exercise-center {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .exercise-panel,
        .code-panel,
        .exercise-tip,
        .assistant-panel,
        .exercise-hint {
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
        }

        .evidence-panel,
        .mission-panel,
        .tests-panel,
        .code-panel {
          overflow: hidden;
        }

        .evidence-mini-card {
          width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }

        .code-header {
          min-height: 58px;
          box-sizing: border-box;
        }

        .code-editor {
          display: block;
          width: 100%;
          min-width: 0;
          min-height: 430px;
          height: min(560px, 58vh);
          max-height: 620px;
          margin: 0;
          padding: 28px 24px;
          box-sizing: border-box;
          resize: vertical;
          overflow: auto;
          white-space: pre;
          overflow-wrap: normal;
        }

        .code-legend {
          min-height: 48px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }

        .exercise-actions {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .exercise-action {
          min-width: 0;
          min-height: 78px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }

        .exercise-action span {
          min-width: 0;
        }

        .exercise-action small {
          display: block;
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mission-step {
          min-width: 0;
        }

        .mission-step > div {
          min-width: 0;
        }

        .mission-step p,
        .assistant-panel p,
        .exercise-tip p,
        .exercise-hint p {
          overflow-wrap: anywhere;
        }

        .test-row {
          min-width: 0;
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr) auto;
          align-items: center;
          gap: 10px;
        }

        .test-row code {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .assistant-panel {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .assistant-panel > div:last-child {
          min-width: 0;
          flex: 1;
        }

        .continue-code-button,
        .exercise-back {
          box-sizing: border-box;
          width: 100%;
        }

        @media (max-width: 1050px) {
          .exercise-grid {
            grid-template-columns: minmax(190px, 0.85fr) minmax(0, 1.7fr) minmax(210px, 0.9fr);
          }

          .exercise-actions {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .exercise-topbar {
            grid-template-columns: 1fr;
            gap: 18px;
            align-items: start;
          }

          .exercise-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }

          .exercise-center {
            grid-column: 1 / -1;
            grid-row: 1;
          }

          .exercise-left {
            grid-column: 1;
            grid-row: 2;
          }

          .exercise-right {
            grid-column: 2;
            grid-row: 2;
          }

          .code-editor {
            min-height: 400px;
            height: 55vh;
          }
        }

        @media (max-width: 640px) {
          .exercise-page {
            padding: 20px 14px 36px;
          }

          .exercise-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .exercise-center,
          .exercise-left,
          .exercise-right {
            grid-column: 1;
            grid-row: auto;
          }

          .exercise-center { grid-row: 1; }
          .exercise-left { grid-row: 2; }
          .exercise-right { grid-row: 3; }

          .exercise-actions {
            grid-template-columns: 1fr 1fr;
          }

          .code-editor {
            min-height: 360px;
            height: 55vh;
            padding: 22px 18px;
          }
        }
      `}</style>
    </main>
  );
}
