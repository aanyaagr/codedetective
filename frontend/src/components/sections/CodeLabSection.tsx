"use client";

import React, { useEffect, useState } from "react";
import {
  Pushpin,
  RubberStamp,
  DetectiveLogoIcon,
} from "@/components/ui/Icons";
import {
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileCode,
  ShieldAlert,
} from "lucide-react";
import { getCase, submitCode } from "@/lib/api";

type CodingChallenge = {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  language: string;
};

type CaseData = {
  id: string;
  caseNumber: number;
  title: string;
  course: string;
  topic: string;
  difficulty: string;
  codingChallenge: CodingChallenge;
  rewards: {
    xp: number;
    badge: string;
    unlockNextCase: boolean;
  };
};

type EvaluationResult = {
  success: boolean;
  output?: string;
  passed?: boolean;
  score?: number;
};

export const CodeLabSection: React.FC = () => {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const [output, setOutput] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getCase("case01")
      .then((response) => {
        setCaseData(response.data);
        setCode(response.data.codingChallenge.starterCode);
      })
      .catch((err) => {
        console.error("Failed to load case:", err);
        setError("Unable to load the case file.");
      });
  }, []);

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError("Code cannot be empty.");
      return;
    }

    setIsRunning(true);
    setError("");
    setOutput("");

    try {
      const response = await submitCode("case01", code);
      const result: EvaluationResult = response.result;

      setOutput(result.output || "");
      setScore(result.score ?? null);
      setIsSolved(result.passed === true);
    } catch (err) {
      console.error("Code execution failed:", err);
      setError("Could not connect to the Python evaluator.");
      setIsSolved(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    if (!caseData) return;
    setCode(caseData.codingChallenge.starterCode);
    setOutput("");
    setScore(null);
    setIsSolved(false);
    setError("");
  };

  if (!caseData) {
    return (
      <section id="code-lab" className="w-full py-16 sm:py-24 relative bg-[#06080C] border-t-2 border-red-950/60">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {error ? (
            <p className="text-red-400 font-mono">{error}</p>
          ) : (
            <p className="text-amber-400 font-mono">LOADING CASE FILE...</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="code-lab" className="w-full py-16 sm:py-24 relative bg-[#06080C] border-t-2 border-red-950/60 overflow-hidden">
      <div className="absolute inset-0 corkboard-surface opacity-90 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-2">
            <RubberStamp text="AUTHENTIC INVESTIGATION IDE" color="red" rotation="rotate-0" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans uppercase">
            REAL CODE. REAL INVESTIGATION.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1 max-w-xl">
            Repair the corrupted evidence using real Python code.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="relative rounded-lg bg-gradient-to-br from-[#1E160F] to-[#0E0C09] border-2 border-amber-600/50 p-5 shadow-2xl space-y-4 transform -rotate-1">
              <div className="absolute -top-3 left-6 z-30">
                <Pushpin color="brass" className="w-6 h-6" />
              </div>

              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 pt-1">
                <div className="flex items-center gap-2">
                  <DetectiveLogoIcon className="w-8 h-8 text-amber-500" />
                  <div>
                    <span className="text-[9px] font-mono font-bold text-amber-400 block tracking-widest">
                      CASE #{String(caseData.caseNumber).padStart(3, "0")}
                    </span>
                    <h3 className="text-sm font-black text-white uppercase font-sans">
                      {caseData.title}
                    </h3>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  CODE LAB
                </span>
              </div>

              <div className="p-3.5 rounded bg-[#090806] border border-amber-500/30 font-mono text-xs text-amber-200 leading-relaxed">
                <p className="font-bold text-slate-100">{caseData.codingChallenge.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#090806] border border-amber-500/20 rounded p-2">
                  <span className="block text-[9px] text-slate-500">COURSE</span>
                  <span className="text-[11px] text-amber-300 font-bold">{caseData.course}</span>
                </div>
                <div className="bg-[#090806] border border-amber-500/20 rounded p-2">
                  <span className="block text-[9px] text-slate-500">TOPIC</span>
                  <span className="text-[11px] text-amber-300 font-bold">{caseData.topic}</span>
                </div>
                <div className="bg-[#090806] border border-amber-500/20 rounded p-2">
                  <span className="block text-[9px] text-slate-500">DIFFICULTY</span>
                  <span className="text-[11px] text-emerald-300 font-bold">{caseData.difficulty}</span>
                </div>
                <div className="bg-[#090806] border border-amber-500/20 rounded p-2">
                  <span className="block text-[9px] text-slate-500">LANGUAGE</span>
                  <span className="text-[11px] text-cyan-300 font-bold">{caseData.codingChallenge.language.toUpperCase()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setShowClue(!showClue)}
                  className="w-full py-2 px-3 rounded bg-[#2D2115] hover:bg-[#3D2C1C] border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showClue ? "HIDE CASE CLUE" : "ASK FOR A CLUE"}
                </button>

                {showClue && (
                  <div className="p-3 rounded bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-200">
                    <span className="text-red-400 font-bold block text-[10px] uppercase">FORENSIC HINT</span>
                    <p className="mt-1">Check whether each value is stored using the correct Python data type.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="relative paper-cream p-4 rounded-xs border border-[#CFC2A4] text-[#1E1914] shadow-xl space-y-2 transform rotate-1">
              <div className="absolute -top-2.5 right-6 z-30">
                <Pushpin color="red" className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-black text-red-800 uppercase tracking-wider block">CASE FILE</span>
              <div className="space-y-1.5 font-mono text-xs">
                <div className="p-2 rounded bg-[#EDE3CE] border border-[#BFAFA0]">
                  <span className="text-red-700 font-black">[TASK]</span>
                  <span className="ml-2 text-[#2C231A] font-sans text-[11px]">Repair all corrupted variable types.</span>
                </div>
                <div className="p-2 rounded bg-[#EDE3CE] border border-[#BFAFA0]">
                  <span className="text-red-700 font-black">[XP]</span>
                  <span className="ml-2 text-[#2C231A] font-sans text-[11px]">+{caseData.rewards.xp} XP on completion</span>
                </div>
                <div className="p-2 rounded bg-[#EDE3CE] border border-[#BFAFA0]">
                  <span className="text-red-700 font-black">[BADGE]</span>
                  <span className="ml-2 text-[#2C231A] font-sans text-[11px]">{caseData.rewards.badge}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-xl border-2 border-amber-600/40 bg-[#090C14] shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden font-mono text-xs">
              <div className="bg-[#121622] px-4 py-2.5 border-b border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-600/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-600/80 inline-block" />
                  </div>
                  <span className="text-slate-300 font-bold text-xs flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    main.py — CASE #{String(caseData.caseNumber).padStart(3, "0")}
                  </span>
                </div>
                <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 font-bold text-[10px]">
                  PYTHON
                </span>
              </div>

              <div className="p-4 bg-[#080A10] flex overflow-hidden">
                <div className="select-none text-slate-600 pr-3 text-right border-r border-slate-800 mr-3 font-mono">
                  {code.split("\n").map((_, index) => (
                    <div key={index} className="text-xs leading-6">{index + 1}</div>
                  ))}
                </div>

                <textarea
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  spellCheck={false}
                  className="w-full min-h-[300px] resize-y bg-transparent text-slate-200 outline-none border-none font-mono text-xs sm:text-sm leading-6"
                  placeholder="Write your Python code here..."
                />
              </div>

              <div className="p-3 bg-[#0E121E] border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="bg-red-700 hover:bg-red-600 active:scale-95 disabled:opacity-60 text-white font-mono font-black text-xs uppercase tracking-wider px-4 py-2 rounded flex items-center gap-2 shadow-md shadow-red-950 transition-all cursor-pointer border border-red-500"
                  >
                    {isRunning ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>EXECUTING...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>RUN CODE</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleResetCode}
                    className="text-xs text-amber-400/80 hover:text-amber-300 underline font-mono cursor-pointer"
                  >
                    ↺ RESET CODE
                  </button>
                </div>

                {isSolved ? (
                  <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/40 uppercase">
                    ✓ CASE PASSED
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                    ✕ CASE NOT SOLVED
                  </span>
                )}
              </div>

              <div className="p-4 bg-[#05060A] border-t border-white/[0.08]">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] text-slate-500 uppercase font-bold">SYSTEM OUTPUT STREAM</span>
                </div>

                <div className="min-h-[70px] p-3 rounded bg-black border border-white/10 text-amber-300 font-mono text-xs whitespace-pre-wrap">
                  {output || <span className="text-slate-600">No execution yet. Run your code.</span>}
                </div>

                {error && (
                  <div className="mt-3 p-2 rounded border border-red-500/30 bg-red-950/30 text-red-300 text-xs">
                    {error}
                  </div>
                )}

                {score !== null && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px] uppercase">Evaluator Score</span>
                    <span className={isSolved ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{score}/100</span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-[#05060A] border-t border-white/[0.08]">
                <span className="text-[10px] text-slate-500 uppercase block mb-2 font-bold">EVALUATION STATUS</span>
                <div className="space-y-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Code Submitted</span>
                    {output ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Python Execution</span>
                    {output ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Case Requirements</span>
                    {isSolved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
