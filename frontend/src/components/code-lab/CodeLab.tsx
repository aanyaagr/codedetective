"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Code2,
  FileText,
  Fingerprint,
  Lightbulb,
  Maximize2,
  Play,
  RotateCcw,
  Send,
  Shield,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";

const initialCode = `#include <iostream>
using namespace std;

int findMax(int arr[], int n) {

    int max = arr[0];

    for(int i = 1; i < n; i++) {

        if(arr[i] > max) {
            max = arr[i];
        }
    }

    return max;
}

int main() {
    return 0;
}`;

const testCases = [
  {
    id: 1,
    input: "[3, 7, 2, 9]",
    expected: "9",
    output: "9",
    passed: true,
  },
  {
    id: 2,
    input: "[17, 4, 8]",
    expected: "17",
    output: "17",
    passed: true,
  },
  {
    id: 3,
    input: "[-4, -2, -8]",
    expected: "-2",
    output: "0",
    passed: false,
  },
  {
    id: 4,
    input: "[5, 5, 2]",
    expected: "5",
    output: "5",
    passed: true,
  },
];

export default function CodeLab() {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [selectedLine, setSelectedLine] = useState(5);
  const [running, setRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    { type: "ai" | "user"; text: string }[]
  >([
    {
      type: "ai",
      text:
        "Hey Detective. I'm here to help you solve this case. Ask me about your code, errors, or how to improve your solution.",
    },
  ]);

  const passedTests = testCases.filter((test) => test.passed).length;

  function runCode() {
    setRunning(true);

    setTimeout(() => {
      setRunning(false);
    }, 1000);
  }

  function resetCode() {
    setCode(initialCode);
    setSelectedLine(5);
    setSubmitted(false);
  }

  function askAI(question?: string) {
    const questionText = question || chatInput.trim();

    if (!questionText) return;

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: questionText,
      },
      {
        type: "ai",
        text:
          "Good question. Look closely at how `max` is initialized. What happens when every number in the array is negative? Try reasoning through test case 3 before changing the code.",
      },
    ]);

    setChatInput("");
  }

  function submitSolution() {
    setSubmitted(true);
  }

  return (
    <main className="code-lab-page">

      {/* TOP HEADER */}

      <header className="code-lab-header">

        <div className="code-lab-case">

          <div className="code-lab-fingerprint">
            <Fingerprint size={48} />
          </div>

          <div>
            <div className="case-number">
              CASE #001
            </div>

            <h2>
              THE MISSING ALGORITHM
            </h2>
          </div>

        </div>


        <div className="code-lab-title">

          <div className="code-lab-kicker">
            CODE LAB
          </div>

          <h1>
            SOLVE THE CASE
          </h1>

          <p>
            Write, test and refine your code to solve the mystery.
          </p>

        </div>


        <div className="code-lab-xp">

          <div className="xp-badge">
            XP
          </div>

          <div className="xp-info">

            <div className="xp-number">
              1,250
              <span>/ 2,000 XP</span>
            </div>

            <div className="xp-progress">
              <div style={{ width: "62%" }} />
            </div>

          </div>

          <div className="xp-percent">
            62%
          </div>

          <div className="rank">

            <span>RANK</span>

            <strong>
              ROOKIE
            </strong>

          </div>

        </div>

      </header>


      {/* MAIN WORKSPACE */}

      <section className="code-lab-workspace">


        {/* LEFT COLUMN */}

        <aside className="code-lab-left">


          {/* CASE BRIEF */}

          <div className="lab-panel case-brief-panel">

            <div className="lab-panel-title">

              <FileText size={17} />

              CASE BRIEF

            </div>

            <div className="panel-divider" />


            <div className="brief-section">

              <span>
                OBJECTIVE
              </span>

              <p>
                Write a function that returns the largest value in an integer
                array.
              </p>

            </div>


            <div className="brief-section">

              <span>
                INPUT
              </span>

              <p>
                An array of integers and its size n.
              </p>

            </div>


            <div className="brief-section">

              <span>
                OUTPUT
              </span>

              <p>
                Return the largest integer present in the array.
              </p>

            </div>


            <div className="brief-section">

              <span>
                CONSTRAINTS
              </span>

              <ul>
                <li>O(n) time complexity</li>
                <li>No sorting</li>
                <li>Handle negative numbers</li>
                <li>1 ≤ n ≤ 10⁵</li>
              </ul>

            </div>

          </div>


          {/* EVIDENCE CLUE */}

          <div className="lab-panel evidence-clue-panel">

            <div className="lab-panel-title">

              <CircleAlert size={17} />

              EVIDENCE CLUE

            </div>

            <p className="clue-text">
              "The system received corrupted results when all numbers were
              negative."
            </p>

            <Link
              href="/evidence"
              className="view-evidence-button"
            >
              <Fingerprint size={15} />
              VIEW EVIDENCE
            </Link>

          </div>

        </aside>


        {/* CENTER */}

        <section className="code-lab-center">


          {/* EDITOR */}

          <div className="editor-panel">

            <div className="editor-toolbar">

              <div className="editor-tab">
                findMax.cpp
                <X size={15} />
              </div>

              <button className="new-tab">
                +
              </button>

              <div className="editor-toolbar-right">

                <button className="language-select">
                  C++
                  <ChevronDown size={14} />
                </button>

                <button>
                  ⚙
                </button>

                <button>
                  <Maximize2 size={15} />
                </button>

              </div>

            </div>


            {/* CODE AREA */}

            <div className="code-editor">

              <div className="line-numbers">

                {code.split("\n").map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLine(index + 1)}
                    className={
                      selectedLine === index + 1
                        ? "line-number selected"
                        : "line-number"
                    }
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                ))}

              </div>


              <textarea
                value={code}
                onChange={(event) => setCode(event.target.value)}
                spellCheck={false}
                className="code-textarea"
              />

            </div>


            <div className="editor-status">

              <span className="saved-status">
                <CircleCheck size={14} />
                Saved
              </span>

              <span>
                Line {selectedLine}, Col 18
              </span>

            </div>

          </div>


          {/* ACTION BAR */}

          <div className="editor-actions">

            <button
              className="lab-action reset-action"
              onClick={resetCode}
            >

              <RotateCcw size={21} />

              <span>
                RESET CODE
                <small>Start Over</small>
              </span>

            </button>


            <button
              className="lab-action hint-action"
              onClick={() => askAI("Give me a hint")}
            >

              <Lightbulb size={21} />

              <span>
                HINT
                <small>Get a clue</small>
              </span>

            </button>


            <button
              className="lab-action run-action"
              onClick={runCode}
            >

              <Play size={22} />

              <span>
                {running ? "RUNNING..." : "RUN CODE"}
                <small>Compile & Test</small>
              </span>

            </button>


            <button
              className="lab-action submit-action"
              onClick={submitSolution}
              disabled={submitted}
            >

              {submitted ? (
                <Check size={22} />
              ) : (
                <CircleCheck size={22} />
              )}

              <span>
                {submitted ? "SUBMITTED" : "SUBMIT SOLUTION"}
                <small>
                  {submitted ? "Case updated" : "Submit & Earn XP"}
                </small>
              </span>

            </button>

          </div>


          {/* TERMINAL */}

          <div className="terminal-panel">

            <div className="terminal-header">

              <div>
                <Terminal size={16} />
                TERMINAL / OUTPUT
              </div>

              <button>
                Clear
              </button>

            </div>


            <div className="terminal-content">

              <div>
                &gt; Initializing CodeDetective Compiler...
              </div>

              <div>
                &gt; Compiling findMax.cpp
              </div>

              <div className="terminal-success">
                ✓ Compilation successful!
              </div>

              <div>
                &gt; Running test cases...
              </div>

              <div className="terminal-success">
                ✓ Test case 1 passed.
              </div>

              <div className="terminal-success">
                ✓ Test case 2 passed.
              </div>

              <div className="terminal-error">
                ✕ Test case 3 failed.
              </div>

              <div>
                Expected: -2
              </div>

              <div>
                Your Output: 0
              </div>

              <div className="terminal-success">
                ✓ Test case 4 passed.
              </div>

              <div className="terminal-warning">
                &gt; {passedTests}/4 test cases passed.
              </div>

            </div>

          </div>

        </section>


        {/* RIGHT COLUMN */}

        <aside className="code-lab-right">


          {/* TEST CASES */}

          <div className="lab-panel test-panel">

            <div className="lab-panel-title">
              <Code2 size={17} />
              TEST CASES
            </div>

            <div className="test-table">

              <div className="test-row test-heading">
                <span>#</span>
                <span>INPUT ARRAY</span>
                <span>EXPECTED</span>
                <span>OUTPUT</span>
                <span>STATUS</span>
              </div>

              {testCases.map((test) => (

                <div
                  key={test.id}
                  className="test-row"
                >

                  <span>
                    {test.id}
                  </span>

                  <span>
                    {test.input}
                  </span>

                  <span>
                    {test.expected}
                  </span>

                  <span
                    className={
                      test.passed
                        ? ""
                        : "failed-output"
                    }
                  >
                    {test.output}
                  </span>

                  <span>

                    {test.passed ? (
                      <Check
                        size={19}
                        className="test-pass"
                      />
                    ) : (
                      <X
                        size={19}
                        className="test-fail"
                      />
                    )}

                  </span>

                </div>

              ))}

            </div>


            <div className="test-summary">

              <strong>
                {passedTests} / 4 TEST CASES PASSED
              </strong>

              <span>
                Some cases are failing. Keep debugging!
              </span>

            </div>

          </div>


          {/* AI ASSISTANT */}

          <div className="lab-panel ai-panel">

            <div className="ai-header">

              <div>

                <div className="ai-icon">
                  AI
                </div>

                DETECTIVE AI ASSISTANT

              </div>

              <div>
                − &nbsp; ×
              </div>

            </div>


            <div className="chat-messages">

              {messages.map((message, index) => (

                <div
                  key={index}
                  className={
                    message.type === "ai"
                      ? "chat-message ai-message"
                      : "chat-message user-message"
                  }
                >

                  {message.type === "ai" && (
                    <Bot size={16} />
                  )}

                  <p>
                    {message.text}
                  </p>

                </div>

              ))}

            </div>


            <div className="chat-input">

              <input
                value={chatInput}
                onChange={(event) =>
                  setChatInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    askAI();
                  }
                }}
                placeholder="Ask me for a hint..."
              />

              <button onClick={() => askAI()}>
                <Send size={18} />
              </button>

            </div>


            <div className="ai-quick-actions">

              <button
                onClick={() =>
                  askAI("Why is my code failing?")
                }
              >
                🔍 Why failing?
              </button>

              <button
                onClick={() =>
                  askAI("Give me a hint")
                }
              >
                💡 Give me hint
              </button>

              <button
                onClick={() =>
                  askAI("Analyze my code")
                }
              >
                💬 Analyze code
              </button>

            </div>

          </div>


        </aside>

      </section>


      {/* CASE PROGRESS */}

      <div className="case-progress">

        <div className="case-progress-title">
          CASE PROGRESS
        </div>


        <div className="progress-step completed">
          <Check size={14} />
          Evidence
        </div>

        <div className="progress-line" />


        <div className="progress-step completed">
          <Check size={14} />
          Lesson
        </div>

        <div className="progress-line" />


        <div className="progress-step completed">
          <Check size={14} />
          Exercise
        </div>

        <div className="progress-line" />


        <div className="progress-step active">
          <Sparkles size={14} />
          Code Lab
        </div>

        <div className="progress-line" />


        <div className="progress-step locked">
          <Shield size={14} />
          Resolution
        </div>

      </div>


      {/* BOTTOM NAVIGATION */}
<div className="code-lab-navigation">

  <Link
    href="/lesson"
    className="back-lesson-button"
  >
    <ArrowLeft size={17} />
    BACK TO MINI LESSON
  </Link>

  <button
    className="continue-button"
    disabled={!submitted}
    onClick={() => router.push("/resolution")}
  >
    CONTINUE TO RESOLUTION
    <ArrowRight size={17} />
  </button>

</div>

      {/* TIP */}

      <div className="lab-tip">

        <Lightbulb size={16} />

        <span>
          TIP: Use the AI Assistant to learn while you debug.
        </span>

      </div>

    </main>
  );
}