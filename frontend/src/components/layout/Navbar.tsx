"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DetectiveLogoIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Menu, X, UserRound, ChevronDown, Trophy, LogOut, Shield } from "lucide-react";
import { getStoredUser, logout, type User } from "@/lib/auth";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-950/60 bg-[#07080C]/95 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex shrink-0 items-center gap-3" onClick={closeMobile}>
          <div className="relative flex items-center justify-center rounded-lg p-1 transition-transform duration-200 group-hover:scale-105">
            <DetectiveLogoIcon className="h-9 w-9 text-[#F5F2ED] sm:h-10 sm:w-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-base font-black tracking-[0.12em] leading-none text-[#F5F2ED] sm:text-lg">
              CODE<span className="text-[#ED1118]">DETECTIVE</span>
            </span>
            <span className="mt-1 font-mono text-[8px] font-black tracking-[0.28em] text-[#8F949E] sm:text-[9px]">
              ACADEMY // CRIME LAB
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary navigation">
          <Link
            href="/case-board"
            className="group relative py-2 font-mono text-[11px] font-black uppercase tracking-[0.16em] text-slate-300 transition-colors hover:text-white"
          >
            Case Board
            <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-red-500 transition-transform duration-200 group-hover:scale-x-100" />
          </Link>
          <Link
            href="/leaderboard"
            className="group relative flex items-center gap-2 py-2 font-mono text-[11px] font-black uppercase tracking-[0.16em] text-slate-300 transition-colors hover:text-white"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-500/80" />
            Leaderboard
            <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-red-500 transition-transform duration-200 group-hover:scale-x-100" />
          </Link>
        </nav>

        {/* Desktop account area */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-wider text-slate-200 transition hover:border-red-700/50 hover:bg-red-950/20"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded border border-red-700/50 bg-red-950/30 text-red-400">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="max-w-[120px] truncate">{user.name || "Detective"}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-md border border-red-950/80 bg-[#0B0D12] shadow-[0_20px_50px_rgba(0,0,0,0.65)]" role="menu">
                  <div className="border-b border-white/[0.06] bg-[#0E1015] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded border border-amber-600/40 bg-amber-950/20 text-amber-500">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs font-black uppercase tracking-wider text-white">{user.name || "Detective"}</p>
                        <p className="truncate font-mono text-[9px] text-slate-500">{user.rank || "Detective"} // LVL {user.level ?? 1}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3 font-mono text-[9px] uppercase tracking-wider">
                      <span className="text-slate-500">XP</span>
                      <span className="font-black text-amber-400">{(user.xp ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link href="/case-board" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded px-3 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 transition hover:bg-white/[0.04] hover:text-white">
                      <Shield className="h-3.5 w-3.5 text-red-500" /> My Cases
                    </Link>
                    <Link href="/leaderboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded px-3 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 transition hover:bg-white/[0.04] hover:text-white">
                      <Trophy className="h-3.5 w-3.5 text-amber-500" /> Leaderboard
                    </Link>
                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded px-3 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 transition hover:bg-red-950/30 hover:text-red-400">
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" className="border border-red-400/50 bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-5 py-2.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_6px_20px_rgba(220,38,38,0.15)] hover:from-red-600 hover:via-red-500 hover:to-red-600">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="rounded-md border border-white/[0.08] p-2 text-slate-300 transition hover:border-red-700/50 hover:text-red-400 sm:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-red-950/60 bg-[#090B10] px-4 pb-5 pt-3 sm:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <Link href="/case-board" onClick={closeMobile} className="rounded px-3 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-slate-300 transition hover:bg-white/[0.04] hover:text-red-400">
              Case Board
            </Link>
            <Link href="/leaderboard" onClick={closeMobile} className="flex items-center gap-2 rounded px-3 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-slate-300 transition hover:bg-white/[0.04] hover:text-red-400">
              <Trophy className="h-4 w-4 text-amber-500" /> Leaderboard
            </Link>
          </nav>
          <div className="mt-3 border-t border-white/[0.06] pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="rounded border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                  <p className="font-mono text-[10px] font-black uppercase tracking-wider text-white">{user.name || "Detective"}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-slate-500">{user.rank || "Detective"} // {user.xp ?? 0} XP</p>
                </div>
                <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded border border-red-900/50 px-3 py-3 font-mono text-[10px] font-black uppercase tracking-wider text-red-400 transition hover:bg-red-950/30">
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={closeMobile}>
                <Button variant="primary" size="sm" className="w-full border border-red-400/50 bg-red-700 font-mono text-xs font-black uppercase tracking-wider text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
