import React from "react";
import { INVESTIGATION_JOURNEY_STAGES } from "@/data/content";
import { DynamicIcon, Pushpin, TapeStrip, RubberStamp } from "@/components/ui/Icons";

export const HowItWorks: React.FC = () => {
  const getCardStyle = (paperType: string) => {
    switch (paperType) {
      case "dossier":
        return "bg-gradient-to-br from-[#1E1912] to-[#120F0B] border-amber-500/40 text-amber-200";
      case "memo":
        return "bg-gradient-to-br from-[#141A22] to-[#0A0D14] border-cyan-500/40 text-cyan-200";
      case "photo":
        return "bg-[#11141D] border-white/20 text-slate-200";
      case "terminal":
        return "bg-[#06080F] border-emerald-500/40 text-emerald-200 font-mono";
      case "evidence":
        return "bg-[#1C1620] border-purple-500/40 text-purple-200";
      case "badge":
      default:
        return "bg-gradient-to-br from-[#261C08] to-[#120D04] border-amber-400 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.2)]";
    }
  };

  const getPinColor = (idx: number): "red" | "amber" | "cyan" | "brass" => {
    const colors: ("red" | "amber" | "cyan" | "brass")[] = ["red", "cyan", "amber", "red", "brass", "amber"];
    return colors[idx % colors.length];
  };

  return (
    <section id="journey" className="w-full py-14 sm:py-18 relative bg-[#07090F] border-t border-amber-500/20">
      {/* Evidence Board Grid Texture */}
      <div className="absolute inset-0 evidence-board-bg opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header as Investigation Board Title */}
        <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-14">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 sm:w-16 h-[2px] bg-red-600/80" />
            <RubberStamp text="CHAIN OF CUSTODY" color="red" rotation="rotate-0" />
            <span className="w-8 sm:w-16 h-[2px] bg-red-600/80" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-sans uppercase">
            INVESTIGATION BOARD
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Follow the evidence line to close the case and claim your badge.
          </p>
        </div>

        {/* 6 Asymmetric Evidence Items Grid with Thread Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-4 relative">
          {/* Visual Red Thread Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-[28px] left-[5%] right-[5%] h-[2px] border-t-2 border-dashed border-red-600/40 z-0 pointer-events-none" />

          {INVESTIGATION_JOURNEY_STAGES.map((stage, idx) => (
            <div
              key={stage.number}
              className={`group relative rounded-lg border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-2xl ${stage.rotation} ${getCardStyle(
                stage.paperType
              )}`}
            >
              {/* Pushpin at Top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                <Pushpin color={getPinColor(idx)} className="w-6 h-6" />
              </div>

              {/* Tag & Stage Number */}
              <div>
                <div className="flex items-center justify-between mb-3 pt-1 border-b border-white/10 pb-1.5">
                  <span className="text-[9px] font-mono font-black tracking-wider uppercase opacity-80">
                    {stage.tag}
                  </span>
                  <span className="text-xs font-mono font-black text-amber-400">
                    STAGE {stage.number}
                  </span>
                </div>

                {/* Stage Icon */}
                <div className="w-10 h-10 rounded-md bg-black/40 border border-white/15 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
                  <DynamicIcon name={stage.icon} className="w-5 h-5" />
                </div>

                {/* Stage Title */}
                <h3 className="text-sm font-black tracking-wide text-white uppercase mb-1 font-sans">
                  {stage.title}
                </h3>
                <span className="text-[10px] font-mono font-bold text-amber-400/90 block mb-2">
                  {stage.subtitle}
                </span>

                {/* Stage Description */}
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {stage.description}
                </p>
              </div>

              {/* Bottom Tape / Case Marker */}
              <div className="mt-4 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[9px] font-mono opacity-70">
                <span>PHASE // 0{idx + 1}</span>
                <span>VERIFIED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
