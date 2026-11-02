"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";

/*
 * Lightweight Python editor.
 *
 * Layout (why code can never be clipped or misaligned):
 *   .cd-editor            ← the ONLY scroll container (overflow: auto, fills its parent)
 *     .cd-editor-row      ← width: max-content; min-width: 100%  (grows with the longest line)
 *       .cd-gutter        ← sticky left; one row per line, same line-height as the code
 *       .cd-code          ← position: relative
 *         <pre>           ← highlighted copy of the text; in normal flow, so it sizes everything
 *         <textarea>      ← absolutely covers the <pre>; transparent text, visible caret;
 *                           never scrolls by itself because it is always exactly content-sized
 * Gutter and code share one scroll box, so line numbers stay aligned while scrolling in
 * either direction, and long lines scroll horizontally instead of being cut off.
 */

const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del", "elif",
  "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal", "not", "or",
  "pass", "raise", "return", "try", "while", "with", "yield", "match", "case",
]);
const BUILTINS = new Set([
  "print", "range", "len", "input", "int", "str", "float", "list", "dict", "set", "tuple", "sum", "min", "max", "sorted",
  "enumerate", "zip", "abs", "round", "map", "filter", "any", "all", "open", "type", "isinstance", "bool", "reversed",
]);
const TOKEN_RE = /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_])/gm;

function highlightLine(line: string, key: number): React.ReactNode {
  const out: React.ReactNode[] = [];
  let m: RegExpExecArray | null;
  let i = 0;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m[0] === "") { TOKEN_RE.lastIndex++; continue; }
    const [text, comment, str, num, ident, , punct] = m;
    let cls = "";
    if (comment) cls = "tok-comment";
    else if (str) cls = "tok-string";
    else if (num) cls = "tok-number";
    else if (ident) {
      if (KEYWORDS.has(ident)) cls = "tok-keyword";
      else if (BUILTINS.has(ident)) cls = "tok-builtin";
      else if (line.slice(m.index + ident.length).trimStart().startsWith("(")) cls = "tok-call";
    } else if (punct && /[=+\-*/%<>!]/.test(punct)) cls = "tok-operator";
    out.push(cls ? <span key={i++} className={cls}>{text}</span> : text);
  }
  return <React.Fragment key={key}>{out}</React.Fragment>;
}

export type CodeEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  /** 1-based line to flag (e.g. from a traceback). */
  errorLine?: number | null;
  ariaLabel?: string;
  className?: string;
};

const INDENT = "    ";

