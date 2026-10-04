// src/data/config.js
// Global site configuration and static metadata for The Sixth Element
import { COLORS } from "../theme/tokens";

// ── Toast Tables Reservation Config ───────────────────────────────
export const TOAST_CONFIG = {
  reservationUrl: "https://tables.toasttab.com/restaurants/5503e03f-b188-421c-aa8f-5a2c8e27fd59/findTime",
};

// ── Elements Data ──────────────────────────────────────────────────
export const ELEMENTS = [
  { name: "Earth", symbol: "🜃", color: COLORS.earthBrown, desc: "Our foundation. Honest ingredients, grounded in provenance. Every plate tells a story of soil and season." },
  { name: "Water", symbol: "🜄", color: "#4A7C8F", desc: "The flow of community. Social impact coffee that connects Richmond to farming communities worldwide." },
  { name: "Fire", symbol: "🜂", color: COLORS.warmAmber, desc: "Evening warmth. As the sun sets, the space transforms — natural wines, craft beers, and curated cocktails." },
  { name: "Air", symbol: "🜁", color: "#B8C4A0", desc: "Morning lightness. Bright, breathable mornings filled with specialty coffee and sunlit brunch." },
  { name: "Space", symbol: "✦", color: COLORS.mossGreen, desc: "The sixth element. The intangible feeling of belonging — the reason you return. This is what we create." },
];

// ── Promotions (browser-managed via admin panel) ───────────────────
export const DEFAULT_PROMOTIONS = [
  {
    id: "seed-golden-hour", title: "Golden Hour", badge_text: "DAILY",
    description: "Wind down as the space shifts from day to night.",
    discount_text: "2-for-1 on natural wine by the glass, 5–7pm",
    start_date: "2026-01-01", end_date: "2030-12-31", is_active: true,
  },
  {
    id: "seed-brunch", title: "Weekend Brunch Club", badge_text: "WEEKENDS",
    description: "Every Saturday & Sunday.",
    discount_text: "Free filter coffee with any brunch plate",
    start_date: "2026-01-01", end_date: "2030-12-31", is_active: true,
  },
];

// ── Instagram Section Config ───────────────────────────────────────
export const INSTAGRAM_CONFIG = {
  handle: "thesixthelement.richmond",
  profileUrl: "https://www.instagram.com/the.sixth.element.210",
  elfsightWidgetId: null,
  curatorFeedId: null,
};

// ── Old Spike Roastery Social Impact URL ───────────────────────────
export const OLD_SPIKE_URL = "https://oldspikeroastery.com/pages/impact";

// ── Contact & Map Information ─────────────────────────────────────
export const VENUE_ADDRESS = "210 Upper Richmond Road West, London, SW14 8AH";
export const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_ADDRESS)}&output=embed`;
export const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE_ADDRESS)}`;
