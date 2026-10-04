# The Sixth Element — Official Website

> **Specialty coffee by day, natural wine by night.**  
> 210 Upper Richmond Road West, Richmond-upon-Thames, London SW14 8AH

A modern, high-performance web application engineered with modular React 18, Vite 6, and zero-cost automated hosting on GitHub Pages via GitHub Actions CI/CD.

---

## 🚀 Key Features

- **Automated Dual-Personality Theming**: Seamless transitions between daytime artisan café styling and evening ambient wine lounge based on London local time (`Europe/London`), configurable via the Admin Console.
- **In-Browser Menu Studio & CSV Spreadsheet**: Dedicated full-page spreadsheet (`/studio`) allowing staff to batch-edit dishes, prices, descriptions, and dietary tags (`V`, `VE`, `GF`, `GF*`), with 1-click CSV export/import and direct in-browser GitHub API publishing.
- **Staff & User Management (RBAC)**: Role-based access control with 5 distinct permission tiers: Owner, Admin, Manager, Shift Lead, and Chef/Kitchen. Live publishing capabilities are restricted strictly to authorized Admins.
- **Spacious Toast Tables Reservations**: Custom-engineered wide modal (`min(980px, 95vw)`) providing a comfortable calendar and seating-time reservation experience powered by Toast Tables.
- **Cross-Device & Mobile Optimization**: Native mobile gestures, `100dvh` dynamic viewport handling, edge-to-edge iOS safe area insets, and zero tap delay.
- **Zero Ongoing Infrastructure Cost**: 100% serverless static deployment with persistent client-side storage for operational promotions and real-time tab synchronization.

---

## 📁 Project Architecture

```
the-sixth-element-website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD: Automated build & GitHub Pages deploy
├── public/
│   ├── CNAME                   # Custom domain mapping (the6thelement.co.uk)
│   ├── 404.html                # Single-Page Application (SPA) routing fallback
│   ├── data/
│   │   └── menu_template.csv   # Standardized menu CSV schema & starter template
│   └── media/                  # Optimized brand photography and imagery
├── src/
│   ├── components/
│   │   ├── admin/              # MenuStudio, UserManager, PromotionsManager
│   │   ├── features/           # ReservationModal, StructuredData (Schema.org)
│   │   ├── layout/             # Navbar, Footer, AnnouncementBar
│   │   └── ui/                 # Logomark, FadeIn, CTAButton, PersistentCTA
│   ├── data/                   # Menu dataset, customer reviews, site configuration
│   ├── hooks/                  # useFeatureFlags, useContent
│   ├── pages/                  # HomePage, MenuPage, SocialImpactPage, AboutPage, ContactPage, StaffPage
│   ├── theme/                  # Color tokens, daylight/evening design system
│   ├── utils/                  # auth (SHA-256), csvMenuParser, githubPublisher, userManager, time
│   ├── App.jsx                 # Core application shell & routing
│   └── main.jsx                # Application mount point
├── FEATURE_BACKLOG.md          # Living product roadmap and feature backlog
└── vite.config.js              # Vite configuration
```

---

## 🛠️ Local Development

```powershell
# Install dependencies
npm.cmd install

# Start development server
npm.cmd run dev

# Build production bundle
npm.cmd run build

# Preview production build locally
npm.cmd run preview
```

---

## 🌐 Deployment & CI/CD

Deployment is fully automated:
1. Every push to the `main` branch triggers `.github/workflows/deploy.yml`.
2. The workflow installs dependencies, compiles the Vite production bundle, and deploys directly to **GitHub Pages**.
3. Custom domain `the6thelement.co.uk` is bound via `public/CNAME`.

---

## 📋 Product Backlog

To see completed milestones and upcoming features (such as ambient video loops, click & collect, and gift cards), refer to [FEATURE_BACKLOG.md](FEATURE_BACKLOG.md).
