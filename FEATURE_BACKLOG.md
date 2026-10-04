# The Sixth Element — Feature & Product Backlog

A living backlog and product roadmap for **The Sixth Element** website and digital operations platform. This document tracks all completed features, active release milestones, and queued ideas for future exploration.

---

## 📌 Status Key
- 🟢 **Completed (Shipped to `dev`)**: Fully implemented, verified, built, and committed.
- 🟡 **Pending Go-Live (Phase 4 & 5)**: Ready for production merge, DNS cutover, and production domain verification.
- 🔵 **Backlog / Future Exploration**: Prioritized candidate features for upcoming development cycles.
- ⚪ **Idea / In Discovery**: Concepts proposed for scoping and viability assessment.

---

## 🟢 1. Completed Features (Shipped to `dev` Branch)

### 1.1 Architecture, Theme & Modularization (Phase 1)
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-01** | **Monolith Decomposition** | Replaced 2,652-line monolithic `App.jsx` with structured architecture: `src/theme/`, `src/components/`, `src/pages/`, `src/data/`, and `src/utils/`. | 🟢 Shipped |
| **FEAT-02** | **Centralized Design Tokens** | Unified luxury color palette (`Earth Brown #4B3621`, `Moss Green #606E3D`, `Warm Amber #BF8A2F`, `Charcoal #2C2C2C`, `Cream #FAF8F0`) and typography (`Cormorant Garamond` & `Outfit`). | 🟢 Shipped |
| **FEAT-03** | **Time-Based Theme Engine** | Automatic daylight (AM) to evening (PM lounge) styling driven by UK London time (`Europe/London` handling BST/GMT) with configurable admin switch hour. | 🟢 Shipped |
| **FEAT-04** | **Dedicated Page Routing** | Client-side routing for Home, Menu, Social Impact, Our Story, Contact, Staff Portal (`/staff`), and Menu Studio (`/studio`) with browser back/forward history and scroll-to-top. | 🟢 Shipped |

### 1.2 Menu Management & CSV Studio (Phase 2)
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-05** | **Interactive Menu Studio** | In-browser spreadsheet for batch-editing daytime & evening menus, descriptions, prices, categories, and dietary tags (`V`, `VE`, `GF`, `GF*`). | 🟢 Shipped |
| **FEAT-06** | **CSV Import & Export** | 1-click download of the complete menu as `sixth_element_menu.csv` for editing in Excel/Google Sheets, plus drag-and-drop CSV upload and parsing. | 🟢 Shipped |
| **FEAT-07** | **1-Click GitHub Direct Publisher** | Client-side GitHub API publisher allowing authorized admins to push menu changes directly to GitHub from the browser without CLI tools. | 🟢 Shipped |
| **FEAT-08** | **Integrated Menu Studio Route** | Rendered Menu Studio as a full-page experience (`/studio`) retaining the website logo and main navigation links at the top. | 🟢 Shipped |

### 1.3 Staff & User Management with RBAC
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-09** | **Role-Based Access Control (RBAC)** | Multi-user credential store with 5 roles: `Owner` (Pooja Somani), `Admin` (Deepak), `Manager`, `Shift Lead`, and `Chef / Kitchen`. | 🟢 Shipped |
| **FEAT-10** | **Granular Publishing Permissions** | Only `Admin` and `Owner` accounts can publish updates to the live site; other staff roles can edit menus and save local drafts. | 🟢 Shipped |
| **FEAT-11** | **User Management UI** | Dedicated Admin tab to view staff, add new team members with custom titles/roles, update credentials, and delete staff accounts (with Owner deletion protection). | 🟢 Shipped |
| **FEAT-12** | **Cross-Network Auth & Fallback** | Secure SHA-256 password hashing with a pure JavaScript cryptographic fallback to allow testing across local WiFi/LAN (`http://192.168.1.195:5173/`). | 🟢 Shipped |

