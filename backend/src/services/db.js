const { createClient } = require("@supabase/supabase-js");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function query(table, options = {}) {
  let q = supabase.from(table).select(options.select || "*");
  if (options.filters) {
    for (const [column, value] of Object.entries(options.filters)) q = q.eq(column, value);
  }
  if (options.order) q = q.order(options.order.column, { ascending: options.order.ascending ?? true });
  if (options.limit) q = q.limit(options.limit);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

async function insert(table, row) {
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw error;
  return data;
}

async function update(table, filters, patch) {
  let q = supabase.from(table).update(patch);
  for (const [column, value] of Object.entries(filters)) q = q.eq(column, value);
  const { data, error } = await q.select();
  if (error) throw error;
  return data || [];
}

async function remove(table, filters) {
  let q = supabase.from(table).delete();
  for (const [column, value] of Object.entries(filters)) q = q.eq(column, value);
  const { data, error } = await q.select();
  if (error) throw error;
  return data || [];
}

module.exports = { supabase, query, insert, update, remove };
