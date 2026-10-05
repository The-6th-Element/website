import React, { useState, useEffect } from "react";
import { COLORS } from "../../theme/tokens";
import { getStoredTelemetryMetrics, fetchLiveCloudMetrics } from "../../utils/analytics";

export function AnalyticsDashboard({ theme }) {
  const [metrics, setMetrics] = useState(() => getStoredTelemetryMetrics());
  const [cloudHistory, setCloudHistory] = useState(null);

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
    return () => clearInterval(interval);
  }, []);

  const handleClear = () => {
    if (window.confirm("Clear the local telemetry buffer? (Does not affect Supabase cloud)")) {
      localStorage.removeItem("t6e_offline_events_buffer");
      refreshMetrics();
    }
  };

  // If cloud data is loaded for today, use today's aggregated count
  const todayCloud = cloudHistory ? cloudHistory[0] : null;
  const displayVisitors = todayCloud ? todayCloud.unique_visitors : metrics.uniqueSessions;
  const displayBookClicks = todayCloud ? todayCloud.book_table_clicks : metrics.bookClicks;
  const displayDirections = todayCloud ? todayCloud.directions_clicks : metrics.directionsClicks;
  const displayMenuViews = todayCloud ? todayCloud.menu_tab_switches : metrics.menuSwitches;
  const displayPdfs = todayCloud ? todayCloud.menu_print_downloads : metrics.printDownloads;
  const displayPromos = todayCloud ? todayCloud.promo_clicks : metrics.promoClicks;
  const displayMobilePct = todayCloud ? todayCloud.mobile_percentage : metrics.mobilePct;

  const bookingRate =
    displayVisitors > 0
      ? ((displayBookClicks / displayVisitors) * 100).toFixed(1)
      : "0.0";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>📊</span>
            <h3 style={{ margin: 0, fontSize: 18, color: theme.heading, fontWeight: 500 }}>
              Website Traffic & Dining Intent Telemetry
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
              {metrics.isLiveConnected ? "🟢 Live Supabase Sync" : "⚡ First-Party Local Buffer"}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: theme.muted, lineHeight: 1.5 }}>
            100% GDPR & PECR compliant. Tracks anonymous customer buying signals without third-party cookies or intrusive banners.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={refreshMetrics}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: `1px solid ${theme.muted}40`,
              background: "transparent",
              color: theme.text,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            ↻ Refresh
          </button>
          <button
            onClick={handleClear}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: `1px solid #d9302540`,
              background: "#d9302510",
              color: "#d93025",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Clear Buffer
          </button>
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
          { label: "Unique Visitors", value: displayVisitors, icon: "👤", sub: `${displayMobilePct}% Mobile devices` },
          { label: "Book Table Taps", value: displayBookClicks, icon: "🍽️", sub: `${bookingRate}% Conversion rate`, highlight: true },
          { label: "Get Directions", value: displayDirections, icon: "📍", sub: "Richmond walk-in intent" },
          { label: "Menu Tab Views", value: displayMenuViews, icon: "📜", sub: "Daytime vs Evening interest" },
          { label: "PDF Menus Printed", value: displayPdfs, icon: "🖨️", sub: "Physical A4/A5 exports" },
          { label: "Promo Banner Taps", value: displayPromos, icon: "🏷️", sub: "Announcement conversions" },
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
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                {kpi.label}
              </span>
              <span style={{ fontSize: 16 }}>{kpi.icon}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 600, color: kpi.highlight ? COLORS.warmAmber : theme.heading }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: theme.muted }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Cross-Correlation Explanation Banner */}
      <div
        style={{
          background: `${COLORS.mossGreen}12`,
          border: `1px solid ${COLORS.mossGreen}40`,
          borderRadius: 14,
          padding: "16px 20px",
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 22 }}>🤖</span>
        <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.6 }}>
          <strong>Automated 05:15 AM Cross-Correlation:</strong> Every morning, the Toast-to-Xero nightly sync engine connects directly to this telemetry database to calculate yesterday's <strong>Web Intent vs Physical Toast Sales</strong>. You receive an automated digest in your morning email showing web footfall, top viewed menus, and dining conversion.
        </div>
      </div>

      {/* 7-Day Cloud Daily Rollup Table (if Supabase connected) */}
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h4 style={{ margin: 0, fontSize: 15, color: theme.heading, fontWeight: 600 }}>
              ☁️ Cloud Daily Performance History (Supabase Live)
            </h4>
            <span style={{ fontSize: 12, color: theme.muted }}>Europe/London Aggregation</span>
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
              {cloudHistory.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${theme.muted}15` }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.trading_date}</td>
                  <td style={{ padding: "10px 12px" }}>{row.unique_visitors}</td>
                  <td style={{ padding: "10px 12px", color: COLORS.warmAmber, fontWeight: 600 }}>{row.book_table_clicks}</td>
                  <td style={{ padding: "10px 12px" }}>{row.booking_intent_rate_pct}%</td>
                  <td style={{ padding: "10px 12px" }}>{row.directions_clicks}</td>
                  <td style={{ padding: "10px 12px" }}>{row.menu_tab_switches}</td>
                  <td style={{ padding: "10px 12px" }}>{row.menu_print_downloads}</td>
                  <td style={{ padding: "10px 12px" }}>{row.mobile_percentage}%</td>
                </tr>
              ))}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h4 style={{ margin: 0, fontSize: 15, color: theme.heading, fontWeight: 600 }}>
            Recent Intent Activity Stream ({metrics.recentEvents.length} events logged)
          </h4>
          <span style={{ fontSize: 12, color: theme.muted }}>Auto-updates live</span>
        </div>

        {metrics.recentEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: theme.muted, fontSize: 13 }}>
            No events logged in the buffer yet. Browse the menu or tap "Book a Table" to see live activity here.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {metrics.recentEvents.map((evt, i) => {
              const timeStr = new Date(evt.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
              const isHighIntent = evt.event_name === "book_table_click" || evt.event_name === "directions_click";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: isHighIntent ? `${COLORS.warmAmber}15` : `${theme.muted}10`,
                    borderLeft: `3px solid ${isHighIntent ? COLORS.warmAmber : theme.muted}`,
                    fontSize: 13,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 600, color: theme.heading }}>
                      {evt.event_name.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <span style={{ color: theme.muted, fontSize: 12 }}>
                      {evt.event_data ? JSON.stringify(evt.event_data) : ""}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: `${theme.muted}25`,
                        color: theme.muted,
                        textTransform: "uppercase",
                      }}
                    >
                      {evt.device_type}
                    </span>
                    <span style={{ color: theme.muted, fontSize: 12 }}>{timeStr}</span>
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
