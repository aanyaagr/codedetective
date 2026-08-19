"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lock,
  Shield,
  Globe,
  Lightbulb,
} from "lucide-react";

export default function MiniLesson() {
  return (
    <main className="lesson-page">

      {/* =========================================
          LEFT LESSON PROGRESS
      ========================================= */}

      <aside className="lesson-progress">

        <div className="lesson-progress-title">
          LESSON PROGRESS
        </div>

        {/* ACTIVE STEP */}
        <div className="progress-step active">

          <div className="progress-icon">
            <BookOpen size={21} />
          </div>

          <div className="progress-info">
            <div className="progress-name">
              CONCEPT
            </div>

            <div className="progress-description">
              Understand
              <br />
              the basics
            </div>
          </div>

        </div>

        <div className="progress-line" />

        {/* LOCKED STEP */}
        <div className="progress-step">

          <div className="progress-icon locked">
            <Lock size={19} />
          </div>

          <div className="progress-info">
            <div className="progress-name">
              EXERCISE
            </div>

            <div className="progress-description">
              Apply what
              <br />
              you learned
            </div>
          </div>

        </div>

        <div className="progress-line" />

        {/* LOCKED STEP */}
        <div className="progress-step">

          <div className="progress-icon locked">
            <Lock size={19} />
          </div>

          <div className="progress-info">
            <div className="progress-name">
              CODE LAB
            </div>

            <div className="progress-description">
              Solve the
              <br />
              case
            </div>
          </div>

        </div>

      </aside>


      {/* =========================================
          MAIN LESSON CONTENT
      ========================================= */}

      <section className="lesson-content">

        {/* TOP LABEL */}

        <div className="lesson-label">
          MINI LESSON
        </div>


        {/* TITLE */}

        <h1 className="lesson-title">
          UNDERSTAND THE CONCEPT
        </h1>

        <p className="lesson-subtitle">
          Your investigation points toward{" "}
          <span>ACCESS CONTROL.</span>
        </p>


        {/* =====================================
            CLUE CARD
        ===================================== */}

        <div className="lesson-clue">

          <div className="clue-heading">
            <Lightbulb size={19} />
            CLUE
          </div>

          <div className="clue-content">

            <p>
              Employee.salary is marked{" "}
              <span className="red-text">PRIVATE.</span>
            </p>

            <p>
              Manager extends Employee.
            </p>

            <p>
              Manager cannot access salary directly.
            </p>

          </div>

          <div className="clue-decoration">
            <div className="clue-folder">
              <div className="clue-magnifier" />
            </div>
          </div>

        </div>


        {/* =====================================
            SECTION TITLE
        ===================================== */}

        <div className="lesson-section-title">

          <span />

          <h2>
            ACCESS MODIFIERS
          </h2>

          <span />

        </div>


        {/* =====================================
            ACCESS MODIFIER CARDS
        ===================================== */}

        <div className="modifier-grid">

          {/* PRIVATE */}

          <div className="modifier-card private">

            <div className="modifier-icon">
              <Lock size={42} />
            </div>

            <h3>
              PRIVATE
            </h3>

            <div className="modifier-divider" />

            <p>
              Accessible only
              <br />
              within the class
              <br />
              that declares it.
            </p>

          </div>


          {/* PROTECTED */}

          <div className="modifier-card protected">

            <div className="modifier-icon">
              <Shield size={42} />
            </div>

            <h3>
              PROTECTED
            </h3>

            <div className="modifier-divider" />

            <p>
              Accessible within the
              <br />
              class and its
              <br />
              subclasses.
            </p>

          </div>


          {/* PUBLIC */}

          <div className="modifier-card public">

            <div className="modifier-icon">
              <Globe size={42} />
            </div>

            <h3>
              PUBLIC
            </h3>

            <div className="modifier-divider" />

            <p>
              Accessible from
              <br />
              anywhere in the
              <br />
              program.
            </p>

          </div>

        </div>


        {/* =====================================
            BOTTOM NAVIGATION
        ===================================== */}

        <div className="lesson-navigation">

          <Link
            href="/evidence"
            className="lesson-back-button"
          >
            <ArrowLeft size={20} />

            BACK TO EVIDENCE TRAIL
          </Link>


          <Link
            href="/exercise"
            className="lesson-continue-button"
          >
            CONTINUE TO EXERCISE

            <ArrowRight size={21} />

          </Link>

        </div>

      </section>

    </main>
  );
}