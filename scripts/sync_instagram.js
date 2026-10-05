// scripts/sync_instagram.js
// Automated Instagram Media Fetcher & Local Asset Cacher for The Sixth Element
// Integrates Behold.so Zero-Auth JSON Feed with Local Asset Caching & Offline Fallback

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DATA_PATH = path.join(ROOT_DIR, 'public', 'data', 'instagram_feed.json');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images', 'instagram');

const DEFAULT_BEHOLD_URL = 'https://feeds.behold.so/ujJfSNtQnyj153fUHfi4';

async function downloadImage(url, destPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

function determineTag(caption, hashtags = []) {
  const cap = ((caption || '') + ' ' + (hashtags || []).join(' ')).toLowerCase();
  if (/\b(curry|curries|naan|biryani|thali|platter|indian|desi|dal|pakora|pakoras)\b/i.test(cap)) return 'Weekend Feast';
  if (/\b(deliveroo|delivery|takeaway|order now)\b/i.test(cap)) return 'Order Online';
  if (/\b(cocktail|cocktails|whisky|whiskey|mezcal|evening|bar|drinks)\b/i.test(cap)) return 'Evening Alchemy';
  if (/\b(wine|orange wine|natural wine)\b/i.test(cap)) return 'Golden Hour';
  if (/\b(coffee|flat white|cappuccino|espresso|morning|matcha)\b/i.test(cap) || /\blatte\b/i.test(cap)) return 'Morning Ritual';
  if (/\b(brunch|pancake|pancakes|egg|eggs|sourdough)\b/i.test(cap)) return 'Brunch Plates';
  if (/\b(dog|dogs|terrace|patio|alfresco|outdoor)\b/i.test(cap)) return 'Terrace Life';
  return 'Signature Moment';
}

function formatRelativeTime(isoString) {
  if (!isoString) return 'Recent';
  const postDate = new Date(isoString);
  const diffHours = Math.round((Date.now() - postDate.getTime()) / (1000 * 60 * 60));
  if (diffHours < 24) return `${Math.max(1, diffHours)}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

async function syncFromBehold(beholdUrl, handle) {
  console.log(`📡 Fetching live Instagram feed from Behold (${beholdUrl})...`);
  const res = await fetch(beholdUrl);
  if (!res.ok) throw new Error(`Behold API responded with HTTP ${res.status}: ${res.statusText}`);
  const data = await res.json();

  const rawPosts = data.posts || (Array.isArray(data) ? data : []);
  if (rawPosts.length === 0) {
    console.log('⚠️ No posts found in Behold feed.');
    return;
  }

  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const formattedPosts = [];

  for (let i = 0; i < rawPosts.length && i < 5; i++) {
    const item = rawPosts[i];
    const isHero = i === 0;
    const mediaSource = item.sizes?.large?.mediaUrl || item.sizes?.medium?.mediaUrl || item.thumbnailUrl || item.mediaUrl;
    const filename = `post_${i + 1}_${item.id}.jpg`;
    const localFilePath = path.join(IMAGES_DIR, filename);
    const relativeWebPath = `/images/instagram/${filename}`;

    console.log(`📥 Caching post ${i + 1} (${item.id}) to ${filename}...`);
    try {
      await downloadImage(mediaSource, localFilePath);
    } catch (err) {
      console.warn(`⚠️ Failed caching image locally, falling back to CDN URL: ${err.message}`);
    }

    const tag = determineTag(item.caption, item.hashtags);
    const timeStr = formatRelativeTime(item.timestamp);

    formattedPosts.push({
      id: item.id,
      is_hero: isHero,
      type: item.mediaType === 'VIDEO' ? 'reel' : 'photo',
      image_url: fs.existsSync(localFilePath) ? relativeWebPath : mediaSource,
      cdn_image_url: mediaSource,
      permalink: item.permalink || `https://www.instagram.com/${handle}`,
      caption: item.prunedCaption || item.caption || 'Moments at The Sixth Element, East Sheen.',
      timestamp: timeStr,
      likes: typeof item.likeCount === 'number' ? item.likeCount : null,
      comments: typeof item.commentsCount === 'number' ? item.commentsCount : null,
      tag: tag,
    });
  }

  const payload = {
    handle: handle,
    profile_url: `https://www.instagram.com/${handle}`,
    last_synced: new Date().toISOString(),
    sync_status: 'live',
    source: 'behold',
    posts: formattedPosts,
  };

  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2));
  console.log(`✅ Successfully updated public/data/instagram_feed.json with ${formattedPosts.length} posts!`);
}

async function syncInstagram() {
  const beholdUrl = process.env.BEHOLD_FEED_URL || DEFAULT_BEHOLD_URL;
  const handle = process.env.INSTAGRAM_HANDLE || 'the.sixth.element.210';

  console.log(`[Instagram Sync] Starting sync for @${handle}...`);

  try {
    await syncFromBehold(beholdUrl, handle);
  } catch (err) {
    console.error('❌ Instagram sync failed:', err.message);
    process.exit(1);
  }
}

syncInstagram();
