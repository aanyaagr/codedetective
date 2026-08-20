import React from "react";
import { GAMEPLAY_LOOP_ARTIFACTS } from "@/data/content";
import { Pushpin, RubberStamp, TapeStrip, DynamicIcon } from "@/components/ui/Icons";

export const GameplayLoop: React.FC = () => {
  return (
    <section id="gameplay-loop" className="w-full py-16 sm:py-24 relative bg-[#07090D] border-t-2 border-red-950/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-14 sm:mb-18">
          <div className="flex items-center gap-3 mb-2">
            <RubberStamp text="THE INVESTIGATIVE METHOD" color="amber" rotation="rotate-0" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans uppercase">
            HOW YOU SOLVE CASES
          </h2>

          <div className="mt-3 flex flex-wrap justify-center items-center gap-2 text-xs font-mono font-bold text-slate-300">
            <span className="text-amber-400">BRIEF</span>
            <span>→</span>
            <span className="text-cyan-400">INVESTIGATE</span>
            <span>→</span>
            <span className="text-slate-200">LEARN</span>
            <span>→</span>
            <span className="text-amber-300">CODE</span>
            <span>→</span>
            <span className="text-red-400">CONNECT</span>
            <span>→</span>
            <span className="text-emerald-400 font-black">SOLVE</span>
          </div>
        </div>

        {/* 6 Physical Investigation Artifacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {GAMEPLAY_LOOP_ARTIFACTS.map((art, idx) => (
            <div
              key={art.id}
              className={`relative paper-cream p-5 sm:p-6 rounded-xs border border-[#D5C9B0] shadow-xl text-[#1E1914] flex flex-col justify-between transform ${art.rotation} transition-transform duration-300 hover:rotate-0 hover:scale-102`}
            >
              {/* Pushpin at top */}
              <div className="absolute -top-3 left-8 z-30">
                <Pushpin color={idx % 2 === 0 ? "red" : "brass"} className="w-6 h-6" />
              </div>

              {/* Tape Strip in corner */}
              <div className="absolute -top-2 right-4 z-20">
                <TapeStrip text={art.tapeColor === "hazard" ? "EVIDENCE" : "PRECINCT"} variant={art.tapeColor} className="w-24" />
              </div>

              {/* Card Content */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-black/15 pb-2 mb-3 pt-2">
                  <span className="text-[10px] font-mono font-black text-red-700 uppercase tracking-widest">
                    STEP {art.number} // {art.phase}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-[#14100C] uppercase tracking-wide mb-1 font-mono">
                  {art.title}
                </h3>
                <span className="text-[10px] font-mono font-bold text-red-800 block mb-3">
                  {art.subtitle}
                </span>

                <p className="text-xs font-mono leading-relaxed text-[#2C241C] mb-4">
                  {art.description}
                </p>
              </div>

              {/* Snippet Footer Tag */}
              <div className="pt-2 border-t border-black/10 flex items-center justify-between font-mono text-[9px] text-[#524436]">
                <span className="font-bold">{art.artifactName}</span>
                <span className="text-red-700 font-black">{art.clueSnippet}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
