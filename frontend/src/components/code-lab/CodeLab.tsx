"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Bot, Check, Code2, FileText, Fingerprint, Lightbulb, Play, RotateCcw, Send, Terminal, X } from "lucide-react";
import { getActiveCase, runCode, submitCode, type CaseSummary, type RunResult } from "@/lib/api";

export default function CodeLab() {
  const [caseData, setCaseData] = useState<CaseSummary | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ type: "ai" | "user"; text: string }[]>([]);

  useEffect(() => {
    getActiveCase()
      .then(({ case: data }) => { setCaseData(data); setCode(data.challenge.starterCode); setMessages([{ type: "ai", text: data.challenge.hint }]); })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load code lab."))
      .finally(() => setLoading(false));
  }, []);

  async function execute() {
    if (!caseData) return;
    setRunning(true); setError("");
    try { setResult(await runCode(caseData.challenge.id, code)); }
    catch (err) { setError(err instanceof Error ? err.message : "Execution failed."); }
    finally { setRunning(false); }
  }

  async function submit() {
    if (!caseData) return;
    setSubmitting(true); setError("");
    try { setResult(await submitCode(caseData.challenge.id, code)); }
    catch (err) { setError(err instanceof Error ? err.message : "Submission failed."); }
    finally { setSubmitting(false); }
  }

  function askAI(question = chatInput.trim()) {
    if (!question || !caseData) return;
    setMessages((items) => [...items, { type: "user", text: question }, { type: "ai", text: caseData.challenge.hint }]);
    setChatInput("");
  }

  if (loading) return <main className="code-lab-page"><div className="code-lab-title"><div className="code-lab-kicker">CODE LAB</div><h1>LOADING CASE...</h1></div></main>;
  if (!caseData) return <main className="code-lab-page"><div className="code-lab-title"><div className="code-lab-kicker">CODE LAB</div><h1>UNABLE TO LOAD CASE</h1><p>{error}</p></div></main>;

  const passed = result?.passed === true;

  return (
    <main className="code-lab-page">
      <header className="code-lab-header"><div className="code-lab-case"><div className="code-lab-fingerprint"><Fingerprint size={48} /></div><div><div className="case-number">CASE #{caseData.number}</div><h2>{caseData.title}</h2></div></div><div className="code-lab-title"><div className="code-lab-kicker">CODE LAB</div><h1>SOLVE THE CASE</h1><p>{caseData.objective}</p></div></header>
      <section className="code-lab-workspace">
        <aside className="code-lab-left"><div className="lab-panel case-brief-panel"><div className="lab-panel-title"><FileText size={17} /> CASE BRIEF</div><div className="panel-divider" /><div className="brief-section"><span>CASE</span><p>{caseData.description}</p></div><div className="brief-section"><span>CONCEPT</span><p>{caseData.concept}</p></div><div className="brief-section"><span>LANGUAGE</span><p>{caseData.challenge.language}</p></div><div className="brief-section"><span>OBJECTIVE</span><p>{caseData.objective}</p></div></div><div className="lab-panel evidence-clue-panel"><div className="lab-panel-title"><Lightbulb size={17} /> EVIDENCE CLUE</div><p className="clue-text">{caseData.challenge.hint}</p><Link href="/evidence" className="view-evidence-button"><Fingerprint size={15} /> VIEW EVIDENCE</Link></div></aside>
        <section className="code-lab-center"><div className="editor-panel"><div className="editor-toolbar"><div className="editor-tab">challenge.{caseData.challenge.language}<X size={15} /></div><div className="editor-toolbar-right"><span>{caseData.challenge.language.toUpperCase()}</span></div></div><div className="code-editor" style={{ position: "relative", overflow: "hidden" }}><div className="line-numbers" aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "58px", padding: "20px 10px 20px 0", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-start", gap: 0, boxSizing: "border-box", borderRight: "1px solid rgba(255,255,255,0.06)", background: "#080A10", zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>{code.split("\n").map((_, index) => <span key={index} className="line-number" style={{ display: "block", width: "100%", height: "1.7em", lineHeight: "1.7em", textAlign: "right", fontFamily: "monospace", fontSize: "12px", color: "#64748B", whiteSpace: "nowrap" }}>{String(index + 1).padStart(2, "0")}</span>)}</div><textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} className="code-textarea" style={{ paddingLeft: "74px", lineHeight: "1.7", tabSize: 4, boxSizing: "border-box" }} /></div><div className="editor-status"><span>Backend execution enabled</span><span>{code.length} chars</span></div></div><div className="editor-actions"><button className="lab-action reset-action" onClick={() => { setCode(caseData.challenge.starterCode); setResult(null); }}><RotateCcw size={21} /><span>RESET CODE<small>Restore starter</small></span></button><button className="lab-action hint-action" onClick={() => askAI("Give me a hint")}><Lightbulb size={21} /><span>HINT<small>Use case clue</small></span></button><button className="lab-action run-action" onClick={execute} disabled={running}><Play size={22} /><span>{running ? "RUNNING..." : "RUN CODE"}<small>Compile & test</small></span></button><button className="lab-action submit-action" onClick={submit} disabled={submitting || !passed}>{passed ? <Check size={22} /> : <Send size={22} />}<span>{submitting ? "SUBMITTING..." : "SUBMIT SOLUTION"}<small>Save progression</small></span></button></div><div className="terminal-panel"><div className="terminal-header"><div><Terminal size={16} /> TERMINAL / OUTPUT</div></div><div className="terminal-content"><div>&gt; Challenge: {caseData.challenge.id}</div><div>&gt; Language: {caseData.challenge.language}</div>{result ? <><div className={passed ? "terminal-success" : "terminal-error"}>{passed ? "✓ All tests passed." : "✕ Some tests failed."}</div><div>&gt; Tests: {result.testsPassed}/{result.testsTotal}</div><div>&gt; Score: {result.score}</div><pre>{result.stdout || result.stderr || "(no output)"}</pre></> : <div>&gt; Waiting for execution...</div>}</div></div>{error && <div className="terminal-panel"><div className="terminal-content terminal-error">{error}</div></div>}<Link href="/exercise" className="exercise-back"><ArrowLeft size={18} /> BACK TO EXERCISE</Link></section>
        <aside className="code-lab-right"><div className="lab-panel test-panel"><div className="lab-panel-title"><Code2 size={17} /> TEST CASES</div><div className="test-table">{caseData.challenge.tests.map((test, index) => { const state = result?.tests?.find((item) => item.id === test.id); return <div className="test-row" key={test.id}><span>{index + 1}</span><span>{test.name}</span><span>{state ? (state.passed ? <Check className="test-pass" /> : <X className="test-fail" />) : "PENDING"}</span></div>; })}</div><div className="test-summary"><strong>{result ? `${result.testsPassed} / ${result.testsTotal} TESTS PASSED` : `${caseData.challenge.tests.length} TESTS READY`}</strong><span>{result ? `Score ${result.score}` : "Run the challenge to see results."}</span></div></div><div className="lab-panel ai-panel"><div className="ai-header"><div><div className="ai-icon">AI</div> DETECTIVE AI ASSISTANT</div></div><div className="chat-messages">{messages.map((message, index) => <div key={index} className={message.type === "ai" ? "chat-message ai-message" : "chat-message user-message"}>{message.type === "ai" && <Bot size={16} />}<p>{message.text}</p></div>)}</div><div className="chat-input"><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && askAI()} placeholder="Ask me for a hint..." /><button onClick={() => askAI()}><Send size={18} /></button></div></div><Link href="/resolution" className="continue-code-button">CONTINUE TO RESOLUTION <ArrowRight size={18} /></Link></aside>
      </section>
    </main>
  );
}
