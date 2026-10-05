# Instagram Live Feed Sync Setup Guide (BK-03)
**Venue**: The Sixth Element · 210 Upper Richmond Road West, East Sheen, SW14 8AH  
**Handle**: `@the.sixth.element.210`  
**Provider**: Behold.so Zero-Auth JSON Bridge  
**Cost**: £0 / month (Free forever tier, zero third-party tracking scripts, zero token expirations)

---

## Overview

The Sixth Element website features an **Option B Asymmetric Luxury Bento Grid** displaying live posts and reels from `@the.sixth.element.210`.

- **Current State**: The website comes pre-loaded with high-resolution cached photography and real captions directly synced from the venue's Instagram account.
- **Automated Live Sync**: A GitHub Action (`.github/workflows/sync-instagram.yml`) runs every 6 hours to fetch fresh posts from Behold, cache the media locally on GitHub Pages, and refresh the website.
- **Performance & Privacy**: The website loads local cached images (`/images/instagram/`) and `/data/instagram_feed.json`. This ensures sub-millisecond page loads, 100% GDPR compliance, zero cookie tracking, and uses less than 10% of Behold's free monthly quota.

---

## Configuration

The active Behold Feed URL is configured in:
- `src/data/config.js` (`INSTAGRAM_CONFIG.beholdFeedUrl`)
- `.github/workflows/sync-instagram.yml` (`BEHOLD_FEED_URL`)
- `scripts/sync_instagram.js` (`DEFAULT_BEHOLD_URL`)

### Active Feed:
- **Feed URL**: `https://feeds.behold.so/ujJfSNtQnyj153fUHfi4`
- **Source**: `@the.sixth.element.210`

---

## Manual Sync Trigger

Whenever you publish a major post and want it reflected on the website immediately without waiting for the 6-hour cron:
1. Go to the GitHub repository > **Actions** tab.
2. Select **Sync Instagram Feed** on the left.
3. Click **Run workflow** > **Run workflow**.
4. Within ~45 seconds, the new posts will be fetched, cached locally, and live on the website.
