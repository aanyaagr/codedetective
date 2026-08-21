"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { DetectiveLogoIcon } from "@/components/ui/Icons";

function LoginHomeButton() {
  return (
    <Link
      href="/"
      aria-label="Go to CodeDetective home"
      className="group fixed left-5 top-5 z-50 flex items-center gap-3 rounded-md border border-white/[0.08] bg-[#07080C]/90 px-3 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-red-700/60 hover:bg-[#0B0D12]"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded border border-red-700/50 bg-black/40 transition-transform duration-200 group-hover:scale-105">
        <DetectiveLogoIcon className="h-7 w-7 text-[#F5F2ED]" />
      </div>
      <div className="hidden sm:block">
        <div className="font-sans text-sm font-black tracking-[0.12em] leading-none text-[#F5F2ED]">
          CODE<span className="text-[#ED1118]">DETECTIVE</span>
        </div>
        <div className="mt-1 font-mono text-[7px] font-black tracking-[0.24em] text-[#8F949E]">
          ACADEMY // CRIME LAB
        </div>
      </div>
    </Link>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isLogin = pathname === "/login";

  return (
    <>
      {isLogin ? <LoginHomeButton /> : !isHome && <Navbar />}
      {children}
    </>
  );
}
