# The Sixth Element — Feature & Product Backlog

A living backlog and product roadmap for **The Sixth Element** website and digital operations platform. This document tracks all completed features, active release milestones, and queued ideas for future exploration.

---

## 📌 Standardized Status Lifecycle
- 🟢 **Complete**: Fully implemented, tested, verified, and live in the codebase.
- 🟡 **Pending Go-Live**: Implementation complete; awaiting external operational action (e.g. 123-reg.co.uk DNS cutover).
- 🔵 **Prioritised**: High priority; scoped, agreed upon, and queued as immediate next priorities.
- ⚪ **Backlog**: Validated enhancements scheduled for subsequent roadmap phases.
- 💡 **Discovery**: Early concepts under research or viability/API feasibility assessment.

---

## 🟢 1. Completed Features (Production & Main)

### 1.1 Architecture, Theme & Modularization (Phase 1)
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-01** | **Monolith Decomposition** | Replaced 2,652-line monolithic `App.jsx` with structured architecture: `src/theme/`, `src/components/`, `src/pages/`, `src/data/`, and `src/utils/`. | 🟢 Complete |
| **FEAT-02** | **Centralized Design Tokens** | Unified luxury color palette (`Earth Brown #4B3621`, `Moss Green #606E3D`, `Warm Amber #BF8A2F`, `Charcoal #2C2C2C`, `Cream #FAF8F0`) and typography (`Cormorant Garamond` & `Outfit`). | 🟢 Complete |
| **FEAT-03** | **Time-Based Theme Engine** | Automatic daylight (AM) to evening (PM lounge) styling driven by UK London time (`Europe/London` handling BST/GMT) with configurable admin switch hour. | 🟢 Complete |
| **FEAT-04** | **Dedicated Page Routing** | Client-side routing for Home, Menu, Social Impact, Our Story, Contact, Staff Portal (`/staff`), and Menu Studio (`/studio`) with browser back/forward history and scroll-to-top. | 🟢 Complete |

### 1.2 Menu Management & CSV Studio (Phase 2)
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-05** | **Interactive Menu Studio** | In-browser spreadsheet for batch-editing daytime & evening menus, descriptions, prices, categories, and dietary tags (`V`, `VE`, `GF`, `GF*`). | 🟢 Complete |
| **FEAT-06** | **CSV Import & Export** | 1-click download of the complete menu as `sixth_element_menu.csv` for editing in Excel/Google Sheets, plus drag-and-drop CSV upload and parsing. | 🟢 Complete |
| **FEAT-07** | **1-Click GitHub Direct Publisher** | Client-side GitHub API publisher allowing authorized admins to push menu changes directly to GitHub from the browser without CLI tools. | 🟢 Complete |
| **FEAT-08** | **Integrated Menu Studio Route** | Rendered Menu Studio as a full-page experience (`/studio`) retaining the website logo and main navigation links at the top. | 🟢 Complete |

### 1.3 Staff & User Management with RBAC
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-09** | **Role-Based Access Control (RBAC)** | Multi-user credential store with 5 roles: `Owner` (Pooja Somani), `Admin` (Deepak), `Manager`, `Shift Lead`, and `Chef / Kitchen`. | 🟢 Complete |
| **FEAT-10** | **Granular Publishing Permissions** | Only `Admin` and `Owner` accounts can publish updates to the live site; other staff roles can edit menus and save local drafts. | 🟢 Complete |
| **FEAT-11** | **User Management UI** | Dedicated Admin tab to view staff, add new team members with custom titles/roles, update credentials, and delete staff accounts (with Owner deletion protection). | 🟢 Complete |
| **FEAT-12** | **Cross-Network Auth & Fallback** | Secure SHA-256 password hashing with a pure JavaScript cryptographic fallback to allow testing across local WiFi/LAN (`http://192.168.1.195:5173/`). | 🟢 Complete |

