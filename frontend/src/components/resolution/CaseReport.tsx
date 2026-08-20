"use client";

import {
  ArrowLeft,
  Check,
  FileText,
  Search,
  Code2,
  Star,
  Target,
  Timer,
  BookOpen,
  Link2,
  Puzzle,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

const testCases = [
  {
    id: 1,
    input: "[3, 7, 2, 9]",
    expected: "9",
    output: "9",
  },
  {
    id: 2,
    input: "[17, 4, 8]",
    expected: "17",
    output: "17",
  },
  {
    id: 3,
    input: "[-4, -2, -8]",
    expected: "-2",
    output: "-2",
  },
  {
    id: 4,
    input: "[5, 5, 2]",
    expected: "5",
    output: "5",
  },
];

const evidence = [
  {
    title: "Algorithm Spec",
    file: "algorithmspec.txt",
    icon: "▤",
  },
  {
    title: "Corrupted Output",
    file: "corrupted_output.log",
    icon: ">_",
  },
  {
    title: "Test Cases",
    file: "testcases.json",
    icon: "</>",
  },
  {
    title: "Timeline Clue",
    file: "timeline.txt",
    icon: "◷",
  },
];

export default function CaseReport() {
  const router = useRouter();

  return (
    <main className="case-report-page">

      {/* =========================================
          TOP NAVIGATION
      ========================================= */}

      <header className="report-nav">

        <div
          className="report-brand"
          onClick={() => router.push("/")}
        >
          <span className="brand-symbol">◎</span>
          <span>CODEDETECTIVE</span>
        </div>

        <nav className="report-links">

          <button onClick={() => router.push("/case-board")}>
            CASE BOARD
          </button>

          <button onClick={() => router.push("/evidence")}>
            EVIDENCE TRAIL
          </button>

          <button onClick={() => router.push("/lesson")}>
            LESSON
          </button>

          <button onClick={() => router.push("/exercise")}>
            EXERCISE
          </button>

          <button onClick={() => router.push("/code-lab")}>
            CODE LAB
          </button>

          <button className="active">
            RESOLUTION
          </button>

        </nav>

        <div className="report-xp">

          <div>
            <span className="xp-label">
              XP
            </span>

            <strong>
              1,750 / 2,000 XP
            </strong>
          </div>

          <div className="xp-progress">
            <span />
          </div>

          <span className="xp-percent">
            87%
          </span>

          <div className="rank">
            <small>
              RANK
            </small>

            <strong>
              ROOKIE
            </strong>
          </div>

        </div>

      </header>


      {/* =========================================
          REPORT CONTAINER
      ========================================= */}

      <section className="report-container">

        {/* =========================================
            REPORT HEADER
        ========================================= */}

        <div className="report-heading">

          <div>

            <div className="report-kicker">
              CASE REPORT
            </div>

            <div className="case-number">
              CASE #001
            </div>

            <h1>
              THE MISSING ALGORITHM
            </h1>

            <p>
              Investigation completed on 20 Aug 2026
            </p>

          </div>


          <div className="solved-badge">

            <div className="solved-icon">
              <Check size={20} />
            </div>

            <div>
              <small>
                CASE STATUS
              </small>

              <strong>
                SOLVED
              </strong>
            </div>

          </div>

        </div>


        {/* =========================================
            REPORT GRID
        ========================================= */}

        <div className="report-grid">


          {/* =====================================
              CASE SUMMARY
          ===================================== */}

          <section className="report-card summary-card">

            <ReportTitle
              icon="≡"
              title="CASE SUMMARY"
            />

            <div className="summary-content">

              <p>
                The algorithm failed for certain inputs
                due to incorrect initialization. You
                analyzed the evidence, learned the concept,
                identified the bug, and fixed the code
                successfully.
              </p>

              <div className="fingerprint">
                <div className="fingerprint-inner">
                  ◉
                </div>
              </div>

            </div>

          </section>


          {/* =====================================
              PERFORMANCE
          ===================================== */}

          <section className="report-card">

            <ReportTitle
              icon="▥"
              title="PERFORMANCE OVERVIEW"
            />

            <div className="performance-list">

              <PerformanceRow
                icon="◉"
                label="Evidence Connected"
                value="4 / 5"
              />

              <PerformanceRow
                icon="◉"
                label="Mini Lesson"
                value="Completed"
                green
              />

              <PerformanceRow
                icon="⌘"
                label="Exercise"
                value="Completed"
                green
              />

              <PerformanceRow
                icon="✓"
                label="Code Lab"
                value="4 / 4 Tests Passed"
                green
              />

              <PerformanceRow
                icon="!"
                label="Hints Used"
                value="1"
              />

            </div>

          </section>


          {/* =====================================
              ROOT CAUSE
          ===================================== */}

          <section className="report-card">

            <ReportTitle
              icon="⌕"
              title="ROOT CAUSE"
            />

            <h2 className="cause-title">
              Incorrect Max Initialization
            </h2>

            <p className="cause-description">
              The variable{" "}
              <span className="code-highlight">
                max
              </span>{" "}
              was initialized with{" "}
              <span className="code-highlight">
                0
              </span>{" "}
              instead of the first element of the
              array, causing incorrect results when
              all numbers were negative.
            </p>

          </section>


          {/* =====================================
              YOUR FIX
          ===================================== */}

          <section className="report-card">

            <ReportTitle
              icon="</>"
              title="YOUR FIX"
            />

            <div className="code-label">
              BEFORE
            </div>

            <div className="code-box">
              int max = 0;
            </div>

            <div className="fix-arrow">
              ↓
            </div>

            <div className="code-label after">
              AFTER
            </div>

            <div className="code-box fixed">
              int max = arr[0];
            </div>

            <div className="tests-passed">

              <Check size={16} />

              <span>
                TESTS PASSED
              </span>

              <strong>
                4 / 4
              </strong>

            </div>

          </section>


          {/* =====================================
              TEST CASE RESULTS
          ===================================== */}

          <section className="report-card test-card">

            <ReportTitle
              icon="⌬"
              title="TEST CASE RESULTS"
            />

            <div className="test-table">

              <div className="test-header">

                <span>
                  Test Case
                </span>

                <span>
                  Input
                </span>

                <span>
                  Expected
                </span>

                <span>
                  Your Output
                </span>

                <span>
                  Result
                </span>

              </div>


              {testCases.map((test) => (

                <div
                  className="test-row"
                  key={test.id}
                >

                  <span>
                    {test.id}
                  </span>

                  <span className="test-input">
                    {test.input}
                  </span>

                  <span>
                    {test.expected}
                  </span>

                  <span>
                    {test.output}
                  </span>

                  <span className="pass">
                    <Check size={15} />
                  </span>

                </div>

              ))}

            </div>

          </section>


          {/* =====================================
              EVIDENCE CONNECTED
          ===================================== */}

          <section className="report-card evidence-card">

            <ReportTitle
              icon="⌁"
              title="EVIDENCE CONNECTED"
            />

            <div className="evidence-grid">

              {evidence.map((item) => (

                <div
                  className="evidence-item"
                  key={item.title}
                >

                  <div className="evidence-icon">
                    {item.icon}
                  </div>

                  <div className="evidence-check">
                    <Check size={12} />
                  </div>

                  <strong>
                    {item.title}
                  </strong>

                  <small>
                    {item.file}
                  </small>

                </div>

              ))}

            </div>

          </section>


          {/* =====================================
              INVESTIGATION METRICS
          ===================================== */}

          <section className="report-card metrics-card">

            <ReportTitle
              icon="◎"
              title="INVESTIGATION METRICS"
            />

            <div className="metrics-grid">

              <Metric
                value="92%"
                label="OVERALL SCORE"
                icon="☆"
              />

              <Metric
                value="+500 XP"
                label="EARNED"
                icon="◎"
              />

              <Metric
                value="12:42"
                label="TIME TAKEN"
                icon="◷"
              />

            </div>

          </section>

        </div>


        {/* =========================================
            BOTTOM ACTIONS
        ========================================= */}

        <div className="report-actions">

          <Link
            href="/resolution"
            className="report-download"
          >
            <ArrowLeft size={17} />
            BACK TO CASE RESOLUTION
          </Link>


          <button
            className="report-download"
            onClick={() => {
              alert(
                "PDF report generation will be connected to the backend."
              );
            }}
          >
            <FileText size={17} />
            DOWNLOAD REPORT (PDF)
          </button>


          <button
            className="next-case"
            onClick={() => router.push("/case-board")}
          >
            CONTINUE TO NEXT CASE
            <span>
              →
            </span>
          </button>

        </div>

      </section>

    </main>
  );
}


/* =============================================
   REPORT TITLE
============================================= */

function ReportTitle({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <div className="report-title">

      <span className="report-title-icon">
        {icon}
      </span>

      <span>
        {title}
      </span>

    </div>
  );
}


/* =============================================
   PERFORMANCE ROW
============================================= */

function PerformanceRow({
  icon,
  label,
  value,
  green = false,
}: {
  icon: string;
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="performance-row">

      <div className="performance-label">

        <span className="performance-icon">
          {icon}
        </span>

        <span>
          {label}
        </span>

      </div>

      <strong
        className={green ? "green-text" : ""}
      >
        {value}
      </strong>

    </div>
  );
}


/* =============================================
   METRIC
============================================= */

function Metric({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="metric">

      <span className="metric-icon">
        {icon}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        {label}
      </small>

    </div>
  );
}