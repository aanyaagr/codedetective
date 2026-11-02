"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Briefcase, FileText, Terminal, Lightbulb, Target, RotateCcw, Play, CheckCircle2, MessageCircle, Fingerprint, Code2, Lock } from "lucide-react";
import { challengeFilename, loadDraft, requestHint, runCode, saveDraft, submitCode, type CaseResponse, type RunResult } from "@/lib/api";
import { refreshUser } from "@/lib/auth";
import { useActiveCase } from "@/lib/useActiveCase";
import { CaseFileStatus, SignInGate } from "@/components/ui/SignInGate";
import { CodeEditor, errorLineFrom } from "@/components/code-lab/CodeEditor";

const STAGE_TEXT: Record<string, string> = {
  BRIEFING: "Read the case file",
  LEARN: "Study the mini lesson",
  INVESTIGATE: "Examine the evidence",
  CODE: "Run and fix the suspect code",
  EVIDENCE: "Pass every test to secure the evidence",
  SOLVE: "Close the case for your XP",
};

export default function InteractiveExercise() {
  const { signedOut, loading, error, data, setData, reload } = useActiveCase();
  return (
    <main className="exercise-page">
      {signedOut ? (
        <SignInGate title="SIGN IN TO DEBUG THE SUSPECT" />
      ) : loading || error || !data ? (
        <CaseFileStatus loading={loading} error={error} onRetry={reload} />
      ) : (
        <Exercise key={data.case.id} data={data} setData={setData} />
      )}
      <style jsx global>{`
            .evidence-mini-card.is-sealed { opacity: 0.6; }
            .evidence-mini-card.is-sealed p { font-style: italic; }
            .exercise-hint.is-pass { border-color: rgba(34,197,94,0.45); }
            .exercise-hint.is-fail, .exercise-hint.is-error { border-color: rgba(239,68,68,0.45); }
            .exercise-output { margin: 8px 0 0; padding: 10px 12px; max-height: 160px; overflow: auto; background: #040507; border: 1px solid rgba(255,255,255,0.08); color: #f0c674; font-family: var(--font-mono); font-size: 13px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
            .exercise-action:disabled, .assistant-panel button:disabled { opacity: 0.5; cursor: not-allowed; }

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

            .code-editor-shell {
              display: flex;
              width: 100%;
              min-width: 0;
              height: min(560px, 58vh);
              min-height: 380px;
              overflow: hidden;
              box-sizing: border-box;
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

              .code-editor-shell {
                min-height: 360px;
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

              .code-editor-shell {
                min-height: 320px;
                height: 52vh;
              }
            }
          `}</style>
    </main>
  );
}