### 1.4 Hosting, CI/CD & Infrastructure (Phase 3)
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-13** | **GitHub Actions CI/CD** | Automated pipeline (`.github/workflows/deploy.yml`) that builds Vite and deploys static artifacts to GitHub Pages on every push to `main`. | 🟢 Complete |
| **FEAT-14** | **Vercel Elimination** | Removed legacy serverless API routes (`/api/admin-auth.js`, `/api/content.js`) and Vercel dependencies, transitioning to permanent zero-cost hosting. | 🟢 Complete |
| **FEAT-15** | **Custom Domain & SPA Routing** | Added `public/CNAME` (`the6thelement.co.uk`) and `public/404.html` SPA routing redirect script for smooth sub-page reloads. | 🟢 Complete |
| **FEAT-16** | **Supabase Decommissioning** | Removed unused database connections; converted promotions, announcement bars, and operational flags to persistent browser storage. | 🟢 Complete |

### 1.5 Guest Experience & Mobile Optimizations
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-17** | **Toast Tables Broadened Modal** | Expanded the reservation modal container to `min(980px, 95vw)` for comfortable calendar, party size, and seating-time selection. | 🟢 Complete |
| **FEAT-18** | **iOS & Android Touch Tuning** | Added `viewport-fit=cover`, dynamic viewport heights (`100dvh`), iOS notch safe-area padding, `-webkit-backdrop-filter` glassmorphism, 16px input minimum font size (no auto-zoom), and removed 300ms tap delay. | 🟢 Complete |
| **FEAT-19** | **Top Announcement Bar** | Configurable site-wide promotional banner with dismiss/persist logic and real-time Admin Console management. | 🟢 Complete |
| **FEAT-20** | **Staff Portal Dedicated Page** | Replaced the narrow 380px drawer with a full-width dedicated workspace at `/staff`. | 🟢 Complete |
| **FEAT-21** | **Static Content Sanitization** | Removed all hardcoded personal names from login footers, input placeholders, user subtitles, and static copy, ensuring a clean, professional interface. | 🟢 Complete |
| **FEAT-22** | **Automated Navigation AM/PM** | Removed manual sun/moon toggle buttons from top navigation; the theme now transitions dynamically and automatically. | 🟢 Complete |

### 1.6 Marketing Ticker, Data Pipelines & Production Release
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-23** | **Scrolling Promotional Marquee (BK-15)** | GPU-accelerated continuous ribbon ticker with hover/focus pause, manual pause toggle button, and interactive offer details modal. | 🟢 Complete |
| **FEAT-24** | **Historical Sales Catch-Up (DATA-01)** | Automated tool reconciling and posting 73 days of backlog daily sales journals from Toast directly into Xero. | 🟢 Complete |
| **FEAT-25** | **Diagnostic Logging & Health Dashboard (OPS-01)** | Toggleable detailed execution logs and failure alerting for morning 05:15 AM runs. | 🟢 Complete |
| **FEAT-26** | **Production Staging & GitHub Pages Deployment (GO-01)** | Successfully merged `dev` to `main`, triggered automated GitHub Actions build, and deployed to production. | 🟢 Complete |
| **FEAT-27** | **1-Click Print-Ready PDF Menu Generator (BK-23)** | Built-in A4/A5 physical dining room menu generator matching brand typography for instant daily service printouts from Menu Studio and Staff Portal. | 🟢 Complete |
| **FEAT-28** | **Local SEO & Google Search Enhancement (BK-16)** | Full technical SEO crawl suite: sitemap.xml, robots.txt, canonical domain alignment, Google ReserveAction Toast Tables schema, rich OpenGraph metadata, and local Richmond/East Sheen keyword targeting. | 🟢 Complete |
| **FEAT-29** | **Website Footfall & Buying Intent Telemetry (BK-28)** | Privacy-first first-party customer intent telemetry, Supabase schema migration, Staff Portal live analytics tab, and automated 05:15 AM cross-correlation digest in Toast-to-Xero sync engine. | 🟢 Complete |

