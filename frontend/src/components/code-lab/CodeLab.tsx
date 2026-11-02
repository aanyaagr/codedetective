"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Bot, Check, Code2, FileText, Fingerprint, Lightbulb, Play, RotateCcw, Send, Terminal, X } from "lucide-react";
import {
  askAssistant, challengeFilename, loadDraft, requestHint, runCode, saveDraft, submitCode,
  type CaseResponse, type RunResult,
} from "@/lib/api";
import { refreshUser } from "@/lib/auth";
import { useActiveCase } from "@/lib/useActiveCase";
import { CaseFileStatus, SignInGate } from "@/components/ui/SignInGate";
import { CodeEditor, errorLineFrom } from "./CodeEditor";

type Message = { id: number; type: "ai" | "user" | "system"; text: string; tag?: string };

export default function CodeLab() {
  const { signedOut, loading, error, data, setData, reload } = useActiveCase();
  if (signedOut) return <main className="code-lab-page"><SignInGate title="SIGN IN TO ENTER THE CODE LAB" /></main>;
  if (loading || error || !data) return <main className="code-lab-page"><CaseFileStatus loading={loading} error={error} onRetry={reload} /></main>;
  // Keyed by case so editor state resets cleanly when the active case changes.
  return <Lab key={data.case.id} data={data} setData={setData} />;
}

/** Short, non-spoiler diagnosis of a failed run, in the detective's voice. */
function diagnose(r: RunResult): string {
  const err = r.stderr || "";
  const line = errorLineFrom(err);
  const at = line ? ` on line ${line}` : "";
  if (r.status === "timeout") return "The program never finished — that smells like a loop that can't end. Check every loop's exit condition.";
  if (/IndentationError|TabError/.test(err)) return `The indentation is off${at}. Python uses indentation to decide which lines belong inside a block.`;
  if (/SyntaxError/.test(err)) return `Python can't parse the code${at}. Look for a missing colon, bracket or quote.`;
  if (/NameError/.test(err)) return `A name is used before it exists${at}. Check the spelling — Python is case-sensitive.`;
  if (/IndexError/.test(err)) return `The code reached past the end of a list${at}. Check your indexes and range boundaries.`;
  if (/TypeError|ValueError/.test(err)) return `A value has the wrong type or format${at}. Check what each variable holds at that point.`;
  if (r.status !== "completed") return `The run crashed${at}. Read the last line of the error in the terminal — it names the problem.`;
  const failed = r.tests?.find((t) => !t.hidden && !t.passed);
  if (failed) return `"${failed.name}" failed. Compare your output with the expected output in the test panel — what's different?`;
  return "The visible tests pass, but a hidden check doesn't. Make sure your fix works for any input, not just the sample.";
}

