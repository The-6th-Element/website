// api/admin-auth.js — Vercel Serverless Function
// Authenticates admin users and returns a signed session token.
//
// Required environment variables (set in Vercel dashboard):
//   ADMIN_USERNAME  — e.g. "owner"
//   ADMIN_PASSWORD  — e.g. a strong passphrase
//   ADMIN_SECRET    — a random 32+ char string used to sign tokens
//                     Generate one: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

import crypto from "crypto";

const TOKEN_EXPIRY_HOURS = 12;

function signToken(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyToken(token, secret) {
  try {
    const [header, body, signature] = token.split(".");
    const expected = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const SECRET = process.env.ADMIN_SECRET;
  const ADMIN_USER = process.env.ADMIN_USERNAME;
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  if (!SECRET || !ADMIN_USER || !ADMIN_PASS) {
    return res.status(500).json({ error: "Admin auth not configured on server" });
  }

  const { action, username, password, token } = req.body;

  // ── Login ──
  if (action === "login") {
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    // Constant-time comparison to prevent timing attacks
    const userMatch = crypto.timingSafeEqual(
      Buffer.from(username.padEnd(256)),
      Buffer.from(ADMIN_USER.padEnd(256))
    );
    const passMatch = crypto.timingSafeEqual(
      Buffer.from(password.padEnd(256)),
      Buffer.from(ADMIN_PASS.padEnd(256))
    );

    if (!userMatch || !passMatch) {
      // Brief delay to slow brute force
      await new Promise(r => setTimeout(r, 800));
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      sub: username,
      role: "admin",
      iat: Date.now(),
      exp: Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    };

    const jwt = signToken(payload, SECRET);
    return res.status(200).json({ token: jwt, expiresIn: TOKEN_EXPIRY_HOURS * 3600 });
  }

  // ── Verify existing token ──
  if (action === "verify") {
    if (!token) return res.status(401).json({ valid: false });
    const payload = verifyToken(token, SECRET);
    if (!payload) return res.status(401).json({ valid: false });
    return res.status(200).json({ valid: true, user: payload.sub, role: payload.role });
  }

  return res.status(400).json({ error: "Invalid action. Use 'login' or 'verify'." });
}
