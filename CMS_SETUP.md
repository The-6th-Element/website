# CMS & Payment Integration Setup Guide

---

## Part 1: Content Management System (Supabase — Free Tier)

Supabase gives you a Postgres database + file storage for images — all free up to 500MB database and 1GB file storage.

> **Menu & Promotions (what powers the admin panel):** these are stored as JSON
> in the **`site_content`** table under the keys `menu_data` and `promotions`,
> served via `/api/content`. The site reads them publicly and falls back to the
> built-in defaults until Supabase is connected — so nothing breaks before setup.
>
> **Minimum to make admin edits go live for all visitors:**
> 1. Create a Supabase project and run the SQL below (the `site_content` table is the essential one).
> 2. Set these Vercel env vars, then redeploy (`vercel --prod`):
>    ```bash
>    vercel env add SUPABASE_URL          # https://xxxx.supabase.co
>    vercel env add SUPABASE_SERVICE_KEY  # service_role key (Settings → API)
>    vercel env add ADMIN_USERNAME        # e.g. owner
>    vercel env add ADMIN_PASSWORD        # a strong passphrase
>    vercel env add ADMIN_SECRET          # 64-char hex (openssl rand -hex 32)
>    ```
> `ADMIN_*` gate the admin panel and sign the token that authorises saves;
> `SUPABASE_*` are where the data lives.

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → create a free account
2. Create a new project, region: **London (eu-west-2)**
3. Note your **Project URL** and **service_role key** from Settings → API

### Step 2: Create Database Tables

Run these in the Supabase SQL Editor (Dashboard → SQL Editor → New Query):

```sql
-- Menu items
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,          -- 'grounded', 'coffee', 'wine', 'cocktails'
  section TEXT NOT NULL,            -- e.g. 'Brunch Plates', 'Espresso Bar'
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(6,2),
  tags TEXT[] DEFAULT '{}',         -- e.g. {'V', 'GF', 'VG'}
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers & promotions
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,               -- e.g. "Happy Hour"
  description TEXT,
  discount_text TEXT,                -- e.g. "20% off all wine"
  image_url TEXT,
  badge_text TEXT,                   -- e.g. "LIMITED", "NEW"
  badge_color TEXT DEFAULT '#BF8A2F',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  show_on_homepage BOOLEAN DEFAULT true,
  terms TEXT,                        -- e.g. "Not valid with other offers"
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site content (key-value for hero text, about copy, etc.)
CREATE TABLE site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery / Instagram replacement images
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default content keys
INSERT INTO site_content (key, value) VALUES
  ('hero_title', '"The Five Elements Shape Life."'),
  ('hero_subtitle', '"We Offer the Sixth."'),
  ('hero_description', '"A space where morning light meets evening warmth. Specialty coffee by day, natural wine by night. Always intentional. Always Richmond."'),
  ('about_quote', '"In ancient philosophy, five elements compose all of existence — Earth, Water, Fire, Air, and Space. We believe there is a sixth: the feeling of belonging."'),
  ('phone', '"+44 (0) 20 XXXX XXXX"'),
  ('email', '"hello@thesixthelement.co.uk"'),
  ('address', '"Richmond-upon-Thames\nLondon, TW9"'),
  ('hours_weekday', '"Mon – Fri: 8am – 10pm"'),
  ('hours_weekend', '"Sat – Sun: 9am – 11pm"');
```

### Step 3: Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket called `site-assets`
3. Set it to **Public** (images need to be publicly accessible)
4. Under Policies, add a policy allowing `INSERT` for service_role

### Step 4: Set Environment Variables

```bash
vercel env add SUPABASE_URL          # e.g. https://xyzabc.supabase.co
vercel env add SUPABASE_SERVICE_KEY  # the service_role key (NOT anon)
```

### How the CMS works

```
Admin panel → Content Editor tab
  ├─ Edit hero text, about copy, contact info
  ├─ Add/edit/remove menu items with images
  ├─ Create offers with date ranges and badges
  ├─ Upload gallery images (replaces Instagram placeholders)
  └─ All changes live instantly (no rebuild needed)

Public site → GET /api/content?resource=menu
  ├─ Fetches menu items from Supabase
  ├─ Fetches active offers (date-filtered)
  ├─ Fetches gallery images
  └─ Falls back to hardcoded data if CMS not configured
```

---

## Part 2: Payment Gateway (Stripe)

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com) → create an account
2. Complete business verification (UK business or sole trader)
3. Get your **Secret Key** from Developers → API Keys

