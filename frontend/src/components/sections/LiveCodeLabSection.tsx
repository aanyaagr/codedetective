"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, CheckCircle2, XCircle, FileCode, ShieldAlert } from "lucide-react";
import { getActiveCase, runCode, type CaseSummary, type RunResult } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

export function LiveCodeLabSection() {
  const [caseData, setCaseData] = useState<CaseSummary | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getStoredUser();
    if (!user) {
      setLoading(false);
      return;
    }

    getActiveCase()
      .then(({ case: data }) => {
        setCaseData(data);
        setCode(data.challenge.starterCode);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load case"))
      .finally(() => setLoading(false));
  }, []);

  async function execute() {
    if (!caseData) return;
    setRunning(true);
    setError("");
    try {
      setResult(await runCode(caseData.challenge.id, code));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Execution failed");
    } finally {
      setRunning(false);
    }
  }

  const passed = result?.passed === true;

  return (
    <section id="code-lab" className="w-full py-16 sm:py-24 relative bg-[#06080C] border-t-2 border-red-950/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-12">
          <div className="text-[10px] font-mono font-black tracking-[0.3em] text-red-400">AUTHENTIC INVESTIGATION IDE</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white uppercase">REAL CODE. REAL INVESTIGATION.</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-2">The active challenge is loaded from the backend and executed by the backend.</p>
        </div>

        {!mounted ? (
          <div className="text-center text-amber-400 font-mono">LOADING CASE FROM BACKEND...</div>
        ) : !getStoredUser() ? (
          <div className="max-w-2xl mx-auto rounded-xl border border-amber-500/30 bg-[#0B0E17] p-8 text-center">
            <ShieldAlert className="mx-auto text-amber-400" />
            <h3 className="mt-4 text-xl font-black">SIGN IN TO RUN THE INVESTIGATION</h3>
            <Link href="/login" className="inline-block mt-5 rounded-lg bg-amber-500 px-5 py-2.5 font-black text-black">ENTER THE BUREAU</Link>
          </div>
        ) : loading ? (
          <div className="text-center text-amber-400 font-mono">LOADING CASE FROM BACKEND...</div>
        ) : error ? (
          <div className="max-w-2xl mx-auto rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-red-300 font-mono text-sm">{error}</div>
        ) : caseData ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-4 rounded-lg border-2 border-amber-600/40 bg-[#0E0C09] p-5 space-y-5">
              <div><span className="text-[10px] text-amber-400 font-mono">CASE #{caseData.number}</span><h3 className="text-xl font-black mt-1">{caseData.title}</h3></div>
              <p className="text-sm text-slate-300 leading-relaxed">{caseData.description}</p>
              <div className="rounded bg-[#090806] border border-amber-500/20 p-3 text-sm text-amber-200">Concept: <strong>{caseData.concept}</strong></div>
              <div className="rounded bg-cyan-950/20 border border-cyan-500/20 p-3 text-xs text-cyan-200">Challenge: {caseData.challenge.id}</div>
            </div>

            <div className="lg:col-span-8 rounded-xl border-2 border-amber-600/40 bg-[#090C14] overflow-hidden font-mono h-[min(720px,calc(100vh-250px))] min-h-[560px] flex flex-col">
              <div className="shrink-0 bg-[#121622] px-4 py-3 border-b border-amber-500/20 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-xs flex items-center gap-2"><FileCode className="w-4 h-4 text-amber-400" /> challenge.{caseData.challenge.language}</span>
                <span className="text-[10px] text-amber-400">{caseData.challenge.language.toUpperCase()}</span>
              </div>

              <div className="flex-1 min-h-0 bg-[#080A10] overflow-auto">
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  className="block w-full h-full min-h-full resize-none bg-transparent p-5 text-xs sm:text-sm leading-6 text-slate-200 outline-none whitespace-pre font-mono overflow-auto"
                />
              </div>

              <div className="shrink-0 p-3 bg-[#0E121E] border-t border-amber-500/20 flex items-center justify-between gap-3">
                <button onClick={execute} disabled={running} className="bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-black text-xs px-4 py-2 rounded flex items-center gap-2"><Play className="w-3.5 h-3.5 fill-current" />{running ? "EXECUTING..." : "RUN CODE"}</button>
                {result && <span className={passed ? "text-emerald-400 text-xs font-bold" : "text-red-400 text-xs font-bold"}>{passed ? "✓ ALL TESTS PASSED" : `✕ ${result.testsPassed}/${result.testsTotal} TESTS PASSED`}</span>}
              </div>

              {result && <div className="shrink-0 p-4 bg-[#05060A] border-t border-white/[0.08] grid md:grid-cols-2 gap-4 max-h-48 overflow-auto"><div><span className="text-[10px] text-slate-500 block mb-1">SYSTEM OUTPUT</span><pre className="p-3 rounded bg-black border border-white/10 text-amber-300 text-xs whitespace-pre-wrap">{result.stdout || result.stderr || "(no output)"}</pre></div><div><span className="text-[10px] text-slate-500 block mb-1">TEST RESULT</span><div className="text-sm text-slate-300 flex items-center gap-2">{passed ? <CheckCircle2 className="text-emerald-400" /> : <XCircle className="text-red-400" />}{result.testsPassed}/{result.testsTotal} passed · score {result.score}</div></div></div>}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
