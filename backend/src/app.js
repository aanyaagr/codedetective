const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routers/authRouter");
const caseRouter = require("./routers/caseRouter");
const progressRouter = require("./routers/progressRouter");
const codeRouter = require("./routers/codeRouter");

const app = express();
const PORT = Number(process.env.PORT || 5001);

app.disable("x-powered-by");
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true }));
app.use(express.json({ limit: "64kb" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", service: "codedetective-backend", database: "supabase-postgresql" }));
app.use("/api/auth", authRouter);
app.use("/api/cases", caseRouter);
app.use("/api/progress", progressRouter);
app.use("/api/code", codeRouter);
app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, req, res, next) => { console.error(err); res.status(err.status || 500).json({ error: err.message || "Internal server error" }); });

if (require.main === module) app.listen(PORT, () => console.log(`CodeDetective backend running on http://localhost:${PORT}`));
module.exports = app;
