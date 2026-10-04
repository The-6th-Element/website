// src/theme/tokens.js
// Design tokens and color palettes for The Sixth Element

export const COLORS = {
  earthBrown: "#4B3621",
  mossGreen: "#606E3D",
  charcoal: "#2C2C2C",
  warmAmber: "#BF8A2F",
  ivory: "#F6F4E3",
  cream: "#FAF8F0",
  darkBg: "#1A1410",
  warmBlack: "#0F0D0A",
  softWhite: "#FEFDFB",
  sand: "#D4C5A9",
  deepMoss: "#3D4A26",
};

export const AM_THEME = {
  bg: COLORS.cream,
  text: COLORS.charcoal,
  heading: COLORS.earthBrown,
  accent: COLORS.warmAmber,
  surface: COLORS.ivory,
  surfaceAlt: "#FFFFFF",
  muted: "#6E6456",
  hero: `linear-gradient(135deg, ${COLORS.ivory} 0%, ${COLORS.cream} 50%, #E8E0D0 100%)`,
  navBg: "rgba(250,248,240,0.92)",
  label: "Morning Mode",
  icon: "☀️",
};

export const PM_THEME = {
  bg: COLORS.warmBlack,
  text: COLORS.sand,
  heading: COLORS.ivory,
  accent: COLORS.warmAmber,
  surface: "#1E1914",
  surfaceAlt: "#252017",
  muted: "#7A7060",
  hero: `linear-gradient(135deg, #1A1410 0%, #2A1E14 50%, #1E1914 100%)`,
  navBg: "rgba(15,13,10,0.94)",
  label: "Evening Mode",
  icon: "🌙",
};