### 1.7 Live Social Sync & Homepage Experience Redesign
| ID | Feature | Description | Status |
|---|---|---|---|
| **FEAT-30** | **Live Instagram Feed Integration (BK-03)** | Connected `@the.sixth.element.210` via Behold.so feed API. Option B Bento Grid with cached high-res photography (`public/images/instagram/`), authentic caption tags, real engagement counts, zero widget fees, and an automated 6-hour GitHub Actions sync (`.github/workflows/sync-instagram.yml`). | 🟢 Complete |
| **FEAT-31** | **Symmetrical Hero Architecture & Five Elements Redesign** | Reorganized above-the-fold hero into a balanced 2-column layout. Left Column: The Five Elements (*Earth, Water, Fire, Air, Ether*), featuring custom vector SVG icons defining each element, with Ether as the fifth element spanning the foundation with Roman numeral `V`. Right Column: The Sixth Element with subtitle "A Sense of Belonging", gilded Roman numeral `VI`, lead manifesto quote, day-to-night transformation narrative, and primary action buttons. | 🟢 Complete |
| **FEAT-32** | **Dynamic Experience Elimination & Direct Instagram Scroll** | Removed the standalone "Dynamic Experience" (Two Moods, One Space / AM & PM showcase) section to streamline vertical real estate above the fold. Updated scroll prompt to "Live Moments" with smooth scroll directly to `#instagram-feed`. | 🟢 Complete |
| **FEAT-33** | **Uniform Rectangle Hero & Scaled Typography** | Implemented editorial hero composition featuring left showcase poster framed to match the exact combined height of the right cards (`align-items: stretch`). Scaled up fonts, icons, and card padding proportionally across *Our Foundation* and *The Sixth Element* for readability and luxury presence. Sits lowered below the navbar with zero logo overlap. | 🟢 Complete |
| **FEAT-34** | **Single-Line Navbar Logo Lockup & Ether Standardization** | Streamlined top-left logo text to "The Sixth Element" on 1 line alongside the logomark for a sleek navbar profile and enhanced headroom. Standardized "Ether" as the universal reference to the fifth element across the site and philosophical copy. | 🟢 Complete |
| **FEAT-35** | **Mobile UX, Responsive Grid & Touch Targets Optimization (iOS/Android)** | Full mobile rendering polish across iOS Safari & Android Chrome: balanced 5-element matrix so Ether spans row 3 symmetrically on `<480px`, optimized hero poster height (260–280px), locked background body scroll on open drawers/modals, enlarged interactive touch targets to 44×44px, standardized RFC 3966 `tel:+442035188688` links, added Escape key dismissal, and enabled high-priority LCP hero image preload. | 🟢 Complete |

---

## 🟢 2. Go-Live Milestones (Production Cutover & Verification)

| ID | Milestone Item | Description | Target | Priority | Status |
|---|---|---|---|---|---|
| **GO-01** | **Merge `dev` into `main`** | Merge the verified `dev` branch into `main` to trigger the production GitHub Actions build. | Immediate | High | 🟢 Complete |
| **GO-02** | **123-reg.co.uk DNS Cutover (Phase 4)** | Replaced Vercel A record with 4 GitHub Pages Apex IPs and configured `www` CNAME to `the-6th-element.github.io`. DNS live worldwide. | Phase 4 | High | 🟢 Complete |
| **GO-03** | **GitHub Pages HTTPS Enforcement** | Let's Encrypt SSL/TLS certificate issued and Enforce HTTPS successfully enabled. All traffic encrypted over `https://the6thelement.co.uk`. | Phase 4 | High | 🟢 Complete |
| **GO-04** | **Production Verification (Phase 5)** | Run full end-to-end audit on `https://the6thelement.co.uk`: Toast Tables booking, Menu Studio 1-click publishing drill, mobile checks, and Google Rich Results Schema test. | Phase 5 | High | 🟢 Complete |

