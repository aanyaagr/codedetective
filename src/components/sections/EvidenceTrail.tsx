"use client";

import React, { useState } from "react";
import { EVIDENCE_TRAIL_STEPS } from "@/data/content";
import { Pushpin, RubberStamp, TapeStrip, CoffeeStain, DynamicIcon } from "@/components/ui/Icons";
import { ArrowRight, CheckCircle2, Search, Code, Trophy, FileText, Fingerprint } from "lucide-react";

export const EvidenceTrail: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const getStepCardStyle = (type: string) => {
    switch (type) {
      case "dossier":
        return "bg-[#1B160E] border-amber-600/50 text-amber-200";
      case "polaroid":
        return "bg-[#EDE8DC] text-[#1A1612] border-[#C7BBA3]";
      case "clue-card":
        return "bg-[#141A24] border-cyan-500/50 text-cyan-200";
      case "code-snippet":
        return "bg-[#0A0D15] border-amber-500/50 text-amber-300 font-mono";
      case "solved-seal":
      default:
        return "bg-gradient-to-br from-[#261E0A] to-[#120E04] border-amber-400 text-amber-100 shadow-[0_0_25px_rgba(245,158,11,0.25)]";
    }
  };

  const getPinColor = (idx: number): "red" | "brass" | "steel" => {
    const pins: ("red" | "brass" | "steel")[] = ["red", "brass", "steel", "red", "brass"];
    return pins[idx % pins.length];
  };

  return (
    <section id="evidence-trail" className="w-full py-16 sm:py-24 relative bg-[#090B10] border-t-2 border-red-950/60 overflow-hidden">
      {/* Dark Investigation Board Surface */}
      <div className="absolute inset-0 corkboard-surface opacity-90 pointer-events-none" />

      {/* Red Threads SVG Layer across the 5 stages */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-15 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Thread Stage 1 to 2 */}
          <path
            d="M 230 260 Q 320 220 440 270"
            stroke="#DC2626"
            strokeWidth="2.2"
            fill="none"
            strokeDasharray="4 2"
            className="red-thread-glow opacity-85"
          />
          {/* Thread Stage 2 to 3 */}
          <path
            d="M 460 270 Q 560 320 680 260"
            stroke="#DC2626"
            strokeWidth="2.2"
            fill="none"
            strokeDasharray="4 2"
            className="red-thread-glow opacity-85"
          />
          {/* Thread Stage 3 to 4 */}
          <path
            d="M 700 260 Q 800 210 920 270"
            stroke="#DC2626"
            strokeWidth="2.2"
            fill="none"
            strokeDasharray="4 2"
            className="red-thread-glow opacity-85"
          />
          {/* Thread Stage 4 to 5 */}
          <path
            d="M 940 270 Q 1030 330 1150 260"
            stroke="#DC2626"
            strokeWidth="2.2"
            fill="none"
            strokeDasharray="4 2"
            className="red-thread-glow opacity-85"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-14 sm:mb-18">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 sm:w-16 h-[2px] bg-red-600" />
            <RubberStamp text="FORENSIC DEDUCTION TRAIL" color="red" rotation="rotate-0" />
            <span className="w-10 sm:w-16 h-[2px] bg-red-600" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans uppercase">
            EVERY CASE LEAVES A TRAIL.
          </h2>
          
          <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-amber-400">
            <span>CASE</span>
            <span>→</span>
            <span>CLUE</span>
            <span>→</span>
            <span>EVIDENCE</span>
            <span>→</span>
            <span>CODE</span>
            <span>→</span>
            <span className="text-emerald-400 font-black">SOLUTION</span>
          </div>
        </div>

        {/* 5 Connected Evidence Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-4 relative">
          {EVIDENCE_TRAIL_STEPS.map((step, idx) => (
            <div
              key={step.id}
              onMouseEnter={() => setActiveStep(step.id)}
              onMouseLeave={() => setActiveStep(null)}
              className={`group relative rounded-xs border-2 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:z-30 hover:shadow-2xl cursor-pointer ${
                step.rotation
              } ${getStepCardStyle(step.paperType)}`}
            >
              {/* Pushpin at Top Center */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
                <Pushpin color={getPinColor(idx)} className="w-7 h-7" />
              </div>

              {/* Card Top Information */}
              <div>
                <div className="flex items-center justify-between border-b border-black/15 pb-2 mb-3 pt-1">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-red-600">
                    STAGE {step.stepNumber}
                  </span>
                  <RubberStamp text={step.stamp} color={step.stampColor} className="text-[8px] px-1 py-0.2" />
                </div>

                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide mb-0.5 font-mono">
                  {step.title}
                </h3>
                <span className="text-[10px] font-mono font-bold opacity-80 block mb-3">
                  {step.subtitle}
                </span>

                <p className="text-xs leading-relaxed opacity-90 font-sans mb-4">
                  {step.description}
                </p>
              </div>

              {/* Handwritten Post-it Style Annotation */}
              <div className="p-2.5 rounded-xs bg-[#120F0A] border border-amber-500/30 text-[10px] font-mono leading-tight space-y-1">
                <span className="text-red-400 font-bold block text-[9px] uppercase tracking-wider">
                  NOTE // {step.annotationAuthor}:
                </span>
                <p className="text-amber-200 italic font-mono">
                  &ldquo;{step.annotation}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
