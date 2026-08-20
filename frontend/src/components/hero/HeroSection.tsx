"use client";

import { ArrowRight, FolderOpen, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="hero">

      <div className="hero-content">

        {/* LEFT SIDE */}
        <div className="hero-copy">

          <div className="hero-kicker">
            <span className="hero-dot" />
            BUREAU OF CODE INVESTIGATION
          </div>

          <h1 className="hero-title">
            <span>EVERY BUG</span>
            <span className="red">LEAVES A CLUE.</span>
          </h1>

          <div className="hero-line" />

          <p className="hero-description">
            Become a Code Detective. Investigate real-world bugs,
            follow the evidence, write code, and solve cases like
            never before.
          </p>

          <div className="hero-actions">

            <button className="primary-button">
              <FolderOpen size={18} />
              OPEN CASE FILE
              <ArrowRight size={18} />
            </button>

            <button className="secondary-button">
              <Play size={17} />
              HOW IT WORKS
            </button>

          </div>

          <div className="active-dossier">

            <div className="dossier-label">
              ACTIVE DOSSIER: #001
            </div>

            <div className="dossier-title">
              THE MISSING ALGORITHM
              <span className="dossier-status">
                <span className="status-dot" />
                UNSOLVED
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE — HERO IMAGE */}
        <div className="hero-visual">
          <img
            src="/hero-noir.png"
            alt="Code investigation scene"
            className="hero-image"
          />

          <div className="hero-image-fade" />
        </div>

      </div>

      {/* BOTTOM FEATURE STRIP */}
      <div className="hero-features">

        <div className="hero-feature">
          <span className="feature-icon">◈</span>
          <span>REAL BUGS. REAL IMPACT.</span>
        </div>

        <div className="hero-feature">
          <span className="feature-icon">&lt;/&gt;</span>
          <span>WRITE CODE. FIX SYSTEMS.</span>
        </div>

        <div className="hero-feature">
          <span className="feature-icon">◎</span>
          <span>FOLLOW EVIDENCE.</span>
        </div>

        <div className="hero-feature">
          <span className="feature-icon">♜</span>
          <span>EARN BADGES. RANK UP.</span>
        </div>

      </div>

    </section>
  );
}