function Lab({ data, setData }: { data: CaseResponse; setData: (u: (d: CaseResponse) => CaseResponse) => void }) {
  const caseData = data.case;
  const challenge = caseData.challenge;
  const [code, setCode] = useState(() => loadDraft(caseData.id) ?? challenge.starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [lastRunCode, setLastRunCode] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<RunResult | null>(null);
  const [busy, setBusy] = useState<"run" | "submit" | "hint" | "ask" | null>(null);
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [hintsUsed, setHintsUsed] = useState(data.progress?.hintsUsed ?? 0);
  const msgId = useRef(1);
  const chatRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(() => [{
    id: 0,
    type: "ai",
    text: `Case #${caseData.number}: ${caseData.objective} Run the suspect code first and study what it prints. Ask me anything, or press HINT when you're stuck — each hint is stronger than the last.`,
  }]);

  const alreadyCracked = (data.progress?.completedStages || []).includes("EVIDENCE") || data.progress?.completed === true;
  const cracked = alreadyCracked || submitted?.passed === true;
  const passedCurrentCode = result?.passed === true && lastRunCode === code;
  const errorLine = result ? errorLineFrom(result.stderr) : null;
  const discovered = data.evidence.filter((e) => e.discovered && e.text);

  useEffect(() => {
    const t = setTimeout(() => saveDraft(caseData.id, code, challenge.starterCode), 400);
    return () => clearTimeout(t);
  }, [code, caseData.id, challenge.starterCode]);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const say = (type: Message["type"], text: string, tag?: string) => setMessages((m) => [...m, { id: msgId.current++, type, text, tag }]);

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
    for (const ev of r.evidenceDiscovered || []) say("system", `${ev.code}: ${ev.text}`, "NEW EVIDENCE");
  }

  async function execute() {
    if (busy) return;
    setBusy("run"); setError("");
    const snapshot = code;
    try {
      const r = await runCode(challenge.id, snapshot);
      applyResult(r);
      setLastRunCode(snapshot);
      say("ai", r.passed ? "Every test passes on this run. Submit your solution to make it official." : diagnose(r));
    } catch (err) { setError(err instanceof Error ? err.message : "Execution failed."); }
    finally { setBusy(null); }
  }

  async function submit() {
    if (busy) return;
    setBusy("submit"); setError("");
    try {
      const r = await submitCode(challenge.id, code);
      applyResult(r);
      setLastRunCode(code);
      setSubmitted(r);
      if (r.passed) {
        say("ai", "That's it — every test passes, hidden ones included. The bug is neutralized. Head to the resolution to close the case.");
        refreshUser();
      } else {
        say("ai", diagnose(r));
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Submission failed."); }
    finally { setBusy(null); }
  }

  async function hint() {
    if (busy) return;
    setBusy("hint");
    try {
      const h = await requestHint(caseData.id);
      setHintsUsed(h.level);
      say("ai", h.hint, `HINT ${h.level}/${h.total}`);
    } catch (err) { say("system", err instanceof Error ? err.message : "The radio is silent.", "ERROR"); }
    finally { setBusy(null); }
  }

  async function ask(e?: FormEvent) {
    e?.preventDefault();
    const question = chatInput.trim();
    if (!question || busy) return;
    setChatInput("");
    say("user", question);
    setBusy("ask");
    try {
      const lastRun = result ? { status: result.status, stdout: result.stdout.slice(0, 500), stderr: result.stderr.slice(0, 500), testsPassed: result.testsPassed, testsTotal: result.testsTotal } : undefined;
      const a = await askAssistant(caseData.id, question, code, lastRun);
      say("ai", a.answer, a.source === "ai" ? undefined : "CASE NOTES");
    } catch (err) { say("system", err instanceof Error ? err.message : "No answer from headquarters.", "ERROR"); }
    finally { setBusy(null); }
  }

  function reset() {
    if (code !== challenge.starterCode && !window.confirm("Restore the original suspect code? Your changes will be lost.")) return;
    setCode(challenge.starterCode);
    setResult(null);
    setLastRunCode(null);
  }

  const hintsLeft = Math.max(0, (caseData.hintsAvailable || 0) - hintsUsed);

  return (
    <main className="code-lab-page">
      <header className="code-lab-header">
        <div className="code-lab-case">
          <div className="code-lab-fingerprint"><Fingerprint size={48} /></div>
          <div><div className="case-number">CASE #{caseData.number}</div><h2>{caseData.title}</h2></div>
        </div>
        <div className="code-lab-title"><div className="code-lab-kicker">CODE LAB</div><h1>SOLVE THE CASE</h1><p>{caseData.objective}</p></div>
      </header>

      {cracked && (
        <div className="lab-cracked-banner" role="status">
          <div><strong>CASE CRACKED</strong><span>Every test passes. Close the case on the resolution page to collect +{caseData.xpReward} XP.</span></div>
          <Link href="/resolution" className="continue-code-button">GO TO RESOLUTION <ArrowRight size={18} /></Link>
        </div>
      )}

      <section className="code-lab-workspace">
        <aside className="code-lab-left">
          <div className="lab-panel case-brief-panel">
            <div className="lab-panel-title"><FileText size={17} /> CASE BRIEF</div>
            <div className="panel-divider" />
            <div className="brief-section"><span>CASE</span><p>{caseData.description}</p></div>
            <div className="brief-section"><span>CONCEPT</span><p>{caseData.concept}</p></div>
            <div className="brief-section"><span>LANGUAGE</span><p>{challenge.language === "python" ? "Python 3" : challenge.language}</p></div>
            <div className="brief-section"><span>OBJECTIVE</span><p>{caseData.objective}</p></div>
          </div>
          <div className="lab-panel evidence-clue-panel">
            <div className="lab-panel-title"><Lightbulb size={17} /> EVIDENCE CLUES</div>
            {discovered.length ? (
              discovered.map((e) => <p className="clue-text" key={e.id}><strong>{e.code}</strong> {e.text}</p>)
            ) : (
              <p className="clue-text">No evidence logged yet. Examine the board on the Evidence Trail, or run the suspect code to uncover clues.</p>
            )}
            <Link href="/evidence" className="view-evidence-button"><Fingerprint size={15} /> VIEW EVIDENCE</Link>
          </div>
        </aside>

        <section className="code-lab-center">
          <div className="editor-panel">
            <div className="editor-toolbar">
              <div className="editor-tab">{challengeFilename(challenge.language)}{code !== challenge.starterCode && <span className="editor-dirty" title="Edited — draft saved" />}</div>
              <div className="editor-toolbar-right"><span>{challenge.language.toUpperCase()}</span></div>
            </div>
            <div className="lab-editor-frame">
              <CodeEditor value={code} onChange={setCode} onRun={execute} errorLine={errorLine} readOnly={busy === "submit"} ariaLabel={`${challengeFilename(challenge.language)} editor`} />
            </div>
            <div className="editor-status"><span>Ctrl/⌘ + Enter to run · Tab indents</span><span>{code.split("\n").length} lines · {code.length} chars</span></div>
          </div>

          <div className="editor-actions">
            <button className="lab-action reset-action" onClick={reset} disabled={!!busy || code === challenge.starterCode}><RotateCcw size={21} /><span>RESET CODE<small>Restore starter</small></span></button>
            <button className="lab-action hint-action" onClick={hint} disabled={!!busy || hintsLeft === 0}><Lightbulb size={21} /><span>HINT<small>{hintsLeft === 0 ? "All hints used" : `${hintsLeft} left · gets stronger`}</small></span></button>
            <button className="lab-action run-action" onClick={execute} disabled={!!busy}><Play size={22} /><span>{busy === "run" ? "RUNNING..." : "RUN CODE"}<small>Compile & test</small></span></button>
            <button className="lab-action submit-action" onClick={submit} disabled={!!busy || !passedCurrentCode} title={passedCurrentCode ? "" : "Run the code and pass every test first"}>
              {passedCurrentCode ? <Check size={22} /> : <Send size={22} />}
              <span>{busy === "submit" ? "SUBMITTING..." : "SUBMIT SOLUTION"}<small>{passedCurrentCode ? "Save progression" : "Pass all tests first"}</small></span>
            </button>
          </div>

          <div className="terminal-panel" aria-live="polite">
            <div className="terminal-header"><div><Terminal size={16} /> TERMINAL / OUTPUT</div></div>
            <div className="terminal-content">
              {result ? (
                <>
                  <div>&gt; python {challengeFilename(challenge.language)}{result.stdin ? ` < "${result.stdin}"` : ""}</div>
                  {result.stdout && <pre>{result.stdout}</pre>}
                  {result.stderr && <pre className="terminal-error">{result.stderr}</pre>}
                  {!result.stdout && !result.stderr && <div>(no output)</div>}
                  <div className={result.passed ? "terminal-success" : "terminal-error"}>{result.passed ? "✓ All tests passed." : `✕ ${result.testsPassed}/${result.testsTotal} tests passed.`}</div>
                </>
              ) : (
                <div>&gt; Waiting for execution… press RUN CODE (Ctrl/⌘ + Enter).</div>
              )}
            </div>
          </div>
          {error && <div className="terminal-panel"><div className="terminal-content terminal-error">{error}</div></div>}
          <Link href="/exercise" className="exercise-back"><ArrowLeft size={18} /> BACK TO EXERCISE</Link>
        </section>

        <aside className="code-lab-right">
          <div className="lab-panel test-panel">
            <div className="lab-panel-title"><Code2 size={17} /> TEST CASES</div>
            <div className="test-table">
              {challenge.tests.map((test, index) => {
                const state = result?.tests?.find((item) => item.id === test.id);
                return (
                  <div className={`test-row-wrap ${state ? (state.passed ? "is-pass" : "is-fail") : ""}`} key={test.id}>
                    <div className="test-row">
                      <span>{index + 1}</span>
                      <span>{test.name}{test.hidden && <em className="test-hidden-tag">HIDDEN</em>}</span>
                      <span>{state ? (state.passed ? <Check className="test-pass" /> : <X className="test-fail" />) : "PENDING"}</span>
                    </div>
                    {!test.hidden && (
                      <div className="test-io">
                        {test.stdin ? <div><span>INPUT</span><code>{test.stdin}</code></div> : null}
                        <div><span>EXPECTED</span><code>{test.expectedOutput}</code></div>
                        {state && !state.passed && <div className="test-io-got"><span>GOT</span><code>{state.actualOutput || (state.status && state.status !== "completed" ? "(crashed)" : "(no output)")}</code></div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="test-summary">
              <strong>{result ? `${result.testsPassed} / ${result.testsTotal} TESTS PASSED` : `${challenge.tests.length} TESTS READY`}</strong>
              <span>{result ? `Score ${result.score}` : "Run the challenge to see results."}</span>
            </div>
          </div>

          <div className="lab-panel ai-panel">
            <div className="ai-header"><div><div className="ai-icon">AI</div> DETECTIVE AI ASSISTANT</div></div>
            <div className="chat-messages" ref={chatRef}>
              {messages.map((m) => (
                <div key={m.id} className={m.type === "user" ? "chat-message user-message" : m.type === "system" ? "chat-message system-message" : "chat-message ai-message"}>
                  {m.type === "ai" && <Bot size={16} />}
                  <p>{m.tag && <span className="chat-tag">{m.tag}</span>}{m.text}</p>
                </div>
              ))}
              {busy === "ask" && <div className="chat-message ai-message"><Bot size={16} /><p className="chat-typing">Studying the evidence…</p></div>}
            </div>
            <form className="chat-input" onSubmit={ask}>
              <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about your code…" maxLength={600} aria-label="Ask the detective" />
              <button type="submit" disabled={!chatInput.trim() || !!busy} aria-label="Send question"><Send size={18} /></button>
            </form>
          </div>
          <Link href="/resolution" className={`continue-code-button ${cracked ? "" : "is-muted"}`}>CONTINUE TO RESOLUTION <ArrowRight size={18} /></Link>
        </aside>
      </section>
    </main>
  );
}
