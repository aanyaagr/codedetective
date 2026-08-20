const {verifyToken}=require("../services/auth");
const SECRET=process.env.JWT_SECRET||"codedetective-development-secret-change-me";
function authRequired(req,res,next){const h=req.headers.authorization||"",token=h.startsWith("Bearer ")?h.slice(7):null,payload=verifyToken(token,SECRET);if(!payload)return res.status(401).json({error:"Authentication required"});req.user=payload;next();}
module.exports={authRequired,SECRET};
