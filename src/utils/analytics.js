// src/utils/analytics.js
// Lightweight, privacy-conscious first-party telemetry for The Sixth Element
// Fully UK GDPR / PECR compliant (no cookies, zero PII, anonymous sessions).

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const SESSION_KEY = "t6e_anon_session_id";
const LOCAL_STORAGE_KEY = "t6e_offline_events_buffer";
const MAX_LOCAL_EVENTS = 150;

/**
 * Returns or initializes a privacy-safe session ID that expires when the browser session ends.
 */
function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = "s_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "s_anon_" + Date.now();
  }
}

/**
 * Detects whether the visitor is on mobile, tablet, or desktop.
 */
function getDeviceType() {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  const width = window.innerWidth;
  if (/iPad|Tablet/i.test(ua) || (width > 768 && width <= 1024)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua) || width <= 768) return "mobile";
  return "desktop";
}

/**
 * Safely persists events in browser local storage as a fallback when Supabase is not connected.
 */
function storeLocalEvent(event) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const events = raw ? JSON.parse(raw) : [];
    events.push(event);
    if (events.length > MAX_LOCAL_EVENTS) {
      events.splice(0, events.length - MAX_LOCAL_EVENTS);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    // Local storage quota or security error, suppress silently
  }
}

/**
 * Dispatches an event payload directly to Supabase REST API or falls back to local storage.
 */
export async function trackEvent(eventName, eventData = {}) {
  const payload = {
    session_id: getSessionId(),
    event_name: eventName,
    event_data: eventData,
    page_path: typeof window !== "undefined" ? window.location.pathname + window.location.hash : "/",
    referrer: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
    device_type: getDeviceType(),
    created_at: new Date().toISOString(),
  };

  // Always log to local buffer so Staff Portal can preview telemetry immediately
  storeLocalEvent(payload);

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/site_events`;
      const body = JSON.stringify(payload);

      // Use fetch with keepalive to reliably send apikey and Authorization headers
      await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body,
        keepalive: true,
      });
    } catch {
      // Network drop or blocker, silently handled by local storage fallback
    }
  }
}

// ── Specialized Event Dispatchers ─────────────────────────────────────────────

export const trackPageView = (path) => trackEvent("page_view", { path });
export const trackBookTableClick = (location) => trackEvent("book_table_click", { location });
export const trackDirectionsClick = (location) => trackEvent("directions_click", { location });
export const trackMenuTab = (tab) => trackEvent("menu_tab_switch", { tab });
export const trackMenuPrint = (format, period) => trackEvent("menu_print_pdf", { format, period });
export const trackPromoClick = (id, title) => trackEvent("promo_banner_click", { id, title });
export const trackContactClick = (channel) => trackEvent("contact_click", { channel });

/**
 * Queries live aggregate web metrics from Supabase if configured.
 */
export async function fetchLiveCloudMetrics() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/daily_web_metrics?order=trading_date.desc&limit=7`;
    const res = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Return null on failure to fall back to local buffer
  }
  return null;
}

/**
 * Returns analytical summary metrics calculated from local telemetry or Supabase for the Staff Portal.
 */
export function getStoredTelemetryMetrics() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const events = raw ? JSON.parse(raw) : [];

    const uniqueSessions = new Set(events.map((e) => e.session_id)).size;
    const pageViews = events.filter((e) => e.event_name === "page_view").length;
    const bookClicks = events.filter((e) => e.event_name === "book_table_click").length;
    const directionsClicks = events.filter((e) => e.event_name === "directions_click").length;
    const menuSwitches = events.filter((e) => e.event_name === "menu_tab_switch").length;
    const printDownloads = events.filter((e) => e.event_name === "menu_print_pdf").length;
    const promoClicks = events.filter((e) => e.event_name === "promo_banner_click").length;

    const mobileCount = events.filter((e) => e.device_type === "mobile").length;
    const mobilePct = events.length > 0 ? Math.round((mobileCount / events.length) * 100) : 0;

    return {
      isLiveConnected: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
      totalEventsLogged: events.length,
      uniqueSessions,
      pageViews,
      bookClicks,
      directionsClicks,
      menuSwitches,
      printDownloads,
      promoClicks,
      mobilePct,
      recentEvents: events.slice(-15).reverse(),
    };
  } catch {
    return {
      isLiveConnected: false,
      totalEventsLogged: 0,
      uniqueSessions: 0,
      pageViews: 0,
      bookClicks: 0,
      directionsClicks: 0,
      menuSwitches: 0,
      printDownloads: 0,
      promoClicks: 0,
      mobilePct: 0,
      recentEvents: [],
    };
  }
}
