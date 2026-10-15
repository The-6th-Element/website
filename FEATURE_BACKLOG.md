# The Sixth Element — Master Feature Backlog (v4.0)

A living backlog and product roadmap for **The Sixth Element** website and digital operations platform.
All items follow the unified **`FEATURE-NN`** standard nomenclature with legacy identifiers preserved for full traceability.

---

## 📌 Standardized Status Lifecycle
- 🟢 **Complete**: Fully implemented, tested, verified, and live in the codebase.
- 🟡 **Yet to Deploy**: Fully implemented and tested in DEV; awaiting production release window / deployment.
- 🔵 **Prioritised**: Scoped, agreed upon, and queued as immediate next priorities.
- ⚪ **Backlog**: Scoped enhancements scheduled for subsequent roadmap phases.
- 💡 **Discovery**: Early concepts under research or viability/API feasibility assessment.
- ❌ **Cancelled**: Deprecated, superseded, or formally scrapped per management review.

---

## 📊 Backlog Summary Metrics
- 🟢 **Complete**: 53 items
- 🟡 **Yet to Deploy**: 0 items
- 🔵 **Prioritised**: 11 items
- ⚪ **Backlog**: 19 items
- 💡 **Discovery**: 6 items
- ❌ **Cancelled**: 1 item
- **Total Tracked**: 90 items across 14 Categories

---

## 📋 Master Feature Catalog

