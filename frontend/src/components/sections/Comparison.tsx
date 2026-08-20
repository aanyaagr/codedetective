import React from "react";
import { COMPARISON_REPORT } from "@/data/content";
import { DynamicIcon, RubberStamp } from "@/components/ui/Icons";

export const Comparison: React.FC = () => {
  return (
    <section id="case-report" className="w-full py-14 sm:py-18 relative bg-[#07090F] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-2">
            <RubberStamp text={COMPARISON_REPORT.badge} color="red" rotation="rotate-0" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-sans uppercase">
            {COMPARISON_REPORT.headline}
          </h2>
          <p className="text-xs sm:text-sm text-amber-400 font-mono mt-1 font-bold">
            {COMPARISON_REPORT.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Traditional */}
          <div className="rounded-lg bg-[#0C0F15] border-2 border-slate-700/50 p-6 space-y-3">
            <span className="text-[10px] font-mono font-black text-red-400 block mb-1">
              {COMPARISON_REPORT.traditional.status}
            </span>
            <h3 className="text-base font-black text-slate-300 font-mono uppercase mb-4">
              {COMPARISON_REPORT.traditional.label}
            </h3>
            {COMPARISON_REPORT.traditional.steps.map((step: { label: string; sub: string; icon: string }, idx: number) => (
              <div key={step.label} className="p-2.5 rounded bg-[#131720] border border-white/5 flex items-center justify-between font-mono text-xs">
                <span>0{idx + 1}. {step.label} ({step.sub})</span>
              </div>
            ))}
          </div>

          {/* CodeDetective */}
          <div className="rounded-lg bg-gradient-to-br from-[#1A150D] to-[#0A0D15] border-2 border-amber-500/60 p-6 space-y-3">
            <span className="text-[10px] font-mono font-black text-amber-400 block mb-1">
              {COMPARISON_REPORT.codedetective.status}
            </span>
            <h3 className="text-base font-black text-amber-300 font-mono uppercase mb-4">
              {COMPARISON_REPORT.codedetective.label}
            </h3>
            {COMPARISON_REPORT.codedetective.steps.map((step: { label: string; sub: string; icon: string }, idx: number) => (
              <div key={step.label} className="p-2.5 rounded bg-[#18130A] border border-amber-500/30 flex items-center justify-between font-mono text-xs text-amber-200">
                <span>0{idx + 1}. {step.label} ({step.sub})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