---

## 🔵 3. Future Exploration & Enhancement Backlog

The following features have been scoped or requested for future exploration once the site is live on GitHub Pages:

### 3.1 Media & Visual Experience
| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| **BK-01** | **Ambient Video Background Loop** | Subdued, high-aesthetic background video loop of the café/lounge (morning steam, evening pour) with battery-saving auto-pause on mobile. | Medium | ⚪ Backlog |
| **BK-02** | **Photo & Video Reels Lightbox** | Interactive gallery showcasing interior architecture, latte art, cocktails, and seasonal dishes with touch-swipe on mobile devices. | Medium | ⚪ Backlog |
| **BK-03** | **Automated Live Instagram Feed Sync** | Connected live feed `@the.sixth.element.210` via Behold.so and cached assets to `public/images/instagram/`. Option B Bento Grid live with 6-hr GitHub Actions automated cron sync. | High | 🟢 Complete |
| **BK-17** | **Interactive Day-to-Night Vibe Slider** | An interactive time-scrubber on the homepage allowing visitors to slide from 8:00am Morning Coffee to 12:30pm Brunch to 5:30pm Golden Hour to 9:00pm Candlelit Lounge, watching the atmosphere, lighting, and dishes morph dynamically. | High | 🔵 Prioritised |
| **BK-18** | **"Sounds of The Sixth Element" Curated Spotify Audio Integration** | Lifestyle music widget linking to curated daytime acoustic/lo-fi and evening vinyl/jazz playlists to immerse guests in the venue's audio identity. | Low | 💡 Discovery |
| **BK-25** | **Instagram Story Circles & Mobile Highlights** | Tappable story bubbles on the mobile homepage inspired by Instagram stories (*Today's Bakes*, *Wine of the Week*, *Old Spike Coffee*, *Dogs of Sixth Element*), providing quick video reel previews without leaving the site. | Medium | ⚪ Backlog |
| **BK-32** | **Subtle Tactile Paper Grain & Glassmorphic Noise Overlay** | Lightweight CSS/SVG noise texture overlay adding editorial tactile warmth and luxury print aesthetic across dark and cream backgrounds. | Medium | ⚪ Backlog |

### 3.2 Guest Operations & Hospitality
| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| **BK-04** | **Click & Collect / Takeaway Ordering** | Simple mobile-first takeaway ordering for morning coffees, pastries, and brunch dishes with time-slot collection. | Medium | ⚪ Backlog |
| **BK-05** | **Private Hire & Events Inquiry Portal** | Interactive inquiry form for private venue hire, evening gatherings, masterclasses, and corporate bookings with date checker and guest estimator. | Medium | ⚪ Backlog |
| **BK-06** | **Digital Gift Cards** | Integration with a digital gift voucher provider (e.g., Toast Gift Cards, Square, or Stripe) for custom-amount vouchers with instant email delivery. | High | 🔵 Prioritised |
| **BK-07** | **Interactive Dietary & Allergen Matrix** | Filterable menu view allowing guests to highlight all items suitable for specific allergen profiles (Nut-Free, Celery, Sesame, Dairy-Free, Egg-Free). | Medium | ⚪ Backlog |
| **BK-19** | **Live Walk-in & Table Availability Indicator** | Real-time 1-tap status switch in Staff Portal allowing staff to signal 🟢 Walk-ins Welcome / 🟡 Short Wait / 🔴 Bookings Only to eliminate customer hesitation and drive spontaneous visits. | Medium | 🔵 Prioritised |
| **BK-20** | **"Dog-Friendly & Richmond Park Walkers" Guide** | Dedicated emblem and micro-section highlighting dog-friendly indoor seating, heated terrace, complimentary organic treats, water bowls, and takeaway coffee hatch for park walkers. | High | 🔵 Prioritised |
| **BK-24** | **Context-Aware WhatsApp Hospitality Concierge** | Floating WhatsApp button with pre-populated contextual messages based on user intent (e.g. large parties of 6+ on Reservations, daily dietary queries on Menu, dog-friendly or table walk-in queries on Contact). | High | 🔵 Prioritised |
| **BK-29** | **Interactive Dietary & Lifestyle Filter Chips (Menu UX)** | Instant client-side filter chips on the Menu page (🌿 Vegetarian, 🌱 Vegan, 🌾 Gluten-Friendly, Halal) with badge counts and smooth CSS transitions. | High | 🔵 Prioritised |
| **BK-30** | **Frosted Mobile Hospitality Quick-Action Bar** | Sticky frosted bottom action bar on mobile devices offering 1-tap Book Table, Call, Directions, and Opening Hours with glassmorphic styling. | High | 🔵 Prioritised |
| **BK-31** | **Real-Time Kitchen & Service Status Pill** | Dynamic navbar pill indicating live kitchen state (e.g., "🟢 Open Now · Serving Daytime Brunch" / "🌙 Evening Plates from 5:30pm") based on current London time. | High | 🔵 Prioritised |
| **BK-33** | **Signature Dish Visual Peek & Lightbox Drawer** | Discrete photo indicator and modal lightbox for signature menu items (e.g., Cardamom French Toast, Old Delhi Butter Chicken, V60 Pour-Over). | Medium | ⚪ Backlog |

### 3.3 Marketing & Community Growth
| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| **BK-08** | **VIP Club / Newsletter Signup** | Elegant footer and popup modal to capture guest emails (e.g. Mailchimp / Klaviyo / Resend) with automated welcome offer. | Medium | ⚪ Backlog |
| **BK-09** | **Live Google Reviews Sync** | Automatic periodic sync with Google Places API to showcase fresh 5-star customer testimonials dynamically. | Low | 💡 Discovery |
| **BK-10** | **Community / Local Events Calendar** | Lightweight events calendar for live music evenings, coffee cupping sessions, and Richmond community collaborations. | Low | 💡 Discovery |
| **BK-15** | **Scrolling Promotional Top Ticker (Marquee)** | Upgrade the top announcement bar into an elegant, continuously scrolling ticker (marquee) showcasing live promotions, happy hour timings, and special offers with hover-to-pause, smooth GPU-accelerated animation, and configurable scroll speed. | Medium | 🟢 Complete |
| **BK-21** | **Ticketed Tasting Masterclasses & Workshops** | Prepaid ticketing system for intimate, limited-seat natural wine tastings, coffee cupping sessions with Old Spike, and live acoustic music nights. | Medium | ⚪ Backlog |
| **BK-22** | **Interactive Provenance & Producers Map ("Story of the Soil")** | Visual interactive story showcasing supplier origins: Old Spike social impact coffee in Peckham, artisan sourdough bakeries, British charcuterie, and biodynamic natural vineyards across Europe/UK. | Medium | ⚪ Backlog |
| **BK-26** | **"VIP Tasting & Secret Drops" WhatsApp Channel** | Opt-in community broadcast channel for Richmond locals receiving rare natural wine uncorking drops, acoustic night invites, and exclusive seasonal perks with ~95% open rates. | Medium | ⚪ Backlog |
| **BK-27** | **OpenGraph Rich Social Sharing Cards (Facebook & WhatsApp)** | High-resolution OpenGraph and Twitter/X card metadata ensuring links shared in local Richmond/East Sheen Facebook groups, WhatsApp chats, and iMessage display stunning branded imagery and compelling venue copy. | High | 🔵 Prioritised |

### 3.4 Technical Performance, PWA & SEO
| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| **BK-34** | **Next-Gen WebP/AVIF Asset Pipeline & Retina Srcset** | Automated compression of photographic assets into modern WebP/AVIF with responsive retina srcset markup, reducing data transfer by ~60%. | Medium | ⚪ Backlog |
| **BK-35** | **Progressive Web App (PWA) Manifest & Add to Home Screen** | Complete `manifest.json` with brand icons, standalone mobile windowing, and splash styling for 1-tap installation on iPhone and Android. | Low | 💡 Discovery |

### 3.5 Operational & Admin Tooling
| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| **BK-11** | **Toast POS Direct Menu Integration** | Explore direct sync between Toast POS API and website menu to eliminate manual dual-entry of menu items and pricing. | High (Future) | 🔵 Prioritised |
| **BK-12** | **Menu Item Availability / 86 Toggle** | Quick-action switch in Staff Portal allowing staff to mark individual dishes as "Sold Out for Today" without deleting them. | High | 🔵 Prioritised |
| **BK-13** | **Audit Log of Menu Changes** | Visual timestamped history in Staff Portal recording which user made what price or item modification. | Medium | ⚪ Backlog |
| **BK-23** | **1-Click Print-Ready PDF Menu Generator** | Export magazine-grade, formatted A4/A5 PDF physical menus directly from the in-browser Menu Studio with 1 click, eliminating manual InDesign/Word formatting when dishes or prices change. | High | 🟢 Complete |

### 3.5 Quality Assurance & Automated Testing
| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| **BK-14** | **Full Automated Regression Test Pack** | Build and maintain a comprehensive automated regression test pack (unit, component, and end-to-end browser tests) covering all critical user journeys: navigation routing, daylight/evening theme switching, Toast Tables reservation opening, Menu Studio spreadsheet editing and CSV import/export, role-based access control (RBAC) permissions, and mobile touch viewports. Integrated into GitHub Actions CI/CD to run automatically on every future change before merging/deployment. | High | 🔵 Prioritised |

### 3.6 Search Engine Optimization (SEO) & Local Discoverability
| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| **BK-16** | **Full SEO Analysis & Google Search Enhancement** | Perform a comprehensive technical and content SEO audit to boost Google search rankings and local pack visibility for Richmond and London dining searches. Includes: generating `sitemap.xml` & `robots.txt`, route-specific dynamic OpenGraph/meta tags, expanding Schema.org JSON-LD (Restaurant, Menu, ReserveAction, GeoCoordinates), optimizing Core Web Vitals (LCP, CLS, INP), and aligning high-intent local search keywords (*"specialty coffee Richmond"*, *"brunch East Sheen"*, *"wine bar Upper Richmond Road"*, *"artisan coffee shop SW14"*). | High | 🟢 Complete |

### 3.7 Analytics & Business Intelligence
| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| **BK-28** | **Monitor Website Traffic and Build Analytics** | Privacy-first website traffic monitoring (daily visitors, session duration, referral channels) and customer intent tracking (menu views, reservation clicks, takeaway links, Google Maps directions) cross-correlated with Toast ePOS covers and daily revenue. Includes integration into the 05:15 AM executive daily email report. | High | 🟢 Complete |

### 3.8 Toast & Xero Data Hub
| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| **DATA-02** | **Shift & Staff Gratuity Distribution Reporting** | Detailed reporting on daily service charge and tip allocations across lunch and evening shifts. | Medium | ⚪ Backlog |
| **DATA-03** | **Tender Reconciliation Alerting** | Flag discrepancies between declared cash drawer totals in Toast and physical bank deposits. | Low | 💡 Discovery |

---

## 📝 4. How to Add New Backlog Requests

Whenever you have a new idea or feature request, simply mention it in conversation (e.g., *"Add Click & Collect to the backlog"* or *"Let's explore an 86 toggle for sold out items"*). 

New entries will be recorded with:
1. **Feature Title & Summary**
2. **User Story / Business Value**
3. **Category** (Guest Experience, Kitchen/Ops, Marketing, Admin)
4. **Estimated Complexity & Priority**
