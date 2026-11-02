# Fixes and improvements on `final-integration`

Design, colours, page structure and the investigation flow
(Case Board → Evidence → Lesson → Exercise → Code Lab → Resolution → Report) are unchanged.

## Critical bugs fixed
- **Code Lab editor clipped to "rep".** `.code-lab-page .code-editor` is a `53px 1fr` grid, but the line numbers were absolutely
  positioned, so the textarea fell into the 53px column (measured: 98px wide, **0px** usable). Line numbers were also
  20.4px apart vs 22.1px code lines and lived in a separate scroll box. Replaced with one shared editor component
  (`components/code-lab/CodeEditor.tsx`): gutter and code share a single scroll container and line height, long lines
  scroll horizontally. Measured after: 698px usable, 22px/22px, aligned. Used by Exercise, Code Lab and the home page.
- **Starter code stored as one line.** `schema.sql` seeded `'...\n...'` without `E''`, so Postgres stored literal `\n`.
- **Lesson page crashed** (`Cannot read properties of undefined (reading 'map')`): the seed inserted `lesson = {}` and `resolution = {}`.
- **Secrets readable by player code.** Submitted Python inherited the server environment, including `SUPABASE_SERVICE_ROLE_KEY`
  (full database access) and `JWT_SECRET`. The runner now uses a scrubbed environment.
- **XP never awarded from the normal flow.** The Resolution page showed "+250 XP" but never closed the case. It now closes
  it once (idempotently), awards XP and unlocks the next case.
- **`npm run build` would fail type-checking**: unused `Comparison.tsx` / `StatsAndJourney.tsx` referenced missing data.
- **AFTER code box floated off** on Resolution/Report: the class name `fixed` matched Tailwind's `position: fixed` utility.

## Other bugs fixed
- Hint and AI assistant both revealed the full answer immediately; hints are now progressive (3 levels) and the assistant
  answers questions (Claude when `ANTHROPIC_API_KEY` is set, case notes otherwise) without handing over the fix.
- Evidence text, including the final "solution" clue, was sent and shown before discovery. Evidence is now gated by
  its condition; hidden test outputs are never sent.
- Players could set `EVIDENCE` / `SOLVE` stages directly through the API.
- `latestSubmission` was returned in snake_case, so Resolution/Report showed "undefined / undefined".
- Case Board always showed the first unlocked case; solved/in-progress/locked status wasn't shown; other cases couldn't be opened.
- Leaderboard rows showed `#ROOKIE` instead of a position; ties, inactive users and "your position" weren't handled.
- Navbar XP/rank never refreshed after login; sign-out didn't leave protected pages.
- Two navigation bars stacked on the Resolution pages.
- Red threads on the Evidence board pointed at nothing; Threat Level rose as you made progress.
- CORS blocked the frontend when Next.js moved to port 3001.
- Malformed login tokens caused 500 errors; database errors were echoed to the browser.
- A slow code run could overwrite progress saved in the meantime.
- Input-driven tests now get their own stdin; hard-coding the sample output fails the hidden test.
- "Continue" buttons in Exercise/Code Lab had no styles; "CASE FILE" label was unreadable on the case-board dossier.
- Resolution page overflowed horizontally on phones and tablets.
- IBM Plex was loaded but not applied (85 `monospace` / 7 `Arial` declarations); labels under 12px were enlarged.

## Added
- Cases #002 and #003, unlocked in order, with lessons, hints, tests and resolutions.
- `npm run seed` / `npm run seed:sql` and `supabase/seed.sql` generated from `backend/src/data/cases.js`;
  `schema.sql` adds `challenges.hints` (safe to re-run on an existing database).
- Local development database when Supabase isn't configured.
- Sign-in prompts with return-to-page, code drafts shared between Exercise and Code Lab, per-test expected vs actual output.
- Backend test suite (`npm test`) — passes against the local store and against PostgreSQL through the Supabase code path.
