# Instagram Live Feed Sync Setup Guide (BK-03)
**Venue**: The Sixth Element · 210 Upper Richmond Road West, East Sheen, SW14 8AH  
**Handle**: `@the.sixth.element.210`  
**Cost**: £0 / month (Zero subscription fees, zero third-party tracking scripts)

---

## Overview

The Sixth Element website features an **Option B Asymmetric Luxury Bento Grid** displaying the latest posts and reels from `@the.sixth.element.210`.

- **Current State**: The website comes pre-loaded with high-resolution cached photography and captions matching the venue's core chapters (morning coffee ritual, brunch plates, dog-friendly heated terrace, golden hour amber wines, evening smoked cocktails).
- **Automated Live Sync**: A GitHub Action (`.github/workflows/sync-instagram.yml`) runs every 6 hours to fetch fresh posts from Instagram, cache the media on the CDN, and refresh the website.

---

## 5-Minute Setup: Connecting Your Live Instagram Handle

To enable automated synchronization from your Instagram account:

### Step 1: Create a Meta for Developers Account
1. Go to [developers.facebook.com](https://developers.facebook.com/) and log in with the Facebook account linked to `@the.sixth.element.210`.
2. Click **My Apps** > **Create App**.
3. Select **Other** > **Consumer** (or **Business**) and name it `The Sixth Element Feed`.

### Step 2: Set up Instagram Basic Display
1. In the app dashboard, find **Instagram Basic Display** and click **Set Up**.
2. Scroll to the bottom and click **Create New App**.
3. Enter `The Sixth Element` as the Display Name and save changes.

### Step 3: Add Your Instagram Account as a Tester
1. Under **User Token Generator**, click **Add or Remove Instagram Testers**.
2. Under the **Instagram Testers** section, click **Add Instagram Testers** and type `the.sixth.element.210`.
3. On Instagram (mobile app or desktop):
   - Go to **Settings and privacy** > **Website permissions** > **Apps and Websites** > **Tester Invites**.
   - Accept the invite from your app.

### Step 4: Generate Your Long-Lived User Access Token
1. Return to [developers.facebook.com](https://developers.facebook.com/) > Your App > **Instagram Basic Display** > **Basic Display**.
2. Under **User Token Generator**, you will now see `the.sixth.element.210`. Click **Generate Token**.
3. Log in and authorize read permissions (`user_profile, user_media`).
4. Check **I Understand** and copy the generated token.

### Step 5: Save in GitHub Repository Secrets
1. Go directly to your GitHub repository secrets page:  
   👉 [https://github.com/The-6th-Element/website/settings/secrets/actions](https://github.com/The-6th-Element/website/settings/secrets/actions)
3. Click **New repository secret**:
   - **Name**: `INSTAGRAM_ACCESS_TOKEN`
   - **Value**: Paste the token copied in Step 4.
4. Click **Add secret**.

---

## How Token Refreshing Works
- Instagram user tokens last 60 days.
- Our sync script (`scripts/sync_instagram.js`) **automatically calls the Meta token refresh endpoint** on every run.
- As long as the scheduled GitHub Action runs periodically, your token **never expires**.

---

## Manual Sync Trigger
Whenever you publish a major post and want it reflected on the website immediately without waiting for the 6-hour cron:
1. Go to the GitHub repository > **Actions** tab.
2. Select **Sync Instagram Feed** on the left.
3. Click **Run workflow** > **Run workflow**.
4. Within ~45 seconds, the new post will be cached and live on the website.
