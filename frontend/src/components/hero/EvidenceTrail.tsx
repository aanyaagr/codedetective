"use client";

import Link from "next/link";

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Link2,
  Fingerprint,
  Shield,
  Target,
  AlertTriangle,
  Lock,
  Check,
  FileText,
  Image as ImageIcon,
  Database,
  Clock,
} from "lucide-react";

const evidence = [
  {
    id: 1,
    title: "SERVER ROOM",
    type: "Incident Photo",
    image: "/hero-noir.png",
    note: "Captured 02:47 AM",
  },
  {
    id: 2,
    title: "CORRUPTED OUTPUT",
    type: "System Log",
    image: "/hero-noir.png",
    note: "Mismatch detected in all nodes",
  },
  {
    id: 3,
    title: "ALGORITHM SPEC",
    type: "Document",
    image: "/hero-noir.png",
    note: "Spec v4.2 — last updated 3 days ago",
  },
  {
    id: 4,
    title: "UNKNOWN PROCESS",
    type: "Forensic Clue",
    image: "/hero-noir.png",
    note: "Executed before crash",
  },
];

export default function EvidenceTrail() {
  const [selectedEvidence, setSelectedEvidence] = useState(2);

  const selected =
    evidence.find((item) => item.id === selectedEvidence) ?? evidence[1];

  return (
    <main className="evidence-page">

      {/* TOP CASE BAR */}

      <div className="evidence-casebar">
        <div>
          CASE #001: THE MISSING ALGORITHM
        </div>

        <div className="evidence-case-status">
          <span>STATUS: INVESTIGATION IN PROGRESS</span>
          <span className="case-separator">•</span>
          <span className="wire-status">RED WIRE CONNECTED</span>
        </div>
      </div>


      {/* PAGE HEADER */}

      <section className="evidence-header">

        <button className="back-case-button">
          <ArrowLeft size={16} />
          BACK TO CASE BOARD
        </button>

        <div className="evidence-heading">

          <div className="evidence-kicker">
            <span />
            EVIDENCE DIVISION
            <span />
          </div>

          <h1>EVIDENCE TRAIL</h1>

          <p>
            FOLLOW THE CLUES. CONNECT THE EVIDENCE. FIND THE BUG.
          </p>

        </div>

        {/* DETECTIVE STATUS */}

        <div className="detective-status">

          <div className="detective-icon">
            <Shield size={36} />
          </div>

          <div>
            <div className="status-heading">
              DETECTIVE STATUS
            </div>

            <div className="rank-row">
              RANK:
              <strong>ROOKIE</strong>
            </div>

            <div className="xp-row">
              <span>XP: 1,250 / 2,000</span>
              <span>62%</span>
            </div>

            <div className="xp-bar">
              <div style={{ width: "62%" }} />
            </div>
          </div>

        </div>

      </section>


      {/* MAIN CONTENT */}

      <section className="evidence-layout">

        {/* LEFT SIDE */}

        <div className="evidence-main">

          {/* INVESTIGATION BOARD */}

          <div className="investigation-board">

            <div className="board-title">
              INVESTIGATION BOARD
            </div>


            {/* EVIDENCE 01 */}

            <EvidenceCard
              evidence={evidence[0]}
              position="evidence-one"
              selected={selectedEvidence === 1}
              onClick={() => setSelectedEvidence(1)}
            />


            {/* EVIDENCE 02 */}

            <EvidenceCard
              evidence={evidence[1]}
              position="evidence-two"
              selected={selectedEvidence === 2}
              onClick={() => setSelectedEvidence(2)}
            />


            {/* QUESTION NOTE */}

            <div className="board-question question-one">
              Why did the output change
              after this process?
            </div>


            {/* EVIDENCE 03 */}

            <EvidenceCard
              evidence={evidence[2]}
              position="evidence-three"
              selected={selectedEvidence === 3}
              onClick={() => setSelectedEvidence(3)}
            />


            {/* QUESTION NOTE */}

            <div className="board-question question-two">
              What caused the algorithm
              to behave incorrectly?
            </div>


            {/* EVIDENCE 04 */}

            <EvidenceCard
              evidence={evidence[3]}
              position="evidence-four"
              selected={selectedEvidence === 4}
              onClick={() => setSelectedEvidence(4)}
            />


            {/* THREADS */}

            <div className="red-thread thread-one" />
            <div className="red-thread thread-two" />
            <div className="red-thread thread-three" />
            <div className="red-thread thread-four" />

          </div>


          {/* INVENTORY */}

          <div className="evidence-inventory">

            <div className="inventory-title">
              <Search size={15} />
              EVIDENCE INVENTORY
            </div>

            <div className="inventory-items">

              {evidence.map((item) => (
                <button
                  key={item.id}
                  className={`inventory-card ${
                    selectedEvidence === item.id
                      ? "inventory-selected"
                      : ""
                  }`}
                  onClick={() => setSelectedEvidence(item.id)}
                >

                  <span className="inventory-number">
                    {String(item.id).padStart(2, "0")}
                  </span>

                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <span className="inventory-check">
                    <Check size={12} />
                  </span>

                </button>
              ))}

              <div className="inventory-locked">
                <Lock size={20} />
                <span>EVIDENCE</span>
                <small>LOCKED</small>
              </div>

              <div className="inventory-locked">
                <Lock size={20} />
                <span>EVIDENCE</span>
                <small>LOCKED</small>
              </div>

            </div>

          </div>


          {/* CONNECT AREA */}

        

{/* CONNECT AREA */}

<div className="connect-area">

  <div className="connect-info">

    <Fingerprint size={48} />

    <div>
      <h3>CONNECT THE RIGHT EVIDENCE TO REVEAL THE TRUTH.</h3>

      <p>
        You need at least 3 pieces of relevant evidence
        to build your theory.
      </p>
    </div>

  </div>

  <div className="connect-actions">

    <button className="connect-button">
      <Link2 size={18} />
      CONNECT EVIDENCE
    </button>

    <Link
      href="/lesson"
      className="lesson-button"
    >
      CONTINUE TO MINI LESSON
      <span>→</span>
    </Link>

  </div>

</div>

{/* CLOSE EVIDENCE-MAIN */}
</div>

{/* RIGHT SIDEBAR */}

<aside className="evidence-sidebar">

          {/* PROGRESS */}

          <div className="evidence-panel">

            <h3>INVESTIGATION PROGRESS</h3>

            <div className="progress-content">

              <div className="progress-circle">
                <strong>3 / 5</strong>
                <span>EVIDENCE<br />DISCOVERED</span>
              </div>

              <div className="progress-list">

                <div>
                  <span className="progress-dot green" />
                  Evidence Found
                  <strong>3</strong>
                </div>

                <div>
                  <span className="progress-dot amber" />
                  Connections Made
                  <strong>2</strong>
                </div>

                <div>
                  <span className="progress-dot blue" />
                  Theory Unlocked
                  <strong>0</strong>
                </div>

                <div>
                  <span className="progress-dot red" />
                  Case Solved
                  <strong>0</strong>
                </div>

              </div>

            </div>

          </div>


          {/* THREAT LEVEL */}

          <div className="evidence-panel threat-panel">

            <h3>
              <AlertTriangle size={18} />
              THREAT LEVEL
            </h3>

            <div className="threat-bar">

              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <span
                  key={item}
                  className={item <= 7 ? "active" : ""}
                />
              ))}

            </div>

            <strong>70%</strong>

          </div>


          {/* OBJECTIVE */}

          <div className="evidence-panel objective-panel">

            <h3>
              <Target size={18} />
              CASE OBJECTIVE
            </h3>

            <p>
              Identify the source of the algorithm corruption
              and determine what caused the system failure.
            </p>

            <div className="investigation-active">
              <span />
              INVESTIGATION ACTIVE
            </div>

          </div>


          {/* SELECTED EVIDENCE */}

          <div className="evidence-panel selected-panel">

            <h3>SELECTED EVIDENCE</h3>

            <div className="selected-content">

              <img
                src={selected.image}
                alt={selected.title}
              />

              <div>

                <h4>{selected.title}</h4>

                <span>{selected.type}</span>

                <p>
                  {selected.note}
                </p>

                <button className="examine-button">
                  <Search size={15} />
                  EXAMINE CLUE
                </button>

              </div>

            </div>

          </div>

        </aside>

      </section>

    </main>
  );
}


/* =========================================
   EVIDENCE CARD
   ========================================= */

function EvidenceCard({
  evidence,
  position,
  selected,
  onClick,
}: {
  evidence: {
    id: number;
    title: string;
    type: string;
    image: string;
    note: string;
  };
  position: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`board-evidence ${position} ${
        selected ? "board-selected" : ""
      }`}
      onClick={onClick}
    >

      <span className="pin" />

      <span className="evidence-number">
        {String(evidence.id).padStart(2, "0")}
      </span>

      <img
        src={evidence.image}
        alt={evidence.title}
      />

      <div className="board-card-footer">

        <strong>{evidence.title}</strong>

        <span>{evidence.type}</span>

      </div>

      <span className="zoom-icon">
        <Search size={16} />
      </span>

    </button>
  );
}