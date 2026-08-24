import React from "react";
import { FINAL_CTA } from "@/data/siteChrome";
import { Pushpin, RubberStamp, TapeStrip, DetectiveLogoIcon, PolaroidPhoto } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { ArrowRight, FolderOpen, Lock, ShieldAlert } from "lucide-react";

export const CtaBanner: React.FC = () => {
  return (
    <section id="get-started" className="w-full py-16 sm:py-24 relative bg-[#07080C] overflow-hidden">
      <div className="absolute inset-0 corkboard-surface opacity-90 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-red-600/[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="relative rounded-lg bg-gradient-to-br from-[#241A10] via-[#16120C] to-[#0A0D15] border-2 border-red-700/60 p-8 sm:p-12 lg:p-16 shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden transform -rotate-0.5">
          <div className="absolute -top-3.5 left-12 z-30">
            <Pushpin color="red" className="w-7 h-7" />
          </div>
          <div className="absolute -top-3.5 right-12 px-4 py-1 bg-[#3A2A18] border-t-2 border-l-2 border-r-2 border-red-700/60 rounded-t text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest">
            {FINAL_CTA.caseReference}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-4 flex items-center justify-center lg:justify-start">
              <div className="relative group">
                <div className="relative w-52 h-40 rounded bg-gradient-to-br from-[#2E2012] to-[#140E08] border-2 border-red-600/60 p-4 shadow-2xl transform -rotate-3 transition-transform group-hover:rotate-0 duration-300 flex flex-col justify-between">
                  <div className="border-2 border-red-600/80 rounded px-2 py-1 transform -rotate-6 text-center bg-red-950/40">
                    <span className="text-[9px] font-mono font-black text-red-400 tracking-widest uppercase">
                      {FINAL_CTA.stamp}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">EXHIBIT A</span>
                      <span className="text-xs font-mono font-black text-amber-400">PRECINCT #404</span>
                    </div>
                    <DetectiveLogoIcon className="w-10 h-10 text-amber-500 drop-shadow-[0_0_12px_rgba(220,38,38,0.6)]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2">
                <RubberStamp text="UNSOLVED CASE ALERT" color="red" rotation="rotate-0" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-sans uppercase leading-tight tracking-tight">
                {FINAL_CTA.headline}
                <br />
                <span className="text-red-500 underline decoration-red-600/60 decoration-4">
                  {FINAL_CTA.subheadline}
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-mono italic max-w-xl">
                &ldquo;{FINAL_CTA.supporting}&rdquo;
              </p>
              <div className="pt-2">
                <a href="#code-lab">
                  <Button
                    variant="primary"
                    size="lg"
                    className="px-8 py-4 text-sm font-mono font-black tracking-widest uppercase bg-red-700 hover:bg-red-600 active:scale-98 text-white shadow-2xl shadow-red-950 border-2 border-red-500"
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                  >
                    {FINAL_CTA.buttonText}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
