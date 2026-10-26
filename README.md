# CodeDetective Academy

Full-stack detective-style coding learning platform built with Next.js and an Express backend.

## Architecture

The frontend communicates with the authenticated Express API through the typed client in `frontend/src/lib/api.ts`. The backend owns authentication, case data, progression, evidence, submissions, XP, unlocking, and code execution.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the complete workflow, API contract, data ownership, progression model, and local development architecture.

## Local development

### Backend

```bash
cd backend
npm install
npm start
```

Default API: `http://localhost:5001/api`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

If port 3000 is occupied, Next.js may start on another port such as `3001`. Configure the backend URL with `NEXT_PUBLIC_API_URL` when required.

## Core workflow

```text
Browser
  -> Next.js frontend
  -> typed API client
  -> Express API + JWT
  -> case/progress/code services
  -> persistence / code execution
  -> JSON response
  -> frontend state and UI
```

The frontend should not hardcode dynamic case values or determine whether submitted code is correct. Those decisions belong to the backend.