### Step 2: Install Stripe

```bash
cd sixth-element
npm install stripe
```

### Step 3: Set Environment Variables

```bash
vercel env add STRIPE_SECRET_KEY      # sk_live_... (or sk_test_... for testing)
vercel env add SITE_URL               # https://thesixthelement.co.uk
```

### Step 4: Set Up Webhook

Stripe needs to tell your site when payments complete:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://thesixthelement.co.uk/api/payment?action=webhook`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
4. Copy the **Webhook Signing Secret**

```bash
vercel env add STRIPE_WEBHOOK_SECRET  # whsec_...
```

### How Payments Work

#### A) Reservation Deposits

```
Guest books table → "Pay £5 deposit to confirm" option
  → Stripe Checkout page (hosted by Stripe — PCI compliant)
    → Guest pays with card / Apple Pay / Google Pay
      → Stripe webhook fires → api/payment.js
        ├─ Owner gets email: "💳 Deposit paid for John, Sat 7pm"
        ├─ Booking marked as "Deposit Paid" in Google Sheet
        └─ Guest redirected back to site with confirmation

Deposit is deducted from the bill on arrival.
```

**Deposit amounts (configurable in admin panel):**
- Brunch: £5 per booking
- Evening: £10 per booking
- Large party (6+): £5 per person

#### B) Collection Orders (Direct Ordering)

```
Guest selects items from menu → adds to basket
  → Checkout with name, phone, collection time
    → Stripe Checkout (card / Apple Pay / Google Pay)
      → Payment confirmed → owner notified
        → Guest collects at the counter
```

This replaces or supplements third-party platforms (Deliveroo etc.) — zero commission.

#### C) Gift Vouchers (Optional Future Phase)

Stripe also supports creating Products in your dashboard for fixed-value gift cards (£25, £50, £100) that can be purchased online.

### Testing

Use Stripe test mode first:
- Test card: `4242 4242 4242 4242`, any future expiry, any CVC
- Test Apple Pay: enable in Stripe dashboard under Payment Methods
- Switch to live keys when ready

### Stripe Fees (UK)

| Method | Fee |
|--------|-----|
| UK cards | 1.4% + 20p |
| EU cards | 2.5% + 20p |
| Apple Pay / Google Pay | Same as card |

On a £10 deposit, that's ~34p. On a £30 collection order, ~62p.

---

## Part 3: Admin Panel Content Editor

The admin panel now has additional tabs:

### Content Tab
- Edit hero section text (title, subtitle, description)
- Edit about page quote and copy
- Edit contact information (phone, email, address, hours)
- Changes are saved to Supabase and reflected on the live site immediately

### Menu Editor Tab
- Add, edit, delete menu items
- Upload images per item
- Set availability (toggle items on/off without deleting)
- Reorder items via sort order

### Offers Tab
- Create promotional offers with:
  - Title, description, discount text
  - Start and end dates (auto-activates/deactivates)
  - Homepage badge (e.g. "NEW", "LIMITED")
  - Custom image
- Active offers appear as a banner on the homepage

### Gallery Tab
- Upload images to replace the Instagram placeholder grid
- Reorder, caption, and toggle visibility
- Once your Instagram embed is connected, this becomes supplementary

### Payments Tab
- View deposit amounts (brunch / evening)
- Toggle deposit requirement on/off
- Toggle direct ordering on/off
- Link to Stripe dashboard for full transaction history

---

## Environment Variables Summary

After full setup, your Vercel project needs these:

```
# Admin Auth
ADMIN_USERNAME=owner
ADMIN_PASSWORD=your-strong-passphrase
ADMIN_SECRET=your-64-char-hex-string

# Email (Resend)
RESEND_API_KEY=re_xxxxx
OWNER_EMAIL=owner@thesixthelement.co.uk

# Bookings (Google Sheet)
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_SERVICE_KEY=base64-encoded-json

# CMS (Supabase)
SUPABASE_URL=https://xyzabc.supabase.co
SUPABASE_SERVICE_KEY=eyJhb...

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
SITE_URL=https://thesixthelement.co.uk
```

All services used have generous free tiers:
- **Vercel**: Free (hobby plan)
- **Supabase**: Free (500MB database, 1GB storage)
- **Resend**: Free (3,000 emails/month)
- **Stripe**: No monthly fee (pay-per-transaction only)
- **Google Sheets**: Free