### 1.4 Hosting, CI/CD & Infrastructure (Phase 3)
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-13** | **GitHub Actions CI/CD** | Automated pipeline (`.github/workflows/deploy.yml`) that builds Vite and deploys static artifacts to GitHub Pages on every push to `main`. | 🟢 Shipped |
| **FEAT-14** | **Vercel Elimination** | Removed legacy serverless API routes (`/api/admin-auth.js`, `/api/content.js`) and Vercel dependencies, transitioning to permanent zero-cost hosting. | 🟢 Shipped |
| **FEAT-15** | **Custom Domain & SPA Routing** | Added `public/CNAME` (`the6thelement.co.uk`) and `public/404.html` SPA routing redirect script for smooth sub-page reloads. | 🟢 Shipped |
| **FEAT-16** | **Supabase Decommissioning** | Removed unused database connections; converted promotions, announcement bars, and operational flags to persistent browser storage. | 🟢 Shipped |

### 1.5 Guest Experience & Mobile Optimizations
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-17** | **Toast Tables Broadened Modal** | Expanded the reservation modal container to `min(980px, 95vw)` for comfortable calendar, party size, and seating-time selection. | 🟢 Shipped |
| **FEAT-18** | **iOS & Android Touch Tuning** | Added `viewport-fit=cover`, dynamic viewport heights (`100dvh`), iOS notch safe-area padding, `-webkit-backdrop-filter` glassmorphism, 16px input minimum font size (no auto-zoom), and removed 300ms tap delay. | 🟢 Shipped |
| **FEAT-19** | **Top Announcement Bar** | Configurable site-wide promotional banner with dismiss/persist logic and real-time Admin Console management. | 🟢 Shipped |
| **FEAT-20** | **Staff Portal Dedicated Page** | Replaced the narrow 380px drawer with a full-width dedicated workspace at `/staff`. | 🟢 Shipped |
| **FEAT-21** | **Static Content Sanitization** | Removed all hardcoded personal names from login footers, input placeholders, user subtitles, and static copy, ensuring a clean, professional interface. | 🟢 Shipped |
| **FEAT-22** | **Automated Navigation AM/PM** | Removed manual sun/moon toggle buttons from top navigation; the theme now transitions dynamically and automatically. | 🟢 Shipped |

---

## 🟡 2. Immediate Go-Live Milestones (Pending Production Cutover)

| ID | Milestone Item | Description | Target |
|---|---|---|---|
| **GO-01** | **Merge `dev` into `main`** | Merge the verified `dev` branch into `main` to trigger the production GitHub Actions build. | Immediate |
| **GO-02** | **GoDaddy DNS Cutover (Phase 4)** | Replace Vercel A record (`216.198.79.1`) with 4 GitHub Pages Apex IPs (`185.199.108.153`, `109.153`, `110.153`, `111.153`) and set `www` CNAME to `the-6th-element.github.io`. | Phase 4 |
| **GO-03** | **GitHub Pages HTTPS Enforcement** | Enable **Enforce HTTPS** in GitHub repo settings once DNS resolves to provision the free Let's Encrypt SSL certificate. | Phase 4 |
| **GO-04** | **Production Verification (Phase 5)** | Run full end-to-end audit on `https://the6thelement.co.uk`: Toast Tables booking, Menu Studio 1-click publishing drill, mobile checks, and Google Rich Results Schema test. | Phase 5 |

---

## 🔵 3. Future Exploration & Enhancement Backlog

The following features have been scoped or requested for future exploration once the site is live on GitHub Pages:

### 3.1 Media & Visual Experience
| ID | Feature | Description | Priority |
|---|---|---|---|
| **BK-01** | **Ambient Video Background Loop** | Subdued, high-aesthetic background video loop of the café/lounge (morning steam, evening pour) with battery-saving auto-pause on mobile. | Medium |
| **BK-02** | **Photo & Video Reels Lightbox** | Interactive gallery showcasing interior architecture, latte art, cocktails, and seasonal dishes with touch-swipe on mobile devices. | Medium |
| **BK-03** | **Instagram Graph API Live Feed** | Replace static curated grid with real-time feed fetching the latest posts and reels from `@thesixthelementrichmond`. | Low |

