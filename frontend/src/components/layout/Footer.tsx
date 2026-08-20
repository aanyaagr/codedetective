import React from "react";
import Link from "next/link";
import { FOOTER_DATA } from "@/data/siteChrome";
import { DetectiveLogoIcon, RubberStamp } from "@/components/ui/Icons";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#05060A] border-t-2 border-red-950/80 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-4 space-y-3">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <DetectiveLogoIcon className="w-9 h-9 text-amber-500 transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="text-base font-black tracking-wider text-amber-400 font-sans">{FOOTER_DATA.brand}</span>
                <span className="text-[9px] tracking-[0.35em] font-black text-red-500/90 font-mono">{FOOTER_DATA.subBrand} // {FOOTER_DATA.precinct}</span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-mono">{FOOTER_DATA.tagline}</p>
            <div className="pt-1">
              <RubberStamp text="OFFICIAL EVIDENCE REPOSITORY" color="red" className="text-[8px] px-1.5" />
            </div>
          </div>
          {FOOTER_DATA.columns.map((col) => (
            <div key={col.title} className="col-span-1 md:col-span-2 space-y-3">
              <h4 className="text-xs font-mono font-black tracking-widest text-slate-200 uppercase border-b border-red-950/60 pb-1">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-xs font-mono text-slate-400 hover:text-red-400 transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-black tracking-widest text-slate-200 uppercase border-b border-red-950/60 pb-1">DISPATCH WIRE</h4>
            <div className="flex flex-col space-y-2 font-mono text-xs text-slate-400">
              {FOOTER_DATA.socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors">› {s.name}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© {new Date().getFullYear()} CodeDetective Academy. Precinct #404. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {FOOTER_DATA.legal.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-red-400 transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
