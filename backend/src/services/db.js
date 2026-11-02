// Database access used by every router: query / insert / update / remove / upsert.
//
// Production: Supabase (PostgreSQL) via the service-role key. The key stays on the server
// and is never sent to the browser; tables have RLS enabled with no public policies.
//
// Local development without Supabase credentials: a small file-backed store with the same
// tables and the same API (backend/data/local-db.json), seeded from src/data/cases.js.
// It is refused when NODE_ENV=production so a deploy can't silently lose data.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const usingSupabase = Boolean(url && key);

// ---------------------------------------------------------------- Supabase
function supabaseAdapter() {
  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const applyFilters = (q, filters = {}) => {
    for (const [column, value] of Object.entries(filters)) q = value === null ? q.is(column, null) : q.eq(column, value);
    return q;
  };
  return {
    supabase,
    async query(table, options = {}) {
      let q = applyFilters(supabase.from(table).select(options.select || "*"), options.filters);
      if (options.order) q = q.order(options.order.column, { ascending: options.order.ascending ?? true });
      if (options.limit) q = q.limit(options.limit);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async insert(table, row) {
      const { data, error } = await supabase.from(table).insert(row).select().single();
      if (error) throw error;
      return data;
    },
    async update(table, filters, patch) {
      const { data, error } = await applyFilters(supabase.from(table).update(patch), filters).select();
      if (error) throw error;
      return data || [];
    },
    async remove(table, filters) {
      const { data, error } = await applyFilters(supabase.from(table).delete(), filters).select();
      if (error) throw error;
      return data || [];
    },
    async upsert(table, rows, onConflict = "id") {
      const { data, error } = await supabase.from(table).upsert(rows, { onConflict }).select();
      if (error) throw error;
      return data || [];
    },
  };
}

// ---------------------------------------------------------------- Local file store
const DEFAULTS = {
  users: () => ({ id: crypto.randomUUID(), created_at: new Date().toISOString() }),
  progress: () => ({
    xp: 0, level: 1, rank: "ROOKIE", streak: 0, cases_solved: 0, mastery: {}, completed_lessons: [],
    completed_stages: {}, discovered_evidence: [], unlocked_case_ids: [],
  }),
  submissions: () => ({ id: crypto.randomUUID(), passed: false, score: 0, tests_passed: 0, tests_total: 0, created_at: new Date().toISOString() }),
  xp_transactions: () => ({ id: crypto.randomUUID(), created_at: new Date().toISOString() }),
};
const PRIMARY_KEY = { progress: "user_id" };
const TABLES = ["users", "seasons", "cases", "challenges", "challenge_tests", "evidence", "progress", "submissions", "xp_transactions"];

function localAdapter() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in production.");
  }
  const dir = path.resolve(process.env.DATA_DIR || path.join(__dirname, "../../data"));
  const file = path.join(dir, "local-db.json");
  const { seedRows } = require("../data/cases");
  const clone = (v) => JSON.parse(JSON.stringify(v));

  let db = {};
  try { db = JSON.parse(fs.readFileSync(file, "utf8")); } catch { db = {}; }
  for (const t of TABLES) if (!Array.isArray(db[t])) db[t] = [];
  // Case content is re-synced from cases.js on every start.
  const seed = seedRows();
  for (const [table, rows] of Object.entries(seed)) db[table] = clone(rows);

  const save = () => {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${file}.tmp`, JSON.stringify(db, null, 2));
    fs.renameSync(`${file}.tmp`, file);
  };
  save();
  const matches = (row, filters = {}) => Object.entries(filters).every(([k, v]) => (v === null ? row[k] == null : row[k] === v));
  const pk = (table) => PRIMARY_KEY[table] || "id";

  return {
    supabase: null,
    async query(table, options = {}) {
      let rows = db[table].filter((r) => matches(r, options.filters));
      if (options.order) {
        const { column, ascending = true } = options.order;
        rows = [...rows].sort((a, b) => (a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0) * (ascending ? 1 : -1));
      }
      if (options.limit) rows = rows.slice(0, options.limit);
      if (options.select && options.select !== "*") {
        const cols = options.select.split(",").map((c) => c.trim());
        rows = rows.map((r) => Object.fromEntries(cols.map((c) => [c, r[c]])));
      }
      return clone(rows);
    },
    async insert(table, row) {
      const full = { ...(DEFAULTS[table]?.() || {}), ...clone(row) };
      const k = pk(table);
      if (full[k] !== undefined && db[table].some((r) => r[k] === full[k])) {
        const err = new Error(`duplicate key value violates unique constraint on ${table}.${k}`);
        err.code = "23505";
        throw err;
      }
      if (table === "users" && db.users.some((u) => u.email === full.email)) {
        const err = new Error("duplicate key value violates unique constraint on users.email");
        err.code = "23505";
        throw err;
      }
      db[table].push(full);
      save();
      return clone(full);
    },
    async update(table, filters, patch) {
      const changed = [];
      for (const r of db[table]) if (matches(r, filters)) { Object.assign(r, clone(patch)); changed.push(r); }
      if (changed.length) save();
      return clone(changed);
    },
    async remove(table, filters) {
      const gone = db[table].filter((r) => matches(r, filters));
      db[table] = db[table].filter((r) => !matches(r, filters));
      if (gone.length) save();
      return clone(gone);
    },
    async upsert(table, rows, onConflict = "id") {
      const out = [];
      for (const row of [].concat(rows)) {
        const existing = db[table].find((r) => r[onConflict] === row[onConflict]);
        if (existing) Object.assign(existing, clone(row));
        else db[table].push(clone(row));
        out.push(row);
      }
      save();
      return clone(out);
    },
  };
}

const adapter = usingSupabase ? supabaseAdapter() : localAdapter();
if (!usingSupabase) {
  console.warn("[db] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — using the local development database (backend/data/local-db.json).");
}

module.exports = { ...adapter, usingSupabase };