function Exercise({ data, setData }: { data: CaseResponse; setData: (u: (d: CaseResponse) => CaseResponse) => void }) {
  const caseData = data.case;
  const challenge = caseData.challenge;
  const [code, setCode] = useState(() => loadDraft(caseData.id) ?? challenge.starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [lastRunCode, setLastRunCode] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<RunResult | null>(null);
  const [busy, setBusy] = useState<"run" | "submit" | "hint" | null>(null);
  const [hints, setHints] = useState<Array<{ level: number; total: number; text: string }>>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => saveDraft(caseData.id, code, challenge.starterCode), 400);
    return () => clearTimeout(t);
  }, [code, caseData.id, challenge.starterCode]);

  const progress = data.progress;
  const completedStages = progress?.completedStages || [];
  const cracked = completedStages.includes("EVIDENCE") || submitted?.passed === true;
  const passedCurrentCode = result?.passed === true && lastRunCode === code;
  const errorLine = result ? errorLineFrom(result.stderr) : null;
  const lastHint = hints[hints.length - 1];

  function applyResult(r: RunResult) {
    setResult(r);
    setData((d) => ({
      ...d,
      progress: r.progress ?? d.progress,
      evidence: d.evidence.map((e) => {
        const found = r.evidenceDiscovered?.find((x) => x.id === e.id);
        return found ? { ...e, discovered: true, text: found.text } : e;
      }),
    }));
  }

  async function run() {
    if (busy) return;
    setBusy("run"); setError("");
    const snapshot = code;
    try { applyResult(await runCode(challenge.id, snapshot)); setLastRunCode(snapshot); }
    catch (err) { setError(err instanceof Error ? err.message : "Code execution failed."); }
    finally { setBusy(null); }
  }

  async function submit() {
    if (busy) return;
    setBusy("submit"); setError("");
    try {
      const r = await submitCode(challenge.id, code);
      applyResult(r);
      setSubmitted(r);
      if (r.passed) refreshUser();
    } catch (err) { setError(err instanceof Error ? err.message : "Submission failed."); }
    finally { setBusy(null); }
  }

  async function hint() {
    if (busy || (lastHint && lastHint.level >= lastHint.total)) return;
    setBusy("hint");
    try {
      const h = await requestHint(caseData.id);
      setHints((items) => (items.some((x) => x.level === h.level) ? items : [...items, { level: h.level, total: h.total, text: h.hint }]));
    } catch (err) { setError(err instanceof Error ? err.message : "No hint available."); }
    finally { setBusy(null); }
  }

  function reset() {
    if (code !== challenge.starterCode && !window.confirm("Restore the original suspect code? Your changes will be lost.")) return;
    setCode(challenge.starterCode); setResult(null); setLastRunCode(null);
  }

  return (
    <>
      <header className="exercise-topbar"><div className="exercise-case"><div className="exercise-fingerprint"><Fingerprint size={42} /></div><div><span className="case-number">CASE #{caseData.number}</span><h2>{caseData.title}</h2></div></div><div className="exercise-title"><span className="exercise-kicker">INTERACTIVE EXERCISE</span><h1>DEBUG THE SUSPECT</h1><p>{caseData.description}</p><strong>{caseData.objective}</strong></div></header>
      <section className="exercise-grid">
        <aside className="exercise-left">
          <div className="exercise-panel evidence-panel">
            <h3><Briefcase size={18} /> CASE EVIDENCE</h3>
            {data.evidence.map((item) => (
              <div className={`evidence-mini-card ${item.discovered ? "" : "is-sealed"}`} key={item.id}>
                {item.discovered ? <FileText size={25} /> : <Lock size={23} />}
                <div><strong>{item.code}</strong><span>{item.discovered ? "Forensic clue" : "Sealed"}</span></div>
                <p>{item.discovered ? item.text : item.condition === "investigate" ? "Examine it on the Evidence Trail." : item.condition === "failed_test" ? "Run the suspect code to uncover this clue." : "Pass every test to uncover this clue."}</p>
              </div>
            ))}
          </div>
          <div className="exercise-tip"><div className="tip-title"><Lightbulb size={18} /> TIP</div><p>{caseData.lesson?.hint || challenge.hint}</p></div>
        </aside>

        <section className="exercise-center">
          <div className="code-panel">
            <div className="code-header"><h3>SUSPECT CODE</h3><span>{challengeFilename(challenge.language)}</span></div>
            <div className="code-editor-shell">
              <CodeEditor value={code} onChange={setCode} onRun={run} errorLine={errorLine} readOnly={busy === "submit"} ariaLabel="Suspect code editor" />
            </div>
            <div className="code-legend"><span><i className="legend-red" /> Edit the suspect code</span><span><i className="legend-green" /> Ctrl/⌘ + Enter runs the tests</span></div>
          </div>
          <div className="exercise-actions">
            <button type="button" className="exercise-action reset" onClick={reset} disabled={!!busy || code === challenge.starterCode}><RotateCcw size={21} /><span>RESET<small>Restore starter code</small></span></button>
            <button type="button" className="exercise-action hint" onClick={hint} disabled={!!busy || (lastHint && lastHint.level >= lastHint.total)}><Lightbulb size={21} /><span>HINT<small>{lastHint ? (lastHint.level >= lastHint.total ? "All hints used" : `Stronger hint (${lastHint.level + 1}/${lastHint.total})`) : "Get a subtle hint"}</small></span></button>
            <button type="button" className="exercise-action run" onClick={run} disabled={!!busy}><Play size={22} fill="currentColor" /><span>{busy === "run" ? "RUNNING..." : "RUN CODE"}<small>Test your fix</small></span></button>
            <button type="button" className="exercise-action submit" onClick={submit} disabled={!!busy || !passedCurrentCode} title={passedCurrentCode ? "" : "Run the code and pass every test first"}><CheckCircle2 size={21} /><span>{busy === "submit" ? "SUBMITTING..." : "SUBMIT FIX"}<small>{passedCurrentCode ? "Save the solution" : "Pass all tests first"}</small></span></button>
          </div>
          {lastHint && <div className="exercise-hint"><Lightbulb size={20} /><div><strong>DETECTIVE TIP {lastHint.level}/{lastHint.total}</strong><p>{lastHint.text}</p></div></div>}
          {error && <div className="exercise-hint is-error"><Terminal size={20} /><div><strong>BACKEND ERROR</strong><p>{error}</p></div></div>}
          {result && (
            <div className={`exercise-hint ${result.passed ? "is-pass" : "is-fail"}`}>
              <CheckCircle2 size={20} />
              <div>
                <strong>{submitted && submitted.passed ? "FIX SUBMITTED — CASE CRACKED" : result.passed ? "ALL TESTS PASSED — SUBMIT YOUR FIX" : "SOME TESTS FAILED"}</strong>
                <p>{result.testsPassed}/{result.testsTotal} tests passed · score {result.score}</p>
                {(result.stdout || result.stderr) && <pre className="exercise-output">{result.stderr || result.stdout}</pre>}
              </div>
            </div>
          )}
          <Link href="/lesson" className="exercise-back"><ArrowLeft size={18} /> BACK TO MINI LESSON</Link>
        </section>

        <aside className="exercise-right">
          <div className="exercise-panel mission-panel">
            <h3><Target size={18} /> YOUR MISSION</h3>
            {caseData.stages.map((stage, index) => {
              const done = completedStages.includes(stage) || (stage === "EVIDENCE" && cracked);
              return (
                <div className={`mission-step ${done ? "active" : ""}`} key={stage}>
                  <span>{done ? "✓" : index + 1}</span>
                  <div><strong>{stage}</strong><p>{STAGE_TEXT[stage] || "Investigation stage"}</p></div>
                </div>
              );
            })}
          </div>
          <div className="exercise-panel tests-panel">
            <h3><Code2 size={18} /> TEST CASES</h3>
            {challenge.tests.map((test, index) => {
              const state = result?.tests?.find((item) => item.id === test.id);
              return (
                <div className="test-row" key={test.id} title={test.hidden ? "Hidden test — its input and expected output are secret" : `Expected: ${test.expectedOutput}`}>
                  <span>{index + 1}</span>
                  <code>{test.name}{test.hidden ? " (hidden)" : ""}</code>
                  <strong className={state?.passed ? "test-pass" : state ? "test-fail" : ""}>{state ? (state.passed ? "PASS" : "FAIL") : "PENDING"}</strong>
                </div>
              );
            })}
          </div>
          <div className="assistant-panel">
            <div className="assistant-character">🕵️</div>
            <div>
              <h3>DETECTIVE ASSISTANT</h3>
              <p>Stuck? Each hint is a little stronger than the last. For a conversation about your code, open the Code Lab.</p>
              <button type="button" onClick={hint} disabled={!!busy || (lastHint && lastHint.level >= lastHint.total)}><MessageCircle size={16} /> ASK FOR HINT</button>
            </div>
          </div>
          <Link href={cracked ? "/resolution" : "/code-lab"} className="continue-code-button">{cracked ? "CONTINUE TO RESOLUTION" : "CONTINUE TO CODE LAB"} <ArrowRight size={18} /></Link>
        </aside>
      </section>
    </>
  );
}
