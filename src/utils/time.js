// src/utils/time.js
// Date, time, and scroll utilities for The Sixth Element

// AM (light) between 8am and the configurable evening switch hour, UK time.
export function computeIsAM(pmSwitchHour = 14) {
  const h = parseInt(
    new Date().toLocaleString("en-GB", {
      timeZone: "Europe/London",
      hour: "numeric",
      hour12: false,
    }),
    10
  );
  return h >= 8 && h < pmSwitchHour;
}

// Jump to the top instantly. Bypasses the global `scroll-behavior: smooth`,
// whose animation mobile browsers abandon mid-flight during a page swap.
export function scrollToTop() {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.scrollTop = 0;
  document.body.scrollTop = 0; // older mobile Safari
  root.style.scrollBehavior = prev;
}

// Which menu opens first, based on UK time of day: Daytime until the
// evening hour, then Evening. Overnight falls back to Daytime.
export function defaultMenuTab(flags = {}) {
  const eveningFrom = flags.menu_evening_hour ?? 17;
  const h = parseInt(
    new Date().toLocaleString("en-GB", {
      timeZone: "Europe/London",
      hour: "numeric",
      hour12: false,
    }),
    10
  );
  return h >= eveningFrom ? "evening" : "daytime";
}
