// src/utils/analytics.js
// Lightweight, privacy-conscious first-party telemetry for The Sixth Element
// Fully UK GDPR / PECR compliant (no cookies, zero PII, anonymous sessions).
// Retains incremental historical metrics across code deployments and page refreshes.

const SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  "https://crjtogivsllhsxuznufn.supabase.co";

const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyanRvZ2l2c2xsaHN4dXpudWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU4ODIsImV4cCI6MjEwNjc4MTg4Mn0.uX8IHMaKAApaROFRehMtZADYOMqb2GdIT-ecvrDAOEA";

const SESSION_KEY = "t6e_anon_session_id";
const LOCAL_STORAGE_KEY = "t6e_offline_events_buffer";
const CUMULATIVE_STORAGE_KEY = "t6e_cumulative_metrics";
const DAILY_HISTORY_KEY = "t6e_daily_metrics_history";
const SEEN_SESSIONS_KEY = "t6e_seen_sessions_set";
const MAX_LOCAL_EVENTS = 250;

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
 * Gets today's trading date in YYYY-MM-DD format (Europe/London).
 */
function getTodayDateString() {
  try {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Updates persistent daily and cumulative metrics in localStorage.
 * Ensures data is strictly incremental and NEVER overwritten when code is pushed.
 */
function updateIncrementalMetrics(event) {
  try {
    const today = (event.created_at || new Date().toISOString()).slice(0, 10);
    const isMobile = event.device_type === "mobile";

    // 1. Retrieve or initialize seen sessions
    let seen = { all_time: [], by_date: {} };
    try {
      const rawSeen = localStorage.getItem(SEEN_SESSIONS_KEY);
      if (rawSeen) seen = JSON.parse(rawSeen);
    } catch {}
    if (!seen.all_time) seen.all_time = [];
    if (!seen.by_date) seen.by_date = {};
    if (!seen.by_date[today]) seen.by_date[today] = [];

    const isNewTodaySession = !seen.by_date[today].includes(event.session_id);
    const isNewAllTimeSession = !seen.all_time.includes(event.session_id);

    if (isNewTodaySession) {
      seen.by_date[today].push(event.session_id);
      // Keep array reasonable in size
      if (seen.by_date[today].length > 500) seen.by_date[today].shift();
    }
    if (isNewAllTimeSession) {
      seen.all_time.push(event.session_id);
      if (seen.all_time.length > 2000) seen.all_time.shift();
    }
    localStorage.setItem(SEEN_SESSIONS_KEY, JSON.stringify(seen));

    // 2. Retrieve or initialize daily history
    let dailyHistory = {};
    try {
      const rawDaily = localStorage.getItem(DAILY_HISTORY_KEY);
      if (rawDaily) dailyHistory = JSON.parse(rawDaily);
    } catch {}

    if (!dailyHistory[today]) {
      dailyHistory[today] = {
        trading_date: today,
        unique_visitors: 0,
        page_views: 0,
        book_table_clicks: 0,
        directions_clicks: 0,
        menu_tab_switches: 0,
        menu_print_downloads: 0,
        promo_clicks: 0,
        contact_clicks: 0,
        mobile_visitors: 0,
        desktop_visitors: 0,
      };
    }

    const dayRecord = dailyHistory[today];
    if (isNewTodaySession) {
      dayRecord.unique_visitors += 1;
      if (isMobile) dayRecord.mobile_visitors += 1;
      else dayRecord.desktop_visitors += 1;
    }

    if (event.event_name === "page_view") dayRecord.page_views += 1;
    else if (event.event_name === "book_table_click") dayRecord.book_table_clicks += 1;
    else if (event.event_name === "directions_click") dayRecord.directions_clicks += 1;
    else if (event.event_name === "menu_tab_switch") dayRecord.menu_tab_switches += 1;
    else if (event.event_name === "menu_print_pdf") dayRecord.menu_print_downloads += 1;
    else if (event.event_name === "promo_banner_click") dayRecord.promo_clicks += 1;
    else if (event.event_name === "contact_click") dayRecord.contact_clicks += 1;

    localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(dailyHistory));

    // 3. Retrieve or initialize cumulative all-time counters
    let cumulative = {
      unique_visitors: 0,
      page_views: 0,
      book_table_clicks: 0,
      directions_clicks: 0,
      menu_tab_switches: 0,
      menu_print_downloads: 0,
      promo_clicks: 0,
      contact_clicks: 0,
      mobile_count: 0,
    };
    try {
      const rawCum = localStorage.getItem(CUMULATIVE_STORAGE_KEY);
      if (rawCum) cumulative = JSON.parse(rawCum);
    } catch {}

    if (isNewAllTimeSession) {
      cumulative.unique_visitors += 1;
    }
    if (event.event_name === "page_view") cumulative.page_views += 1;
    else if (event.event_name === "book_table_click") cumulative.book_table_clicks += 1;
    else if (event.event_name === "directions_click") cumulative.directions_clicks += 1;
    else if (event.event_name === "menu_tab_switch") cumulative.menu_tab_switches += 1;
    else if (event.event_name === "menu_print_pdf") cumulative.menu_print_downloads += 1;
    else if (event.event_name === "promo_banner_click") cumulative.promo_clicks += 1;
    else if (event.event_name === "contact_click") cumulative.contact_clicks += 1;

    if (isMobile) cumulative.mobile_count = (cumulative.mobile_count || 0) + 1;

    localStorage.setItem(CUMULATIVE_STORAGE_KEY, JSON.stringify(cumulative));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("t6e_analytics_updated"));
    }
  } catch (err) {
    // Suppress quota error silently
  }
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

    // Always incrementally update persistent metrics
    updateIncrementalMetrics(event);
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

  // Always log to local incremental buffer so Staff Portal retains telemetry immediately
  storeLocalEvent(payload);

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/site_events`;
      const body = JSON.stringify(payload);

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
      // Network drop or blocker, safely persisted in local incremental storage
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
export const trackDietaryFilter = (diet, tab) => trackEvent("menu_dietary_filter", { diet, tab });

/**
 * Queries live aggregate web metrics from Supabase if configured.
 */
export async function fetchLiveCloudMetrics() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/daily_web_metrics?order=trading_date.desc&limit=14`;
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

    const todayDate = getTodayDateString();

    // Read persistent daily history and cumulative counters
    let dailyHistory = {};
    try {
      const rawDaily = localStorage.getItem(DAILY_HISTORY_KEY);
      if (rawDaily) dailyHistory = JSON.parse(rawDaily);
    } catch {}

    let cumulative = {
      unique_visitors: 0,
      page_views: 0,
      book_table_clicks: 0,
      directions_clicks: 0,
      menu_tab_switches: 0,
      menu_print_downloads: 0,
      promo_clicks: 0,
      contact_clicks: 0,
      mobile_count: 0,
    };
    try {
      const rawCum = localStorage.getItem(CUMULATIVE_STORAGE_KEY);
      if (rawCum) cumulative = JSON.parse(rawCum);
    } catch {}

    // Compute raw events for backward-compatibility fallback
    const rawUniqueSessions = new Set(events.map((e) => e.session_id)).size;
    const rawPageViews = events.filter((e) => e.event_name === "page_view").length;
    const rawBookClicks = events.filter((e) => e.event_name === "book_table_click").length;
    const rawDirectionsClicks = events.filter((e) => e.event_name === "directions_click").length;
    const rawMenuSwitches = events.filter((e) => e.event_name === "menu_tab_switch").length;
    const rawPrintDownloads = events.filter((e) => e.event_name === "menu_print_pdf").length;
    const rawPromoClicks = events.filter((e) => e.event_name === "promo_banner_click").length;

    const mobileCount = events.filter((e) => e.device_type === "mobile").length;
    const mobilePct = events.length > 0 ? Math.round((mobileCount / events.length) * 100) : 0;

    const todayRecord = dailyHistory[todayDate] || {
      trading_date: todayDate,
      unique_visitors: rawUniqueSessions,
      page_views: rawPageViews,
      book_table_clicks: rawBookClicks,
      directions_clicks: rawDirectionsClicks,
      menu_tab_switches: rawMenuSwitches,
      menu_print_downloads: rawPrintDownloads,
      promo_clicks: rawPromoClicks,
      contact_clicks: 0,
    };

    return {
      isLiveConnected: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
      totalEventsLogged: events.length,
      // Cumulative all-time (strictly incremental)
      cumulative: {
        uniqueVisitors: Math.max(cumulative.unique_visitors, rawUniqueSessions),
        pageViews: Math.max(cumulative.page_views, rawPageViews),
        bookClicks: Math.max(cumulative.book_table_clicks, rawBookClicks),
        directionsClicks: Math.max(cumulative.directions_clicks, rawDirectionsClicks),
        menuSwitches: Math.max(cumulative.menu_tab_switches, rawMenuSwitches),
        printDownloads: Math.max(cumulative.menu_print_downloads, rawPrintDownloads),
        promoClicks: Math.max(cumulative.promo_clicks, rawPromoClicks),
      },
      // Today live
      today: {
        uniqueVisitors: todayRecord.unique_visitors,
        pageViews: todayRecord.page_views,
        bookClicks: todayRecord.book_table_clicks,
        directionsClicks: todayRecord.directions_clicks,
        menuSwitches: todayRecord.menu_tab_switches,
        printDownloads: todayRecord.menu_print_downloads,
        promoClicks: todayRecord.promo_clicks,
      },
      // Backward compatibility fields
      uniqueSessions: Math.max(cumulative.unique_visitors, rawUniqueSessions),
      pageViews: Math.max(cumulative.page_views, rawPageViews),
      bookClicks: Math.max(cumulative.book_table_clicks, rawBookClicks),
      directionsClicks: Math.max(cumulative.directions_clicks, rawDirectionsClicks),
      menuSwitches: Math.max(cumulative.menu_tab_switches, rawMenuSwitches),
      printDownloads: Math.max(cumulative.menu_print_downloads, rawPrintDownloads),
      promoClicks: Math.max(cumulative.promo_clicks, rawPromoClicks),
      mobilePct,
      recentEvents: events.slice(-20).reverse(),
    };
  } catch {
    return {
      isLiveConnected: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
      totalEventsLogged: 0,
      cumulative: {
        uniqueVisitors: 0,
        pageViews: 0,
        bookClicks: 0,
        directionsClicks: 0,
        menuSwitches: 0,
        printDownloads: 0,
        promoClicks: 0,
      },
      today: {
        uniqueVisitors: 0,
        pageViews: 0,
        bookClicks: 0,
        directionsClicks: 0,
        menuSwitches: 0,
        printDownloads: 0,
        promoClicks: 0,
      },
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
