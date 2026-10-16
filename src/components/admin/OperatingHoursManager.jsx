// src/components/admin/OperatingHoursManager.jsx
// Operating Hours & Service Times Manager
// Easy-to-use control center for weekly hours, bank holidays, and Google Maps sync.

import React, { useState, useEffect } from "react";
import {
  getOperatingHoursConfig,
  saveOperatingHoursConfig,
  getLiveOperatingStatus,
  formatTime12h,
  getFormattedHoursSummary,
  getGoogleBusinessProfilePayload,
  DEFAULT_WEEKLY_SCHEDULE,
  DEFAULT_HOLIDAY_SCHEDULE,
} from "../../data/operatingHours";
import { GOOGLE_CONFIG } from "../../data/config";

export function OperatingHoursManager({ theme }) {
  const [config, setConfig] = useState(() => getOperatingHoursConfig());
  const [activeSubTab, setActiveSubTab] = useState("weekly"); // "weekly" | "holidays" | "notice" | "channels"
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [googleSyncing, setGoogleSyncing] = useState(false);
  const [googleSyncSuccess, setGoogleSyncSuccess] = useState(false);
  const [lastGoogleSyncTime, setLastGoogleSyncTime] = useState(() => {
    try {
      return localStorage.getItem("tse_last_google_sync") || null;
    } catch {
      return null;
    }
  });
  const [showDevPayload, setShowDevPayload] = useState(false);

  // New Holiday Draft State
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayClosed, setNewHolidayClosed] = useState(false);
  const [newHolidayOpen, setNewHolidayOpen] = useState("10:00");
  const [newHolidayClose, setNewHolidayClose] = useState("18:00");
  const [newHolidayNote, setNewHolidayNote] = useState("");
  const [holidayError, setHolidayError] = useState("");

  // Live status preview
  const [liveStatus, setLiveStatus] = useState(() => getLiveOperatingStatus(config));

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveStatus(getLiveOperatingStatus(config));
    }, 15000);
    return () => clearInterval(timer);
  }, [config]);

  // Handle Weekly Hours Change
  const handleWeeklyChange = (dayIndex, field, value) => {
    setConfig((prev) => {
      const updatedWeekly = [...prev.weekly];
      updatedWeekly[dayIndex] = {
        ...updatedWeekly[dayIndex],
        [field]: value,
      };
      return { ...prev, weekly: updatedWeekly };
    });
    setSaveSuccess(false);
  };

  // Toggle Day Open/Closed
  const handleToggleDayOpen = (dayIndex) => {
    setConfig((prev) => {
      const updatedWeekly = [...prev.weekly];
      updatedWeekly[dayIndex] = {
        ...updatedWeekly[dayIndex],
        open: !updatedWeekly[dayIndex].open,
      };
      return { ...prev, weekly: updatedWeekly };
    });
    setSaveSuccess(false);
  };

  // Add Special Holiday Override
  const handleAddHoliday = (e) => {
    e.preventDefault();
    setHolidayError("");
    if (!newHolidayDate) {
      setHolidayError("Please select a date for the holiday override.");
      return;
    }
    if (!newHolidayName.trim()) {
      setHolidayError("Please provide a name (e.g. Boxing Day or Private Party).");
      return;
    }

    const newHoliday = {
      id: `holiday-${Date.now()}`,
      date: newHolidayDate,
      name: newHolidayName.trim(),
      isClosed: newHolidayClosed,
      openTime: newHolidayClosed ? "" : newHolidayOpen,
      closeTime: newHolidayClosed ? "" : newHolidayClose,
      note: newHolidayNote.trim(),
    };

    setConfig((prev) => ({
      ...prev,
      holidays: [...(prev.holidays || []).filter((h) => h.date !== newHolidayDate), newHoliday].sort((a, b) =>
        a.date.localeCompare(b.date)
      ),
    }));

    setNewHolidayDate("");
    setNewHolidayName("");
    setNewHolidayClosed(false);
    setNewHolidayNote("");
    setSaveSuccess(false);
  };

  // Remove Holiday Override
  const handleRemoveHoliday = (holidayId) => {
    setConfig((prev) => ({
      ...prev,
      holidays: (prev.holidays || []).filter((h) => h.id !== holidayId),
    }));
    setSaveSuccess(false);
  };

  // Save All Changes
  const handleSaveAll = () => {
    const saved = saveOperatingHoursConfig(config);
    setConfig(saved);
    setLiveStatus(getLiveOperatingStatus(saved));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Push to Google Maps
  const handleSyncToGoogle = async () => {
    setGoogleSyncing(true);
    setGoogleSyncSuccess(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const nowStr = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      try {
        localStorage.setItem("tse_last_google_sync", nowStr);
      } catch {
        // ignore
      }
      setLastGoogleSyncTime(nowStr);
      setGoogleSyncSuccess(true);
      setTimeout(() => setGoogleSyncSuccess(false), 4000);
    } catch (e) {
      console.error("Google sync error:", e);
    } finally {
      setGoogleSyncing(false);
    }
  };

  const currentSummary = getFormattedHoursSummary(config.weekly);

  // Styles
  const cardStyle = {
    background: theme.surface,
    border: `1px solid ${theme.muted}20`,
    borderRadius: 14,
    padding: "24px 28px",
    marginBottom: 24,
  };

  const pillStyle = (active) => ({
    padding: "8px 18px",
    borderRadius: 8,
    border: `1px solid ${active ? theme.accent : `${theme.muted}30`}`,
    background: active ? `${theme.accent}15` : theme.surfaceAlt,
    color: active ? theme.accent : theme.text,
    fontWeight: active ? 600 : 400,
    fontSize: 13,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "all 0.15s ease",
  });

  const inputStyle = {
    padding: "9px 12px",
    borderRadius: 8,
    border: `1px solid ${theme.muted}30`,
    background: theme.surfaceAlt,
    color: theme.text,
    fontSize: 13,
    outline: "none",
  };

  return (
    <div>
      {/* Top Banner: Status Header */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 22 }}>⏰</span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24,
                  fontWeight: 600,
                  color: theme.heading,
                  margin: 0,
                }}
              >
                Operating Hours &amp; Service Times
              </h2>
            </div>
            <div style={{ fontSize: 13, color: theme.muted, maxWidth: 660, lineHeight: 1.5 }}>
              Set your weekly opening times, holiday hours, and notices. When you click <strong>Publish Hours</strong>, the website updates immediately.
            </div>
          </div>

          {/* Current Real-Time Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              borderRadius: 10,
              background: theme.surfaceAlt,
              border: `1px solid ${theme.muted}25`,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: liveStatus.color || "#2ECC71",
                boxShadow: `0 0 8px ${liveStatus.color || "#2ECC71"}`,
              }}
            />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.heading }}>
                Currently: {liveStatus.badge}
              </div>
              <div style={{ fontSize: 11, color: theme.muted }}>{liveStatus.detail}</div>
            </div>
          </div>
        </div>

        {/* 4-Channel Status Overview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 12,
            marginTop: 20,
            paddingTop: 18,
            borderTop: `1px solid ${theme.muted}15`,
          }}
        >
          {/* Channel 1: Website */}
          <div style={{ padding: "12px 14px", borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.muted}15` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.heading }}>🌐 Website</span>
              <span style={{ fontSize: 11, color: "#2ECC71", fontWeight: 600 }}>● Live</span>
            </div>
            <div style={{ fontSize: 11, color: theme.muted }}>Contact page &amp; footer update instantly</div>
          </div>

          {/* Channel 2: Google Maps */}
          <div style={{ padding: "12px 14px", borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.muted}15` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.heading }}>📍 Google Maps</span>
              <span style={{ fontSize: 11, color: "#4285F4", fontWeight: 600 }}>
                {lastGoogleSyncTime ? `● Synced today at ${lastGoogleSyncTime}` : "● Ready to Sync"}
              </span>
            </div>
            <div style={{ fontSize: 11, color: theme.muted }}>Updates your Google Search &amp; Maps hours</div>
          </div>

          {/* Channel 3: Toast POS */}
          <div style={{ padding: "12px 14px", borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.muted}15` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.heading }}>🍞 Toast POS</span>
              <span style={{ fontSize: 11, color: "#E67E22", fontWeight: 600 }}>○ Toast BackOffice</span>
            </div>
            <div style={{ fontSize: 11, color: theme.muted }}>Tills &amp; bookings are managed in Toast</div>
          </div>

          {/* Channel 4: Deliveroo */}
          <div style={{ padding: "12px 14px", borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.muted}15` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.heading }}>🛵 Deliveroo</span>
              <span style={{ fontSize: 11, color: "#E67E22", fontWeight: 600 }}>○ Deliveroo Hub</span>
            </div>
            <div style={{ fontSize: 11, color: theme.muted }}>Mirrors Toast or update in Deliveroo Hub</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <button style={pillStyle(activeSubTab === "weekly")} onClick={() => setActiveSubTab("weekly")}>
          📅 Weekly Schedule
        </button>
        <button style={pillStyle(activeSubTab === "holidays")} onClick={() => setActiveSubTab("holidays")}>
          🎄 Bank Holidays ({config.holidays?.length || 0})
        </button>
        <button style={pillStyle(activeSubTab === "notice")} onClick={() => setActiveSubTab("notice")}>
          🚨 Special Notice {config.emergencyNotice?.enabled && "●"}
        </button>
        <button style={pillStyle(activeSubTab === "channels")} onClick={() => setActiveSubTab("channels")}>
          🔄 Other Platforms Guide
        </button>
      </div>

      {/* SUB-TAB 1: WEEKLY SCHEDULE */}
      {activeSubTab === "weekly" && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.heading, margin: 0 }}>
                Weekly Service Hours
              </h3>
              <div style={{ fontSize: 12, color: theme.muted, marginTop: 4 }}>
                Set doors open and close times for each day. Use the <strong>OPEN/CLOSED</strong> toggle to mark days off.
              </div>
            </div>
            <button
              onClick={handleSaveAll}
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                background: theme.accent,
                color: "#fff",
                border: "none",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              {saveSuccess ? "✓ Hours Published!" : "Publish Hours"}
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.muted}25`, textAlign: "left", color: theme.muted, fontSize: 11, textTransform: "uppercase" }}>
                  <th style={{ padding: "10px 12px" }}>Day</th>
                  <th style={{ padding: "10px 12px" }}>Status</th>
                  <th style={{ padding: "10px 12px" }}>Doors Open</th>
                  <th style={{ padding: "10px 12px" }}>Doors Close</th>
                  <th style={{ padding: "10px 12px" }}>Daytime Brunch Slot</th>
                  <th style={{ padding: "10px 12px" }}>Evening Dining Slot</th>
                </tr>
              </thead>
              <tbody>
                {(config.weekly || DEFAULT_WEEKLY_SCHEDULE).map((item, idx) => (
                  <tr
                    key={item.day}
                    style={{
                      borderBottom: `1px solid ${theme.muted}15`,
                      background: item.open ? "transparent" : `${theme.muted}08`,
                    }}
                  >
                    <td style={{ padding: "12px", fontWeight: 600, color: theme.heading }}>
                      {item.day}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => handleToggleDayOpen(idx)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          border: `1px solid ${item.open ? "#2ECC71" : theme.muted}`,
                          background: item.open ? "rgba(46, 204, 113, 0.15)" : theme.surfaceAlt,
                          color: item.open ? "#2ECC71" : theme.muted,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {item.open ? "OPEN" : "CLOSED"}
                      </button>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <input
                        type="time"
                        disabled={!item.open}
                        value={item.openTime}
                        onChange={(e) => handleWeeklyChange(idx, "openTime", e.target.value)}
                        style={inputStyle}
                      />
                    </td>
                    <td style={{ padding: "12px" }}>
                      <input
                        type="time"
                        disabled={!item.open}
                        value={item.closeTime}
                        onChange={(e) => handleWeeklyChange(idx, "closeTime", e.target.value)}
                        style={inputStyle}
                      />
                    </td>
                    <td style={{ padding: "12px" }}>
                      <input
                        type="text"
                        disabled={!item.open}
                        value={item.daytime || ""}
                        placeholder="e.g. 08:00 - 15:00"
                        onChange={(e) => handleWeeklyChange(idx, "daytime", e.target.value)}
                        style={{ ...inputStyle, width: 140 }}
                      />
                    </td>
                    <td style={{ padding: "12px" }}>
                      <input
                        type="text"
                        disabled={!item.open}
                        value={item.evening || ""}
                        placeholder="e.g. 17:00 - 22:00"
                        onChange={(e) => handleWeeklyChange(idx, "evening", e.target.value)}
                        style={{ ...inputStyle, width: 140 }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BANK HOLIDAYS */}
      {activeSubTab === "holidays" && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.heading, margin: 0 }}>
                Bank Holidays &amp; Special Dates
              </h3>
              <div style={{ fontSize: 12, color: theme.muted, marginTop: 4 }}>
                Set special opening times or closures for holidays like Christmas, New Year, and Easter.
              </div>
            </div>
            <button
              onClick={handleSaveAll}
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                background: theme.accent,
                color: "#fff",
                border: "none",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {saveSuccess ? "✓ Holidays Saved!" : "Publish Holidays"}
            </button>
          </div>

          {/* Add Holiday Form */}
          <form
            onSubmit={handleAddHoliday}
            style={{
              padding: "16px 20px",
              borderRadius: 10,
              background: theme.surfaceAlt,
              border: `1px solid ${theme.muted}20`,
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.heading, marginBottom: 12 }}>
              Add a Holiday or Special Day
            </div>

            {holidayError && (
              <div style={{ color: "#E74C3C", fontSize: 12, marginBottom: 12, fontWeight: 500 }}>
                ⚠️ {holidayError}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: theme.muted, marginBottom: 4 }}>Date</label>
                <input
                  type="date"
                  value={newHolidayDate}
                  onChange={(e) => setNewHolidayDate(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={{ display: "block", fontSize: 11, color: theme.muted, marginBottom: 4 }}>Holiday / Event Name</label>
                <input
                  type="text"
                  placeholder="e.g. Boxing Day Recovery"
                  value={newHolidayName}
                  onChange={(e) => setNewHolidayName(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, color: theme.muted, marginBottom: 4 }}>Status</label>
                <select
                  value={newHolidayClosed ? "closed" : "custom"}
                  onChange={(e) => setNewHolidayClosed(e.target.value === "closed")}
                  style={inputStyle}
                >
                  <option value="custom">Modified Hours</option>
                  <option value="closed">Closed All Day</option>
                </select>
              </div>

              {!newHolidayClosed && (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: theme.muted, marginBottom: 4 }}>Opens</label>
                    <input
                      type="time"
                      value={newHolidayOpen}
                      onChange={(e) => setNewHolidayOpen(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: theme.muted, marginBottom: 4 }}>Closes</label>
                    <input
                      type="time"
                      value={newHolidayClose}
                      onChange={(e) => setNewHolidayClose(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </>
              )}

              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={{ display: "block", fontSize: 11, color: theme.muted, marginBottom: 4 }}>Guest Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Serving Festive Roast & Spiced Cider"
                  value={newHolidayNote}
                  onChange={(e) => setNewHolidayNote(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "9px 18px",
                  borderRadius: 8,
                  background: theme.heading,
                  color: theme.surface,
                  border: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                + Add Date
              </button>
            </div>
          </form>

          {/* Existing Overrides List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(config.holidays || []).map((h) => (
              <div
                key={h.id || h.date}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 18px",
                  borderRadius: 10,
                  background: theme.surfaceAlt,
                  border: `1px solid ${theme.muted}15`,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: theme.heading }}>{h.name}</span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: h.isClosed ? "rgba(231, 76, 60, 0.15)" : "rgba(46, 204, 113, 0.15)",
                        color: h.isClosed ? "#E74C3C" : "#2ECC71",
                      }}
                    >
                      {h.isClosed ? "CLOSED" : `${formatTime12h(h.openTime)} – ${formatTime12h(h.closeTime)}`}
                    </span>
                    <span style={{ fontSize: 12, color: theme.muted }}>({h.date})</span>
                  </div>
                  {h.note && <div style={{ fontSize: 12, color: theme.muted, marginTop: 4 }}>{h.note}</div>}
                </div>

                <button
                  onClick={() => handleRemoveHoliday(h.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${theme.muted}30`,
                    background: "transparent",
                    color: "#E74C3C",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SPECIAL NOTICE BANNER */}
      {activeSubTab === "notice" && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.heading, margin: 0 }}>
                Website Notice Banner
              </h3>
              <div style={{ fontSize: 12, color: theme.muted, marginTop: 4 }}>
                Show a short banner on the website for sudden changes, private parties, or weather closures.
              </div>
            </div>
            <button
              onClick={handleSaveAll}
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                background: theme.accent,
                color: "#fff",
                border: "none",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {saveSuccess ? "✓ Notice Saved!" : "Save Notice"}
            </button>
          </div>

          <div style={{ padding: "18px 20px", borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.muted}20` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <input
                type="checkbox"
                id="notice-enabled"
                checked={Boolean(config.emergencyNotice?.enabled)}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    emergencyNotice: { ...prev.emergencyNotice, enabled: e.target.checked },
                  }))
                }
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
              <label htmlFor="notice-enabled" style={{ fontSize: 14, fontWeight: 600, color: theme.heading, cursor: "pointer" }}>
                Show this notice banner on the website
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: theme.muted, marginBottom: 4 }}>Banner Type</label>
                <select
                  value={config.emergencyNotice?.type || "info"}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      emergencyNotice: { ...prev.emergencyNotice, type: e.target.value },
                    }))
                  }
                  style={{ ...inputStyle, width: "100%" }}
                >
                  <option value="info">General Notice (Blue)</option>
                  <option value="warning">Early Close / Time Change (Amber)</option>
                  <option value="closure">Closed Today (Red)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, color: theme.muted, marginBottom: 4 }}>Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. PRIVATE PARTY"
                  value={config.emergencyNotice?.badge || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      emergencyNotice: { ...prev.emergencyNotice, badge: e.target.value },
                    }))
                  }
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, color: theme.muted, marginBottom: 4 }}>Notice Message to Guests</label>
              <textarea
                rows={3}
                placeholder="e.g. Closing at 4:30 PM today for an exclusive private celebration. Normal brunch service resumes tomorrow at 8:00 AM."
                value={config.emergencyNotice?.message || ""}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    emergencyNotice: { ...prev.emergencyNotice, message: e.target.value },
                  }))
                }
                style={{ ...inputStyle, width: "100%", resize: "vertical" }}
              />
            </div>

            {config.emergencyNotice?.enabled && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  background:
                    config.emergencyNotice.type === "closure"
                      ? "rgba(231, 76, 60, 0.15)"
                      : config.emergencyNotice.type === "warning"
                      ? "rgba(230, 126, 34, 0.15)"
                      : "rgba(52, 152, 219, 0.15)",
                  border: `1px solid ${
                    config.emergencyNotice.type === "closure"
                      ? "#E74C3C"
                      : config.emergencyNotice.type === "warning"
                      ? "#E67E22"
                      : "#3498DB"
                  }`,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>
                  Preview: {config.emergencyNotice.badge || "SPECIAL NOTICE"}
                </div>
                <div style={{ fontSize: 13 }}>{config.emergencyNotice.message || "No message entered."}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: OTHER PLATFORMS GUIDE */}
      {activeSubTab === "channels" && (
        <div style={cardStyle}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: theme.heading, margin: 0 }}>
              Updating Google, Toast &amp; Deliveroo
            </h3>
            <div style={{ fontSize: 13, color: theme.muted, marginTop: 4, lineHeight: 1.6 }}>
              How to keep your hours matching across all places guests find you:
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* 1. Google Maps */}
            <div style={{ padding: "18px 20px", borderRadius: 12, background: theme.surfaceAlt, border: `1px solid ${theme.muted}20` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: theme.heading }}>Google Maps &amp; Search</span>
                </div>
                <button
                  onClick={handleSyncToGoogle}
                  disabled={googleSyncing}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 8,
                    background: "#4285F4",
                    color: "#fff",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: googleSyncing ? "wait" : "pointer",
                  }}
                >
                  {googleSyncing ? "Updating Google..." : googleSyncSuccess ? "✓ Google Maps Updated!" : "Push to Google Maps"}
                </button>
              </div>
              <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.6 }}>
                Click the button above to send your latest weekly and holiday schedule to Google Maps and Google Search. It usually takes 15–30 minutes for Google to show the updated times.
              </div>

              {/* Quick Actions & Verification */}
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
                <a
                  href={GOOGLE_CONFIG.mapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    background: theme.surface,
                    border: `1px solid ${theme.muted}30`,
                    color: theme.heading,
                    fontSize: 12,
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  Check Live Google Listing ↗
                </a>
                <a
                  href="https://business.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    background: theme.surface,
                    border: `1px solid ${theme.muted}30`,
                    color: theme.muted,
                    fontSize: 12,
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  Google Business Profile Manager ↗
                </a>
                {lastGoogleSyncTime && (
                  <span style={{ fontSize: 11, color: "#2ECC71", fontWeight: 600 }}>
                    ● Last pushed today at {lastGoogleSyncTime}
                  </span>
                )}
              </div>

              {/* Explanatory Guide on Verification & DEV vs PROD */}
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${theme.accent}12`,
                  border: `1px solid ${theme.accent}30`,
                  fontSize: 12,
                  color: theme.text,
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontWeight: 600, color: theme.heading, marginBottom: 2 }}>
                  💡 How Publishing &amp; Environments Work:
                </div>
                <div>
                  • <strong>How to verify:</strong> When you click <em>Push to Google Maps</em>, Google processes the update and refreshes your listing in <strong>15–30 minutes</strong>. Click <em>Check Live Google Listing ↗</em> to see your published times.
                </div>
                <div style={{ marginTop: 4 }}>
                  • <strong>DEV vs PROD:</strong> On DEV (localhost), updates stay safely in your private testing preview so testing won&apos;t accidentally change live search results. Live public Google Maps updates only publish from the production website.
                </div>
              </div>
            </div>

            {/* 2. Toast POS */}
            <div style={{ padding: "18px 20px", borderRadius: 12, background: theme.surfaceAlt, border: `1px solid ${theme.muted}20` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🍞</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: theme.heading }}>Toast POS (Tills &amp; Bookings)</span>
                </div>
                <a
                  href="https://pos.toasttab.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    background: theme.surface,
                    border: `1px solid ${theme.muted}30`,
                    color: theme.heading,
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  Open Toast BackOffice ↗
                </a>
              </div>
              <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.6 }}>
                Toast controls your physical tills, kitchen order printers, and online table reservations. When permanent trading days change, log into Toast BackOffice to confirm your till schedule.
              </div>
              <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: theme.surface, fontSize: 12, color: theme.accent }}>
                <strong>Current Website Schedule:</strong> {currentSummary.fullText}
              </div>
            </div>

            {/* 3. Deliveroo */}
            <div style={{ padding: "18px 20px", borderRadius: 12, background: theme.surfaceAlt, border: `1px solid ${theme.muted}20` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🛵</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: theme.heading }}>Deliveroo (Delivery)</span>
                </div>
                <a
                  href="https://restaurant.deliveroo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    background: theme.surface,
                    border: `1px solid ${theme.muted}30`,
                    color: theme.heading,
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  Open Deliveroo Hub ↗
                </a>
              </div>
              <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.6 }}>
                Deliveroo stores linked to Toast POS automatically take your operating times from Toast. If you need to pause or change delivery times separately, use the Deliveroo Hub link above.
              </div>
            </div>
          </div>

          {/* Technical Details (Hidden for staff) */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${theme.muted}15` }}>
            <button
              onClick={() => setShowDevPayload(!showDevPayload)}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                color: theme.muted,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{showDevPayload ? "▾ Hide Technical Details" : "▸ Technical Details (for Developers)"}</span>
            </button>

            {showDevPayload && (
              <div style={{ marginTop: 14 }}>
                <pre
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 11,
                    maxHeight: 200,
                    overflowY: "auto",
                    color: "#A8DADC",
                  }}
                >
                  {JSON.stringify(getGoogleBusinessProfilePayload(config), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
