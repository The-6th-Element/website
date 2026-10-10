// src/data/config.js
// Global site configuration and static metadata for The Sixth Element
import { COLORS } from "../theme/tokens.js";

// ── Toast Tables Reservation Config ───────────────────────────────
export const TOAST_CONFIG = {
  reservationUrl: "https://tables.toasttab.com/restaurants/5503e03f-b188-421c-aa8f-5a2c8e27fd59/findTime",
};

// ── Elements Data ──────────────────────────────────────────────────
export const ELEMENTS = [
  { name: "Earth", symbol: "🜃", color: COLORS.earthBrown, desc: "Honest ingredients, grounded in provenance. Every plate tells a story of soil and season." },
  { name: "Water", symbol: "🜄", color: "#4A7C8F", desc: "The flow of community. Direct-trade coffee that connects Richmond to ethical growers worldwide." },
  { name: "Fire", symbol: "🜂", color: COLORS.warmAmber, desc: "Evening warmth. Low-intervention natural wines, craft beers, and intimate amber glow." },
  { name: "Air", symbol: "🜁", color: COLORS.mossGreen, desc: "Morning lightness. Sunlit mornings, vibrant brunch plates, and artisan specialty coffee." },
  { name: "Ether", symbol: "✦", color: COLORS.warmAmber, desc: "The fifth element. The celestial atmosphere that binds all together — sound, resonance, and space." },
];

// ── Promotions (browser-managed via admin panel) ───────────────────
export const DEFAULT_PROMOTIONS = [
  {
    id: "christmas-2026",
    title: "Make It a Christmas to Remember",
    badge_text: "CHRISTMAS 2026",
    description: "'Tis the Season to Celebrate — Family gatherings, catch-ups with friends or the office party. Celebrate with modern Indian food, festive cocktails and warm hospitality.",
    discount_text: "Festive Dinners, Sharing Feasts & Bottomless · Free Prosecco if booked by 31 Oct",
    start_date: "2026-10-01",
    end_date: "2026-12-31",
    is_active: true,
    served_from: "20th November",
    early_bird: "Book by 31st October & enjoy a complimentary glass of Prosecco for every guest (Festive Dinner & Christmas Feast bookings)",
    packages: [
      {
        name: "Festive Dinner",
        guests: "For 2 – 8 guests",
        price: "£35.95",
        unit: "pp",
        description: "Three courses with a choice of dishes",
        extra: "12-hour Lamb Shank +£10",
      },
      {
        name: "Christmas Feast",
        guests: "For 9+ guests",
        price: "£37.95",
        unit: "pp",
        description: "Sharing platters for the table — no choices, no fuss",
        extra: "Signature Feast £49.95pp",
      },
      {
        name: "Festive Bottomless",
        guests: "Fri – Sun · 11am – 2pm",
        price: "£45",
        unit: "pp",
        description: "A dish of your choice with 90 minutes of bottomless drinks",
      },
      {
        name: "Drinks & Nibbles",
        guests: "Office & group parties",
        price: "from £20",
        unit: "pp",
        description: "Festive drinks with sharing nibbles for the table",
      },
    ],
    notes: "Advance bookings recommended · 50% deposit required to secure group bookings · Vegetarian, vegan & allergies catered for",
    phone: "+44 20 3518 8688",
    email: "reservations@the6thelement.co.uk",
  },
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
  handle: "the.sixth.element.210",
  profileUrl: "https://www.instagram.com/the.sixth.element.210",
  feedJsonUrl: "/data/instagram_feed.json",
  beholdFeedUrl: "https://feeds.behold.so/ujJfSNtQnyj153fUHfi4",
};

// ── Old Spike Roastery Social Impact URL ───────────────────────────
export const OLD_SPIKE_URL = "https://oldspikeroastery.com/pages/impact";

// ── Contact & Map Information ─────────────────────────────────────
export const VENUE_ADDRESS = "210 Upper Richmond Road West, London, SW14 8AH";
export const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_ADDRESS)}&output=embed`;
export const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE_ADDRESS)}`;
