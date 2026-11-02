// Upserts all case content from src/data/cases.js into Supabase:  npm run seed
// Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env and schema.sql applied first.
require("dotenv").config();
const db = require("../src/services/db");
const { seedRows } = require("../src/data/cases");

(async () => {
  if (!db.usingSupabase) {
    console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set — nothing to seed (the local development store seeds itself).");
    process.exit(1);
  }
  const rows = seedRows();
  for (const table of ["seasons", "cases", "challenges", "challenge_tests", "evidence"]) {
    const result = await db.upsert(table, rows[table], "id");
    console.log(`${table.padEnd(16)} ${result.length} rows upserted`);
  }
  console.log("Seed complete.");
})().catch((err) => {
  console.error("Seed failed:", err.message || err);
  if (/hints/.test(String(err.message))) console.error("Hint: re-run supabase/schema.sql — it adds the challenges.hints column.");
  process.exit(1);
});
