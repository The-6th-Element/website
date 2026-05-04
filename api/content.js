// api/content.js — Vercel Serverless Function
// CMS backend: manages menu items, offers, images, hero content, gallery
//
// Required environment variables:
//   ADMIN_SECRET          — same secret used for admin-auth.js
//   SUPABASE_URL          — from your Supabase project settings
//   SUPABASE_SERVICE_KEY  — service_role key (not the anon key)
//
// Supabase setup: see CMS_SETUP.md for table schemas and storage bucket config

import crypto from "crypto";

// ── Auth middleware ──────────────────────────────────────────────────
function verifyToken(token, secret) {
  try {
    const [header, body, signature] = token.split(".");
    const expected = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch { return null; }
}

function getAuth(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return verifyToken(auth.slice(7), process.env.ADMIN_SECRET);
}

// ── Supabase client ─────────────────────────────────────────────────
function supabase(path, options = {}) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${path}`;
  return fetch(url, {
    ...options,
    headers: {
      "apikey": process.env.SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.method === "POST" ? "return=representation" : "return=representation",
      ...options.headers,
    },
  }).then(async r => {
    const data = await r.json();
    if (!r.ok) throw new Error(JSON.stringify(data));
    return data;
  });
}

function supabaseStorage(path, options = {}) {
  const url = `${process.env.SUPABASE_URL}/storage/v1/${path}`;
  return fetch(url, {
    ...options,
    headers: {
      "apikey": process.env.SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      ...options.headers,
    },
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { resource, action } = req.query;

  // ── Public reads (no auth required) ──
  if (req.method === "GET") {
    try {
      switch (resource) {
        case "menu":
          const menu = await supabase("menu_items?select=*&order=sort_order.asc");
          return res.json(menu);

        case "offers":
          const now = new Date().toISOString();
          const offers = await supabase(
            `offers?select=*&is_active=eq.true&start_date=lte.${now}&end_date=gte.${now}&order=sort_order.asc`
          );
          return res.json(offers);

        case "content":
          const content = await supabase("site_content?select=*");
          const contentMap = {};
          content.forEach(c => { contentMap[c.key] = c.value; });
          return res.json(contentMap);

        case "gallery":
          const gallery = await supabase("gallery?select=*&is_visible=eq.true&order=sort_order.asc");
          return res.json(gallery);

        default:
          return res.status(400).json({ error: "Invalid resource" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch", detail: err.message });
    }
  }

  // ── Protected writes (auth required) ──
  const user = getAuth(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  try {
    // ── Menu CRUD ──
    if (resource === "menu") {
      if (req.method === "POST") {
        const item = await supabase("menu_items", {
          method: "POST",
          body: JSON.stringify(req.body),
        });
        return res.json(item[0]);
      }
      if (req.method === "PUT") {
        const { id, ...updates } = req.body;
        const item = await supabase(`menu_items?id=eq.${id}`, {
          method: "PATCH",
          body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
        });
        return res.json(item[0]);
      }
      if (req.method === "DELETE") {
        const { id } = req.body;
        await supabase(`menu_items?id=eq.${id}`, { method: "DELETE" });
        return res.json({ deleted: true });
      }
    }

    // ── Offers CRUD ──
    if (resource === "offers") {
      if (req.method === "POST") {
        const offer = await supabase("offers", {
          method: "POST",
          body: JSON.stringify(req.body),
        });
        return res.json(offer[0]);
      }
      if (req.method === "PUT") {
        const { id, ...updates } = req.body;
        const offer = await supabase(`offers?id=eq.${id}`, {
          method: "PATCH",
          body: JSON.stringify(updates),
        });
        return res.json(offer[0]);
      }
      if (req.method === "DELETE") {
        const { id } = req.body;
        await supabase(`offers?id=eq.${id}`, { method: "DELETE" });
        return res.json({ deleted: true });
      }
    }

    // ── Site Content (key-value) ──
    if (resource === "content") {
      if (req.method === "PUT") {
        const { key, value } = req.body;
        // Upsert
        const existing = await supabase(`site_content?key=eq.${key}`);
        if (existing.length > 0) {
          await supabase(`site_content?key=eq.${key}`, {
            method: "PATCH",
            body: JSON.stringify({ value, updated_at: new Date().toISOString() }),
          });
        } else {
          await supabase("site_content", {
            method: "POST",
            body: JSON.stringify({ key, value }),
          });
        }
        return res.json({ key, value });
      }
    }

    // ── Image Upload ──
    if (resource === "upload") {
      if (req.method === "POST") {
        const { filename, base64Data, contentType, folder } = req.body;
        const buffer = Buffer.from(base64Data, "base64");
        const path = `${folder || "general"}/${Date.now()}-${filename}`;

        const uploadResp = await supabaseStorage(`object/site-assets/${path}`, {
          method: "POST",
          headers: { "Content-Type": contentType },
          body: buffer,
        });

        if (!uploadResp.ok) {
          const err = await uploadResp.json();
          throw new Error(JSON.stringify(err));
        }

        const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/site-assets/${path}`;
        return res.json({ url: publicUrl, path });
      }
    }

    // ── Gallery ──
    if (resource === "gallery") {
      if (req.method === "POST") {
        const item = await supabase("gallery", {
          method: "POST",
          body: JSON.stringify(req.body),
        });
        return res.json(item[0]);
      }
      if (req.method === "DELETE") {
        const { id } = req.body;
        await supabase(`gallery?id=eq.${id}`, { method: "DELETE" });
        return res.json({ deleted: true });
      }
    }

    return res.status(400).json({ error: "Invalid resource or method" });
  } catch (err) {
    return res.status(500).json({ error: "Operation failed", detail: err.message });
  }
}
