# CodeDetective Academy

Full-stack detective-style coding learning platform: Next.js frontend, Express API, Supabase (PostgreSQL) database.

A case runs **Case Board → Evidence Trail → Mini Lesson → Exercise → Code Lab → Resolution**. Players examine evidence,
learn the concept, fix the suspect code against visible and hidden tests, get progressive hints from the Detective
AI Assistant, then close the case for XP, unlocking the next case and climbing the leaderboard.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the workflow, API contract and data ownership.

## Quick start (local, no Supabase needed)

Requirements: Node 20+, Python 3 on your PATH.

```bash
# Terminal 1 — API on http://localhost:5001
cd backend
cp .env.example .env        # set JWT_SECRET; leave SUPABASE_* empty for the local database
npm install
npm run dev

# Terminal 2 — app on http://localhost:3000
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

With `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` empty, the API uses a local development database
(`backend/data/local-db.json`) with the same tables, seeded automatically. It refuses to run that way when `NODE_ENV=production`.

## Using Supabase

1. In the Supabase SQL editor, run `backend/supabase/schema.sql` (safe to re-run; it also migrates older databases).
2. Load the case content — either `cd backend && npm run seed`, or paste `backend/supabase/seed.sql` into the SQL editor.
3. Put `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env` and restart the API. `/api/health` reports `"database": "supabase-postgresql"`.

The service-role key is used only by the backend. It must never go in the frontend or in a `NEXT_PUBLIC_*` variable.
Tables have row-level security enabled with no public policies, so the anon key cannot read them.

## Editing cases

All case content lives in `backend/src/data/cases.js` (story, lesson, hints, starter code, tests, evidence, resolution).
After editing it: `npm run seed` (Supabase) and `npm run seed:sql` (regenerates `supabase/seed.sql`).
The local database re-syncs it on every start.

## Checks

```bash
cd backend && npm test               # API, progression, sandbox and leaderboard tests
cd frontend && npm run build && npm run lint
```

`npm test` uses the local database unless `SUPABASE_*` are set, in which case it runs against that project (use a throwaway one — it creates test users).

## Environment variables

| Where | Variable | Purpose |
|---|---|---|
| backend | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase project. Empty = local development database. |
| backend | `JWT_SECRET` | **Required in production.** Signs login tokens. |
| backend | `FRONTEND_ORIGIN` | Allowed frontend URL(s), comma-separated. Any localhost port is allowed in development. |
| backend | `PYTHON_BIN`, `CODE_TIMEOUT_MS` | Python used for player code (`python3` / `python`) and its time limit. |
| backend | `ANTHROPIC_API_KEY`, `ASSISTANT_MODEL` | Optional. AI answers in the Detective AI Assistant; without it the assistant answers from the case hints. |
| frontend | `NEXT_PUBLIC_API_URL` | Backend URL, with or without `/api`. Defaults to `http://localhost:5001`. |

## Security notes

- Player code runs in a child process with a scrubbed environment (it cannot read `SUPABASE_SERVICE_ROLE_KEY` or `JWT_SECRET`), a temp directory and a timeout. That is fine for a demo; for a public launch run the API in a container without network access and with CPU/memory limits.
- Hidden test inputs/outputs and undiscovered evidence text are never sent to the browser.