export function CodeEditor({ value, onChange, onRun, readOnly = false, errorLine = null, ariaLabel = "Code editor", className = "" }: CodeEditorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const escapedRef = useRef(false);
  const lines = useMemo(() => value.split("\n"), [value]);
  const highlighted = useMemo(() => lines.map((l, i) => <React.Fragment key={i}>{highlightLine(l, i)}{"\n"}</React.Fragment>), [lines]);

  // Keep the caret visible inside the single scroll container.
  const revealCaret = useCallback(() => {
    const ta = taRef.current;
    const box = scrollRef.current;
    if (!ta || !box) return;
    const before = ta.value.slice(0, ta.selectionEnd);
    const row = before.split("\n").length - 1;
    const col = before.length - before.lastIndexOf("\n") - 1;
    const cs = getComputedStyle(ta);
    const lh = parseFloat(cs.lineHeight) || 22;
    const ctx = document.createElement("canvas").getContext("2d");
    let cw = 8.4;
    if (ctx) { ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; cw = ctx.measureText("M").width || cw; }
    const gutter = (box.querySelector(".cd-gutter") as HTMLElement | null)?.offsetWidth ?? 0;
    const x = gutter + parseFloat(cs.paddingLeft) + col * cw;
    const y = parseFloat(cs.paddingTop) + row * lh;
    const pad = 24;
    if (x < box.scrollLeft + gutter + pad) box.scrollLeft = Math.max(0, x - gutter - pad);
    else if (x > box.scrollLeft + box.clientWidth - pad) box.scrollLeft = x - box.clientWidth + pad * 2;
    if (y < box.scrollTop) box.scrollTop = Math.max(0, y - pad);
    else if (y + lh > box.scrollTop + box.clientHeight) box.scrollTop = y + lh - box.clientHeight + pad;
  }, []);

  useEffect(() => {
    // The textarea is content-sized; undo any internal scroll the browser applies.
    const ta = taRef.current;
    if (!ta) return;
    const reset = () => { if (ta.scrollTop || ta.scrollLeft) { ta.scrollTop = 0; ta.scrollLeft = 0; } };
    ta.addEventListener("scroll", reset);
    return () => ta.removeEventListener("scroll", reset);
  }, []);

  // Insert text at the selection, keeping native undo where supported.
  function insert(text: string, selStart?: number, selEnd?: number) {
    const ta = taRef.current!;
    if (selStart !== undefined && selEnd !== undefined) ta.setSelectionRange(selStart, selEnd);
    const ok = typeof document.execCommand === "function" && document.execCommand("insertText", false, text);
    if (!ok) {
      const s = ta.selectionStart;
      ta.setRangeText(text, s, ta.selectionEnd, "end");
      onChange?.(ta.value);
    }
    requestAnimationFrame(revealCaret);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const ta = e.currentTarget;
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); onRun?.(); return; }
    if (e.key === "Escape") { escapedRef.current = true; return; }
    if (readOnly) return;
    const { selectionStart: s, selectionEnd: end, value: v } = ta;

    if (e.key === "Tab") {
      if (escapedRef.current) { escapedRef.current = false; return; } // Esc then Tab leaves the editor
      e.preventDefault();
      const lineStart = v.lastIndexOf("\n", s - 1) + 1;
      if (s === end && !e.shiftKey) { insert(INDENT); return; }
      // Indent / dedent every selected line.
      const blockEnd = v.indexOf("\n", end - (end > s && v[end - 1] === "\n" ? 1 : 0));
      const stop = blockEnd === -1 ? v.length : blockEnd;
      const block = v.slice(lineStart, stop);
      const changed = e.shiftKey
        ? block.split("\n").map((l) => l.replace(/^( {1,4}|\t)/, "")).join("\n")
        : block.split("\n").map((l) => INDENT + l).join("\n");
      insert(changed, lineStart, stop);
      ta.setSelectionRange(lineStart, lineStart + changed.length);
      return;
    }
    escapedRef.current = false;

    if (e.key === "Enter" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      const lineStart = v.lastIndexOf("\n", s - 1) + 1;
      const current = v.slice(lineStart, s);
      const indent = current.match(/^\s*/)?.[0] ?? "";
      const extra = /:\s*(#.*)?$/.test(current) ? INDENT : "";
      insert("\n" + indent + extra);
      return;
    }

    if (e.key === "Backspace" && s === end && s > 0) {
      const lineStart = v.lastIndexOf("\n", s - 1) + 1;
      const before = v.slice(lineStart, s);
      if (before.length > 0 && /^ +$/.test(before)) {
        e.preventDefault();
        const remove = before.length % 4 === 0 ? 4 : before.length % 4;
        insert("", s - remove, s);
      }
    }
  }

  return (
    <div ref={scrollRef} className={`cd-editor ${readOnly ? "cd-editor-readonly" : ""} ${className}`}>
      <div className="cd-editor-row">
        <div className="cd-gutter" aria-hidden="true">
          {lines.map((_, i) => (
            <div key={i} className={errorLine === i + 1 ? "cd-gutter-error" : ""}>{i + 1}</div>
          ))}
        </div>
        <div className="cd-code">
          <pre className="cd-highlight" aria-hidden="true"><code>{highlighted}{" "}</code></pre>
          <textarea
            ref={taRef}
            className="cd-input"
            value={value}
            onChange={(e) => { onChange?.(e.target.value); requestAnimationFrame(revealCaret); }}
            onKeyDown={onKeyDown}
            onKeyUp={(e) => { if (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End" || e.key.startsWith("Page")) revealCaret(); }}
            onClick={revealCaret}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            aria-label={ariaLabel}
            aria-multiline="true"
            data-gramm="false"
          />
        </div>
      </div>
    </div>
  );
}

/** Extracts the last "line N" reference for challenge.py from a Python traceback. */
export function errorLineFrom(stderr: string | undefined | null): number | null {
  if (!stderr) return null;
  const matches = [...stderr.matchAll(/File "challenge\.py", line (\d+)/g)];
  const last = matches.at(-1);
  return last ? Number(last[1]) : null;
}
