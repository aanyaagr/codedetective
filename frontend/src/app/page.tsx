import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import LiveCaseBoard from "@/components/hero/LiveCaseBoard";
import { EvidenceTrail } from "@/components/sections/EvidenceTrail";
import { GameplayLoop } from "@/components/sections/GameplayLoop";
import { LiveCodeLabSection } from "@/components/sections/LiveCodeLabSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080C] text-slate-100 selection:bg-red-600/40 selection:text-red-100">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <HeroSection />
        <LiveCaseBoard />
        <EvidenceTrail />
        <GameplayLoop />
        <LiveCodeLabSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
