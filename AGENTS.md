# The Sixth Element — Agent Architecture & Engineering Guide

## Overview
**The Sixth Element** is a modern hospitality web application for an artisan specialty café and evening natural wine bar in Richmond-upon-Thames, London (*"Specialty coffee by day, natural wine by night"*).

- **Repository**: [The-6th-Element/website](https://github.com/The-6th-Element/website)
- **Primary Domain**: `https://the6thelement.co.uk`
- **Tech Stack**: React 18, Vite 6, GitHub Pages, GitHub Actions CI/CD, Toast Tables.
- **Operating Model**: 100% serverless, zero database fees, zero dedicated server costs.

---

## Architectural Rules & Conventions

### 1. Branch Strategy
- **`dev` branch**: All new features, bug fixes, and experiments MUST be written, tested, and committed to `dev`.
- **`main` branch**: Clean production branch mapped directly to GitHub Pages deployment. Only merge `dev` into `main` after full review and verification.

### 2. Dual-Personality Theming
- The site automatically computes AM (Daylight) vs PM (Evening lounge) based on London local time (`Europe/London`).
- The switch hour defaults to 14:00 UK time, configurable in real time via the Staff Portal (`flags.pm_switch_hour`).
- Global color tokens live in `src/theme/tokens.js`. Never introduce ad-hoc hex values where standard design tokens exist.

### 3. Staff & User Management (RBAC)
- Multi-user authentication is managed by `src/utils/userManager.js`.
- Passwords are hashed with SHA-256 (Web Crypto API with pure JS fallback for non-secure local IP testing).
- Five roles: `owner`, `admin`, `manager`, `lead`, `chef`.
- **CRITICAL**: Only `owner` and `admin` roles have `canPublishLive: true`. Staff roles can edit menus and save drafts locally for admin review.

### 4. In-Browser Menu Studio
- Located at `/studio` or via the Staff Portal banner.
- Allows live spreadsheet editing of daytime & evening menu items, dietary tags (`V`, `VE`, `GF`, `GF*`), and prices.
- Supports 1-click CSV download and drag-and-drop CSV upload via `src/utils/csvMenuParser.js`.
- Direct publishing to GitHub repository branches via in-browser GitHub REST API (`src/utils/githubPublisher.js`).

### 5. Persistent State & Storage
- Custom operational settings (promotions, announcement bar, switch hour) are persisted in `localStorage` under `tse_*` keys.
- Real-time synchronization across browser tabs is achieved using `window.dispatchEvent(new Event(...))`.

---

## Local Development (Windows / PowerShell)

Always use `npm.cmd` when executing npm scripts on Windows:

```powershell
npm.cmd run dev       # Starts Vite dev server (host: 0.0.0.0 for LAN/mobile testing)
npm.cmd run build     # Compiles production bundle to dist/
npm.cmd run preview   # Previews production dist/ locally
```

---

## Change Governance & Defect Traceability Protocol

1. **Mandatory Backlog Attribution**:
   Every requested change or bug fix MUST have an assigned Backlog Identifier (`BK-XX`, `FEAT-XX`, or `BUG-XX`) before implementing any code changes. If a user requests a change not currently associated with a backlog item, immediately allocate a new unique Backlog Identifier and record it before writing code.
2. **Defect-to-Feature Traceability**:
   Maintain explicit traceability between any bug/error encountered and the specific backlog item or commit that introduced it.
3. **Regression Test Mandate (BK-14)**:
   Every newly added functionality and bug fix must be accompanied by automated test cases added to the regression test pack so that pre-merge CI execution prevents recurrence.

---

## Feature Backlog Maintenance
All project feature requests and status updates are tracked in [FEATURE_BACKLOG.md](FEATURE_BACKLOG.md). Keep this document updated on every milestone.
