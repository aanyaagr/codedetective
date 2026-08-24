# CodeDetective Academy — Architecture & Workflow

## 1. System overview

CodeDetective Academy is a full-stack detective-style coding learning platform.

```text
Browser
  |
  | Next.js UI
  v
Frontend (Next.js 16)
  |
  | JSON over HTTP + Bearer JWT
  v
Backend (Express / Node.js :5001)
  |
  +--> Auth Router
  +--> Case Router
  +--> Progress Router
  +--> Code Router
  |
  +--> Store / persistence
  +--> Progression service
  +--> Code execution service
```

The frontend is responsible for presentation, user interaction, routing, and API calls. The backend is the source of truth for authentication, cases, progress, evidence, rewards, unlocking, and code evaluation.

## 2. Frontend architecture

The frontend lives under `frontend/` and uses the Next.js App Router.

Important areas:

- `frontend/src/app/` — route entry points/pages.
- `frontend/src/components/` — reusable UI and feature components.
- `frontend/src/lib/api.ts` — typed API client and frontend/backend contract layer.
- `frontend/src/lib/auth.ts` — client authentication/session helpers.
- `frontend/public/` — static visual assets.

The frontend should not own case truth, scores, XP, unlock state, evidence conditions, or test correctness. Those values come from the backend API.

### Main user-facing flow

1. Landing page introduces the academy.
2. Authentication creates/logs in a user and receives a JWT.
3. Case Board requests available cases from `/api/cases`.
4. The selected case is loaded from `/api/cases/:id`.
5. The Lesson/Investigation UI advances stages through backend stage/lesson endpoints.
6. Evidence is discovered through `/api/cases/:id/evidence/:evidenceId/discover`.
7. Exercise loads the backend-provided starter code and challenge metadata.
8. Run Code sends the edited source to `/api/code/run`.
9. Submit Fix sends the source to `/api/code/submit`; the backend executes tests and records the submission.
10. A successful coding submission advances the case to Evidence.
11. Case completion awards XP and can unlock the next case.
12. Progress/dashboard data is read from `/api/progress`.

## 3. API contract layer

`frontend/src/lib/api.ts` is the single frontend contract layer.

It provides typed functions for:

- Authentication/session requests.
- Case listing and case detail.
- Case progress.
- Starting cases.
- Stage transitions.
- Lesson completion.
- Evidence discovery.
- Case completion.
- Code execution.
- Code submission.
- Overall player progress.

The API base URL is configured with `NEXT_PUBLIC_API_URL` and defaults to `http://localhost:5001/api` for local development.

Authentication is attached as:

```text
Authorization: Bearer <JWT>
```

The frontend normalizes case/challenge IDs at the API boundary so route components do not need to know backend ID formatting rules.

## 4. Backend architecture

The backend lives under `backend/` and is an Express application.

### Entry point

`backend/src/app.js`:

- Loads environment variables.
- Configures CORS and JSON parsing.
- Registers API routers.
- Exposes `/api/health`.
- Initializes the application store.
- Starts on `PORT`, defaulting to `5001`.

### Routers

#### `/api/auth`

Handles:

- `POST /register`
- `POST /login`
- `GET /me`
- `POST /logout`

Registration/login returns a signed JWT and public user information.

#### `/api/cases`

Protected by authentication.

Handles:

- `GET /cases`
- `GET /cases/:id`
- `GET /cases/:id/progress`
- `POST /cases/:id/start`
- `POST /cases/:id/stage`
- `POST /cases/:id/lesson/complete`
- `POST /cases/:id/evidence/:evidenceId/discover`
- `POST /cases/:id/complete`

The backend decides whether a case is unlocked and enforces ordered progression.

#### `/api/code`

Protected by authentication.

Handles:

- `POST /code/run`
- `POST /code/submit`

`run` evaluates the code without creating a permanent submission. `submit` evaluates the code, records the submission, updates evidence/progression when appropriate, and returns the evaluation result.

#### `/api/progress`

Provides authenticated player progression such as XP, level, rank, streak, solved cases, mastery, and unlocked cases.

## 5. Code execution flow

```text
Exercise editor
   |
   | challengeId + code
   v
POST /api/code/run
   |
   v
Code Router
   |
   v
Code Execution Service
   |
   +--> load challenge tests
   +--> execute submitted code
   +--> compare test outcomes
   v
RunResult
   |
   v
Frontend renders stdout/stderr, pass count, score and status
```

For submission:

```text
POST /api/code/submit
   |
   v
executeChallenge(...)
   |
   +--> persist submission
   +--> discover conditional evidence
   +--> advance case from CODE -> EVIDENCE when all tests pass
   v
Frontend receives submission result
```

The important security/design boundary is that the frontend never decides whether a solution is correct. It only sends source code and renders the backend result.

## 6. Progression model

A case has ordered stages such as:

```text
BRIEFING -> LEARN -> INVESTIGATE -> CODE -> EVIDENCE -> SOLVE
```

The backend stores the current stage and completed stages for each user/case.

The coding challenge is a prerequisite for final case completion. When the challenge passes, the backend advances the case and records evidence. When the case is completed, XP/rank/level are updated and the next prerequisite case can be unlocked.

## 7. Data ownership

| Data | Owner |
|---|---|
| Case title/description | Backend case data |
| Starter code | Backend challenge data |
| Test definitions | Backend challenge data |
| Test correctness | Backend code execution |
| Evidence text/conditions | Backend case data |
| Current stage | Backend progress store |
| Unlocked cases | Backend progress store |
| XP/rank/level | Backend progression logic |
| Submission history | Backend store |
| UI layout/theme | Frontend |
| Editor interaction | Frontend |
| API request/response typing | Frontend API layer |

This separation is what prevents the production UI from silently falling back to hardcoded case values.

## 8. Local development

Run the backend from `backend/`:

```bash
npm start
```

Default backend URL:

```text
http://localhost:5001
```

Run the frontend from `frontend/`:

```bash
npm run dev
```

The current local frontend can run on port `3001` if `3000` is already occupied. The frontend API client should continue targeting the backend at `http://localhost:5001/api` unless `NEXT_PUBLIC_API_URL` overrides it.

## 9. Debugging checklist

If a page reports `Case not found`:

1. Confirm the backend is running on port `5001`.
2. Confirm the browser has a valid JWT.
3. Confirm `/api/cases` succeeds before calling `/api/cases/:id`.
4. Confirm the selected case ID is normalized to the backend format.
5. Confirm the case is unlocked for the authenticated user.

If a page shows a Next.js hydration warning involving `data-new-gr-c-s-check-loaded` or `data-gr-ext-installed`, those attributes are typically injected by a browser extension and are not application data. Test with extensions disabled/incognito before treating it as a React rendering defect.

## 10. Current integration principle

The target architecture is:

```text
UI -> typed API client -> authenticated Express endpoint -> backend business logic -> persistence/execution -> API response -> UI state
```

Hardcoded mock values should only exist as intentional UI copy or backend seed data. Dynamic user/case/progress/execution values should not be duplicated in page components.
