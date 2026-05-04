// api/book.js — Vercel Serverless Function
// Handles booking submissions: sends email to owner + logs to Google Sheet
//
// Required environment variables (set in Vercel dashboard → Settings → Environment Variables):
//   RESEND_API_KEY        — from https://resend.com (free: 3,000 emails/month)
//   OWNER_EMAIL           — e.g. owner@thesixthelement.co.uk
//   GOOGLE_SHEET_ID       — the ID from your Google Sheet URL
//   GOOGLE_SERVICE_KEY    — base64-encoded Google service account JSON key
//
// Setup steps are in README.md

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { name, email, phone, date, time, guests, seating, notes } = req.body;

    // ── Validate required fields ──
    if (!name || !email || !date || !time || !guests || !seating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const bookingRef = `TSE-${Date.now().toString(36).toUpperCase()}`;
    const seatingLabel = seating === "brunch" ? "Brunch (60 min)" : "Evening (120 min)";
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    // ── 1. Email the restaurant owner ──
    await sendOwnerEmail({
      bookingRef, name, email, phone, formattedDate, time, guests, seatingLabel, notes,
    });

    // ── 2. Send confirmation to the guest ──
    await sendGuestEmail({
      bookingRef, name, email, formattedDate, time, guests, seatingLabel,
    });

    // ── 3. Log to Google Sheet ──
    await logToGoogleSheet({
      bookingRef, name, email, phone, date, time, guests, seatingLabel, notes,
    });

    return res.status(200).json({ success: true, bookingRef });
  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ error: "Booking failed. Please call us directly." });
  }
}

// ─── Email to Owner ─────────────────────────────────────────────────
async function sendOwnerEmail({ bookingRef, name, email, phone, formattedDate, time, guests, seatingLabel, notes }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const OWNER_EMAIL = process.env.OWNER_EMAIL;

  if (!RESEND_API_KEY || !OWNER_EMAIL) {
    console.warn("Email not configured — skipping owner notification");
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "The Sixth Element <bookings@thesixthelement.co.uk>",
      to: OWNER_EMAIL,
      subject: `New Booking: ${name} — ${formattedDate} at ${time}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 24px;">
          <h2 style="color: #4B3621; margin-bottom: 4px;">New Table Reservation</h2>
          <p style="color: #999; font-size: 13px;">Ref: ${bookingRef}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <table style="width: 100%; font-size: 14px; line-height: 2;">
            <tr><td style="color: #999;">Guest</td><td><strong>${name}</strong></td></tr>
            <tr><td style="color: #999;">Date</td><td>${formattedDate}</td></tr>
            <tr><td style="color: #999;">Time</td><td>${time}</td></tr>
            <tr><td style="color: #999;">Covers</td><td>${guests}</td></tr>
            <tr><td style="color: #999;">Seating</td><td>${seatingLabel}</td></tr>
            <tr><td style="color: #999;">Phone</td><td>${phone || "—"}</td></tr>
            <tr><td style="color: #999;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            ${notes ? `<tr><td style="color: #999;">Notes</td><td>${notes}</td></tr>` : ""}
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p style="font-size: 12px; color: #bbb;">Reply to this email or call the guest to confirm.</p>
        </div>
      `,
    }),
  });
}

// ─── Confirmation Email to Guest ────────────────────────────────────
async function sendGuestEmail({ bookingRef, name, email, formattedDate, time, guests, seatingLabel }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "The Sixth Element <bookings@thesixthelement.co.uk>",
      to: email,
      subject: `Your reservation at The Sixth Element — ${formattedDate}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 24px;">
          <h2 style="color: #4B3621;">Thank you, ${name}</h2>
          <p style="color: #666; line-height: 1.6;">
            Your table is reserved. Here are the details:
          </p>
          <div style="background: #F6F4E3; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${time}</p>
            <p style="margin: 4px 0;"><strong>Guests:</strong> ${guests}</p>
            <p style="margin: 4px 0;"><strong>Seating:</strong> ${seatingLabel}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #999;">Ref: ${bookingRef}</p>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Need to change or cancel? Reply to this email or call us.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #bbb;">
            The Sixth Element · Richmond-upon-Thames<br/>
            hello@thesixthelement.co.uk
          </p>
        </div>
      `,
    }),
  });
}

// ─── Log to Google Sheet ────────────────────────────────────────────
async function logToGoogleSheet({ bookingRef, name, email, phone, date, time, guests, seatingLabel, notes }) {
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const SERVICE_KEY_B64 = process.env.GOOGLE_SERVICE_KEY;

  if (!SHEET_ID || !SERVICE_KEY_B64) {
    console.warn("Google Sheets not configured — skipping log");
    return;
  }

  // Decode service account key
  const serviceKey = JSON.parse(Buffer.from(SERVICE_KEY_B64, "base64").toString());

  // Create JWT for Google Sheets API
  const jwt = await createGoogleJWT(serviceKey);

  // Append row to sheet
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Bookings!A:J:append?valueInputOption=USER_ENTERED`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [[
        bookingRef,
        new Date().toISOString(),
        name,
        email,
        phone || "",
        date,
        time,
        guests,
        seatingLabel,
        notes || "",
      ]],
    }),
  });
}

// ─── Google JWT Helper ──────────────────────────────────────────────
async function createGoogleJWT(serviceKey) {
  // For production, use the 'google-auth-library' package instead.
  // This is a minimal implementation for the serverless function.
  //
  // Install: npm install google-auth-library
  // Then replace this function with:
  //
  //   const { GoogleAuth } = require('google-auth-library');
  //   const auth = new GoogleAuth({
  //     credentials: serviceKey,
  //     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  //   });
  //   const client = await auth.getClient();
  //   const token = await client.getAccessToken();
  //   return token.token;

  // Placeholder — see README for full setup
  throw new Error("Replace with google-auth-library. See README.");
}
