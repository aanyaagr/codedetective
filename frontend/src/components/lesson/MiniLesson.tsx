"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Check, Code2, Lock, Lightbulb, PenLine } from "lucide-react";
import { completeLesson } from "@/lib/api";
import { useActiveCase } from "@/lib/useActiveCase";
import { CaseFileStatus, SignInGate } from "@/components/ui/SignInGate";

export default function MiniLesson() {
  const router = useRouter();
  const { signedOut, loading, error, data, setData, reload } = useActiveCase();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (signedOut) return <main className="lesson-page lesson-page-single"><SignInGate title="SIGN IN TO STUDY THE CASE" /></main>;
  if (loading || error || !data) return <main className="lesson-page lesson-page-single"><CaseFileStatus loading={loading} error={error} onRetry={reload} /></main>;

  const caseData = data.case;
  const lesson = caseData.lesson || ({} as typeof caseData.lesson);
  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  const stages = data.progress?.completedStages || [];
  const completed = stages.includes("LEARN");
  const exerciseDone = stages.includes("EVIDENCE") || data.progress?.completed === true;

  async function finishLesson() {
    if (completed) { router.push("/exercise"); return; }
    setSaving(true);
    setSaveError("");
    try {
      const r = await completeLesson(caseData.id);
      setData((d) => ({ ...d, progress: r.progress }));
      router.push("/exercise");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unable to save lesson progress.");
      setSaving(false);
    }
  }

  return (
    <main className="lesson-page">
      <aside className="lesson-progress">
        <div className="lesson-progress-title">LESSON PROGRESS</div>
        <div className="lesson-case-ref">CASE #{caseData.number}<br /><strong>{caseData.title}</strong></div>
        <div className={`progress-step ${completed ? "done" : "active"}`}>
          <div className="progress-icon">{completed ? <Check size={20} /> : <BookOpen size={21} />}</div>
          <div className="progress-info"><div className="progress-name">CONCEPT</div><div className="progress-description">Understand<br />the basics</div></div>
        </div>
        <div className="progress-line" />
        <Link href="/exercise" className={`progress-step ${exerciseDone ? "done" : completed ? "active" : ""}`} aria-disabled={!completed} onClick={(e) => { if (!completed) e.preventDefault(); }}>
          <div className={`progress-icon ${completed ? "" : "locked"}`}>{exerciseDone ? <Check size={20} /> : completed ? <PenLine size={20} /> : <Lock size={19} />}</div>
          <div className="progress-info"><div className="progress-name">EXERCISE</div><div className="progress-description">Apply what<br />you learned</div></div>
        </Link>
        <div className="progress-line" />
        <Link href="/code-lab" className={`progress-step ${exerciseDone ? "done" : ""}`} aria-disabled={!completed} onClick={(e) => { if (!completed) e.preventDefault(); }}>
          <div className={`progress-icon ${completed ? "" : "locked"}`}>{completed ? <Code2 size={20} /> : <Lock size={19} />}</div>
          <div className="progress-info"><div className="progress-name">CODE LAB</div><div className="progress-description">Solve the<br />case</div></div>
        </Link>
      </aside>

      <section className="lesson-content">
        <div className="lesson-label">MINI LESSON · CASE #{caseData.number}</div>
        <h1 className="lesson-title">{lesson.title || caseData.concept.toUpperCase()}</h1>
        <p className="lesson-subtitle">{lesson.subtitle || `Your investigation points toward ${caseData.concept}.`}</p>
        <div className="lesson-clue">
          <div className="clue-heading"><Lightbulb size={19} /> CLUE</div>
          <div className="clue-content">
            {lesson.clue && <p>{lesson.clue}</p>}
            <p>CASE CONCEPT: <span className="red-text">{caseData.concept.toUpperCase()}</span></p>
            <p>OBJECTIVE: {caseData.objective}</p>
          </div>
          <div className="clue-decoration"><div className="clue-folder"><div className="clue-magnifier" /></div></div>
        </div>
        {sections.length > 0 && (
          <>
            <div className="lesson-section-title"><span /><h2>KEY IDEAS</h2><span /></div>
            <div className="modifier-grid">
              {sections.map((section) => (
                <div className="modifier-card" key={section.title}>
                  <div className="modifier-icon"><BookOpen size={42} /></div>
                  <h3>{section.title}</h3>
                  <div className="modifier-divider" />
                  <p>{section.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
        {lesson.hint && <div className="lesson-clue"><div className="clue-heading"><Lightbulb size={19} /> DETECTIVE HINT</div><div className="clue-content"><p>{lesson.hint}</p></div></div>}
        {saveError && <div className="lesson-clue"><div className="clue-content"><p className="red-text">{saveError}</p></div></div>}
        <div className="lesson-navigation">
          <Link href="/evidence" className="lesson-back-button"><ArrowLeft size={20} /> BACK TO EVIDENCE TRAIL</Link>
          <button onClick={finishLesson} disabled={saving} className="lesson-continue-button">
            {saving ? "SAVING..." : completed ? "CONTINUE TO EXERCISE" : "COMPLETE LESSON"} <ArrowRight size={21} />
          </button>
        </div>
      </section>
    </main>
  );
}
