"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Lock, Lightbulb } from "lucide-react";
import { completeLesson, getActiveCase, type CaseSummary } from "@/lib/api";

export default function MiniLesson() {
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getActiveCase()
      .then(({ case: data, progress }) => { setCaseData(data); setCompleted(progress?.completedStages?.includes("LEARN") ?? false); })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load lesson."))
      .finally(() => setLoading(false));
  }, []);

  async function finishLesson() {
    if (!caseData) return;

    // If the lesson was already completed, continue directly to the exercise.
    if (completed) {
      router.push("/exercise");
      return;
    }

    try {
      // Keep the existing backend progress update unchanged.
      await completeLesson(caseData.id);
      setCompleted(true);
      router.push("/exercise");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save lesson progress.");
    }
  }

  if (loading) return <main className="lesson-page"><section className="lesson-content"><div className="lesson-label">MINI LESSON</div><h1 className="lesson-title">LOADING CASE CONCEPT...</h1></section></main>;
  if (error || !caseData) return <main className="lesson-page"><section className="lesson-content"><div className="lesson-label">MINI LESSON</div><h1 className="lesson-title">UNABLE TO LOAD LESSON</h1><p className="lesson-subtitle">{error || "The case is unavailable."}</p></section></main>;

  const lesson = caseData.lesson;

  return (
    <main className="lesson-page">
      <aside className="lesson-progress">
        <div className="lesson-progress-title">LESSON PROGRESS</div>
        <div className="progress-step active"><div className="progress-icon"><BookOpen size={21} /></div><div className="progress-info"><div className="progress-name">CONCEPT</div><div className="progress-description">Understand<br />the basics</div></div></div>
        <div className="progress-line" />
        <div className={`progress-step ${completed ? "active" : ""}`}><div className={`progress-icon ${completed ? "" : "locked"}`}>{completed ? <BookOpen size={21} /> : <Lock size={19} />}</div><div className="progress-info"><div className="progress-name">EXERCISE</div><div className="progress-description">Apply what<br />you learned</div></div></div>
        <div className="progress-line" />
        <div className="progress-step"><div className="progress-icon locked"><Lock size={19} /></div><div className="progress-info"><div className="progress-name">CODE LAB</div><div className="progress-description">Solve the<br />case</div></div></div>
      </aside>
      <section className="lesson-content">
        <div className="lesson-label">MINI LESSON</div>
        <h1 className="lesson-title">{lesson.title}</h1>
        <p className="lesson-subtitle">{lesson.subtitle}</p>
        <div className="lesson-clue"><div className="clue-heading"><Lightbulb size={19} /> CLUE</div><div className="clue-content"><p>{lesson.clue}</p><p>CASE CONCEPT: <span className="red-text">{caseData.concept.toUpperCase()}</span></p><p>OBJECTIVE: {caseData.objective}</p></div><div className="clue-decoration"><div className="clue-folder"><div className="clue-magnifier" /></div></div></div>
        <div className="lesson-section-title"><span /><h2>KEY IDEAS</h2><span /></div>
        <div className="modifier-grid">{lesson.sections.map((section) => <div className="modifier-card" key={section.title}><div className="modifier-icon"><BookOpen size={42} /></div><h3>{section.title}</h3><div className="modifier-divider" /><p>{section.description}</p></div>)}</div>
        <div className="lesson-clue"><div className="clue-heading"><Lightbulb size={19} /> DETECTIVE HINT</div><div className="clue-content"><p>{lesson.hint}</p></div></div>
        {error && <div className="lesson-clue"><div className="clue-content"><p className="red-text">{error}</p></div></div>}
        <div className="lesson-navigation"><Link href="/evidence" className="lesson-back-button"><ArrowLeft size={20} /> BACK TO EVIDENCE TRAIL</Link><button onClick={finishLesson} className="lesson-continue-button">{completed ? "LESSON COMPLETED" : "COMPLETE LESSON"} <ArrowRight size={21} /></button></div>
      </section>
    </main>
  );
}
