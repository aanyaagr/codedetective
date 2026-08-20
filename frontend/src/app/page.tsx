import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import HeroSection  from "@/components/hero/HeroSection";
import CaseBoard  from "@/components/hero/CaseBoard";
import { EvidenceTrail } from "@/components/sections/EvidenceTrail";
import { GameplayLoop } from "@/components/sections/GameplayLoop";
import { CodeLabSection } from "@/components/sections/CodeLabSection";
import { CtaBanner } from "@/components/sections/CtaBanner";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080C] text-slate-100 selection:bg-red-600/40 selection:text-red-100">
      {/* 1. Precinct Navigation Header */}
      <Navbar />

      {/* Main Investigation Board Page Flow */}
      <main className="flex-grow flex flex-col">
        {/* 2. Asymmetrical Investigation Board Hero */}
        <HeroSection />

        <CaseBoard />

        {/* 3. Investigation Deduction Trail (CASE -> CLUE -> EVIDENCE -> CODE -> SOLUTION) */}
        <EvidenceTrail />

        {/* 4. The 6-Step Gameplay Loop (Investigation Artifacts) */}
        <GameplayLoop />

        {/* 5. Real Coding Experience & Detective Assistant Partner */}
        <CodeLabSection />

        {/* 6. Cinematic Final Case-File CTA */}
        <CtaBanner />
      </main>

      {/* 7. Bureau Footer */}
      <Footer />
    </div>
  );
}
