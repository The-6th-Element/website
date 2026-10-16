import React, { useState, useEffect, useMemo } from "react";
import { COLORS } from "../../theme/tokens";
import { getStoredTelemetryMetrics, fetchLiveCloudMetrics } from "../../utils/analytics";

export function AnalyticsDashboard({ theme }) {
  const [metrics, setMetrics] = useState(() => getStoredTelemetryMetrics());
  const [cloudHistory, setCloudHistory] = useState(null);
  const [timeRange, setTimeRange] = useState("all"); // "all" | "today" | "yesterday" | "7d"

  const refreshMetrics = async () => {
    setMetrics(getStoredTelemetryMetrics());
    try {
      const cloud = await fetchLiveCloudMetrics();
      if (cloud && Array.isArray(cloud) && cloud.length > 0) {
        setCloudHistory(cloud);
      }
    } catch {}
  };

  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 6000);

    const handleSync = () => refreshMetrics();
    window.addEventListener("t6e_analytics_updated", handleSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener("t6e_analytics_updated", handleSync);
    };
  }, []);

  const handleClear = () => {
    if (
      window.confirm(
        "Clear only the recent local activity stream below? All-time cumulative stats and historical metrics are permanently retained."
      )
    ) {
      localStorage.removeItem("t6e_offline_events_buffer");
      refreshMetrics();
    }
  };

  // ── Multi-Day Aggregations (Cloud + Local Buffer Merging) ────────────────
  const aggregatedStats = useMemo(() => {
    const cloud = Array.isArray(cloudHistory) && cloudHistory.length > 0 ? cloudHistory : null;

    // Cloud records
    const todayCloud = cloud ? cloud[0] : null;
    const yesterdayCloud = cloud && cloud.length > 1 ? cloud[1] : null;

    // 7-day cloud totals
    const cloud7dVisitors = cloud ? cloud.reduce((acc, r) => acc + (r.unique_visitors || 0), 0) : 0;
    const cloud7dBookClicks = cloud ? cloud.reduce((acc, r) => acc + (r.book_table_clicks || 0), 0) : 0;
    const cloud7dDirections = cloud ? cloud.reduce((acc, r) => acc + (r.directions_clicks || 0), 0) : 0;
    const cloud7dMenuViews = cloud ? cloud.reduce((acc, r) => acc + (r.menu_tab_switches || 0), 0) : 0;
    const cloud7dPdfs = cloud ? cloud.reduce((acc, r) => acc + (r.menu_print_downloads || 0), 0) : 0;
    const cloud7dPromos = cloud ? cloud.reduce((acc, r) => acc + (r.promo_clicks || 0), 0) : 0;
    const cloud7dPageViews = cloud ? cloud.reduce((acc, r) => acc + (r.page_views || 0), 0) : 0;

    // Local metrics fallbacks
    const localToday = metrics.today || {};
    const localCumulative = metrics.cumulative || {};

    // Today values
    const todayVisitors = todayCloud
      ? Math.max(todayCloud.unique_visitors, localToday.uniqueVisitors || 0)
      : Math.max(localToday.uniqueVisitors || 0, metrics.uniqueSessions || 0);

    const todayBookClicks = todayCloud
      ? Math.max(todayCloud.book_table_clicks, localToday.bookClicks || 0)
      : (localToday.bookClicks || metrics.bookClicks || 0);

    const todayDirections = todayCloud
      ? Math.max(todayCloud.directions_clicks, localToday.directionsClicks || 0)
      : (localToday.directionsClicks || metrics.directionsClicks || 0);

    const todayMenuViews = todayCloud
      ? Math.max(todayCloud.menu_tab_switches, localToday.menuSwitches || 0)
      : (localToday.menuSwitches || metrics.menuSwitches || 0);

    const todayPdfs = todayCloud
      ? Math.max(todayCloud.menu_print_downloads, localToday.printDownloads || 0)
      : (localToday.printDownloads || metrics.printDownloads || 0);

    const todayPromos = todayCloud
      ? Math.max(todayCloud.promo_clicks, localToday.promoClicks || 0)
      : (localToday.promoClicks || metrics.promoClicks || 0);

    const todayMobilePct = todayCloud
      ? todayCloud.mobile_percentage
      : (metrics.mobilePct || 0);

    // Yesterday values
    const yesterdayVisitors = yesterdayCloud ? yesterdayCloud.unique_visitors : 0;
    const yesterdayBookClicks = yesterdayCloud ? yesterdayCloud.book_table_clicks : 0;
    const yesterdayDirections = yesterdayCloud ? yesterdayCloud.directions_clicks : 0;
    const yesterdayMenuViews = yesterdayCloud ? yesterdayCloud.menu_tab_switches : 0;
    const yesterdayPdfs = yesterdayCloud ? yesterdayCloud.menu_print_downloads : 0;
    const yesterdayPromos = yesterdayCloud ? yesterdayCloud.promo_clicks : 0;
    const yesterdayMobilePct = yesterdayCloud ? yesterdayCloud.mobile_percentage : 0;

    // Cumulative All-Time values (never reset or overwritten by code deploys)
    const cumulativeVisitors = Math.max(
      cloud7dVisitors,
      localCumulative.uniqueVisitors || 0,
      metrics.uniqueSessions || 0
    );

    const cumulativeBookClicks = Math.max(
      cloud7dBookClicks,
      localCumulative.bookClicks || 0,
      metrics.bookClicks || 0
    );

    const cumulativeDirections = Math.max(
      cloud7dDirections,
      localCumulative.directionsClicks || 0,
      metrics.directionsClicks || 0
    );

    const cumulativeMenuViews = Math.max(
      cloud7dMenuViews,
      localCumulative.menuSwitches || 0,
      metrics.menuSwitches || 0
    );

    const cumulativePdfs = Math.max(
      cloud7dPdfs,
      localCumulative.printDownloads || 0,
      metrics.printDownloads || 0
    );

    const cumulativePromos = Math.max(
      cloud7dPromos,
      localCumulative.promoClicks || 0,
      metrics.promoClicks || 0
    );

    const cumulativeMobilePct = cloud
      ? Math.round(
          (cloud.reduce((acc, r) => acc + (r.mobile_visitors || 0), 0) /
            Math.max(cumulativeVisitors, 1)) *
            100
        )
      : metrics.mobilePct || 0;

    return {
      today: {
        visitors: todayVisitors,
        bookClicks: todayBookClicks,
        directions: todayDirections,
        menuViews: todayMenuViews,
        pdfs: todayPdfs,
        promos: todayPromos,
        mobilePct: todayMobilePct,
        date: todayCloud?.trading_date || "Today",
      },
      yesterday: {
        visitors: yesterdayVisitors,
        bookClicks: yesterdayBookClicks,
        directions: yesterdayDirections,
        menuViews: yesterdayMenuViews,
        pdfs: yesterdayPdfs,
        promos: yesterdayPromos,
        mobilePct: yesterdayMobilePct,
        date: yesterdayCloud?.trading_date || "Yesterday",
      },
      all: {
        visitors: cumulativeVisitors,
        bookClicks: cumulativeBookClicks,
        directions: cumulativeDirections,
        menuViews: cumulativeMenuViews,
        pdfs: cumulativePdfs,
        promos: cumulativePromos,
        mobilePct: cumulativeMobilePct,
        totalPageViews: cloud7dPageViews || metrics.pageViews || 0,
      },
    };
  }, [cloudHistory, metrics]);

  // Determine active display values based on selected time range
  const currentView =
    timeRange === "today"
      ? aggregatedStats.today
      : timeRange === "yesterday"
      ? aggregatedStats.yesterday
      : aggregatedStats.all;

  const displayVisitors = currentView.visitors;
  const displayBookClicks = currentView.bookClicks;
  const displayDirections = currentView.directions;
  const displayMenuViews = currentView.menuViews;
  const displayPdfs = currentView.pdfs;
  const displayPromos = currentView.promos;
  const displayMobilePct = currentView.mobilePct;

  const bookingRate =
    displayVisitors > 0
      ? ((displayBookClicks / displayVisitors) * 100).toFixed(1)
      : "0.0";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Top Header & Status Banner */}
      <div
        style={{
          background: `${theme.accent}12`,
          border: `1px solid ${theme.accent}30`,
          borderRadius: 16,
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 18 }}>📊</span>
            <h3 style={{ margin: 0, fontSize: 18, color: theme.heading, fontWeight: 500 }}>
              Website Traffic & Customer Activity
            </h3>
            <span
              style={{
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: 12,
                fontWeight: 600,
                background: metrics.isLiveConnected ? "#E6F4EA" : "#FEF7E0",
                color: metrics.isLiveConnected ? "#137333" : "#B06000",
              }}
            >
              {metrics.isLiveConnected ? "🟢 Connected to Cloud" : "⚡ Local Storage"}
            </span>
            <span
              style={{
                fontSize: 10.5,
                padding: "2px 8px",
                borderRadius: 10,
                fontWeight: 700,
                background: `${COLORS.mossGreen}20`,
                color: COLORS.mossGreen,
              }}
            >
              🔒 History Saved
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: theme.muted, lineHeight: 1.5 }}>
            100% privacy-friendly. Shows how many customers visit the website and interact with menus and booking buttons.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={refreshMetrics}
            title="Immediately fetch the latest local and cloud analytics"
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: `1px solid ${theme.muted}40`,
              background: "transparent",
              color: theme.text,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Daily Visitor Retention Banner */}
      <div
        style={{
          background: `${COLORS.mossGreen}12`,
          border: `1.5px solid ${COLORS.mossGreen}40`,
          borderRadius: 14,
          padding: "16px 20px",
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 22 }}>🛡️</span>
        <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.6 }}>
          <strong>All-Time Visitor History:</strong> Website visitor numbers are saved automatically at midnight each day (e.g. yesterday&apos;s {aggregatedStats.yesterday.visitors} visitors) and added to your <strong>All-Time</strong> total, so your traffic history is never lost.
        </div>
      </div>

      {/* Time Range Selector Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          padding: "12px 16px",
          background: theme.surfaceAlt || "#FAFAF9",
          border: `1px solid ${theme.muted}20`,
          borderRadius: 14,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: theme.heading, display: "flex", alignItems: "center", gap: 6 }}>
          <span>📅 View Traffic By:</span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { id: "all", label: `🌟 All-Time Cumulative (${aggregatedStats.all.visitors} visitors)` },
            { id: "today", label: `📅 Today (${aggregatedStats.today.visitors} visitors)` },
            { id: "yesterday", label: `⏪ Yesterday (${aggregatedStats.yesterday.visitors} visitors)` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeRange(tab.id)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: timeRange === tab.id ? 600 : 500,
                cursor: "pointer",
                border: timeRange === tab.id ? `1.5px solid ${theme.accent}` : `1px solid ${theme.muted}30`,
                background: timeRange === tab.id ? `${theme.accent}18` : "transparent",
                color: timeRange === tab.id ? theme.accent : theme.text,
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {[
          {
            label: timeRange === "all" ? "Cumulative Visitors" : timeRange === "yesterday" ? "Yesterday's Visitors" : "Today's Visitors",
            value: displayVisitors,
            icon: "👤",
            sub:
              timeRange === "all"
                ? `+${aggregatedStats.today.visitors} today · ${aggregatedStats.yesterday.visitors} yesterday`
                : `${displayMobilePct}% Mobile devices`,
          },
          {
            label: "Book Table Taps",
            value: displayBookClicks,
            icon: "🍽️",
            sub: `${bookingRate}% Conversion rate`,
            highlight: true,
          },
          {
            label: "Get Directions",
            value: displayDirections,
            icon: "📍",
            sub: "Richmond walk-in intent",
          },
          {
            label: "Menu Tab Views",
            value: displayMenuViews,
            icon: "📜",
            sub: "Daytime vs Evening interest",
          },
          {
            label: "PDF Menus Printed",
            value: displayPdfs,
            icon: "🖨️",
            sub: "Physical A4/A5 exports",
          },
          {
            label: "Promo Banner Taps",
            value: displayPromos,
            icon: "🏷️",
            sub: "Announcement conversions",
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            style={{
              background: kpi.highlight ? `${COLORS.warmAmber}10` : `${theme.muted}0c`,
              border: `1px solid ${kpi.highlight ? COLORS.warmAmber + "50" : theme.muted + "25"}`,
              borderRadius: 14,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11.5, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                {kpi.label}
              </span>
              <span style={{ fontSize: 16 }}>{kpi.icon}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 600, color: kpi.highlight ? COLORS.warmAmber : theme.heading }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 11.5, color: theme.muted, lineHeight: 1.4 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Cross-Correlation Explanation Banner */}
      <div
        style={{
          background: `${COLORS.warmAmber}10`,
          border: `1px solid ${COLORS.warmAmber}35`,
          borderRadius: 14,
          padding: "16px 20px",
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 22 }}>🤖</span>
        <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.6 }}>
          <strong>Automated 05:15 AM Cross-Correlation:</strong> Every morning, the Toast-to-Xero nightly sync engine connects directly to this telemetry database to calculate yesterday&apos;s <strong>Web Intent vs Physical Toast Sales</strong>. You receive an automated digest in your morning email showing web footfall, top viewed menus, and dining conversion.
        </div>
      </div>

      {/* Cloud Daily Rollup Table (Supabase Live History) */}
      {cloudHistory && cloudHistory.length > 0 && (
        <div
          style={{
            background: `${theme.muted}08`,
            border: `1px solid ${theme.muted}20`,
            borderRadius: 14,
            padding: 24,
            overflowX: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 15, color: theme.heading, fontWeight: 600 }}>
                ☁️ Daily Trading History (Supabase Live Archive)
              </h4>
              <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>
                Each trading day is permanently preserved here across releases and code updates.
              </div>
            </div>
            <span style={{ fontSize: 12, color: theme.muted, background: `${theme.muted}15`, padding: "4px 10px", borderRadius: 12 }}>
              Europe/London Aggregation
            </span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${theme.muted}25`, color: theme.muted, fontSize: 11, textTransform: "uppercase" }}>
                <th style={{ padding: "8px 12px" }}>Trading Date</th>
                <th style={{ padding: "8px 12px" }}>Visitors</th>
                <th style={{ padding: "8px 12px" }}>Book Table</th>
                <th style={{ padding: "8px 12px" }}>Conversion</th>
                <th style={{ padding: "8px 12px" }}>Directions</th>
                <th style={{ padding: "8px 12px" }}>Menu Views</th>
                <th style={{ padding: "8px 12px" }}>PDF Menus</th>
                <th style={{ padding: "8px 12px" }}>Mobile %</th>
              </tr>
            </thead>
            <tbody>
              {/* Highlighted Cumulative Total Row */}
              <tr
                style={{
                  borderBottom: `2px solid ${COLORS.warmAmber}50`,
                  background: `${COLORS.warmAmber}15`,
                  fontWeight: 700,
                }}
              >
                <td style={{ padding: "12px", color: COLORS.warmAmber }}>
                  ★ All-Time Retained Total ({cloudHistory.length} Days)
                </td>
                <td style={{ padding: "12px", color: theme.heading }}>
                  {aggregatedStats.all.visitors}
                </td>
                <td style={{ padding: "12px", color: COLORS.warmAmber }}>
                  {aggregatedStats.all.bookClicks}
                </td>
                <td style={{ padding: "12px" }}>
                  {aggregatedStats.all.visitors > 0
                    ? ((aggregatedStats.all.bookClicks / aggregatedStats.all.visitors) * 100).toFixed(1)
                    : "0.0"}%
                </td>
                <td style={{ padding: "12px" }}>{aggregatedStats.all.directions}</td>
                <td style={{ padding: "12px" }}>{aggregatedStats.all.menuViews}</td>
                <td style={{ padding: "12px" }}>{aggregatedStats.all.pdfs}</td>
                <td style={{ padding: "12px" }}>{aggregatedStats.all.mobilePct}%</td>
              </tr>

              {/* Individual Days */}
              {cloudHistory.map((row, idx) => {
                const isTodayRow = idx === 0;
                const isYesterdayRow = idx === 1;

                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: `1px solid ${theme.muted}15`,
                      background: isTodayRow ? `${theme.accent}08` : "transparent",
                    }}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>
                      {row.trading_date}{" "}
                      {isTodayRow && (
                        <span style={{ fontSize: 10, color: theme.accent, fontWeight: 700, marginLeft: 4 }}>
                          (TODAY)
                        </span>
                      )}
                      {isYesterdayRow && (
                        <span style={{ fontSize: 10, color: COLORS.mossGreen, fontWeight: 700, marginLeft: 4 }}>
                          (YESTERDAY)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "10px 12px" }}>{row.unique_visitors}</td>
                    <td style={{ padding: "10px 12px", color: COLORS.warmAmber, fontWeight: 600 }}>
                      {row.book_table_clicks}
                    </td>
                    <td style={{ padding: "10px 12px" }}>{row.booking_intent_rate_pct}%</td>
                    <td style={{ padding: "10px 12px" }}>{row.directions_clicks}</td>
                    <td style={{ padding: "10px 12px" }}>{row.menu_tab_switches}</td>
                    <td style={{ padding: "10px 12px" }}>{row.menu_print_downloads}</td>
                    <td style={{ padding: "10px 12px" }}>{row.mobile_percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Live Stream of Recent Intent Events */}
      <div
        style={{
          background: `${theme.muted}08`,
          border: `1px solid ${theme.muted}20`,
          borderRadius: 14,
          padding: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h4 style={{ margin: 0, fontSize: 15, color: theme.heading, fontWeight: 600 }}>
              Recent Intent Activity Stream ({metrics.recentEvents.length} events logged)
            </h4>
            <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>
              Real-time clickstream of visitor actions across the website.
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: theme.muted }}>Auto-updates live</span>
            {metrics.recentEvents.length > 0 && (
              <button
                onClick={handleClear}
                title="Clear only the recent activity clickstream below. Cumulative and historical stats are permanently preserved."
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: `1px solid ${theme.muted}30`,
                  background: "transparent",
                  color: theme.muted,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Clear Log
              </button>
            )}
          </div>
        </div>

        {metrics.recentEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: theme.muted, fontSize: 13 }}>
            No events logged in the buffer yet. Browse the menu or tap &quot;Book a Table&quot; to see live activity here.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {metrics.recentEvents.map((evt, i) => {
              const nameMap = {
                page_view: { label: "Page View", icon: "👁️", color: theme.muted },
                book_table_click: { label: "Book Table Tap", icon: "🍽️", color: COLORS.warmAmber },
                directions_click: { label: "Get Directions", icon: "📍", color: COLORS.mossGreen },
                menu_tab_switch: { label: "Menu Category Switch", icon: "📜", color: theme.accent },
                menu_print_pdf: { label: "PDF Menu Export", icon: "🖨️", color: "#2563EB" },
                promo_banner_click: { label: "Promo Banner Tap", icon: "🏷️", color: "#D97706" },
                contact_click: { label: "Contact Channel Click", icon: "✉️", color: theme.muted },
                menu_dietary_filter: { label: "Dietary Filter Active", icon: "🥗", color: COLORS.mossGreen },
              };
              const meta = nameMap[evt.event_name] || { label: evt.event_name, icon: "⚡", color: theme.muted };
              const timeStr = evt.created_at ? new Date(evt.created_at).toLocaleTimeString() : "";

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: theme.surface,
                    borderRadius: 8,
                    fontSize: 12,
                    border: `1px solid ${theme.muted}15`,
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span style={{ fontSize: 14 }}>{meta.icon}</span>
                    <span style={{ fontWeight: 600, color: meta.color, whiteSpace: "nowrap" }}>
                      {meta.label}
                    </span>
                    <span
                      style={{
                        color: theme.muted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: 11.5,
                      }}
                    >
                      {evt.page_path || "/"}
                      {evt.event_data?.tab ? ` (${evt.event_data.tab})` : ""}
                      {evt.event_data?.title ? ` - ${evt.event_data.title}` : ""}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10.5, color: theme.muted, textTransform: "uppercase" }}>
                      {evt.device_type}
                    </span>
                    <span style={{ fontSize: 11, color: theme.muted }}>{timeStr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
