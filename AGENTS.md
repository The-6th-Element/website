# The Sixth Element — Anti Gravity Project Guide

## Overview
**The Sixth Element** is a high-end hospitality website and web application for an artisan café and evening wine bar in Richmond-upon-Thames, London ("Specialty coffee by day, natural wine by night").

- **Repository**: [The-6th-Element/website](https://github.com/The-6th-Element/website)
- **Local Path**: `C:\Users\deepa\.gemini\antigravity-ide\scratch\the-sixth-element-website`
- **Tech Stack**: React 18, Vite 6, Vercel Serverless Functions, Supabase (PostgreSQL & Storage), Toast Tables (Reservations).

---

## Architecture & File Structure

```
the-sixth-element-website/
├── index.html              # HTML shell with Google Fonts, metadata, and JSON-LD baseline
├── package.json            # Scripts and dependencies (React 18, Vite 6)
├── vite.config.js          # Vite config (dev server port 3000)
├── api/                    # Vercel Serverless Functions (Node.js)
│   ├── admin-auth.js       # Admin authentication & JWT token signing/verification
│   └── content.js          # Supabase REST client for CMS (menu, offers, content, gallery)
├── public/                 # Static brand assets (SVG logomarks, food/drink imagery)
├── src/
│   ├── main.jsx            # React root mount
│   └── App.jsx             # Main application (routing, theme engine, pages, admin panel)
└── CMS_SETUP.md            # Supabase schema definitions and Vercel setup instructions
```

---

## Key Workflows & Conventions

### 1. Theme Engine (AM / PM Dual Personality)
- **AM Mode**: Morning/afternoon theme (Ivory `#F6F4E3`, Cream `#FAF8F0`, Earth Brown `#4B3621`, Warm Amber `#BF8A2F`).
- **PM Mode**: Evening lounge theme (Warm Black `#0F0D0A`, Dark Bg `#1A1410`, Sand `#D4C5A9`, Warm Amber `#BF8A2F`).
- Switches automatically based on Europe/London local hour (`h >= 8 && h < pm_switch_hour`, configurable in admin panel, default 14:00).
- Users can manually toggle via the Sun/Moon icon in the navbar.

### 2. Navigation & Pages
- Controlled via `currentPage` state in `TheSixthElement` (`App.jsx`):
  - `'home'`: Hero, dual experience showcase, concept highlights, reviews, Instagram/gallery, booking CTA.
  - `'menu'`: Tabbed Daytime (Brunch, Coffee, Tea) vs Evening (Plates, Cocktails, Wine, Beer).
  - `'impact'`: Ethical coffee bean sourcing, community focus, and environmental initiatives.
  - `'about'`: The story behind the brand and philosophy of the six elements.
  - `'contact'`: Physical address (210 Upper Richmond Road West, SW14 8AH), telephone, opening hours, contact form.
- Smooth scrolling is managed via `scrollToTop()` on route switches.

### 3. CMS & Admin Panel
- Access: Add `?admin=true` to any URL.
- Auth: Serverless endpoint `api/admin-auth.js` verifies credentials and signs a 12-hour JWT stored in `sessionStorage`.
- Features: Content editing, live menu management, promotions manager with badge styling, image gallery uploads.
- Supabase Integration: Public GET requests fetch live data with graceful offline fallbacks to local defaults if Supabase is unconfigured.

### 4. Toast Tables Integration
- Reservation booking opens Toast Tables modal using `TOAST_CONFIG.reservationUrl` (`https://tables.toasttab.com/restaurants/5503e03f-b188-421c-aa8f-5a2c8e27fd59/findTime`).

---

## Local Development Commands (Windows)

> On Windows PowerShell where script execution policy may restrict `.ps1` files, use `npm.cmd`:

```powershell
# Install dependencies
npm.cmd install

# Start local development server (http://localhost:3000)
npm.cmd run dev

# Production build
npm.cmd run build

# Preview build locally
npm.cmd run preview
```

---

## Planned / Recommended Enhancements
1. **Modularizing `App.jsx`**: Split the single 2,650-line file into dedicated directories:
   - `src/components/` (Navbar, Footer, AnnouncementBar, ToastModal, etc.)
   - `src/pages/` (Home, Menu, Impact, About, Contact)
   - `src/admin/` (AdminPanel, ContentEditor, MenuManager, etc.)
   - `src/theme/` (Colors, Theme tokens, AM/PM logic)
   - `src/data/` (Default menu items, static fallback copy)
2. **Environment Variable Integration**: Ensure local `.env` and Vercel environment variables are aligned for Supabase and Admin secrets.
3. **Menu & Visual Assets**: Update any placeholder photography, verify opening hours, and connect live forms.
