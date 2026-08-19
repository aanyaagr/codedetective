"use client";

import React, { useState } from "react";
import { CASE_LAB_MOCK_DATA } from "@/data/content";
import { DetectiveLogoIcon, TapeStrip, RubberStamp, Pushpin } from "@/components/ui/Icons";
import { Play, Plus, HelpCircle, FileCode, CheckCircle2, XCircle } from "lucide-react";

export const CaseLabMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState("CODE");
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [assistantExpanded, setAssistantExpanded] = useState(false);
  const [code, setCode] = useState(CASE_LAB_MOCK_DATA.editor.code);

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      if (code.includes("if r % 2 == 0:")) {
        setIsSolved(false);
      } else {
        setIsSolved(true);
      }
    }, 500);
  };

  const handleFixCode = () => {
    setCode(CASE_LAB_MOCK_DATA.editor.fixedCode);
    setIsSolved(true);
  };

  const handleResetCode = () => {
    setCode(CASE_LAB_MOCK_DATA.editor.code);
    setIsSolved(false);
  };

  return (
    <div id="case-lab-mockup" className="relative w-full max-w-3xl lg:max-w-none">
      <div className="relative z-10 rounded-xl border-2 border-amber-500/30 bg-[#090C13] shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden font-sans text-xs sm:text-sm">
        {/* Top Case Header Bar */}
        <div className="bg-[#111622] px-3 sm:px-4 py-2.5 border-b border-amber-500/20 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="font-mono font-black text-amber-400 text-xs sm:text-sm tracking-wide">
              {CASE_LAB_MOCK_DATA.caseNumber}
            </span>
            <span className="text-slate-600 font-bold hidden sm:inline">|</span>
            <span className="font-black text-slate-100 text-xs sm:text-sm tracking-wider font-mono">
              {CASE_LAB_MOCK_DATA.title}
            </span>
            <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 uppercase">
              DIFFICULTY: {CASE_LAB_MOCK_DATA.difficulty}
            </span>
          </div>
        </div>

        {/* Stepper Workflow Header */}
        <div className="bg-[#07090F] px-3 sm:px-4 py-2 border-b border-white/[0.08] overflow-x-auto scrollbar-none flex items-center gap-1 sm:gap-2">
          {CASE_LAB_MOCK_DATA.tabs.map((tab: string, idx: number) => {
            const isActive = activeTab === tab;
            return (
              <React.Fragment key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono font-bold uppercase transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-amber-400 animate-pulse" : "bg-slate-600"}`} />
                  <span>{tab}</span>
                </button>
                {idx < CASE_LAB_MOCK_DATA.tabs.length - 1 && (
                  <span className="text-amber-500/40 text-[10px] font-mono select-none">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 3-Panel Main Crime Scene Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[290px] divide-y md:divide-y-0 md:divide-x divide-amber-500/15 bg-[#090C13]">
          {/* Left Sub-Panel */}
          <div className="md:col-span-3 p-3.5 sm:p-4 flex flex-col justify-between space-y-4 bg-[#0B0E17]/80">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono font-black text-amber-400 tracking-wider uppercase block mb-1">
                  {CASE_LAB_MOCK_DATA.briefing.title}
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {CASE_LAB_MOCK_DATA.briefing.description}
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#121622] border border-cyan-500/25">
                <div className="text-[10px] font-mono font-black tracking-wider text-cyan-400 uppercase mb-1">
                  🎯 {CASE_LAB_MOCK_DATA.briefing.objectiveLabel}
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed font-sans">
                  {CASE_LAB_MOCK_DATA.briefing.objectiveText}
                </p>
              </div>

              {showHints && (
                <div className="p-2.5 rounded bg-amber-950/40 border border-amber-500/40 text-[10px] text-amber-200 font-mono space-y-1.5 animate-in fade-in">
                  {CASE_LAB_MOCK_DATA.briefing.hints.map((h: string, i: number) => (
                    <div key={i} className="flex gap-1.5">
                      <span className="text-amber-400 font-bold">#{i + 1}</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full py-1.5 px-3 rounded bg-[#131926] hover:bg-[#1A2234] border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHints ? "CONCEAL HINTS" : `VIEW HINTS (${CASE_LAB_MOCK_DATA.briefing.hintsCount})`}</span>
              </button>
              <button
                onClick={isSolved ? handleResetCode : handleFixCode}
                className="text-[10px] text-amber-400/80 hover:text-amber-300 font-mono text-center underline transition-colors"
              >
                {isSolved ? "↺ Reset to buggy case" : "⚡ Auto-patch bug"}
              </button>
            </div>
          </div>

          {/* Center Sub-Panel: Code Editor */}
          <div className="md:col-span-5 flex flex-col justify-between bg-[#080B12]">
            <div>
              <div className="bg-[#05070C] px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between text-[11px]">
                <span className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  {CASE_LAB_MOCK_DATA.editor.fileName}
                </span>
                <span className="text-slate-500 text-[10px] font-mono font-bold">PYTHON 3.11</span>
              </div>

              <div className="p-3 font-mono text-xs overflow-x-auto leading-relaxed flex">
                <div className="select-none text-slate-600 pr-3 text-right space-y-0.5 border-r border-slate-800 mr-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="text-[11px]">
                      {i + 1}
                    </div>
                  ))}
                </div>

                <pre className="text-slate-200 text-[11px] leading-relaxed">
                  <code>
                    <span className="text-cyan-300">reports</span> = []
                    {"\n\n"}
                    <span className="text-amber-400 font-bold">for</span> r <span className="text-amber-400 font-bold">in</span> <span className="text-yellow-200">range</span>(<span className="text-purple-300">1</span>, <span className="text-purple-300">6</span>):{"\n"}
                    {"    "}reports.<span className="text-yellow-200">append</span>(r){"\n"}
                    {!isSolved && (
                      <>
                        {"    "}<span className="text-amber-400 font-bold">if</span> r % <span className="text-purple-300">2</span> == <span className="text-purple-300">0</span>:{"\n"}
                        {"        "}reports.<span className="text-yellow-200">append</span>(r) <span className="text-red-400 font-bold text-[10px]"># BUG!</span>{"\n"}
                      </>
                    )}
                    {"\n"}
                    <span className="text-yellow-200">print</span>(reports)
                  </code>
                </pre>
              </div>
            </div>

            <div className="p-3 border-t border-amber-500/15 bg-[#0A0D16] flex items-center justify-between gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="bg-red-700 hover:bg-red-600 active:scale-95 text-white font-mono font-black text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-md transition-all cursor-pointer border border-red-500"
              >
                {isRunning ? (
                  <span>EXECUTING...</span>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>RUN CODE</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Sub-Panel */}
          <div className="md:col-span-4 p-3.5 sm:p-4 space-y-3 bg-[#0A0D15] flex flex-col justify-between">
            <div className="space-y-3">
              <div>
                <span className="text-[9px] font-mono font-black tracking-wider text-slate-400 uppercase block mb-1">
                  OUTPUT
                </span>
                <div className="bg-[#05060A] p-2 rounded border border-white/[0.08] font-mono text-[11px] text-amber-300">
                  {isSolved ? CASE_LAB_MOCK_DATA.fixedOutput : CASE_LAB_MOCK_DATA.output}
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono font-black tracking-wider text-cyan-400 uppercase block mb-1">
                  EVIDENCE ({isSolved ? "3" : "2"})
                </span>
                <div className="space-y-1.5 text-[10px] font-mono">
                  {CASE_LAB_MOCK_DATA.evidence.map((ev: { id: number; text: string; code: string }) => (
                    <div key={ev.id} className="p-1.5 rounded bg-cyan-950/20 border border-cyan-500/30 text-cyan-200">
                      [{ev.code}] {ev.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#0C101A] border-t-2 border-amber-500/30 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <DetectiveLogoIcon className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">
              {isSolved ? CASE_LAB_MOCK_DATA.assistant.solvedMessage : CASE_LAB_MOCK_DATA.assistant.initialMessage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
