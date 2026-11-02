const { verifyToken } = require("../services/auth");

const DEV_SECRET = "codedetective-development-secret-change-me";
const SECRET = process.env.JWT_SECRET || DEV_SECRET;

if (SECRET === DEV_SECRET) {
  console.warn("[auth] WARNING: JWT_SECRET is not set — using the insecure development secret. Set it in backend/.env (and in your host's environment when deploying).");
}

function tokenFrom(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

function authRequired(req, res, next) {
  const payload = verifyToken(tokenFrom(req), SECRET);
  if (!payload) return res.status(401).json({ error: "Authentication required" });
  req.user = payload;
  next();
}

module.exports = { authRequired, tokenFrom, SECRET };
