// src/pages/StaffPage.jsx
import React, { useState } from "react";
import { COLORS } from "../theme/tokens";
import { ROLES, hasPermission, resetStaffUsersToDefault } from "../utils/userManager";
import { UserManager } from "../components/admin/UserManager";
import { PromotionsManager } from "../components/admin/PromotionsManager";
import { FadeIn } from "../components/ui/FadeIn";
import { Logomark } from "../components/ui/Logomark";

export function StaffPage({
  theme,
  flags,
  updateFlag,
  resetFlags,
  adminAuth,
  onLogin,
  onLogout,
  onOpenStudio,
  navigate,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  const handleResetDefaults = () => {
    resetStaffUsersToDefault();
    setResetMsg("Accounts restored to initial defaults.");
    setLoginError("");
    setTimeout(() => setResetMsg(""), 6000);
  };

  const role = adminAuth.role || "staff";
  const roleDef = ROLES[role] || ROLES.staff;
  const canManageUsers = hasPermission(role, "canManageUsers");
  const canEditSettings = hasPermission(role, "canEditSettings");
  const canEditMenu = hasPermission(role, "canEditMenu");
  const canManagePromos = hasPermission(role, "canManagePromos");

  // Determine available tabs based on permissions
  const availableTabs = [
    canManageUsers && { id: "users", label: "Staff & Users", icon: "👥" },
    canManagePromos && { id: "promos", label: "Offers & Promos", icon: "🎁" },
    canEditSettings && { id: "settings", label: "Operations & Display", icon: "⚙️" },
  ].filter(Boolean);

  const [activeTab, setActiveTab] = useState(() => (canManageUsers ? "users" : availableTabs[0]?.id || "promos"));

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username || !password) return;
    setLoginLoading(true);
    setLoginError("");
    try {
      await onLogin(username, password);
    } catch (err) {
      setLoginError(err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const toggleStyle = (active) => ({
    position: "relative",
    width: 46,
    height: 26,
    borderRadius: 13,
    cursor: "pointer",
    background: active ? COLORS.mossGreen : `${theme.muted}30`,
    border: "none",
    transition: "background 0.3s ease",
    flexShrink: 0,
    WebkitTapHighlightColor: "transparent",
  });

  const dotStyle = (active) => ({
    position: "absolute",
    top: 3,
    left: active ? 23 : 3,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#fff",
    transition: "left 0.3s ease",
    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
  });

  // ── 1. Unauthenticated View: Full Page Login Card ───────────────────
  if (!adminAuth.authenticated) {
    return (
      <div style={{ paddingTop: 120, minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <div style={{ maxWidth: 460, width: "100%", margin: "0 auto", padding: "0 24px 80px" }}>
          <FadeIn>
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={() => navigate("home")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: theme.muted,
                  fontSize: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'Outfit', sans-serif",
                  padding: "4px 0",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = theme.muted)}
              >
                ← Return to website
              </button>
            </div>

            <div
              style={{
                background: theme.surface,
                borderRadius: 24,
                padding: "40px 32px",
                border: `1px solid ${theme.muted}20`,
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: 16 }}>
                  <Logomark size={48} color={theme.accent} />
                </div>
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 32,
                    fontWeight: 500,
                    color: theme.heading,
                    lineHeight: 1.1,
                  }}
                >
                  Staff Portal
                </h1>
                <p style={{ fontSize: 13, color: theme.muted, fontWeight: 300, marginTop: 6 }}>
                  The Sixth Element · Richmond-upon-Thames
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: theme.muted,
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                    autoComplete="username"
                    placeholder="Enter username..."
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: `1px solid ${theme.muted}30`,
                      background: theme.surfaceAlt,
                      color: theme.text,
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 16,
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: theme.muted,
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="Enter password..."
                      style={{
                        width: "100%",
                        padding: "14px 44px 14px 16px",
                        borderRadius: 12,
                        border: `1px solid ${theme.muted}30`,
                        background: theme.surfaceAlt,
                        color: theme.text,
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 16,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      title={showPassword ? "Hide password" : "Show password"}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: theme.muted,
                        fontSize: 16,
                        padding: 4,
                        lineHeight: 1,
                      }}
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: 10,
                      background: "#FEE2E2",
                      color: "#991B1B",
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>⚠</span> {loginError}
                  </div>
                )}

                {resetMsg && (
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: 10,
                      background: `${COLORS.mossGreen}18`,
                      color: COLORS.mossGreen,
                      border: `1px solid ${COLORS.mossGreen}40`,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>✓</span> {resetMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!username || !password || loginLoading}
                  style={{
                    padding: "14px",
                    borderRadius: 30,
                    border: "none",
                    background: username && password && !loginLoading ? theme.accent : `${theme.muted}30`,
                    color: username && password && !loginLoading ? "#fff" : theme.muted,
                    cursor: username && password && !loginLoading ? "pointer" : "not-allowed",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                    marginTop: 6,
                    opacity: loginLoading ? 0.7 : 1,
                    transition: "all 0.3s ease",
                    minHeight: 48,
                  }}
                >
                  {loginLoading ? "Signing in..." : "Sign In to Staff Portal"}
                </button>
              </form>

              {/* Login Help & Credentials Recovery Drawer */}
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => setShowHelp((h) => !h)}
                  style={{
                    background: "none",
                    border: "none",
                    color: theme.accent,
                    fontSize: 12,
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    fontFamily: "'Outfit', sans-serif",
                    padding: "4px 8px",
                  }}
                >
                  {showHelp ? "Hide Login Credentials Help" : "Forgot password or need login help?"}
                </button>

                {showHelp && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: "16px",
                      borderRadius: 12,
                      background: theme.surfaceAlt,
                      border: `1px solid ${theme.muted}25`,
                      textAlign: "left",
                      fontSize: 12,
                      color: theme.text,
                      lineHeight: 1.6,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 6, color: theme.heading }}>
                      Default Admin Credentials:
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(0,0,0,0.04)", padding: "8px 10px", borderRadius: 6, marginBottom: 10 }}>
                      <div><strong>Admin Usernames:</strong> deepak &nbsp;<em>(or pooja)</em></div>
                      <div><strong>Password:</strong> R1chm0nd-s1xth@007!</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setUsername("deepak");
                          setPassword("R1chm0nd-s1xth@007!");
                        }}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: `${theme.accent}15`,
                          border: `1px solid ${theme.accent}40`,
                          color: theme.accent,
                          fontSize: 11,
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Auto-fill Deepak Admin
                      </button>
                      <button
                        type="button"
                        onClick={handleResetDefaults}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: "transparent",
                          border: `1px solid ${theme.muted}40`,
                          color: theme.muted,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        Restore Seeded Accounts
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: `1px solid ${theme.muted}15`,
                  fontSize: 11,
                  color: theme.muted,
                  textAlign: "center",
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                Session remains active for 12 hours.
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  // ── 2. Authenticated View: Full-Page Staff Dashboard ────────────────
  return (
    <div style={{ paddingTop: 110, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        {/* Top Bar: Return to Website & User Badge */}
        <FadeIn>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 32,
              paddingBottom: 20,
              borderBottom: `1px solid ${theme.muted}20`,
            }}
          >
            <div>
              <button
                onClick={() => navigate("home")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: theme.muted,
                  fontSize: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'Outfit', sans-serif",
                  padding: "4px 0",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = theme.muted)}
              >
                ← Return to Public Website
              </button>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 400,
                  color: theme.heading,
                  marginTop: 4,
                }}
              >
                Staff &amp; Management Portal
              </h1>
              <div style={{ fontSize: 12, color: theme.muted, fontWeight: 300 }}>
                The Sixth Element · 210 Upper Richmond Road West, SW14 8AH
              </div>
            </div>

            {/* User Profile Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 18px",
                borderRadius: 14,
                background: theme.surface,
                border: `1px solid ${roleDef.color}40`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: roleDef.color,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {(adminAuth.user || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.heading }}>
                  {adminAuth.user}
                </div>
                <div style={{ fontSize: 11, color: roleDef.color, fontWeight: 700, marginTop: 1 }}>
                  {roleDef.label} {adminAuth.title ? `· ${adminAuth.title}` : ""}
                </div>
              </div>
              <button
                onClick={onLogout}
                style={{
                  marginLeft: 8,
                  background: "none",
                  border: `1px solid ${theme.muted}30`,
                  borderRadius: 20,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: 12,
                  color: theme.muted,
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#EF4444";
                  e.currentTarget.style.color = "#EF4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${theme.muted}30`;
                  e.currentTarget.style.color = theme.muted;
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Staff Access Notice if non-admin */}
        {!canEditSettings && (
          <FadeIn delay={0.05}>
            <div
              style={{
                padding: "14px 20px",
                borderRadius: 12,
                background: `${COLORS.warmAmber}15`,
                border: `1px solid ${COLORS.warmAmber}35`,
                fontSize: 13,
                color: theme.heading,
                lineHeight: 1.6,
                marginBottom: 28,
              }}
            >
              🔒 <strong>Staff Access Mode:</strong> You are logged in as <strong>{roleDef.label}</strong>. You can update menu items, prices, dietary tags, and promotional drafts. Publishing changes to the live worldwide website is reserved for <strong>Admins</strong>.
            </div>
          </FadeIn>
        )}

        {/* Quick Action Banner: Menu Studio */}
        <FadeIn delay={0.1}>
          <div
            style={{
              padding: "24px 28px",
              borderRadius: 18,
              background: theme.surface,
              border: `1.5px solid ${COLORS.warmAmber}40`,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 20,
              marginBottom: 32,
            }}
          >
            <div style={{ flex: "1 1 500px", minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 24 }}>📊</span>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: theme.heading,
                  }}
                >
                  Menu Studio &amp; CSV Spreadsheet
                </h3>
              </div>
              <p style={{ fontSize: 13, color: theme.muted, lineHeight: 1.6, fontWeight: 300 }}>
                Launch the full interactive spreadsheet to batch-edit daytime &amp; evening menus, dietary tags (V, VE, GF), categories, or download and upload CSV files.
              </p>
            </div>
            <button
              onClick={onOpenStudio}
              style={{
                padding: "12px 26px",
                borderRadius: 30,
                border: "none",
                background: theme.accent,
                color: "#fff",
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.03em",
                boxShadow: "0 2px 10px rgba(191,138,47,0.3)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(191,138,47,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(191,138,47,0.3)";
              }}
            >
              Open Menu Studio →
            </button>
          </div>
        </FadeIn>

        {/* Tab Navigation */}
        <FadeIn delay={0.15}>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 24,
              borderBottom: `1px solid ${theme.muted}20`,
              paddingBottom: 14,
            }}
          >
            {availableTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 30,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  background: activeTab === t.id ? theme.accent : `${theme.muted}15`,
                  color: activeTab === t.id ? "#fff" : theme.text,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.25s ease",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Tab Content Container */}
        <FadeIn key={activeTab} delay={0.05}>
          <div
            style={{
              background: theme.surface,
              borderRadius: 20,
              padding: "clamp(20px, 3vw, 36px)",
              border: `1px solid ${theme.muted}20`,
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            }}
          >
            {/* TAB 1: Staff & User Management */}
            {activeTab === "users" && canManageUsers && (
              <div>
                <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${theme.muted}15` }}>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 26,
                      fontWeight: 500,
                      color: theme.heading,
                    }}
                  >
                    Staff &amp; User Accounts
                  </h2>
                  <p style={{ fontSize: 13, color: theme.muted, fontWeight: 300, marginTop: 4 }}>
                    Manage team member credentials and assigned roles.
                  </p>
                </div>
                <UserManager theme={theme} currentUser={adminAuth.username || adminAuth.user} />
              </div>
            )}

            {/* TAB: Offers & Promotions */}
            {activeTab === "promos" && canManagePromos && (
              <div>
                <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${theme.muted}15` }}>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 26,
                      fontWeight: 500,
                      color: theme.heading,
                    }}
                  >
                    Offers &amp; Promotions
                  </h2>
                  <p style={{ fontSize: 13, color: theme.muted, fontWeight: 300, marginTop: 4 }}>
                    Configure the top announcement bar banners, schedule dates, discount codes, and promotion badges.
                  </p>
                </div>
                <PromotionsManager theme={theme} />
              </div>
            )}

            {/* TAB 4: Operations & Settings */}
            {activeTab === "settings" && canEditSettings && (
              <div style={{ maxWidth: 800 }}>
                <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: `1px solid ${theme.muted}15` }}>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 26,
                      fontWeight: 500,
                      color: theme.heading,
                    }}
                  >
                    Operations &amp; Site Controls
                  </h2>
                  <p style={{ fontSize: 13, color: theme.muted, fontWeight: 300, marginTop: 4 }}>
                    Configure website feature flags, timing transitions, and integration URLs.
                  </p>
                </div>

                {/* Features toggles */}
                <div style={{ marginBottom: 36 }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: theme.accent,
                      fontWeight: 600,
                      marginBottom: 16,
                    }}
                  >
                    Feature Flags
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderRadius: 12,
                      background: theme.surfaceAlt,
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: theme.heading }}>Instagram Feed</div>
                      <div style={{ fontSize: 13, color: theme.muted, marginTop: 2 }}>Show Instagram feed on the homepage</div>
                    </div>
                    <button
                      onClick={() => updateFlag("instagram_feed", !flags.instagram_feed)}
                      style={toggleStyle(flags.instagram_feed)}
                    >
                      <div style={dotStyle(flags.instagram_feed)} />
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderRadius: 12,
                      background: theme.surfaceAlt,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: theme.heading }}>Online Table Reservations</div>
                      <div style={{ fontSize: 13, color: theme.muted, marginTop: 2 }}>
                        Enable floating "Book a Table" button and Toast Tables reservation modal
                      </div>
                    </div>
                    <button
                      onClick={() => updateFlag("booking_enabled", !flags.booking_enabled)}
                      style={toggleStyle(flags.booking_enabled)}
                    >
                      <div style={dotStyle(flags.booking_enabled)} />
                    </button>
                  </div>
                </div>

                {/* Display Mode Switch Hour */}
                <div style={{ marginBottom: 36, paddingTop: 24, borderTop: `1px solid ${theme.muted}15` }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: theme.accent,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Display Mode (Day to Evening Transition)
                  </div>
                  <div style={{ fontSize: 13, color: theme.muted, fontWeight: 300, marginBottom: 14, lineHeight: 1.6 }}>
                    The site opens on the bright "AM" aesthetic from morning, then automatically switches to the warm, intimate "PM" aesthetic at the time chosen below (London UK time).
                  </div>
                  <div style={{ fontSize: 13, color: theme.heading, fontWeight: 500, marginBottom: 10 }}>
                    Evening mode switches at:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[11, 12, 13, 14, 15, 16, 17, 18, 19].map((h) => {
                      const label = h === 12 ? "12pm" : h < 12 ? `${h}am` : `${h - 12}pm`;
                      const active = flags.pm_switch_hour === h;
                      return (
                        <button
                          key={h}
                          onClick={() => updateFlag("pm_switch_hour", h)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: 8,
                            border: `1px solid ${active ? theme.accent : `${theme.muted}30`}`,
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 500,
                            background: active ? theme.accent : theme.surfaceAlt,
                            color: active ? "#fff" : theme.text,
                            transition: "all 0.2s ease",
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Menu Default Tab Switch */}
                <div style={{ marginBottom: 36, paddingTop: 24, borderTop: `1px solid ${theme.muted}15` }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: theme.accent,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Menu Page Default Tab
                  </div>
                  <div style={{ fontSize: 13, color: theme.muted, fontWeight: 300, marginBottom: 14, lineHeight: 1.6 }}>
                    Controls whether visitors see Daytime Breakfast/Brunch or Evening Drinks/Small Plates by default when opening the Menu page.
                  </div>
                  <div style={{ fontSize: 13, color: theme.heading, fontWeight: 500, marginBottom: 10 }}>
                    Evening menu tab becomes default from:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[15, 16, 17, 18, 19, 20].map((h) => {
                      const active = flags.menu_evening_hour === h;
                      return (
                        <button
                          key={h}
                          onClick={() => updateFlag("menu_evening_hour", h)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: 8,
                            border: `1px solid ${active ? theme.accent : `${theme.muted}30`}`,
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 500,
                            background: active ? theme.accent : theme.surfaceAlt,
                            color: active ? "#fff" : theme.text,
                            transition: "all 0.2s ease",
                          }}
                        >
                          {h === 12 ? "12pm" : h < 12 ? `${h}am` : `${h - 12}pm`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reservations Info */}
                <div style={{ marginBottom: 36, paddingTop: 24, borderTop: `1px solid ${theme.muted}15` }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: theme.accent,
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    Toast Tables Integration
                  </div>
                  <p style={{ fontSize: 13, color: theme.muted, lineHeight: 1.7, fontWeight: 300 }}>
                    Table reservations are powered by Toast Tables. The booking page loads in a spacious modal window directly on your site.
                    To modify the Toast link, update <code style={{ background: `${theme.muted}15`, padding: "2px 6px", borderRadius: 4 }}>TOAST_CONFIG.reservationUrl</code>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
