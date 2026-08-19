"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/data/content";
import { DetectiveLogoIcon, RubberStamp } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Menu, X, Radio } from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#07080C]/95 backdrop-blur-md border-b-2 border-red-950/60 shadow-lg">
      {/* Top Red Investigation Ticker */}
      <div className="bg-[#0D0B0A] px-4 py-1 border-b border-red-900/30 text-[10px] font-mono text-slate-400 flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span className="text-red-400 font-black tracking-widest uppercase">
            BUREAU OF CODE INVESTIGATION
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-300">ACTIVE DOSSIER: #001</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-slate-400 flex-shrink-0">
          <span className="text-slate-300">STATUS: INVESTIGATION IN PROGRESS</span>
          <span className="text-slate-600">•</span>
          <span className="text-red-400 font-bold">RED WIRE CONNECTED</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center p-1 rounded-lg transition-transform group-hover:scale-105">
            <DetectiveLogoIcon className="w-9 h-9 sm:w-10 sm:h-10 text-amber-500 drop-shadow-[0_0_12px_rgba(220,38,38,0.5)]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-base sm:text-lg font-black tracking-wider text-amber-400 font-sans">
                CODEDETECTIVE
              </span>
            </div>
            <span className="text-[9px] tracking-[0.35em] font-black text-red-500/90 font-mono mt-0.5">
              ACADEMY // CRIME LAB
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-red-400 transition-colors duration-150 relative py-1 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Primary Header Action */}
        <div className="hidden sm:flex items-center gap-3">
          <a href="#get-started">
            <Button
              variant="primary"
              size="sm"
              className="text-xs px-4 py-2 uppercase font-mono font-black tracking-wider bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-400/50 shadow-lg shadow-red-950"
            >
              OPEN CASE FILE
            </Button>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-red-400 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0C12] border-b-2 border-red-950 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-red-400 py-2 px-3 rounded hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-red-900/30 flex flex-col gap-2">
            <a href="#get-started" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs font-mono uppercase font-black bg-red-600 text-white"
              >
                OPEN CASE FILE
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
