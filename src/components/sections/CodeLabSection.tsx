"use client";

import React, { useState } from "react";
import { CASE_LAB_PREVIEW, DETECTIVE_PARTNER } from "@/data/content";
import { Pushpin, RubberStamp, TapeStrip, DetectiveLogoIcon, PolaroidPhoto } from "@/components/ui/Icons";
import { Play, CheckCircle2, XCircle, HelpCircle, FileCode, Radio, Sparkles, Terminal, ShieldAlert } from "lucide-react";

export const CodeLabSection: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const [code, setCode] = useState(CASE_LAB_PREVIEW.code);

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      if (code.includes("if r % 2 == 0:")) {
        setIsSolved(false);
      } else {
        setIsSolved(true);
      }
    }, 450);
  };

  const handleFixCode = () => {
    setCode(CASE_LAB_PREVIEW.fixedCode);
    setIsSolved(true);
  };

  const handleResetCode = () => {
    setCode(CASE_LAB_PREVIEW.code);
    setIsSolved(false);
  };

  return (
    <section id="code-lab" className="w-full py-16 sm:py-24 relative bg-[#06080C] border-t-2 border-red-950/60 overflow-hidden">
      {/* Dark Corkboard Surface */}
      <div className="absolute inset-0 corkboard-surface opacity-90 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Title */}
        <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-2">
            <RubberStamp text="AUTHENTIC INVESTIGATION IDE" color="red" rotation="rotate-0" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans uppercase">
            REAL CODE. REAL INVESTIGATION.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1 max-w-xl">
            You don&apos;t just answer multiple-choice questions. You inspect real codebases, isolate logic bugs, and patch systems in a live terminal.
          </p>
        </div>

        {/* Tactical Case Lab Desk Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Detective Partner Radio Comms & Case Clues */}
          <div className="lg:col-span-4 space-y-6">
            {/* Detective Partner Card */}
            <div className="relative rounded-lg bg-gradient-to-br from-[#1E160F] to-[#0E0C09] border-2 border-amber-600/50 p-5 shadow-2xl space-y-4 transform -rotate-1">
              <div className="absolute -top-3 left-6 z-30">
                <Pushpin color="brass" className="w-6 h-6" />
              </div>

              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 pt-1">
                <div className="flex items-center gap-2">
                  <DetectiveLogoIcon className="w-8 h-8 text-amber-500" />
                  <div>
                    <span className="text-[9px] font-mono font-bold text-amber-400 block tracking-widest">
                      {DETECTIVE_PARTNER.badgeNumber}
                    </span>
                    <h3 className="text-sm font-black text-white uppercase font-sans">
                      {DETECTIVE_PARTNER.name}
                    </h3>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 animate-pulse">
                  RADIO LIVE
                </span>
              </div>

              {/* Detective Partner Dialogue Box */}
              <div className="p-3.5 rounded bg-[#090806] border border-amber-500/30 font-mono text-xs text-amber-200 leading-relaxed space-y-2">
                <p className="font-bold text-slate-100">
                  &ldquo;{isSolved
                    ? "Brilliant deduction! The duplicate logic has been neutralized. Case file cleared."
                    : DETECTIVE_PARTNER.quote}&rdquo;
                </p>
                <p className="text-[11px] text-amber-400/90 font-sans">
                  {isSolved
                    ? "You restored array integrity. Ready to submit verdict."
                    : DETECTIVE_PARTNER.subQuote}
                </p>
              </div>

              {/* Expandable Clue Action */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowClue(!showClue)}
                  className="w-full py-2 px-3 rounded bg-[#2D2115] hover:bg-[#3D2C1C] border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>{showClue ? "HIDE PARTNER CLUE" : "ASK PARTNER FOR CLUE"}</span>
                </button>

                {showClue && (
                  <div className="p-3 rounded bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-200 animate-in fade-in space-y-1">
                    <span className="text-red-400 font-bold block text-[10px] uppercase">
                      FORENSIC HINT:
                    </span>
                    <p>{DETECTIVE_PARTNER.currentClue}</p>
                    <button
                      onClick={handleFixCode}
                      className="text-[10px] text-amber-300 underline block mt-2 font-bold hover:text-white"
                    >
                      Click here to auto-patch (Simulate Fix)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Pinned Evidence List */}
            <div className="relative paper-cream p-4 rounded-xs border border-[#CFC2A4] text-[#1E1914] shadow-xl space-y-2 transform rotate-1">
              <div className="absolute -top-2.5 right-6 z-30">
                <Pushpin color="red" className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-black text-red-800 uppercase tracking-wider block">
                FORENSIC EVIDENCE RECOVERED ({isSolved ? "3/3" : "2/3"})
              </span>

              <div className="space-y-1.5 font-mono text-xs">
                {CASE_LAB_PREVIEW.evidenceFound.map((ev) => (
                  <div key={ev.id} className="p-1.5 rounded bg-[#EDE3CE] border border-[#BFAFA0] flex items-start gap-1.5">
                    <span className="text-red-700 font-black">[{ev.code}]</span>
                    <span className="text-[#2C231A] leading-tight font-sans text-[11px]">{ev.label}</span>
                  </div>
                ))}
                {isSolved && (
                  <div className="p-1.5 rounded bg-emerald-100 border border-emerald-400 text-emerald-900 flex items-start gap-1.5 font-bold">
                    <span className="text-emerald-700">[EV-03]</span>
                    <span className="leading-tight font-sans text-[11px]">Duplication branch neutralized</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Physical Terminal Code Lab */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-xl border-2 border-amber-600/40 bg-[#090C14] shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden font-mono text-xs">
              
              {/* Terminal Window Top Bar */}
              <div className="bg-[#121622] px-4 py-2.5 border-b border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-600/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-600/80 inline-block" />
                  </div>
                  <span className="text-slate-300 font-bold text-xs flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    main.py — CASE #001
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 font-bold">
                    PYTHON 3.11
                  </span>
                </div>
              </div>

              {/* Code Content & Line Numbers */}
              <div className="p-4 bg-[#080A10] flex overflow-x-auto leading-relaxed">
                <div className="select-none text-slate-600 pr-3 text-right space-y-0.5 border-r border-slate-800 mr-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="text-xs">
                      {i + 1}
                    </div>
                  ))}
                </div>

                <pre className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                  <code>
                    <span className="text-cyan-300">reports</span> = []
                    {"\n\n"}
                    <span className="text-slate-500"># Iterating through precinct logs</span>{"\n"}
                    <span className="text-amber-400 font-bold">for</span> r <span className="text-amber-400 font-bold">in</span> <span className="text-yellow-200">range</span>(<span className="text-purple-300">1</span>, <span className="text-purple-300">6</span>):{"\n"}
                    {"    "}reports.<span className="text-yellow-200">append</span>(r){"\n"}
                    {!isSolved && (
                      <>
                        {"    "}<span className="text-amber-400 font-bold">if</span> r % <span className="text-purple-300">2</span> == <span className="text-purple-300">0</span>:{"\n"}
                        {"        "}reports.<span className="text-yellow-200">append</span>(r) <span className="text-red-400 font-bold text-[10px]"># BUG: Redundant insert!</span>{"\n"}
                      </>
                    )}
                    {"\n"}
                    <span className="text-yellow-200">print</span>(<span className="text-emerald-300">&quot;Case Output:&quot;</span>, reports)
                  </code>
                </pre>
              </div>

              {/* Execution Action Bar */}
              <div className="p-3 bg-[#0E121E] border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="bg-red-700 hover:bg-red-600 active:scale-95 text-white font-mono font-black text-xs uppercase tracking-wider px-4 py-2 rounded flex items-center gap-2 shadow-md shadow-red-950 transition-all cursor-pointer border border-red-500"
                  >
                    {isRunning ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>EXECUTING TRACE...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>RUN CODE</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={isSolved ? handleResetCode : handleFixCode}
                    className="text-xs text-amber-400/80 hover:text-amber-300 underline font-mono cursor-pointer"
                  >
                    {isSolved ? "↺ Reset bug" : "⚡ Apply patch"}
                  </button>
                </div>

                {isSolved ? (
                  <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/40 uppercase animate-pulse">
                    ✓ ALL TEST ASSERTIONS PASSING
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                    ✕ 2 TEST FAILURES DETECTED
                  </span>
                )}
              </div>

              {/* Terminal Output & Test Cases Drawer */}
              <div className="p-4 bg-[#05060A] border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1 font-bold">
                    SYSTEM OUTPUT STREAM
                  </span>
                  <div className="p-2 rounded bg-black border border-white/10 text-amber-300 font-mono text-xs">
                    {isSolved ? CASE_LAB_PREVIEW.fixedOutput : CASE_LAB_PREVIEW.output}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1 font-bold">
                    TEST ASSERTION SUITE
                  </span>
                  <div className="space-y-1 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Odd Numbers Push Once</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Even Numbers No Duplication</span>
                      {isSolved ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Final Buffer Size == 5</span>
                      {isSolved ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                      )}
                    </div>
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
