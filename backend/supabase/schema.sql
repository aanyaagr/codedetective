-- CodeDetective Academy PostgreSQL schema for Supabase.
-- Apply this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists seasons (
  id text primary key,
  number integer not null,
  title text not null,
  language text not null,
  unlocked boolean not null default false
);

create table if not exists cases (
  id text primary key,
  season_id text not null references seasons(id) on delete cascade,
  number text not null,
  title text not null,
  description text not null,
  objective text not null,
  difficulty text not null,
  xp_reward integer not null default 0 check (xp_reward >= 0),
  prerequisite_case_id text references cases(id) on delete set null,
  stages jsonb not null default '[]'::jsonb,
  concept text not null,
  lesson jsonb not null default '{}'::jsonb,
  resolution jsonb not null default '{}'::jsonb
);

create table if not exists challenges (
  id text primary key,
  case_id text not null unique references cases(id) on delete cascade,
  language text not null,
  starter_code text not null,
  hint text not null
);

create table if not exists challenge_tests (
  id text primary key,
  challenge_id text not null references challenges(id) on delete cascade,
  name text not null,
  stdin text not null default '',
  expected_output text not null,
  hidden boolean not null default false
);

create table if not exists evidence (
  id text primary key,
  case_id text not null references cases(id) on delete cascade,
  code text not null,
  text text not null,
  condition text not null
);

create table if not exists progress (
  user_id uuid primary key references users(id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  rank text not null default 'ROOKIE',
  streak integer not null default 0,
  cases_solved integer not null default 0,
  mastery jsonb not null default '{}'::jsonb,
  completed_lessons jsonb not null default '[]'::jsonb,
  completed_stages jsonb not null default '{}'::jsonb,
  discovered_evidence jsonb not null default '[]'::jsonb,
  unlocked_case_ids jsonb not null default '[]'::jsonb
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  challenge_id text not null references challenges(id) on delete cascade,
  case_id text not null references cases(id) on delete cascade,
  passed boolean not null default false,
  score numeric not null default 0,
  tests_passed integer not null default 0,
  tests_total integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  case_id text references cases(id) on delete set null,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_cases_season on cases(season_id);
create index if not exists idx_tests_challenge on challenge_tests(challenge_id);
create index if not exists idx_evidence_case on evidence(case_id);
create index if not exists idx_submissions_user on submissions(user_id, created_at desc);
create index if not exists idx_submissions_case on submissions(case_id, created_at desc);
create index if not exists idx_xp_user on xp_transactions(user_id, created_at desc);

insert into seasons(id, number, title, language, unlocked)
values ('season-1', 1, 'Python Foundations', 'python', true)
on conflict (id) do nothing;

insert into cases(id, season_id, number, title, description, objective, difficulty, xp_reward, prerequisite_case_id, stages, concept, lesson, resolution)
values (
  'case-001', 'season-1', '001', 'THE DUPLICATE REPORTS',
  'The automated record system is duplicating critical case files.',
  'Find why the report buffer contains duplicates and repair the loop so every report is unique.',
  'MEDIUM', 250, null,
  '["BRIEFING","LEARN","INVESTIGATE","CODE","EVIDENCE","SOLVE"]'::jsonb,
  'loops and conditions',
  '{"title":"LOOPS AND CONDITIONS","subtitle":"Your investigation points toward a repeated action that should only happen once.","clue":"The same report is appended twice whenever the loop reaches an even value.","sections":[{"title":"LOOPS","description":"A loop repeats a block of code for each value in a sequence or until a condition changes."},{"title":"CONDITIONS","description":"A condition decides whether a block should run. If the condition is too broad, the block may execute when it should not."},{"title":"INVARIANTS","description":"An invariant is a rule that must remain true. Here, every report should appear exactly once."}],"hint":"Trace one even iteration carefully. Ask whether the same value is appended more than once."}'::jsonb,
  '{"rootCause":"The loop appends the current report a second time when the value is even.","fixSummary":"Keep the single append inside the loop and remove the duplicate append branch.","beforeCode":"reports.append(r)\nif r % 2 == 0:\n    reports.append(r)","afterCode":"reports.append(r)","successMessage":"The corrected loop produces exactly five unique reports."}'::jsonb
)
on conflict (id) do nothing;

insert into challenges(id, case_id, language, starter_code, hint)
values ('challenge-001','case-001','python','reports = []\n\nfor r in range(1, 6):\n    reports.append(r)\n    if r % 2 == 0:\n        reports.append(r)\n\nprint("Case Output:", reports)','The duplicate is created by the extra append inside the even-number condition.')
on conflict (id) do nothing;

insert into challenge_tests(id, challenge_id, name, stdin, expected_output, hidden)
values ('test-1','challenge-001','No duplicate reports','','Case Output: [1, 2, 3, 4, 5]',false),
       ('test-hidden-1','challenge-001','Hidden uniqueness invariant','','Case Output: [1, 2, 3, 4, 5]',true)
on conflict (id) do nothing;

insert into evidence(id, case_id, code, text, condition)
values ('ev-01','case-001','EV-01','The loop triggers a duplicate push on even iterations.','failed_test'),
       ('ev-02','case-001','EV-02','The output buffer violates the five-item uniqueness invariant.','failed_test'),
       ('ev-03','case-001','EV-03','A corrected loop produces exactly five unique reports.','passed_all_tests')
on conflict (id) do nothing;
