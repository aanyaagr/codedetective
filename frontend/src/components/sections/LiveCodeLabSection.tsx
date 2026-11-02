"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCode, Play, ShieldAlert, XCircle } from "lucide-react";
import { challengeFilename, getCases, pickActiveCase, runCode, setActiveCase, type CaseSummary, type RunResult } from "@/lib/api";
import { useAuthUser, useHydrated } from "@/lib/auth";
import { CASE_LAB_PREVIEW } from "@/data/content";
import { CodeEditor } from "@/components/code-lab/CodeEditor";

type Loaded = { userId: string; caseData: CaseSummary | null; error: string };

export function LiveCodeLabSection() {
  const user = useAuthUser();
  const hydrated = useHydrated();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState("");
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getCases()
      .then(({ cases }) => { if (!cancelled) setLoaded({ userId, caseData: pickActiveCase(cases.filter((c) => !c.locked)) ?? null, error: "" }); })
      .catch((e) => { if (!cancelled) setLoaded({ userId, caseData: null, error: e instanceof Error ? e.message : "Unable to load case" }); });
    return () => { cancelled = true; };
  }, [userId]);

  const live = loaded && loaded.userId === userId ? loaded : null;
  const caseData = user ? live?.caseData ?? null : null;
  const code = caseData ? edits[caseData.id] ?? caseData.challenge.starterCode : CASE_LAB_PREVIEW.code;

  async function execute() {
    if (!caseData) return;
    setRunning(true);
    setRunError("");
    try { setResult(await runCode(caseData.challenge.id, code)); }
    catch (e) { setRunError(e instanceof Error ? e.message : "Execution failed"); }
    finally { setRunning(false); }
  }

  const passed = result?.passed === true;
  const loadingCase = hydrated && !!user && !live;

  return (
    <section id="code-lab" className="w-full py-16 sm:py-24 relative bg-[#06080C] border-t-2 border-red-950/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-12">
          <div className="text-[11px] font-mono font-black tracking-[0.3em] text-red-400">AUTHENTIC INVESTIGATION IDE</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white uppercase">REAL CODE. REAL INVESTIGATION.</h2>
          <p className="text-sm text-slate-400 font-mono mt-2">Your fix runs on our servers against visible and hidden test cases.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 rounded-lg border-2 border-amber-600/40 bg-[#0E0C09] p-5 space-y-5">
            <div>
              <span className="text-[11px] text-amber-400 font-mono">CASE #{caseData?.number ?? "001"}</span>
              <h3 className="text-xl font-black mt-1">{caseData?.title ?? CASE_LAB_PREVIEW.title}</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {caseData?.description ?? "The automated record system is duplicating critical case files. Every even-numbered report is being filed twice."}
            </p>
            <div className="rounded bg-[#090806] border border-amber-500/20 p-3 text-sm text-amber-200">Concept: <strong>{caseData?.concept ?? "loops and conditions"}</strong></div>
            {!user && hydrated ? (
              <div className="rounded border border-amber-500/30 bg-[#0B0E17] p-4 text-sm">
                <div className="flex items-center gap-2 font-black text-amber-300"><ShieldAlert className="w-4 h-4" /> SIGN IN TO RUN IT</div>
                <p className="mt-1 text-slate-400">Your runs, evidence and XP are tied to your detective account.</p>
                <Link href="/login?next=/code-lab" className="inline-block mt-3 rounded-lg bg-amber-500 px-4 py-2 text-sm font-black text-black hover:bg-amber-400">ENTER THE BUREAU</Link>
              </div>
            ) : (
              <Link href="/code-lab" onClick={() => { if (caseData) setActiveCase(caseData.id); }} className="flex items-center justify-between rounded border border-red-500/40 bg-red-950/20 p-3 text-sm font-mono font-bold text-red-200 hover:bg-red-950/40">
                OPEN THE FULL CODE LAB <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="lg:col-span-8 rounded-xl border-2 border-amber-600/40 bg-[#090C14] overflow-hidden font-mono flex flex-col">
            <div className="bg-[#121622] px-4 py-3 border-b border-amber-500/20 flex items-center justify-between">
              <span className="text-slate-300 font-bold text-xs flex items-center gap-2"><FileCode className="w-4 h-4 text-amber-400" /> {challengeFilename(caseData?.challenge.language || "python")}</span>
              <span className="text-[11px] text-amber-400">{user ? "PYTHON 3 · LIVE" : "PYTHON 3 · PREVIEW"}</span>
            </div>
            <div className="h-[320px] flex">
              <CodeEditor
                value={code}
                readOnly={!caseData}
                onChange={(v) => caseData && setEdits((m) => ({ ...m, [caseData.id]: v }))}
                onRun={execute}
                ariaLabel="Code preview"
              />
            </div>
            <div className="p-3 bg-[#0E121E] border-t border-amber-500/20 flex items-center justify-between gap-3 flex-wrap">
              <button onClick={execute} disabled={running || !caseData} className="bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs px-4 py-2 rounded flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-current" />{running ? "EXECUTING..." : loadingCase ? "LOADING CASE..." : "RUN CODE"}
              </button>
              {result && <span className={passed ? "text-emerald-400 text-xs font-bold" : "text-red-400 text-xs font-bold"}>{passed ? "✓ ALL TESTS PASSED" : `✕ ${result.testsPassed}/${result.testsTotal} TESTS PASSED`}</span>}
              {live?.error && <span className="text-red-400 text-xs">{live.error}</span>}
              {runError && <span className="text-red-400 text-xs">{runError}</span>}
            </div>
            {result && (
              <div className="p-4 bg-[#05060A] border-t border-white/[0.08] grid md:grid-cols-2 gap-4">
                <div><span className="text-[11px] text-slate-500 block mb-1">SYSTEM OUTPUT</span><pre className="p-3 rounded bg-black border border-white/10 text-amber-300 text-xs whitespace-pre-wrap">{result.stdout || result.stderr || "(no output)"}</pre></div>
                <div><span className="text-[11px] text-slate-500 block mb-1">TEST RESULT</span><div className="text-sm text-slate-300 flex items-center gap-2">{passed ? <CheckCircle2 className="text-emerald-400" /> : <XCircle className="text-red-400" />}{result.testsPassed}/{result.testsTotal} passed · score {result.score}</div></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
