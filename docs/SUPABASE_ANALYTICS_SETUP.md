# Supabase Analytics Setup Guide (BK-28)

This guide walks you through setting up a **100% Free Supabase Database** for privacy-conscious website traffic and customer intent tracking, integrated directly with *The Sixth Element* website and the nightly 05:15 AM *Toast ePOS to Xero* sync engine.

---

## 1. Create a Free Supabase Project

1. Go to [supabase.com](https://supabase.com) and click **Start your project** (or sign in with GitHub).
2. Click **New Project**.
3. Choose your organization and fill in:
   - **Name**: `the-sixth-element-analytics`
   - **Database Password**: Generate a secure password and save it in your password manager.
   - **Region**: `Europe (London) / eu-west-2` (recommended for lowest latency in London).
   - **Pricing Plan**: **Free** (includes 500 MB database, 50,000 monthly active users, unlimited API requests).
4. Click **Create new project** (takes ~60 seconds to provision).

---

## 2. Execute the Database Migration Script

1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar (icon with `>_`).
2. Click **New Query**.
3. Copy and paste the entire contents of [`docs/supabase_analytics_schema.sql`](file:///c:/Users/deepa/.gemini/antigravity-ide/scratch/the-sixth-element-website/docs/supabase_analytics_schema.sql).
4. Click **Run** (or press `Ctrl + Enter`).
5. You should see `Success. No rows returned`.

This creates:
- `site_events`: Row-level security protected table for raw anonymous events.
- `daily_web_metrics`: Fast analytical aggregate view grouped by London trading date.
- `get_web_traffic_summary`: Stored function for date range queries.

---

## 3. Retrieve Your API Keys

In your Supabase Dashboard, navigate to **Project Settings** (gear icon) → **API**:

1. **Project URL**: e.g., `https://abcdefghijklm.supabase.co`
2. **Project API Keys**:
   - `anon` / `public`: (Safe to use in the website frontend for sending events).
   - `service_role` / `secret`: (Used ONLY in `toast_xero_integrator` for private morning reports).

---

## 4. Configure the Keys

### A. For the Website (`the-sixth-element-website`)
Create or edit `.env.local` (or GitHub Repository Secrets for production GitHub Pages build):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

*Note: If these keys are not set, the website automatically falls back to offline/local simulation mode without throwing errors.*

### B. For the Nightly Sync Engine (`toast_xero_integrator`)
In `config.json` (or set environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`):

```json
{
  "supabase_analytics": {
    "enabled": true,
    "url": "https://your-project-id.supabase.co",
    "service_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 5. Privacy & Legal Compliance (UK GDPR & PECR)

- **No Cookies**: No identifiers are placed in browser cookies or persistent device storage.
- **No PII**: No names, email addresses, or raw IP addresses are permanently retained.
- **Anonymous Sessions**: Sessions expire when the user closes their browser tab.
- **No Cookie Banner Required**: Fully compliant with the UK Information Commissioner's Office (ICO) guidelines for strictly first-party measurement.
