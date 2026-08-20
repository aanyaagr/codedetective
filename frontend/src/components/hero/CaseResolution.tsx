"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  FileText,
  Link2,
  Puzzle,
  Search,
  Star,
  Target,
  Timer,
  Trophy,
  BookOpen,
} from "lucide-react";

export default function CaseResolution() { 
    const router = useRouter();
  return (
    <main className="resolution-page">

      {/* =========================
          TOP NAVIGATION
      ========================= */}

      <nav className="resolution-nav">

        <div className="resolution-brand">
          <div className="brand-fingerprint">◎</div>
          <span>CODEDETECTIVE</span>
        </div>

        <div className="resolution-nav-links">

          <Link href="/case-board">
            CASE BOARD
          </Link>

          <Link href="/evidence">
            EVIDENCE TRAIL
          </Link>

          <Link href="/lesson">
            LESSON
          </Link>

          <Link href="/exercise">
            EXERCISE
          </Link>

          <Link href="/code-lab">
            CODE LAB
          </Link>

          <span className="resolution-active">
            RESOLUTION
          </span>

        </div>

        <div className="resolution-xp">

          <div>
            <span>XP</span>
            <strong>1,750 / 2,000 XP</strong>

            <div className="resolution-xp-bar">
              <div style={{ width: "87%" }} />
            </div>
          </div>

          <div className="resolution-xp-percent">
            87%
          </div>

          <div className="resolution-rank">
            <span>ROOKIE</span>
            <small>RANK</small>
          </div>

        </div>

      </nav>


      {/* =========================
          CASE INFO
      ========================= */}

      <section className="resolution-case-info">

        <span>CASE #001</span>

        <h2>THE MISSING ALGORITHM</h2>

        <p>
          <strong>Difficulty:</strong> Beginner
        </p>

      </section>


      {/* =========================
          CASE CLOSED HERO
      ========================= */}

      <section className="resolution-hero">

        <div className="resolution-check">
          <Check size={56} strokeWidth={2.5} />
        </div>

        <h1>CASE CLOSED</h1>

        <div className="resolution-divider">
          <span />
          <Star size={13} fill="currentColor" />
          <span />
        </div>

        <h3>INVESTIGATION COMPLETE</h3>

        <p>
          You found the source of the corruption
          <br />
          and repaired the code.
        </p>

      </section>


      {/* =========================
          ROOT CAUSE + FIX
      ========================= */}

      <section className="resolution-results">

        {/* ROOT CAUSE */}

        <div className="resolution-result">

          <div className="resolution-section-title">

            <Search size={19} />

            <span>THE ROOT CAUSE</span>

          </div>

          <div className="resolution-red-line" />

          <h2>Incorrect Max Initialization</h2>

          <p>
            The algorithm initialized <code>max</code> with
            <strong> 0 </strong>
            instead of the first element of the array.
          </p>

          <p>
            This caused incorrect results when all numbers
            in the array were negative.
          </p>

        </div>


        {/* YOUR FIX */}

        <div className="resolution-result">

          <div className="resolution-section-title">

            <Code2 size={19} />

            <span>YOUR FIX</span>

          </div>

          <div className="resolution-red-line" />

          <span className="code-label before">
            BEFORE
          </span>

          <div className="resolution-code">
            int max = 0;
          </div>

          <div className="resolution-arrow">
            ↓
          </div>

          <span className="code-label after">
            AFTER
          </span>

          <div className="resolution-code fixed">
            int max = arr[0];
          </div>

          <div className="tests-passed">

            <Check size={16} />

            <span>TESTS PASSED</span>

            <strong>4 / 4</strong>

          </div>

        </div>

      </section>


      {/* =========================
          INVESTIGATION JOURNEY
      ========================= */}

      <section className="resolution-journey">

        <div className="journey-heading">

          <span />

          <h2>INVESTIGATION JOURNEY</h2>

          <span />

        </div>


        <div className="journey-track">

          {/* EVIDENCE */}

          <div className="journey-step completed">

            <div className="journey-icon">
              <Search size={21} />
            </div>

            <strong>Evidence</strong>

            <span>Collected</span>

            <small>3 / 3</small>

          </div>


          <div className="journey-line red" />


          {/* CONNECT */}

          <div className="journey-step completed">

            <div className="journey-icon">
              <Link2 size={21} />
            </div>

            <strong>Evidence</strong>

            <span>Connected</span>

            <small>3 / 3</small>

          </div>


          <div className="journey-line gold" />


          {/* LESSON */}

          <div className="journey-step completed">

            <div className="journey-icon">
              <BookOpen size={21} />
            </div>

            <strong>Lesson</strong>

            <span>Completed</span>

            <small>
              <Check size={14} />
            </small>

          </div>


          <div className="journey-line gold" />


          {/* EXERCISE */}

          <div className="journey-step completed">

            <div className="journey-icon">
              <Puzzle size={21} />
            </div>

            <strong>Exercise</strong>

            <span>Completed</span>

            <small>
              <Check size={14} />
            </small>

          </div>


          <div className="journey-line green" />


          {/* CASE */}

          <div className="journey-step solved">

            <div className="journey-icon">
              <Star size={21} />
            </div>

            <strong>Case</strong>

            <span>Solved</span>

          </div>

        </div>

      </section>


      {/* =========================
          REWARD STATS
      ========================= */}

      <section className="resolution-stats">

        <div className="resolution-stat">

          <Star size={23} />

          <div>
            <strong>+500 XP</strong>
            <span>CASE COMPLETED</span>
          </div>

        </div>


        <div className="resolution-stat">

          <Target size={23} />

          <div>
            <strong>100%</strong>
            <span>ACCURACY</span>
          </div>

        </div>


        <div className="resolution-stat">

          <Timer size={23} />

          <div>
            <strong>12:42</strong>
            <span>TIME TAKEN</span>
          </div>

        </div>

      </section>


      {/* =========================
          ACTIONS
      ========================= */}

      <section className="resolution-actions">

        <Link
          href="/case-board"
          className="resolution-secondary-button"
        >
          <ArrowLeft size={17} />
          VIEW CASE BOARD
        </Link>


        <button
  className="resolution-secondary-button"
  onClick={() => router.push("/resolution/report")}
>
  <FileText size={18} />
  VIEW FULL CASE REPORT
</button>


        <Link
          href="/case-board"
          className="resolution-primary-button"
        >
          CONTINUE TO NEXT CASE
          <ArrowRight size={18} />
        </Link>

      </section>

    </main>
  );
}