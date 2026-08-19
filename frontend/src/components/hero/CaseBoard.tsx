"use client";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  Star,
  FolderOpen,
  Lock,
  ArrowRight,
  Clock3,
  Fingerprint,
  FileSearch,
  MapPin,
  Shield,
} from "lucide-react";

export default function CaseBoard() {
  return (
    <section className="case-board">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="case-board-header">

        <div className="case-board-heading">
          <div className="case-board-kicker">
            <span className="case-board-kicker-line" />
            INVESTIGATION BOARD
            <span className="case-board-kicker-line" />
          </div>

          <h2>CASE BOARD</h2>

          <p>SELECT YOUR NEXT INVESTIGATION</p>
        </div>


        {/* DETECTIVE STATUS */}

        <div className="detective-status">

          <div className="detective-status-icon">
            <Shield size={28} />
          </div>

          <div className="detective-status-info">

            <span className="detective-status-label">
              DETECTIVE STATUS
            </span>

            <div className="detective-rank">
              RANK:
              <strong>ROOKIE</strong>
            </div>

            <div className="xp-row">
              <span>XP: 1,250 / 2,000</span>
              <span>62%</span>
            </div>

            <div className="xp-bar">
              <div className="xp-progress" />
            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          MAIN CASE AREA
      ========================================= */}

      <div className="case-main-layout">


        {/* =====================================
            LEFT — CASE DOSSIER
        ===================================== */}

        <div className="case-dossier">

          {/* Red investigation thread */}

          <div className="case-thread case-thread-one" />
          <div className="case-thread case-thread-two" />


          {/* Paper stack */}

          <div className="dossier-paper dossier-paper-back" />

          <div className="dossier-paper">

            {/* Top row */}

            <div className="dossier-top">

              <div className="case-number">
                CASE FILE
                <span>#001</span>
              </div>

              <div className="case-status">
                <span />
                UNSOLVED
              </div>

            </div>


            {/* Main dossier content */}

            <div className="dossier-content">

              <div className="dossier-copy">

                <div className="classified-stamp">
                  CLASSIFIED
                </div>

                <h3>
                  THE MISSING
                  <span>ALGORITHM</span>
                </h3>

                <p>
                  A critical algorithm has disappeared from the
                  city&apos;s central data system. The output is
                  corrupted, the logs don&apos;t match, and time
                  is running out.
                </p>

                <p className="dossier-highlight">
                  Find the bug. Restore the truth.
                </p>

              </div>


              {/* Case Image */}

              <div className="case-photo">

                <div className="photo-pin" />

                <img
                  src="/hero-noir.png"
                  alt="Case evidence"
                />

                <div className="photo-caption">
                  CENTRAL DATA SYSTEM
                  <span>02:47 AM</span>
                </div>

              </div>

            </div>


            {/* Dossier stats */}

            <div className="dossier-stats">

              <div className="dossier-stat">

                <Shield size={25} />

                <div>
                  <span>DIFFICULTY</span>
                  <strong>ROOKIE</strong>

                  <div className="difficulty-bars">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>

              </div>


              <div className="dossier-stat">

                <Clock3 size={25} />

                <div>
                  <span>EST. TIME</span>
                  <strong>15 MIN</strong>
                </div>

              </div>


              <div className="dossier-stat">

                <Star size={27} />

                <div>
                  <span>REWARD</span>
                  <strong>+500 XP</strong>
                </div>

              </div>

            </div>


            {/* Buttons */}

            <div className="dossier-actions">

              <Link href="/evidence" className="begin-investigation">

  <Fingerprint size={21} />

  BEGIN INVESTIGATION

  <ArrowRight size={21} />

</Link>

              <button className="case-details-button">

                <FileSearch size={18} />

                VIEW CASE DETAILS

              </button>

            </div>

          </div>

        </div>


        {/* =====================================
            RIGHT — CASE INTEL
        ===================================== */}

        <div className="case-intel">


          {/* CASE INTEL STATS */}

          <div className="intel-panel">

            <div className="panel-title">
              CASE INTEL
            </div>

            <div className="intel-stats">

              <div className="intel-stat">

                <AlertTriangle />

                <span>THREAT LEVEL</span>

                <div className="threat-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i className="empty" />
                  <i className="empty" />
                  <i className="empty" />
                </div>

                <strong>70%</strong>

              </div>


              <div className="intel-stat">

                <CalendarDays />

                <span>EST. TIME</span>

                <strong>15 MIN</strong>

              </div>


              <div className="intel-stat">

                <Star />

                <span>REWARD</span>

                <strong>+500 XP</strong>

              </div>


              <div className="intel-stat">

                <FolderOpen />

                <span>EVIDENCE</span>

                <strong>0 / 3</strong>

              </div>

            </div>

          </div>


          {/* CASE SUMMARY */}

          <div className="intel-panel summary-panel">

            <div className="panel-title">
              CASE SUMMARY
            </div>

            <p>
              Multiple anomalies detected in the execution
              of a critical algorithm. Output mismatch
              reported across all nodes.
            </p>

            <div className="investigation-seal">
              BUREAU OF CODE
              <br />
              INVESTIGATION
            </div>

          </div>


          {/* INTEL BRIEF */}

          <div className="intel-panel">

            <div className="panel-title">
              INTEL BRIEF
            </div>

            <div className="intel-brief">

              <div>
                <Fingerprint />
                <strong>3</strong>
                <span>ANOMALIES DETECTED</span>
              </div>

              <div>
                <FileSearch />
                <strong>0</strong>
                <span>EVIDENCE RECOVERED</span>
              </div>

              <div>
                <MapPin />
                <strong>CENTRAL</strong>
                <span>DATABASE</span>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          UPCOMING CASES
      ========================================= */}

      <div className="upcoming-cases">

        <div className="upcoming-heading">

          <span />

          <h3>CASES UNDER INVESTIGATION</h3>

          <span />

        </div>


        <div className="case-cards">


          {/* CASE 002 */}

          <div className="locked-case">

            <div
              className="locked-case-image"
              style={{
                backgroundImage:
                  "url('/hero-noir.png')",
              }}
            />

            <div className="locked-overlay" />

            <div className="locked-case-content">

              <span className="locked-number">
                #002
              </span>

              <h4>
                THE CORRUPTED
                <br />
                DATABASE
              </h4>

              <div className="locked-label">
                <Lock size={14} />
                LOCKED
              </div>

              <span className="required">
                REQUIRED: CASE #001
              </span>

            </div>

          </div>


          {/* CASE 003 */}

          <div className="locked-case">

            <div
              className="locked-case-image"
              style={{
                backgroundImage:
                  "url('/hero-noir.png')",
              }}
            />

            <div className="locked-overlay" />

            <div className="locked-case-content">

              <span className="locked-number">
                #003
              </span>

              <h4>
                THE LOOP
                <br />
                PARADOX
              </h4>

              <div className="locked-label">
                <Lock size={14} />
                LOCKED
              </div>

              <span className="required">
                REQUIRED: CASE #002
              </span>

            </div>

          </div>


          {/* CASE 004 */}

          <div className="locked-case">

            <div
              className="locked-case-image"
              style={{
                backgroundImage:
                  "url('/hero-noir.png')",
              }}
            />

            <div className="locked-overlay" />

            <div className="locked-case-content">

              <span className="locked-number">
                #004
              </span>

              <h4>
                THE ACCESS
                <br />
                BREACH
              </h4>

              <div className="locked-label">
                <Lock size={14} />
                LOCKED
              </div>

              <span className="required">
                REQUIRED: CASE #003
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}