### 3.2 Guest Operations & Hospitality
| ID | Feature | Description | Priority |
|---|---|---|---|
| **BK-04** | **Click & Collect / Takeaway Ordering** | Simple mobile-first takeaway ordering for morning coffees, pastries, and brunch dishes with time-slot collection. | Medium |
| **BK-05** | **Private Hire & Events Inquiry Portal** | Interactive inquiry form for private venue hire, evening gatherings, masterclasses, and corporate bookings with date checker and guest estimator. | Medium |
| **BK-06** | **Digital Gift Cards** | Integration with a digital gift voucher provider (e.g., Toast Gift Cards, Square, or Stripe) for custom-amount vouchers. | Low |
| **BK-07** | **Interactive Dietary & Allergen Matrix** | Filterable menu view allowing guests to highlight all items suitable for specific allergen profiles (Nut-Free, Celery, Sesame, Dairy-Free, Egg-Free). | Medium |

### 3.3 Marketing & Community Growth
| ID | Feature | Description | Priority |
|---|---|---|---|
| **BK-08** | **VIP Club / Newsletter Signup** | Elegant footer and popup modal to capture guest emails (e.g. Mailchimp / Klaviyo / Resend) with automated welcome offer. | Medium |
| **BK-09** | **Live Google Reviews Sync** | Automatic periodic sync with Google Places API to showcase fresh 5-star customer testimonials dynamically. | Low |
| **BK-10** | **Community / Local Events Calendar** | Lightweight events calendar for live music evenings, coffee cupping sessions, and Richmond community collaborations. | Low |
| **BK-15** | **Scrolling Promotional Top Ticker (Marquee)** | Upgrade the top announcement bar into an elegant, continuously scrolling ticker (marquee) showcasing live promotions, happy hour timings, and special offers with hover-to-pause, smooth GPU-accelerated animation, and configurable scroll speed. | Medium |

### 3.4 Operational & Admin Tooling
| ID | Feature | Description | Priority |
|---|---|---|---|
| **BK-11** | **Toast POS Direct Menu Integration** | Explore direct sync between Toast POS API and website menu to eliminate manual dual-entry of menu items and pricing. | High (Future) |
| **BK-12** | **Menu Item Availability / 86 Toggle** | Quick-action switch in Staff Portal allowing staff to mark individual dishes as "Sold Out for Today" without deleting them. | High |
| **BK-13** | **Audit Log of Menu Changes** | Visual timestamped history in Staff Portal recording which user made what price or item modification. | Medium |

### 3.5 Quality Assurance & Automated Testing
| ID | Feature | Description | Priority |
|---|---|---|---|
| **BK-14** | **Full Automated Regression Test Pack** | Build and maintain a comprehensive automated regression test pack (unit, component, and end-to-end browser tests) covering all critical user journeys: navigation routing, daylight/evening theme switching, Toast Tables reservation opening, Menu Studio spreadsheet editing and CSV import/export, role-based access control (RBAC) permissions, and mobile touch viewports. Integrated into GitHub Actions CI/CD to run automatically on every future change before merging/deployment. | High |

### 3.6 Search Engine Optimization (SEO) & Local Discoverability
| ID | Feature | Description | Priority |
|---|---|---|---|
| **BK-16** | **Full SEO Analysis & Google Search Enhancement** | Perform a comprehensive technical and content SEO audit to boost Google search rankings and local pack visibility for Richmond and London dining searches. Includes: generating `sitemap.xml` & `robots.txt`, route-specific dynamic OpenGraph/meta tags, expanding Schema.org JSON-LD (Restaurant, Menu, ReserveAction, GeoCoordinates), optimizing Core Web Vitals (LCP, CLS, INP), and aligning high-intent local search keywords (*"specialty coffee Richmond"*, *"brunch East Sheen"*, *"wine bar Upper Richmond Road"*, *"artisan coffee shop SW14"*). | High |

---

## 📝 4. How to Add New Backlog Requests

Whenever you have a new idea or feature request, simply mention it in conversation (e.g., *"Add Click & Collect to the backlog"* or *"Let's explore an 86 toggle for sold out items"*). 

New entries will be recorded with:
1. **Feature Title & Summary**
2. **User Story / Business Value**
3. **Category** (Guest Experience, Kitchen/Ops, Marketing, Admin)
4. **Estimated Complexity & Priority**