| ID | Ref | Category | Feature Name | Description | Priority | Status |
|---|---|---|---|---|:---:|:---:|
| **FEATURE-01** | `FEAT-01` | Architecture & Theme Foundation | **Monolith Decomposition** | Replaced 2,652-line monolithic App.jsx with structured architecture: src/theme/, src/components/, src/pages/, src/data/, and src/utils/. | High | 🟢 Complete |
| **FEATURE-02** | `FEAT-02` | Architecture & Theme Foundation | **Centralized Design Tokens** | Unified luxury color palette (Earth Brown #4B3621, Moss Green #606E3D, Warm Amber #BF8A2F, Charcoal #2C2C2C, Cream #FAF8F0) and typography (Cormorant Garamond & Outfit). | High | 🟢 Complete |
| **FEATURE-03** | `FEAT-03` | Architecture & Theme Foundation | **Time-Based Theme Engine** | Automatic daylight (morning coffee) to evening (candlelit wine bar) switch based on UK London time (Europe/London handling BST/GMT) with admin switch-hour override. | High | 🟢 Complete |
| **FEATURE-04** | `FEAT-04` | Architecture & Theme Foundation | **Dedicated Page Routing** | Client-side routing for Home, Menu, Social Impact, Our Story, Contact, Staff Portal (/staff), and Menu Studio (/studio) with browser back/forward history and scroll-to-top. | High | 🟢 Complete |
| **FEATURE-05** | `FEAT-05` | Menu Management & In-Browser Studio | **Interactive Menu Studio** | In-browser spreadsheet for batch-editing daytime & evening dishes, descriptions, prices, categories, and dietary tags (V, VE, GF, GF*). | High | 🟢 Complete |
| **FEATURE-06** | `FEAT-06` | Menu Management & In-Browser Studio | **CSV Import & Export** | 1-click download of the complete menu as sixth_element_menu.csv for editing in Excel/Google Sheets, plus drag-and-drop CSV upload and parsing. | High | 🟢 Complete |
| **FEATURE-07** | `FEAT-07` | Menu Management & In-Browser Studio | **1-Click GitHub Direct Publisher** | Client-side GitHub API publisher allowing authorized admins to push menu changes directly to GitHub from the browser without CLI tools. | High | 🟢 Complete |
| **FEATURE-08** | `FEAT-08` | Menu Management & In-Browser Studio | **Integrated Menu Studio Route** | Rendered Menu Studio as a full-page experience (/studio) retaining the website logo and main navigation links at the top. | High | 🟢 Complete |
| **FEATURE-09** | `FEAT-09` | Staff & Role-Based Access Control (RBAC) | **Role-Based Access Control (RBAC)** | Multi-user credential store with 5 roles: Owner (Pooja Somani), Admin (Deepak), Manager, Shift Lead, and Chef / Kitchen. | High | 🟢 Complete |
| **FEATURE-10** | `FEAT-10` | Staff & Role-Based Access Control (RBAC) | **Granular Publishing Permissions** | Only Admin and Owner accounts can publish updates to the live site; other staff roles can edit menus and save local drafts. | High | 🟢 Complete |
| **FEATURE-11** | `FEAT-11` | Staff & Role-Based Access Control (RBAC) | **User Management UI** | Dedicated Admin tab to view staff, add new team members with custom titles/roles, update credentials, delete staff accounts (with Owner deletion protection), and configure secret security questions. | High | 🟢 Complete |
| **FEATURE-12** | `FEAT-12` | Staff & Role-Based Access Control (RBAC) | **Cross-Network Auth & Fallback** | Secure SHA-256 password hashing with a pure JavaScript cryptographic fallback to allow testing across local WiFi/LAN (http://192.168.1.195:5173/). | High | 🟢 Complete |
| **FEATURE-13** | `FEAT-13` | Hosting, CI/CD & Infrastructure | **GitHub Actions CI/CD** | Automated pipeline (.github/workflows/deploy.yml) that builds Vite and deploys static artifacts to GitHub Pages on every push to main. | High | 🟢 Complete |
| **FEATURE-14** | `FEAT-14` | Hosting, CI/CD & Infrastructure | **Vercel Elimination** | Removed legacy serverless API routes (/api/admin-auth.js, /api/content.js) and Vercel dependencies, transitioning to permanent zero-cost hosting. | High | 🟢 Complete |
| **FEATURE-15** | `FEAT-15` | Hosting, CI/CD & Infrastructure | **Custom Domain & SPA Routing** | Added public/CNAME (the6thelement.co.uk) and public/404.html SPA routing redirect script for smooth sub-page reloads. | High | 🟢 Complete |
| **FEATURE-16** | `FEAT-16` | Hosting, CI/CD & Infrastructure | **Supabase Decommissioning** | Removed unused database connections; converted promotions, announcement bars, and operational flags to persistent browser storage. | High | 🟢 Complete |
| **FEATURE-17** | `FEAT-17` | Guest Experience & Mobile Optimizations | **Toast Tables Broadened Modal** | Expanded the reservation modal container to min(980px, 95vw) for comfortable calendar, party size, and seating-time selection. | High | 🟢 Complete |
| **FEATURE-18** | `FEAT-18` | Guest Experience & Mobile Optimizations | **iOS & Android Touch Tuning** | Added viewport-fit=cover, dynamic viewport heights (100dvh), iOS notch safe-area padding, -webkit-backdrop-filter glassmorphism, 16px input minimum font size (no auto-zoom), and removed 300ms tap delay. | High | 🟢 Complete |
| **FEATURE-19** | `FEAT-19` | Guest Experience & Mobile Optimizations | **Top Announcement Bar** | Configurable site-wide promotional banner with dismiss/persist logic and real-time Admin Console management. | Medium | 🟢 Complete |
| **FEATURE-20** | `FEAT-20` | Staff & Role-Based Access Control (RBAC) | **Staff Portal Dedicated Page** | Replaced the narrow 380px drawer with a full-width dedicated workspace at /staff. | High | 🟢 Complete |
| **FEATURE-21** | `FEAT-21` | Guest Experience & Mobile Optimizations | **Static Content Sanitization** | Removed all hardcoded personal names from login footers, input placeholders, user subtitles, and static copy, ensuring a clean, professional interface. | Medium | 🟢 Complete |
| **FEATURE-22** | `FEAT-22` | Architecture & Theme Foundation | **Automated Navigation AM/PM** | Removed manual sun/moon toggle buttons from top navigation; the theme now transitions dynamically and automatically. | Medium | 🟢 Complete |
| **FEATURE-23** | `FEAT-23 / BK-15` | Marketing & Community Growth | **Scrolling Promotional Marquee** | GPU-accelerated continuous ribbon ticker with hover/focus pause, manual pause toggle button, and interactive offer details modal. | High | 🟢 Complete |
| **FEATURE-24** | `FEAT-24 / DATA-01` | Data Hub & Financial Pipelines | **Historical Sales Catch-Up** | Automated tool reconciling and posting 73 days of backlog daily sales journals from Toast directly into Xero. | High | 🟢 Complete |
| **FEATURE-25** | `FEAT-25 / OPS-01` | Operations & System Health | **Diagnostic Logging & Health Dashboard** | Toggleable detailed execution logs and failure alerting for morning 05:15 AM runs in the Toast-to-Xero integration. | High | 🟢 Complete |
| **FEATURE-26** | `FEAT-26 / GO-01` | Production Cutover & Verification | **Production Staging & GitHub Pages Deployment** | Merged dev to main, triggered automated GitHub Actions build, and deployed to production environment. | High | 🟢 Complete |
| **FEATURE-27** | `FEAT-27 / BK-23` | Menu Management & In-Browser Studio | **1-Click Print-Ready PDF Menu Generator** | Built-in A4/A5 physical dining room menu generator matching brand typography for instant daily service printouts from Menu Studio and Staff Portal. | High | 🟢 Complete |
| **FEATURE-28** | `FEAT-28 / BK-16` | Technical SEO & Discoverability | **Local SEO & Google Search Enhancement** | Full technical SEO crawl suite: sitemap.xml, robots.txt, canonical domain alignment, Google ReserveAction Toast Tables schema, rich OpenGraph metadata, and local Richmond/East Sheen keyword targeting. | High | 🟢 Complete |
| **FEATURE-29** | `FEAT-29 / BK-28` | Data Hub & Financial Pipelines | **Website Footfall & Buying Intent Telemetry** | Privacy-first first-party customer intent telemetry, Supabase schema migration, Staff Portal live analytics tab, and automated 05:15 AM cross-correlation digest in Toast-to-Xero sync engine. | High | 🟢 Complete |
| **FEATURE-30** | `FEAT-30 / BK-03` | Marketing & Community Growth | **Live Instagram Feed Integration** | Connected @the.sixth.element.210 via Behold.so feed API. Option B Bento Grid with cached high-res photography (public/images/instagram/), authentic caption tags, real engagement counts, zero widget fees, and an automated 6-hour GitHub Actions sync. | High | 🟢 Complete |
| **FEATURE-31** | `FEAT-31` | Guest Experience & Mobile Optimizations | **Symmetrical Hero Architecture & Five Elements Redesign** | Reorganized above-the-fold hero into a balanced 2-column layout. Left Column: The Five Elements (Earth, Water, Fire, Air, Ether), featuring custom vector SVG icons defining each element, with Ether as the fifth element spanning the foundation with Roman numeral V. Right Column: The Sixth Element with subtitle 'A Sense of Belonging', gilded Roman numeral VI, lead manifesto quote, day-to-night transformation narrative, and primary action buttons. | High | 🟢 Complete |
| **FEATURE-32** | `FEAT-32` | Guest Experience & Mobile Optimizations | **Dynamic Experience Elimination & Direct Instagram Scroll** | Removed the standalone 'Dynamic Experience' (Two Moods, One Space / AM & PM showcase) section to streamline vertical real estate above the fold. Updated scroll prompt to 'Live Moments' with smooth scroll directly to #instagram-feed. | Medium | 🟢 Complete |
| **FEATURE-33** | `FEAT-33` | Guest Experience & Mobile Optimizations | **Uniform Rectangle Hero & Scaled Typography** | Implemented editorial hero composition featuring left showcase poster framed to match the exact combined height of the right cards (align-items: stretch). Scaled up fonts, icons, and card padding proportionally across Our Foundation and The Sixth Element for readability and luxury presence. Sits lowered below the navbar with zero logo overlap. | High | 🟢 Complete |
| **FEATURE-34** | `FEAT-34` | Guest Experience & Mobile Optimizations | **Single-Line Navbar Logo Lockup & Ether Standardization** | Streamlined top-left logo text to 'The Sixth Element' on 1 line alongside the logomark for a sleek navbar profile and enhanced headroom. Standardized 'Ether' as the universal reference to the fifth element across the site and philosophical copy. | Medium | 🟢 Complete |
| **FEATURE-35** | `FEAT-35` | Guest Experience & Mobile Optimizations | **Mobile UX, Responsive Grid & Touch Targets Optimization** | Full mobile rendering polish across iOS Safari & Android Chrome: balanced 5-element matrix so Ether spans row 3 symmetrically on <480px, optimized hero poster height (260–280px), locked background body scroll on open drawers/modals, enlarged interactive touch targets to 44×44px, standardized RFC 3966 tel:+442035188688 links, added Escape key dismissal, and enabled high-priority LCP hero image preload. | High | 🟢 Complete |
| **FEATURE-36** | `GO-02` | Production Cutover & Verification | **123-reg.co.uk DNS Cutover** | Replaced Vercel A records with 4 GitHub Pages Apex IPs (185.199.108.153, .109, .110, .111) and configured www CNAME to the-6th-element.github.io. DNS live worldwide. | High | 🟢 Complete |
| **FEATURE-37** | `GO-03` | Production Cutover & Verification | **GitHub Pages HTTPS Enforcement** | Let's Encrypt SSL/TLS certificate issued and Enforce HTTPS successfully enabled on GitHub Pages. All production traffic securely encrypted over https://the6thelement.co.uk. | High | 🟢 Complete |
| **FEATURE-38** | `GO-04` | Production Cutover & Verification | **Production Verification & Audit** | Ran full end-to-end audit on live site https://the6thelement.co.uk: Toast Tables booking workflow, Menu Studio 1-click publishing drill, mobile checks, and Google Rich Results Schema verification. | High | 🟢 Complete |
| **FEATURE-39** | `BK-14` | Quality Assurance & Automated Testing | **Full Automated Regression Test Pack** | Comprehensive automated regression test pack (Vitest + Testing Library + jsdom) with 31/31 unit, component, and RBAC tests passing. Integrated into GitHub Actions CI/CD to run automatically on every push with pre-deployment quality gates. | High | 🟢 Complete |
| **FEATURE-40** | `BK-38` | Staff & Role-Based Access Control (RBAC) | **Self-Service Password Reset via Secret Questions** | Secure self-service account recovery allowing staff to reset forgotten passwords by answering a chosen security question from 8 predefined options. Features one-time setup on login, SHA-256 hashed answers, interactive Forgot Password drawer, and Admin Console credential management. | High | 🟢 Complete |
| **FEATURE-41** | `BK-39` | Operations & System Health | **Guaranteed 05:15 AM External Scheduler** | Replaced delayed GitHub Actions scheduled cron queue with dedicated external webhook trigger (cron-job.org) targeting /actions/workflows/daily_sync.yml/dispatches at 05:15 AM Europe/London with sub-second precision. Delivers daily financial & footfall telemetry reports on time. | High | 🟢 Complete |
| **FEATURE-42** | `BK-29` | Guest Experience & Mobile Optimizations | **Interactive Dietary & Lifestyle Filter Chips (Menu UX)** | Instant client-side filter chips on the Menu page (Vegetarian, Plant-Based, Gluten Free) with badge counts, Option A dish filtering, and telemetry integration. Fully tested and verified live in production via BK-14 regression test pack. | High | 🟢 Complete |
| **FEATURE-43** | `BK-24` | Guest Experience & Mobile Optimizations | **Context-Aware WhatsApp Hospitality Concierge** | Floating WhatsApp concierge button with pre-populated contextual messages based on user intent (e.g. large parties of 6+ on Reservations, daily dietary queries on Menu, dog-friendly or table walk-in queries on Contact). | High | 🔵 Prioritised |
| **FEATURE-44** | `BK-06` | Guest Experience & Mobile Optimizations | **Digital Gift Cards Integration** | Integration with digital gift voucher provider (e.g. Toast Gift Cards, Square, or Stripe) for custom-amount vouchers with instant email delivery. | High | 🔵 Prioritised |
| **FEATURE-45** | `BK-19` | Guest Experience & Mobile Optimizations | **Live Walk-in & Table Availability Indicator** | Real-time 1-tap status switch in Staff Portal allowing staff to signal Walk-ins Welcome / Short Wait / Bookings Only to eliminate customer hesitation and drive spontaneous visits. | Medium | 🔵 Prioritised |
| **FEATURE-46** | `BK-20` | Guest Experience & Mobile Optimizations | **Dog-Friendly & Richmond Park Walkers Guide** | Dedicated emblem and micro-section highlighting dog-friendly indoor seating, heated terrace, complimentary organic treats, water bowls, and takeaway coffee hatch for park walkers. | High | 🔵 Prioritised |
| **FEATURE-47** | `BK-30` | Guest Experience & Mobile Optimizations | **Frosted Mobile Hospitality Quick-Action Bar** | Sticky frosted bottom action bar on mobile devices offering 1-tap Book Table, Call, Directions, and Opening Hours with glassmorphic styling. | High | 🔵 Prioritised |
| **FEATURE-48** | `BK-31` | Guest Experience & Mobile Optimizations | **Real-Time Kitchen & Service Status Pill** | Dynamic navbar pill indicating live kitchen state ('Open Now · Serving Daytime Brunch' / 'Evening Plates from 5:30pm') based on current London time. | High | 🔵 Prioritised |
| **FEATURE-49** | `BK-17` | Guest Experience & Mobile Optimizations | **Interactive Day-to-Night Vibe Slider** | Interactive time-scrubber on the homepage allowing visitors to slide from 8:00am Morning Coffee to 12:30pm Brunch to 5:30pm Golden Hour to 9:00pm Candlelit Lounge, watching lighting and dishes morph dynamically. | High | 🔵 Prioritised |
| **FEATURE-50** | `BK-27` | Marketing & Community Growth | **OpenGraph Rich Social Sharing Cards** | High-resolution OpenGraph and Twitter/X card metadata ensuring links shared in local Richmond/East Sheen Facebook groups, WhatsApp chats, and iMessage display stunning branded imagery and compelling venue copy. | High | 🔵 Prioritised |
| **FEATURE-51** | `BK-36 / TOAST-04` | Operations & System Health | **Toast Day-Wise Opening Hours Ingestion & Omnichannel Refresh (Website & Google Pages)** | Automated pipeline to fetch day-wise operating hours and holiday schedules directly from Toast API, and programmatically refresh them across the Website (Contact page, Footer, and Schema.org JSON-LD) and Google Pages (Google Business Profile & Maps Knowledge Panel). | High | 🔵 Prioritised |
| **FEATURE-52** | `BK-37` | Marketing & Community Growth | **Social Brand Awareness & Multi-Platform Campaigns** | Strategic framework and digital tooling to elevate brand awareness across Instagram, Facebook, TikTok, and Nextdoor: includes campaign landing flows, deep-linked UTM attribution into Toast bookings, and graphics templates. | High | 🔵 Prioritised |
| **FEATURE-53** | `BK-11` | Menu Management & In-Browser Studio | **Toast POS Direct Menu Integration** | Explore direct sync between Toast POS API and website menu to eliminate manual dual-entry of menu items and pricing. | High | 🔵 Prioritised |
| **FEATURE-54** | `BK-04` | Guest Experience & Mobile Optimizations | **Click & Collect / Takeaway Ordering** | Simple mobile-first takeaway ordering for morning coffees, pastries, and brunch dishes with time-slot collection. | Medium | ⚪ Backlog |
| **FEATURE-55** | `BK-05` | Guest Experience & Mobile Optimizations | **Private Hire & Events Inquiry Portal** | Interactive inquiry form for private venue hire, evening gatherings, masterclasses, and corporate bookings with date checker and guest estimator. | Medium | ⚪ Backlog |
| **FEATURE-56** | `BK-07` | Guest Experience & Mobile Optimizations | **Interactive Dietary & Allergen Matrix** | Filterable menu view allowing guests to highlight all items suitable for specific allergen profiles (Nut-Free, Celery, Sesame, Dairy-Free, Egg-Free). | Medium | ⚪ Backlog |
| **FEATURE-57** | `BK-08` | Marketing & Community Growth | **VIP Club / Newsletter Signup** | Elegant footer and popup modal to capture guest emails (e.g. Mailchimp / Klaviyo / Resend) with automated welcome offer. | Medium | ⚪ Backlog |
| **FEATURE-58** | `BK-21` | Marketing & Community Growth | **Ticketed Tasting Masterclasses & Workshops** | Prepaid ticketing system for intimate, limited-seat natural wine tastings, coffee cupping sessions with Old Spike, and live acoustic music nights. | Medium | ⚪ Backlog |
| **FEATURE-59** | `BK-22` | Marketing & Community Growth | **Interactive Provenance & Producers Map** | Visual interactive story ('Story of the Soil') showcasing supplier origins: Old Spike coffee in Peckham, artisan sourdough bakeries, British charcuterie, and biodynamic European vineyards. | Medium | ⚪ Backlog |
| **FEATURE-60** | `BK-26` | Marketing & Community Growth | **VIP Tasting & Secret Drops WhatsApp Channel** | Opt-in community broadcast channel for Richmond locals receiving rare natural wine uncorking drops, acoustic night invites, and exclusive seasonal perks with ~95% open rates. | Medium | ⚪ Backlog |
| **FEATURE-61** | `BK-01` | Media, Visual & Audio Experience | **Ambient Video Background Loop** | Subdued, high-aesthetic background video loop of the café/lounge (morning steam, evening wine pour) with battery-saving auto-pause on mobile viewports. | Medium | ⚪ Backlog |
| **FEATURE-62** | `BK-02` | Media, Visual & Audio Experience | **Photo & Video Reels Lightbox** | Interactive gallery showcasing interior architecture, latte art, cocktails, and seasonal dishes with touch-swipe on mobile devices. | Medium | ⚪ Backlog |
| **FEATURE-63** | `BK-25` | Media, Visual & Audio Experience | **Instagram Story Circles & Mobile Highlights** | Tappable story bubbles on mobile homepage (Today's Bakes, Wine of the Week, Old Spike Coffee, Dogs of Sixth Element) providing quick video reel previews without leaving the site. | Medium | ⚪ Backlog |
| **FEATURE-64** | `BK-32` | Architecture & Theme Foundation | **Subtle Tactile Paper Grain & Noise Overlay** | Lightweight CSS/SVG noise texture overlay adding editorial tactile warmth and luxury print aesthetic across dark and cream backgrounds. | Medium | ⚪ Backlog |
| **FEATURE-65** | `BK-33` | Guest Experience & Mobile Optimizations | **Signature Dish Visual Peek & Lightbox Drawer** | Discrete photo indicator and modal lightbox for signature menu items (e.g. Cardamom French Toast, Old Delhi Butter Chicken, V60 Pour-Over). | Medium | ⚪ Backlog |
| **FEATURE-66** | `BK-34` | Technical Performance, PWA & SEO | **Next-Gen WebP/AVIF Asset Pipeline & Retina Srcset** | Automated compression of photographic assets into modern WebP/AVIF with responsive retina srcset markup, reducing data transfer by ~60%. | Medium | ⚪ Backlog |
| **FEATURE-67** | `BK-13` | Staff & Role-Based Access Control (RBAC) | **Audit Log of Menu Changes** | Visual timestamped history in Staff Portal recording which user made what price or item modification. | Medium | ⚪ Backlog |
| **FEATURE-68** | `DATA-02` | Data Hub & Financial Pipelines | **Shift & Staff Gratuity Distribution Reporting** | Automated reporting on daily service charge and tip allocations across lunch and evening shifts. | Medium | ⚪ Backlog |
| **FEATURE-69** | `BK-09` | Marketing & Community Growth | **Live Google Reviews Sync** | Automatic periodic sync with Google Places API to showcase fresh 5-star customer testimonials dynamically. | Low | 💡 Discovery |
| **FEATURE-70** | `BK-10` | Marketing & Community Growth | **Community / Local Events Calendar** | Lightweight events calendar for live music evenings, coffee cupping sessions, and Richmond community collaborations. | Low | 💡 Discovery |
| **FEATURE-71** | `BK-18` | Media, Visual & Audio Experience | **Sounds of The Sixth Element Spotify Player** | Lifestyle music widget linking to curated daytime acoustic/lo-fi and evening vinyl/jazz playlists to immerse guests in the venue's audio identity. | Low | 💡 Discovery |
| **FEATURE-72** | `BK-35` | Technical Performance, PWA & SEO | **Progressive Web App (PWA) Manifest** | Complete manifest.json with brand icons, standalone mobile windowing, and splash styling for 1-tap installation on iPhone and Android. | Low | 💡 Discovery |
| **FEATURE-73** | `DATA-03` | Data Hub & Financial Pipelines | **Tender Reconciliation Alerting** | Flag discrepancies between declared cash drawer totals in Toast and physical bank deposits. | Low | 💡 Discovery |
| **FEATURE-74** | `BK-12` | Menu Management & In-Browser Studio | **Menu Item Availability / 86 Toggle** | Scrapped / Cancelled per operational review. Full dining and beverage menu remains permanently viewable online; physical 86 / stock availability is handled live at till point without modifying digital menus. | Low | ❌ Cancelled |
| **FEATURE-75** | `SEC-01` | Quality Assurance & Automated Testing | **Automated Security, SAST & Vulnerability Test Suite** | Automated security testing integrated into CI/CD quality gates: dependency CVE vulnerability audits (npm audit), client-side XSS injection sanitization tests, sensitive credential/secret leakage checks before bundling, and RBAC privilege escalation resistance tests. | High | 🟢 Complete |
| **FEATURE-76** | `BK-40` | Guest Experience & Mobile Optimizations | **Dedicated Events Hub & Master-Detail Event Viewer (`EVENTS` Navigation)** | Add top-level navigation item 'Events' situated between 'Menu' and 'Social Impact' leading to /events. Master-detail responsive architecture with left-hand events directory and dynamically generated right-hand event views displaying Title, Start & End dates, rich narrative Description, Offers & Packages, Toast 'Book Table' reservation action, and Group Enquiry modal. Supported by an extensible catalog for easily adding future events. | High | 🟢 Complete |
| **FEATURE-77** | `BK-28` | Operations & System Health | **Incremental Telemetry & Persistent Multi-Day Analytics Retention** | Ensure website traffic metrics and dining intent telemetry are strictly incremental and retained across code deployments and daily midnight GMT rollovers. Includes timeframe selector (All-Time Cumulative, Today, Yesterday), permanent multi-day rollup summary, and resilient client-side aggregation. | High | 🟢 Complete |
| **FEATURE-78** | `GBP-01` | Google Business Profile | **Google Business Profile & Places API Connection (Foundational Link)** | Verified ownership of The Sixth Element on Google Business Profile (Store Code `06233181898163879843`), established Google Cloud Project connection with Places API (New), vaulted Place ID (`ChIJGQQLEQAPdkgRd3Et9bb_R3M`) and CID (`8306889198970696055`), restricted API key domain access, implemented Staff Portal Google Connection diagnostic card with live handshake testing, and added 1-tap customer Google Review deep-linking. | High | 🟢 Complete |
| **FEATURE-79** | `GBP-02` | Google Business Profile | **'Reserve with Google' & 'Order Online' Direct Toast Tables & Deliveroo Integrations** | Verified live Google Search Knowledge Panel direct integrations ('Reserve a table' via Toast Tables and 'Order online' via Deliveroo), and implemented dedicated multi-touchpoint Deliveroo ordering and delivery integration across the website (Menu page luxury callout banner, mobile navigation drawer 1-tap ordering, Contact page local delivery card, and footer navigation links with native iOS/Android app deep-linking support). | High | 🟢 Complete |
| **FEATURE-80** | `GBP-03` | Google Business Profile | **Live Google Reviews Ingestion & AI Reputation Manager** | Automated periodic sync of authentic 5-star Google customer reviews into the website showcase (advancing `FEATURE-69 / BK-09`), with Staff Portal alerts and AI-assisted reply drafting. | High | 🟢 Complete |
| **FEATURE-81** | `GBP-04` | Google Business Profile | **Google Food Menus & Structured Pricing Synchronization** | Programmatic sync of daytime brunch and evening dining menus, prices, descriptions, and dietary badges (V, VE, GF, DF) from Menu Studio into Google's structured Food Ordering tabs. | Medium | ⚪ Backlog |
| **FEATURE-82** | `GBP-05` | Google Business Profile | **Google Posts & Seasonal Event Syndication** | Programmatically syndicate festive offers, NYE gala, and jazz brunches from the Events Manager (`FEATURE-76`) directly to Google Business Profile Posts (Offers & Events). | Medium | ⚪ Backlog |
| **FEATURE-83** | `GBP-06` | Google Business Profile | **Operating Hours & Bank Holiday Schedule Sync** | Real-time sync of regular weekly operating hours and special bank holiday schedules (Christmas Eve, Boxing Day, NYE, Easter) from Staff Portal Settings to GBP. | Medium | ⚪ Backlog |
| **FEATURE-84** | `GBP-07` | Google Business Profile | **Richmond Local SEO & Amenity Attribute Optimization** | Programmatic audit and management of high-conversion venue attributes (Outdoor seating, Dog-friendly terrace, Free Wi-Fi) to dominate Richmond/East Sheen map searches. | Medium | ⚪ Backlog |
| **FEATURE-85** | `GBP-08` | Google Business Profile | **GBP Search Footfall & Intent Analytics Ingestion** | Ingest Google Business Profile Insights (Search impressions, Maps views, Direction taps, Phone call clicks) into the Staff Portal Traffic & Intent dashboard (`FEATURE-77`). | Low | 💡 Discovery |
| **FEATURE-86** | `BK-41` | Guest Experience & Mobile Optimizations | **Festive & Christmas Dining Menu Integration in Menu Section** | Introduce a dedicated festive dining menu experience within the Menu section (`/menu`), displaying the official 2026 Festive Menu: Festive Dinner (3 courses · £35.95 pp), Christmas Feast (family sharing for 9+ · £37.95 pp, Signature Feast £49.95 pp), Festive Bottomless Brunch (£45 pp · Fri–Sun 11am–2pm), and Drinks & Nibbles packages (The Merry £20 pp, The Jolly £30 pp). Complete with dietary badges (V, VE, GF, GF*), table sharing guidance, dessert upgrades, early-bird Prosecco perks, and direct Toast reservation integration. | High | 🟢 Complete |
| **FEATURE-87** | `SEC-02` | Staff & Role-Based Access Control (RBAC) | **Credentials & Secret Recovery Persistence & Account Isolation** | Isolated admin, pooja, and deepak into independent protected accounts, permanently retaining custom passwords and secret questions/answers across browser storage with strict default revocation. | High | 🟢 Complete |
| **FEATURE-88** | `SEC-03` | Operations & System Health | **npm v12 Supply-Chain Hardening & Security Policy** | Upgraded runtime to npm 12.2.0 with engine-strict compatibility, audited allowScripts for native modules, exact version pinning, and packageManager declaration. | High | 🟢 Complete |
| **FEATURE-89** | `BK-42` | Guest Experience & Mobile Optimizations | **Menu Dietary Taxonomy Standardization: Gluten Free & Halal Decommissioning** | Standardized all dietary taxonomy to 'Gluten Free' across filter chips, studio tools, and menu badges, and decommissioned Halal qualifiers across all pages, components, and studio tools. | Medium | 🟢 Complete |
| **FEATURE-90** | `BK-43` | Staff & Role-Based Access Control (RBAC) | **Cross-Browser & Multi-Device Cloud Synchronization for Staff Accounts & Credentials via Supabase** | Eliminated localStorage browser isolation barriers across Edge, Chrome, Safari, iPad, and mobile devices. Real-time synchronization of staff accounts, password hashes, and security recovery questions with Supabase cloud table (`public.staff_users`) protected by Row Level Security (RLS) with offline fallback resilience. | High | 🟢 Complete |

---

### 🎄 Festive & Christmas Menu Specifications (`FEATURE-86` / `BK-41`)

#### Overview & Customer Dining Purpose
To capture peak Q4 holiday dining demand across East Sheen and Richmond, the website's main **Menu Section (`/menu`)** must showcase the complete printed festive catalog (**"Make it a Christmas to remember · Served from 20th November"**). This allows couples, family groups, and corporate party organisers to browse authentic dishes, examine dietary accommodations, and book festive tables directly without friction.

#### Detailed Menu Architecture & Offerings:

1. **Festive Dinner (2 – 8 Guests · 3 Courses · £35.95 per person)**
   - **To Begin (Choose One)**:
     - *Christmas Turkey Tikka* (`GF`) — Turkey tikka, cranberry & mint chutney
     - *Winter Ruby Tikki* (`V`, `GF`) — Beetroot & goat's cheese tikki, tamarind glaze, pistachio crumble
     - *Ember Glazed Wings* (`GF`) — Chef special chicken wings, in-house marinated, slow-cooked, makhani drizzle
     - *Winter Shore Pakoras* (`VE`) — Samphire pakoras, seaweed salt, house dip
     - *Fireside Paneer Tikka* (`V`, `GF`) — Paneer tikka, mustard pickle marinade, smoked yoghurt
   - **The Main Event (Choose One · Served with Naan or Saffron Rice)**:
     - *Velvet Christmas Makhani* (`GF`) — Butter chicken, tomatoes, butter, cream, cashews & aromatic spices
     - *Mulled Spice Chicken Chettinad* (`GF`) — Chicken chettinad
     - *Midwinter Malabar Prawns* (`GF`) — King prawn, coconut, curry leaf & Malabar spice sauce
     - *Golden Paneer Lababdar* (`V`, `GF`) — Paneer lababdar, tomato, cashew & aromatic spice gravy
     - *Winter White Malai Kofta* (`V`) — Malai kofta
     - *Midnight Dal Makhani* (`V`, `GF`) — Dal makhani, slow-cooked 12 hours, cultured butter & truffle oil
     - **Signature Main Upgrade (+£10)**: *The Christmas Shank* — 12-hour slow-braised lamb shank, Kashmiri reduction, naan or saffron rice
   - **To Finish**:
     - *Christmas Gulab Jamun* (`V`) — Warm gulab jamun, Baileys ice cream
     - **Signature Dessert Upgrade (+£10)**: *Midnight Chocolate Sphere* — Filter coffee chocolate, Baileys ice cream, table theatre

2. **Christmas Feast (9+ Guests · Family Sharing for Table · £37.95 per person)**
   - **On Arrival**: Christmas Turkey Tikka (`GF`), Winter Ruby Tikki (`V`, `GF`), Ember Glazed Wings (`GF`), Winter Shore Pakoras (`VE`)
   - **The Feast**: Velvet Christmas Makhani (`GF`), Golden Paneer Lababdar (`V`, `GF`), Midnight Dal Makhani (`V`, `GF`), Golden Jaipur Aloo (`VE`, `GF`), Saffron Rice & Festive Bread Basket (Peshawari naan, aloo kulcha, garlic naan)
   - **To Finish**: Christmas Gulab Jamun (`V`) (Upgrade to Midnight Chocolate Sphere +£10 pp)
   - **The Signature Feast (£49.95 per person)**: Everything above, plus *Ember Lamb Chops* (kasundi glaze, pickled shallots & mint chutney) and *The Christmas Shank* for the table

3. **Festive Bottomless Brunch (Fri – Sun · 11am – 2pm · £45 per person)**
   - **Bottomless Pours (90 mins)**: Prosecco, Mango Mimosa, Bellini, Aperol Spritz, Hugo Spritz
   - **Brunch Selection**: Avocado & Feta Sourdough (`V`, `GF*`), House Masala Shakshuka (`GF`), Crispy Chicken Waffle, Buttermilk Pancakes (`V`), Truffle Mushroom Croissant (`V`), Chef's Daily Lunch Bowl
   - **Indian Tapas Selection**: Beetroot & Goat's Cheese Tikki (`V`, `GF`), Chicken / Vegetable Biryani (`GF`), Samphire Pakoras (`VE`), Bombay Nachos (`V`), Jaipur Aloo (`VE`, `GF`), Paneer Tikka (`V`, `GF`)

4. **Drinks & Nibbles Packages (Office & Group Celebrations · Min 10 Guests · from £20 per person)**
   - **The Merry (£20 per person)**: 2 drinks each (house wine, Prosecco, beer or soft drink) + Sharing nibbles (Bar Nibbles, Poppadoms & chutneys, Samphire Pakoras, Bombay Nachos)
   - **The Jolly (£30 per person)**: 3 drinks each (including house cocktails) + Everything in The Merry, plus Chef Special Chicken Wings, Paneer Tikka, Beetroot & Goat's Cheese Tikki
   - **Optional Perk**: Welcome glass of chilled Prosecco for £6 per person

5. **Operational Policies & Promotional Badges**:
   - **Early-Bird Perk**: Book by 31st October and enjoy a complimentary glass of chilled Prosecco for every guest on Festive Dinner & Christmas Feast bookings.
   - **Deposit & Service Terms**: 50% deposit required for group bookings. Full vegetarian, vegan, gluten-free, and allergen guidance clearly noted.

---

### 📍 Google Business Profile Program Specifications (`FEATURE-78` to `FEATURE-85`)

#### Strategic Business Context & Local Growth Impact
For a venue situated at `210 Upper Richmond Road West, London SW14 8AH`, **over 70% of new guest discovery and dining bookings originate directly from Google Search and Google Maps**. Establishing an automated, bi-directional bridge between the venue's digital platform and Google Business Profile (GBP) converts search visibility into seated dining covers, protects price integrity, and secures long-term local market leadership.

#### Detailed Scope of the 8 Google Business Profile Features:

1. **`FEATURE-78` (`GBP-01`) — Google Business Profile & Places API Connection (Foundational Link) (🟢 Complete)**:
   - **Venue Identity & Verification**: Verified venue ownership on Google Business Profile (Store Code: `06233181898163879843`), vaulted Google Place ID (`ChIJGQQLEQAPdkgRd3Et9bb_R3M`) and CID (`8306889198970696055`).
   - **Google Cloud Platform (GCP)**: Created `The Sixth Element` GCP project, enabled **Places API (New)**, vaulted API key, and restricted HTTP referrers to production (`the6thelement.co.uk`), GitHub staging (`the-6th-element.github.io`), and local development (`localhost:5173`).
   - **Staff Portal Integration**: Implemented live `GoogleConnectionCard` in `/staff` Settings with live API handshake test execution (confirming latency and 200 OK status), venue data display, and 1-tap customer Google Review deep-link generator.
   - **Direct Guest Action**: Added direct "⭐ Review Us on Google ↗" action button on `/contact` routing directly to the venue's 5-star review dialog.

2. **`FEATURE-79` (`GBP-02`) — 'Reserve with Google' & 'Order Online' Direct Toast Tables & Deliveroo Integrations (🟢 Complete)**:
   - **Reserve with Google (Toast Tables)**: Live Google Search Knowledge Panel direct integration via Toast Tables, cutting dining table reservations from 4 taps down to 1 directly from Google Search and Google Maps.
   - **Order Online (Deliveroo)**: Live Google Knowledge Panel direct integration connecting to Deliveroo, plus 4 high-conversion, non-intrusive web touchpoints across the website (Menu page luxury delivery banner, mobile navigation drawer 1-tap ordering, Contact page local delivery card, and footer navigation links).
   - **Universal Deep-Linking**: Configured standard HTTPS Deliveroo links that automatically launch the native Deliveroo mobile app on iOS (Apple Universal Links) and Android (Android App Links) if installed, with instant mobile web fallback.

3. **`FEATURE-80` (`GBP-03`) — Live Google Reviews Ingestion & AI Reputation Manager**:
   - **Reviews Sync**: Ingest authentic 5-star customer testimonials from GBP API into the website's social proof carousel (superseding and completing `BK-09`).
   - **Staff Portal Response Hub**: Alert managers on fresh Google reviews with 1-click suggested AI response drafting to maintain high engagement velocity, a primary local map ranking signal.

4. **`FEATURE-81` (`GBP-04`) — Google Food Menus & Structured Pricing Synchronization**:
   - **Menu Sync**: Automatic programmatic mapping of daytime brunch and evening dining items, descriptions, prices, and dietary flags (`V`, `VE`, `GF`, `DF`) from in-browser Menu Studio to Google Food Menus.
   - **Growth Outcome**: Eliminates menu drift and captures high-intent diners searching for specific dishes (e.g. *"12-hour Slow-Cooked Lamb Shank"*, *"Old Delhi Butter Chicken"*, *"Cardamom French Toast"*, *"Old Spike V60 pour-over"*).

5. **`FEATURE-82` (`GBP-05`) — Google Posts & Seasonal Event Syndication**:
   - **Syndication**: Programmatically publish seasonal celebrations (e.g. *Christmas 2026*, *Diwali Banquets*, *New Year's Eve Gala*, *Wine Masterclasses*), and jazz brunches directly into Google Posts ("Offer" & "Event" post formats).
   - **Growth Outcome**: Prominent promotional banner placement on Google's Knowledge Panel whenever local customers search for the venue or dining in East Sheen.

6. **`FEATURE-83` (`GBP-06`) — Operating Hours & Bank Holiday Schedule Sync**:
   - **Hours Sync**: Real-time sync of regular weekly hours and special holiday times (Christmas Eve, Boxing Day, New Year's Day, Easter, Bank Holidays) directly from Staff Portal Settings to GBP.
   - **Growth Outcome**: Prevents customer disappointment, avoids negative reviews caused by outdated hours, and captures peak holiday trade.

7. **`FEATURE-84` (`GBP-07`) — Richmond Local SEO & Amenity Attribute Optimization**:
   - **Attribute Audit**: Programmatically audit and maintain high-conversion venue attributes: *Outdoor seating, Heated dog-friendly terrace, Wheelchair accessible, Vegetarian options, Vegan options, High chairs, Free Wi-Fi, Organic natural wines*.
   - **Growth Outcome**: Dominates Google Maps 3-Pack rankings across Richmond upon Thames, East Sheen, Barnes, Kew, Mortlake, and Putney for queries like *"dog-friendly brunch East Sheen"*, *"best Indian restaurant Richmond"*, and *"outdoor wine bar near me"*.

8. **`FEATURE-85` (`GBP-08`) — GBP Search Footfall & Intent Analytics Ingestion**:
   - **Analytics Ingestion**: Pull GBP Insights telemetry (Search impressions, Maps views, "Request Directions" navigations, website visits, and phone call clicks) directly into the Staff Portal's **Traffic & Intent** dashboard (`FEATURE-77`).
   - **Growth Outcome**: Correlates Google Maps search footfall with Toast till receipts and nightly Toast-to-Xero financial reconciliation, providing management with a true end-to-end view of marketing ROI to register revenue.

---

### ⏰ Toast Day-Wise Opening Hours Ingestion & Omnichannel Refresh (`FEATURE-51` / `BK-36` / `TOAST-04`)

#### Overview & Strategic Operational Intent
Operating hours are configured and updated directly within **Toast POS** (covering regular daily service hours, kitchen cutoffs, and seasonal bank holiday variations). Currently, updating hours across the website and Google requires manual intervention across multiple touchpoints. `FEATURE-51` builds an automated data pipeline that treats Toast as the single authoritative source of truth for restaurant trading times, continuously synchronizing schedule changes across both the public website and Google properties.

#### Pipeline Architecture & Delivery Scope:
1. **Toast API Ingestion**:
   - Query Toast Restaurant Service / Dining Option Configuration API (`/restaurants/{restaurantGuid}/diningOptions` and service schedules).
   - Ingest day-wise open/close timings (Monday through Sunday) along with daytime vs evening service breaks and special holiday date overrides.
2. **Website Touchpoint Refresh**:
   - **Contact & Location Page (`ContactPage.jsx`)**: Dynamically render live day-by-day opening hours table matching the exact Toast schedule.
   - **Footer Navigation**: Reflect current weekly operating schedule without hardcoded static text.
   - **Live Service Status Indicator**: Dynamic open/closed status badge based on current UK London time (e.g. *"Open Now · Daytime Brunch until 3:00 PM"* or *"Closed · Opens Tomorrow at 8:00 AM"*).
   - **Search Engine Structured Data**: Automatically update `Schema.org/Restaurant` `openingHoursSpecification` in JSON-LD markup so Google Search crawlers index accurate hours.
3. **Google Business Profile & Maps Refresh**:
   - Programmatic synchronization to Google Business Profile via the Places / GBP API connection established in `FEATURE-78`.
   - Update both regular weekly hours and special bank holiday hours (Christmas Eve, Boxing Day, New Year's Eve, Easter) directly on the Google Maps Knowledge Panel.

---

## 📝 Change Governance & Defect Traceability Protocol
1. **Mandatory Backlog Attribution**:
   Every requested change, enhancement, or bug fix MUST have an assigned Backlog Identifier (`FEATURE-NN`) before implementing code changes.
2. **Category Classification**:
   Every feature is assigned to an operational category (e.g. `Architecture & Theme Foundation`, `Menu Management & In-Browser Studio`, `Staff & Role-Based Access Control (RBAC)`, `Guest Experience & Mobile Optimizations`, `Marketing & Community Growth`, `Data Hub & Financial Pipelines`, `Operations & System Health`, `Quality Assurance & Automated Testing`, `Technical SEO & Discoverability`, `Production Cutover & Verification`).
3. **Defect-to-Feature Traceability**:
   Full traceability is maintained between any bug or error encountered and the specific backlog feature that introduced it.
4. **Automated Regression Pack Coverage (FEATURE-39 / BK-14)**:
   Every newly added feature and bug fix must have corresponding automated regression test cases added to the test suite, preventing regressions when merging from `dev` to `main`.
