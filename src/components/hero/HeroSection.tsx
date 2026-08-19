"use client";

import React from "react";
import { HERO_CASE_FILE } from "@/data/content";
import { Pushpin, TapeStrip, RubberStamp, PolaroidPhoto, CoffeeStain } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { ArrowRight, HelpCircle, FileText, AlertOctagon, Terminal } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section id="case-board" className="relative w-full pt-10 pb-16 sm:pt-14 sm:pb-22 overflow-hidden bg-[#07080C]">
      {/* Dark Corkboard & Paper Grain Texture */}
      <div className="absolute inset-0 corkboard-surface opacity-90 pointer-events-none" />

      {/* Atmospheric Overhead Noir Lamp Cone with Red Clue Highlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-120px] left-[40%] w-[650px] h-[650px] bg-amber-500/[0.05] rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] bg-red-600/[0.04] rounded-full blur-[130px]" />
      </div>

      {/* Red Investigation Thread Connector across Hero */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-15 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Thread from Title pin to Case File pin */}
          <path
            d="M 280 180 Q 420 120 620 200"
            stroke="#DC2626"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 2"
            className="red-thread-glow opacity-80"
          />
          {/* Thread from Case File pin to Polaroid pin */}
          <path
            d="M 880 190 Q 980 130 1120 230"
            stroke="#DC2626"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 2"
            className="red-thread-glow opacity-80"
          />
          {/* Thread from Case File to Bottom Note */}
          <path
            d="M 640 440 Q 560 520 480 500"
            stroke="#DC2626"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 2"
            className="red-thread-glow opacity-75"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Asymmetrical Investigation Board Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Pinned Headline Memo & Investigation Mandate */}
          <div className="lg:col-span-5 space-y-6 relative">
            {/* Top Evidence Tape */}
            <div className="flex items-center gap-3">
              <TapeStrip text="EVIDENCE BOARD // PRECINCT #404" variant="hazard" className="w-56" />
              <RubberStamp text="ACTIVE CRIME SCENE" color="red" rotation="-rotate-3" />
            </div>

            {/* Pinned Editorial Headline Sheet */}
            <div className="relative paper-cream p-6 sm:p-8 rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.85)] border border-[#D1C7B3] transform -rotate-1 transition-transform duration-300 hover:rotate-0">
              {/* Pushpin at top center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                <Pushpin color="red" className="w-7 h-7" />
              </div>

              {/* Coffee Stain in background of document */}
              <div className="absolute top-2 right-2 z-0">
                <CoffeeStain className="w-24 h-24" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black/20 pb-2 text-[10px] font-mono font-black text-slate-700 uppercase">
                  <span>DISPATCH TRANSMISSION</span>
                  <span className="text-red-700 font-bold">URGENT</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#12100E] leading-[0.95] font-sans uppercase tracking-tight">
                  {HERO_CASE_FILE.headline[0]}
                  <br />
                  <span className="text-red-700 underline decoration-red-600/60 decoration-4">
                    {HERO_CASE_FILE.headline[1]}
                  </span>
                </h1>

                {/* Supporting Text */}
                <p className="text-sm sm:text-base text-[#2E2822] font-mono leading-relaxed font-bold border-l-2 border-red-700 pl-3">
                  {HERO_CASE_FILE.supportingCopy}
                </p>

                {/* Action Buttons */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a href="#get-started">
                    <Button
                      variant="primary"
                      size="md"
                      className="px-5 py-3 text-xs sm:text-sm font-mono font-black uppercase tracking-wider bg-red-700 hover:bg-red-600 text-white shadow-xl shadow-red-950 border border-red-500"
                      icon={<ArrowRight className="w-4 h-4" />}
                      iconPosition="right"
                    >
                      {HERO_CASE_FILE.primaryCta}
                    </Button>
                  </a>

                  <a href="#gameplay-loop">
                    <button className="px-4 py-2.5 rounded-sm bg-[#E4D9C0] hover:bg-[#D8CCB0] text-[#1A1612] border border-[#B8AA90] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm">
                      <HelpCircle className="w-3.5 h-3.5 text-red-700" />
                      <span>{HERO_CASE_FILE.secondaryCta}</span>
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Pinned Handwritten Margin Note (Below Headline) */}
            <div className="relative w-full max-w-sm bg-[#FEF9C3] p-3.5 rounded-xs border border-amber-300 shadow-lg transform rotate-2 text-[#713F12] font-mono text-xs font-bold leading-relaxed">
              <div className="absolute -top-2 left-6">
                <Pushpin color="brass" className="w-5 h-5" />
              </div>
              <span className="text-red-700 font-black block text-[10px] uppercase mb-1">
                📌 DETECTIVE LOG:
              </span>
              &ldquo;Don&apos;t just read tutorials. Follow the stack trace like blood on the floor.&rdquo;
            </div>
          </div>

          {/* Right Column: Large Physical Case File #001 & Pinned Evidence Photos */}
          <div className="lg:col-span-7 relative">
            {/* The Main Physical Case Dossier Folder */}
            <div className="relative rounded-lg bg-gradient-to-br from-[#261E14] via-[#1B150D] to-[#100D09] border-2 border-amber-600/50 p-6 sm:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.95)] transform rotate-1 transition-transform duration-300 hover:rotate-0">
              {/* Pushpin at Folder Top */}
              <div className="absolute -top-3.5 left-10 z-30">
                <Pushpin color="red" className="w-7 h-7" />
              </div>

              {/* Folder Manila Tab */}
              <div className="absolute -top-3.5 right-8 px-4 py-1 bg-[#3A2D1C] border-t-2 border-l-2 border-r-2 border-amber-500/60 rounded-t text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest">
                OFFICIAL CASE DOSSIER
              </div>

              {/* Case File Header Information */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-500/30 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-black text-red-500 tracking-widest block uppercase">
                      {HERO_CASE_FILE.headerBadge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-wider">
                      {HERO_CASE_FILE.fileNumber}
                    </h2>
                  </div>

                  <RubberStamp text={HERO_CASE_FILE.status} color="red" rotation="-rotate-3" />
                </div>

                {/* Case Title & Metadata Strip */}
                <div className="p-3 rounded bg-[#0D0B07] border border-amber-500/25 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">CASE TITLE</span>
                    <span className="text-amber-300 font-bold">{HERO_CASE_FILE.caseTitle}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">DIFFICULTY</span>
                    <span className="text-amber-400 font-bold">{HERO_CASE_FILE.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">EVIDENCE COLLECTED</span>
                    <span className="text-red-400 font-bold">{HERO_CASE_FILE.evidenceCount} VERIFIED CLUES</span>
                  </div>
                </div>

                {/* Case Synopsis Paper Inset */}
                <div className="paper-cream p-4 rounded-xs border border-[#CFC2A4] text-[#1E1914] space-y-2">
                  <span className="text-[9px] font-mono font-black text-red-800 uppercase tracking-wider block">
                    INCIDENT DESCRIPTION // BREACH ANOMALY
                  </span>
                  <p className="text-xs sm:text-sm font-mono leading-relaxed">
                    Automated report dispatch system at the precinct central terminal is generating infinite duplicate entries.
                    Find the bug in the loop condition and patch the algorithm before the audit log overflows.
                  </p>
                </div>

                {/* Pinned Sub-Artifacts in Hero */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {HERO_CASE_FILE.pinnedNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-xs bg-[#15120E] border border-amber-500/30 text-amber-200/90 font-mono text-xs space-y-1 transform ${note.rotation}`}
                    >
                      <div className="flex items-center justify-between text-[9px] font-black text-amber-400">
                        <span>{note.title}</span>
                        <span className="text-red-400 font-bold">EXHIBIT</span>
                      </div>
                      <p className="text-[11px] leading-tight text-slate-300 font-sans">
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pinned Polaroid Photo (Overlapping the Case Dossier) */}
            <div className="hidden sm:block absolute -bottom-10 -right-6 z-25">
              <PolaroidPhoto
                title="CORRUPTED MEMORY TRACE"
                caseRef="CRIME SCENE #01"
                rotation="rotate-6"
                pinColor="brass"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
