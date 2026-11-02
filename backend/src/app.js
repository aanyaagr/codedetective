require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./services/db");
const authRouter = require("./routers/authRouter");
const caseRouter = require("./routers/caseRouter");
const progressRouter = require("./routers/progressRouter");
const codeRouter = require("./routers/codeRouter");
const assistantRouter = require("./routers/assistantRouter");

const app = express();
const PORT = Number(process.env.PORT || 5001);

// FRONTEND_ORIGIN may list several origins, comma-separated. Any localhost port is
// also allowed outside production (Next.js moves to :3001 when :3000 is busy).
const origins = (process.env.FRONTEND_ORIGIN || "").split(",").map((s) => s.trim().replace(/\/+$/, "")).filter(Boolean);
const isLocal = (o) => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o);
const corsOrigin = origins.length === 0
  ? true
  : (origin, cb) => cb(null, !origin || origins.includes(origin) || (process.env.NODE_ENV !== "production" && isLocal(origin)));

app.disable("x-powered-by");
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "64kb" }));

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "codedetective-backend", database: db.usingSupabase ? "supabase-postgresql" : "local-development" }));
app.use("/api/auth", authRouter);
app.use("/api/cases", caseRouter);
app.use("/api/progress", progressRouter);
app.use("/api/code", codeRouter);
app.use("/api/assistant", assistantRouter);
app.use((req, res) => res.status(404).json({ error: "Route not found" }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  console.error(err);
  // Database errors can contain internals; only client errors are echoed back.
  res.status(status).json({ error: status >= 500 ? "Internal server error" : err.message || "Bad request" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CodeDetective backend running on http://localhost:${PORT}`);
    console.log(`  database: ${db.usingSupabase ? "Supabase" : "local development store (set SUPABASE_URL to use Supabase)"}`);
    console.log(`  CORS: ${origins.length ? origins.join(", ") : "any origin (set FRONTEND_ORIGIN in production)"}`);
    console.log(`  assistant: ${process.env.ANTHROPIC_API_KEY ? "AI enabled" : "case-notes mode (set ANTHROPIC_API_KEY for AI answers)"}`);
  });
}

module.exports = app;
