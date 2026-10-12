// src/data/events.js
// Master events & seasonal celebrations catalog for The Sixth Element
import { COLORS } from "../theme/tokens";

export const DEFAULT_EVENTS = [
  {
    id: "christmas-2026",
    title: "Make It a Christmas to Remember",
    subtitle: "Festive Dinners, Sharing Feasts & Bottomless Celebrations",
    badge: "CHRISTMAS 2026",
    badgeColor: COLORS.warmAmber,
    startDate: "2026-11-20",
    endDate: "2026-12-31",
    dateDisplay: "20 Nov 2026 – 31 Dec 2026",
    timing: "Daily Lunch & Evening Dining",
    tagline: "'Tis the Season to Celebrate",
    description:
      "Family gatherings, catch-ups with friends or the annual office celebration — celebrate the festive season with modern Indian cuisine, seasonal spice blends, handcrafted botanical cocktails and warm East Sheen hospitality. Our festive menus bring people together around generous sharing platters, heritage curries and aromatic seasonal desserts.",
    earlyBird:
      "Book by 31st October and enjoy a complimentary glass of chilled Prosecco for every guest (Festive Dinner & Christmas Feast bookings).",
    offers: [
      {
        name: "Festive Dinner",
        guests: "For 2 – 8 guests",
        price: "£35.95",
        unit: "pp",
        description: "Three courses with a choice of dishes across festive starters, signature mains, and seasonal desserts.",
        extra: "✦ 12-hour Slow-Cooked Lamb Shank +£10",
      },
      {
        name: "Christmas Feast",
        guests: "For 9+ guests",
        price: "£37.95",
        unit: "pp",
        description: "Abundant sharing platters served family-style for the whole table — no pre-order headaches, no fuss.",
        extra: "✦ Signature Royal Feast Upgrade £49.95 pp",
      },
      {
        name: "Festive Bottomless",
        guests: "Fri – Sun · 11am – 2pm",
        price: "£45.00",
        unit: "pp",
        description: "A brunch or lunch dish of your choice with 90 minutes of bottomless festive fizz, mimosas, or beer.",
        extra: "✦ Includes artisan filter coffee on arrival",
      },
      {
        name: "Drinks & Nibbles",
        guests: "Office & Group Parties",
        price: "from £20.00",
        unit: "pp",
        description: "Festive cocktails and spiced sharing street snacks for relaxed evening gatherings in our candlelit lounge.",
        extra: "✦ Private bar corner hire available",
      },
    ],
    terms:
      "Festive menus served from 20th November. Advance reservations recommended. 50% deposit required to secure group bookings of 9 or more. Full vegetarian, vegan, and allergen menus always available.",
    hasGroupEnquiry: true,
  },
];
