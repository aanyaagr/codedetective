import React from "react";
import { LEDGER_STATS, BADGE_RANKS } from "@/data/content";
import { DynamicIcon, RankShieldIcon, RubberStamp } from "@/components/ui/Icons";

export const StatsAndJourney: React.FC = () => {
  return (
    <section id="badge-wall" className="w-full py-14 sm:py-18 relative bg-[#06070C] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Ledger */}
          <div className="lg:col-span-6 space-y-4">
            <RubberStamp text="SERVICE RECORD" color="amber" rotation="rotate-0" />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans uppercase">
              DETECTIVE LEDGER
            </h2>
            <div className="space-y-2 font-mono text-xs">
              {LEDGER_STATS.map((stat: { label: string; value: string; code: string; icon: string; note: string }) => (
                <div key={stat.label} className="p-3 rounded bg-[#0D1018] border border-amber-500/20 flex items-center justify-between">
                  <span>{stat.label}</span>
                  <span className="text-amber-400 font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badge Wall */}
          <div className="lg:col-span-6 space-y-4">
            <RubberStamp text="PRECINCT HONORS" color="cyan" rotation="rotate-0" />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans uppercase">
              BADGE WALL
            </h2>
            <div className="flex gap-4">
              {BADGE_RANKS.map((badge: { id: string; title: string; level: number; stars: number; metal: string; issuedDate: string; isMaster?: boolean }) => (
                <div key={badge.id} className="p-3 rounded bg-[#0E121E] border border-white/10 text-center font-mono text-xs">
                  <RankShieldIcon rankId={badge.id} className="w-12 h-12 mx-auto mb-2" isGold={badge.isMaster} />
                  <span className="block font-bold text-slate-200">{badge.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
