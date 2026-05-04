# Booking System Setup Guide

This guide explains how the reservation system works and how to configure it so the restaurant owner receives every booking.

---

## How It Works

```
Guest fills form → Vercel serverless function → 3 things happen:
                                                  ├─ 1. Email to OWNER (formatted HTML)
                                                  ├─ 2. Confirmation email to GUEST
                                                  └─ 3. Row appended to Google Sheet
```

The owner gets an email within seconds. The Google Sheet acts as a live booking diary they can filter, sort, and share with staff.

---

## Step 1: Email Service (Resend — free tier: 3,000 emails/month)

1. Go to [resend.com](https://resend.com) and create a free account
2. Add and verify your domain (`thesixthelement.co.uk`):
   - Go to **Domains** → **Add Domain**
   - Add the DNS records Resend gives you (MX, SPF, DKIM)
   - Wait for verification (usually 5–10 minutes)
3. Go to **API Keys** → **Create API Key**
4. Copy the key — you'll need it in Step 3

> **No domain yet?** Resend lets you send from `onboarding@resend.dev` for testing. Change the `from` address in `api/book.js` to that while developing.

---

## Step 2: Google Sheet (free booking diary)

### Create the sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it **"Sixth Element Bookings"**
3. Rename the first tab to **"Bookings"** (exact name — case-sensitive)
4. Add these headers in Row 1:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Ref | Submitted | Name | Email | Phone | Date | Time | Guests | Seating | Notes |

5. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit
   ```

### Create a service account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use an existing one)
3. Enable the **Google Sheets API**:
   - APIs & Services → Library → search "Google Sheets API" → Enable
4. Create a service account:
   - APIs & Services → Credentials → Create Credentials → Service Account
   - Name it `bookings-writer`
   - Skip the optional steps → Done
5. Create a key:
   - Click into the service account → Keys tab → Add Key → JSON
   - A `.json` file downloads — keep this safe
6. **Share the Google Sheet** with the service account email:
   - The email looks like `bookings-writer@your-project.iam.gserviceaccount.com`
   - Share the sheet with this email as **Editor**
7. Base64-encode the JSON key:
   ```bash
   base64 -i your-key-file.json | tr -d '\n'
   ```
   Copy the output — you'll need it in Step 3

---

## Step 3: Deploy to Vercel

### First deploy

```bash
cd sixth-element
npm install
npx vercel
```

### Add environment variables

In the Vercel dashboard (or via CLI):

```bash
vercel env add RESEND_API_KEY        # paste your Resend API key
vercel env add OWNER_EMAIL           # e.g. owner@thesixthelement.co.uk
vercel env add GOOGLE_SHEET_ID       # the ID from your sheet URL
vercel env add GOOGLE_SERVICE_KEY    # the base64-encoded JSON key
```

Or in the Vercel dashboard: **Project → Settings → Environment Variables**

### Install the Google auth library

```bash
npm install google-auth-library
```

Then update the `createGoogleJWT` function in `api/book.js`:

```javascript
async function createGoogleJWT(serviceKey) {
  const { GoogleAuth } = await import('google-auth-library');
  const auth = new GoogleAuth({
    credentials: serviceKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token;
}
```

### Redeploy

```bash
vercel --prod
```

---

## Step 4: Test It

1. Open your live site
2. Click **Book a Table**
3. Fill in the form and submit
4. Check:
   - ✅ Owner email received?
   - ✅ Guest confirmation email received?
   - ✅ Row appeared in Google Sheet?

---

## Alternative: Zero-Backend with Formspree (5 min setup)

If you want something even simpler with no serverless function:

1. Go to [formspree.io](https://formspree.io) → create a free account
2. Create a new form → copy your form endpoint (e.g. `https://formspree.io/f/xAbCdEfG`)
3. In `App.jsx`, replace the `handleConfirm` function:

```javascript
const handleConfirm = async () => {
  setSubmitting(true);
  setError("");
  try {
    const resp = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _subject: `New booking: ${booking.name} — ${booking.date} at ${booking.time}`,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        date: booking.date,
        time: booking.time,
        guests: booking.guests,
        seating: booking.seating,
        notes: booking.notes,
      }),
    });
    if (!resp.ok) throw new Error("Failed to submit");
    setConfirmed(true);
  } catch (err) {
    setError("Booking failed. Please call us directly.");
  } finally {
    setSubmitting(false);
  }
};
```

With Formspree, the owner gets an email for every submission. No Google Sheet, no serverless function. Free for 50 submissions/month.

---

## Alternative: Third-Party Booking Widget

For full covers management (table allocation, no-show protection, waitlists), embed a UK-standard platform:

| Platform | Monthly Cost | Best For |
|----------|-------------|----------|
| [ResDiary](https://resdiary.com) | From £0 | UK restaurants, strong POS integrations |
| [Design My Night](https://designmynight.com) | Commission-based | Bars, cocktail venues |
| [OpenTable](https://restaurant.opentable.com) | Per-cover fee | International chains |
| [Quandoo](https://quandoo.com) | Free tier available | Small independent venues |

To embed, replace the booking modal with an iframe or redirect:

```javascript
// In the CTAButton onClick for "Book a Table":
window.open("https://www.resdiary.com/restaurant/the-sixth-element", "_blank");
```

---

## Owner's Daily View

With the Google Sheet approach, the owner can:

- **Filter by date** to see today's bookings
- **Sort by time** to plan the day
- **Add a "Status" column** (Confirmed / No-show / Cancelled)
- **Share with staff** via Google Sheets sharing
- **Set up Google Sheets notifications** to get mobile alerts
- **Connect to Google Calendar** via Apps Script for calendar blocking

The sheet becomes the single source of truth, and it costs nothing.
