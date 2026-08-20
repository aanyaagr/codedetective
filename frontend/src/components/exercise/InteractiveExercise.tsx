"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  FileText,
  Terminal,
  Clock3,
  Lightbulb,
  Target,
  RotateCcw,
  Play,
  CheckCircle2,
  MessageCircle,
  Lock,
  Fingerprint,
  Code2,
  Shield,
} from "lucide-react";

const codeLines = [
  "int findMax(int arr[], int n) {",
  "",
  "    int max = 0;",
  "",
  "    for(int i = 0; i < n; i++) {",
  "        if(arr[i] < max)",
  "            max = arr[i];",
  "    }",
  "",
  "    return max;",
  "}",
];

const testCases = [
  {
    id: "01",
    input: "[3, 7, 2, 9]",
    expected: "9",
    actual: "10",
    passed: false,
  },
  {
    id: "02",
    input: "[17, 4, 8]",
    expected: "17",
    actual: "17",
    passed: true,
  },
  {
    id: "03",
    input: "[5, 5, 2]",
    expected: "5",
    actual: "5",
    passed: true,
  },
  {
    id: "04",
    input: "[-4, -2, -8]",
    expected: "-2",
    actual: "0",
    passed: false,
  },
];

export default function InteractiveExercise() {
  const [selectedLine, setSelectedLine] = useState(6);
  const [hintVisible, setHintVisible] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  return (
    <main className="exercise-page">

      {/* =====================================
          TOP CASE HEADER
      ===================================== */}

      <header className="exercise-topbar">

        <div className="exercise-case">

          <div className="exercise-fingerprint">
            <Fingerprint size={42} />
          </div>

          <div>
            <span className="case-number">
              CASE #001
            </span>

            <h2>
              THE MISSING ALGORITHM
            </h2>
          </div>

        </div>


        <div className="exercise-title">

          <span className="exercise-kicker">
            INTERACTIVE EXERCISE
          </span>

          <h1>
            DEBUG THE SUSPECT
          </h1>

          <p>
            The evidence suggests the algorithm is producing an incorrect result.
          </p>

          <strong>
            FIND THE BUG. REPAIR THE CODE. SOLVE THE CASE.
          </strong>

        </div>


        {/* XP */}

        <div className="exercise-xp">

          <div className="xp-badge">
            XP
          </div>

          <div className="xp-information">

            <div className="xp-number">
              <strong>1,250</strong>
              <span>/ 2,000 XP</span>
            </div>

            <div className="xp-progress">
              <div />
            </div>

            <span className="xp-percent">
              62%
            </span>

          </div>

          <div className="rank">
            <span>RANK</span>
            <strong>ROOKIE</strong>
          </div>

        </div>

      </header>


      {/* =====================================
          MAIN GRID
      ===================================== */}

      <section className="exercise-grid">


        {/* =====================================
            LEFT COLUMN
        ===================================== */}

        <aside className="exercise-left">


          {/* CASE EVIDENCE */}

          <div className="exercise-panel evidence-panel">

            <h3>
              <Briefcase size={18} />
              CASE EVIDENCE
            </h3>


            <div className="evidence-mini-card">

              <FileText size={25} />

              <div>
                <strong>ALGORITHM SPEC</strong>
                <span>Document</span>
              </div>

              <p>
                Return the largest
                value in the array.
              </p>

              <small>
                Spec v4.2
              </small>

            </div>


            <div className="evidence-mini-card">

              <Terminal size={25} />

              <div>
                <strong>CORRUPTED OUTPUT</strong>
                <span>System Log</span>
              </div>

              <p>
                <em>Expected: 42</em>
                <br />
                <b>Received: 17</b>
              </p>

              <small>
                Mismatch detected
                in all nodes.
              </small>

            </div>


            <div className="evidence-mini-card">

              <Clock3 size={25} />

              <div>
                <strong>TIMELINE CLUE</strong>
                <span>System Event</span>
              </div>

              <p>
                Anomalous process
                executed 2 min
                before crash.
              </p>

            </div>

          </div>


          {/* TIP */}

          <div className="exercise-tip">

            <div className="tip-title">
              <Lightbulb size={18} />
              TIP
            </div>

            <p>
              Read the evidence
              carefully. The bug is
              hiding in plain sight.
            </p>

          </div>

        </aside>


        {/* =====================================
            CENTER COLUMN
        ===================================== */}

        <section className="exercise-center">


          {/* CODE PANEL */}

          <div className="code-panel">

            <div className="code-header">

              <h3>
                SUSPECT CODE
              </h3>

              <span>
                findMax.cpp
              </span>

            </div>


            <div className="code-editor">

              {codeLines.map((line, index) => {

                const lineNumber = index + 1;

                return (
                  <button
                    key={lineNumber}
                    className={`code-line ${
                      selectedLine === lineNumber
                        ? "selected-code-line"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedLine(lineNumber)
                    }
                  >

                    <span className="line-number">
                      {String(lineNumber).padStart(2, "0")}
                    </span>

                    <code>
                      {line}
                    </code>

                  </button>
                );

              })}

            </div>


            {/* LEGEND */}

            <div className="code-legend">

              <span>
                <i className="legend-red" />
                Select the suspicious line
              </span>

              <span>
                <i className="legend-yellow" />
                Repair the code
              </span>

              <span>
                <i className="legend-green" />
                Run the code
              </span>

            </div>

          </div>


          {/* ACTION BAR */}

          <div className="exercise-actions">

            <button
              className="exercise-action reset"
              onClick={() => {
                setSelectedLine(6);
                setHintVisible(false);
                setHasRun(false);
              }}
            >
              <RotateCcw size={21} />

              <span>
                RESET
                <small>
                  Clear selection
                </small>
              </span>

            </button>


            <button
              className="exercise-action hint"
              onClick={() => setHintVisible(!hintVisible)}
            >
              <Lightbulb size={21} />

              <span>
                HINT
                <small>
                  Get a subtle hint
                </small>
              </span>

            </button>


            <button
              className="exercise-action run"
              onClick={() => setHasRun(true)}
            >
              <Play size={22} fill="currentColor" />

              <span>
                RUN CODE
                <small>
                  Test your fix
                </small>
              </span>

            </button>


            <button
  className="exercise-action submit"
  disabled={!hasRun}
  onClick={() => {
    alert("FIX SUBMITTED — INVESTIGATION COMPLETE!");
  }}
>
  <CheckCircle2 size={21} />

  <span>
    SUBMIT FIX
    <small>
      Verify solution
    </small>
  </span>
</button>

          </div>


          {/* HINT */}

          {hintVisible && (
            <div className="exercise-hint">

              <Lightbulb size={20} />

              <div>
                <strong>DETECTIVE TIP</strong>

                <p>
                  Think about what happens when every
                  value in the array is negative.
                </p>
              </div>

            </div>
          )}


          {/* BACK */}

          <Link
            href="/lesson"
            className="exercise-back"
          >
            <ArrowLeft size={18} />
            BACK TO MINI LESSON
          </Link>

        </section>


        {/* =====================================
            RIGHT COLUMN
        ===================================== */}

        <aside className="exercise-right">


          {/* MISSION */}

          <div className="exercise-panel mission-panel">

            <h3>
              <Target size={18} />
              YOUR MISSION
            </h3>

            <div className="mission-step active">

              <span>1</span>

              <div>
                <strong>IDENTIFY</strong>

                <p>
                  Click the line you believe
                  contains the bug.
                </p>
              </div>

            </div>


            <div className="mission-step active">

              <span>2</span>

              <div>
                <strong>REPAIR</strong>

                <p>
                  Fix the incorrect logic.
                </p>
              </div>

            </div>


            <div className="mission-step">

              <span>3</span>

              <div>
                <strong>VERIFY</strong>

                <p>
                  Run the code and check
                  the test cases.
                </p>
              </div>

            </div>

          </div>


          {/* TEST CASES */}

          <div className="exercise-panel tests-panel">

            <h3>
              TEST CASES
            </h3>

            <div className="test-heading">
              <span>INPUT ARRAY</span>
              <span>EXPECTED</span>
              <span>ACTUAL</span>
            </div>

            {testCases.map((test) => (

              <div
                key={test.id}
                className="test-row"
              >

                <span>{test.id}</span>

                <code>
                  {test.input}
                </code>

                <span>
                  {test.expected}
                </span>

                <strong
                  className={
                    test.passed
                      ? "test-pass"
                      : "test-fail"
                  }
                >
                  {test.actual}
                </strong>

                {test.passed ? (
                  <CheckCircle2
                    size={18}
                    className="test-pass"
                  />
                ) : (
                  <span className="test-x">
                    ×
                  </span>
                )}

              </div>

            ))}

          </div>


          {/* DETECTIVE ASSISTANT */}

          <div className="assistant-panel">

            <div className="assistant-character">
              🕵️
            </div>

            <div>

              <h3>
                DETECTIVE ASSISTANT
              </h3>

              <p>
                Need a hint?
                <br />
                I can help you think
                like a real detective.
              </p>

              <button
                onClick={() => setHintVisible(true)}
              >
                <MessageCircle size={16} />
                ASK FOR HINT
              </button>

            </div>

          </div>


          {/* NEXT */}
<Link
  href="/code-lab"
  className="continue-code-button"
>
  CONTINUE TO CODE LAB
  <ArrowRight size={18} />
</Link>
        </aside>

      </section>

    </main>
  );
}