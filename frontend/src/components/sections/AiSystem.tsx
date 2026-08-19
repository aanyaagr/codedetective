import React from "react";
import { AI_DOSSIERS, AiDossier } from "@/data/content";
import { DynamicIcon, RubberStamp } from "@/components/ui/Icons";

export const AiSystem: React.FC = () => {
  return (
    <section id="ai-dossiers" className="w-full py-14 sm:py-18 relative bg-[#06080E] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-2">
            <RubberStamp text="AI SPECIALIST DOSSIERS" color="amber" rotation="rotate-0" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-sans uppercase">
            THE DETECTIVE UNIT
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AI_DOSSIERS.map((dossier: { id: string; codeName: string; title: string; quote: string; description: string; clearance: string; specialty: string; icon: string; stamp: string }) => (
            <div
              key={dossier.id}
              className="relative rounded-lg bg-[#0B0E17] border-2 border-amber-500/40 p-5 sm:p-6 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded bg-[#131926] border border-white/15 flex items-center justify-center text-amber-400">
                    <DynamicIcon name={dossier.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-amber-400 block tracking-widest">
                      {dossier.codeName}
                    </span>
                    <h3 className="text-sm sm:text-base font-black tracking-wide text-white uppercase font-sans">
                      {dossier.title}
                    </h3>
                  </div>
                </div>
                <RubberStamp text={dossier.stamp} color="amber" className="text-[8px] px-1.5" />
              </div>

              <div className="p-2.5 rounded bg-[#101420] border border-white/[0.08] mb-3">
                <p className="text-xs font-mono font-bold text-amber-300 italic">
                  &ldquo;{dossier.quote}&rdquo;
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                {dossier.description}
              </p>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded border border-amber-500/40 bg-amber-950/40 text-amber-300 font-bold uppercase">
                  {dossier.clearance}
                </span>
                <span className="text-slate-400 font-medium">
                  {dossier.specialty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
