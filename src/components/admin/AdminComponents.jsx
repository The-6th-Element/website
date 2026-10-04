// src/components/admin/AdminComponents.jsx
import React, { useState, useEffect } from "react";
import { COLORS } from "../../theme/tokens";
import { useMenu, usePromotions, isPromoLive } from "../../hooks/useContent";
import { TOAST_CONFIG } from "../../data/config";
import { UserManager } from "./UserManager.jsx";
import { ROLES, hasPermission } from "../../utils/userManager.js";

// ── Admin Login ────────────────────────────────────────────────────
export function AdminLogin({ theme, onLogin, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError("");
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1px solid ${theme.muted}30`, background: theme.surfaceAlt,
    color: theme.text, fontFamily: "'Outfit', sans-serif", fontSize: 14,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 3000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "calc(16px + env(safe-area-inset-top, 0px)) calc(16px + env(safe-area-inset-right, 0px)) calc(16px + env(safe-area-inset-bottom, 0px)) calc(16px + env(safe-area-inset-left, 0px))",
      animation: "slideDown 0.3s ease",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 380,
        background: theme.bg, borderRadius: 20, padding: 36,
        border: `1px solid ${theme.muted}20`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        {/* Lock icon */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: `${theme.accent}15`, border: `2px solid ${theme.accent}30`,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, marginBottom: 16,
          }}>
            🔒
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 26,
            fontWeight: 400, color: theme.heading,
          }}>
            Staff Portal
          </h2>
          <p style={{ fontSize: 13, color: theme.muted, fontWeight: 300, marginTop: 6 }}>
            The Sixth Element &middot; Richmond
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", color: theme.muted, marginBottom: 6, display: "block",
            }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="username"
              placeholder="Enter username..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", color: theme.muted, marginBottom: 6, display: "block",
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
              placeholder="Enter password"
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: 8,
              background: "#FEE2E2", color: "#991B1B", fontSize: 13,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!username || !password || loading}
            style={{
              padding: "14px", borderRadius: 30, border: "none",
              background: username && password && !loading ? theme.accent : `${theme.muted}30`,
              color: username && password && !loading ? "#fff" : theme.muted,
              cursor: username && password && !loading ? "pointer" : "not-allowed",
              fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
              letterSpacing: "0.03em", marginTop: 4,
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <div style={{
          marginTop: 20, fontSize: 11, color: theme.muted, textAlign: "center",
          lineHeight: 1.6, fontWeight: 300,
        }}>
          Session expires after 12 hours.
        </div>
      </div>
    </div>
  );
}

// ── Admin Collapsible Section ──────────────────────────────────────
export function AdminSection({ theme, title, icon, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8, borderTop: `1px solid ${theme.muted}12`, paddingTop: 12 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "none", border: "none", cursor: "pointer", padding: "8px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>{icon}</span>
          <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.accent, fontWeight: 600 }}>
            {title}
          </span>
        </div>
        <span style={{ fontSize: 14, color: theme.muted, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s ease" }}>›</span>
      </button>
      {open && <div style={{ paddingTop: 12, paddingBottom: 8 }}>{children}</div>}
    </div>
  );
}



// ── Menu Manager (browser/localStorage) ───────────────────────────
export function MenuManager({ theme, onOpenStudio }) {
  const { menu, status, saveState, saveMenu, resetMenu } = useMenu();
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(menu)));
  const [cat, setCat] = useState(() => Object.keys(menu)[0]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) setDraft(JSON.parse(JSON.stringify(menu)));
  }, [menu]); // eslint-disable-line react-hooks/exhaustive-deps

  const catKeys = Object.keys(draft);
  const sections = draft[cat]?.sections || [];

  const mutate = (fn) => {
    setDraft(prev => { const next = JSON.parse(JSON.stringify(prev)); fn(next); return next; });
    setDirty(true);
  };
  const editItem = (si, ii, field, value) => mutate(d => { d[cat].sections[si].items[ii][field] = value; });
  const editTags = (si, ii, value) => mutate(d => { d[cat].sections[si].items[ii].tags = value.split(",").map(t => t.trim()).filter(Boolean); });
  const deleteItem = (si, ii) => mutate(d => { d[cat].sections[si].items.splice(ii, 1); });
  const addItem = (si) => mutate(d => { d[cat].sections[si].items.push({ name: "New item", desc: "", price: "0.00", tags: [] }); });
  const editSection = (si, value) => mutate(d => { d[cat].sections[si].name = value; });
  const addSection = () => mutate(d => { d[cat].sections.push({ name: "New Section", items: [] }); });
  const deleteSection = (si) => mutate(d => { d[cat].sections.splice(si, 1); });

  const doSave = () => { saveMenu(draft); setDirty(false); };
  const doReset = () => { resetMenu(); setDirty(false); };

  const input = {
    padding: "6px 8px", borderRadius: 6, border: `1px solid ${theme.muted}20`,
    background: theme.surfaceAlt, color: theme.text, fontFamily: "'Outfit', sans-serif", fontSize: 12,
  };

  return (
    <div>
      {onOpenStudio && (
        <button
          onClick={onOpenStudio}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: `1.5px solid ${COLORS.warmAmber}`,
            background: `${COLORS.warmAmber}18`,
            color: theme.heading,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 16,
            fontFamily: "'Outfit', sans-serif",
            boxShadow: "0 2px 8px rgba(191,138,47,0.15)",
          }}
        >
          <span>📊</span>
          <span>Open Full Menu Studio &amp; CSV Importer</span>
        </button>
      )}

      <div style={{ fontSize: 11, color: theme.muted, lineHeight: 1.6, marginBottom: 12, fontWeight: 300 }}>
        Quick-edit items and prices below, or use the Studio above to download/upload the CSV spreadsheet.
      </div>


      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {catKeys.map(k => (
          <button key={k} onClick={() => setCat(k)} style={{
            padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 500, textTransform: "capitalize",
            background: cat === k ? theme.accent : `${theme.muted}15`,
            color: cat === k ? "#fff" : theme.text, fontFamily: "'Outfit', sans-serif",
          }}>{draft[k]?.title || k}</button>
        ))}
      </div>

      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.muted}12` }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <input value={section.name} onChange={e => editSection(si, e.target.value)} style={{ ...input, flex: 1, fontWeight: 600 }} />
            <button onClick={() => deleteSection(si)} title="Delete section" style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 15 }}>🗑</button>
          </div>
          {section.items.map((item, ii) => (
            <div key={ii} style={{ display: "flex", flexDirection: "column", gap: 6, padding: 10, borderRadius: 8, marginBottom: 8, background: theme.bg, border: `1px solid ${theme.muted}10` }}>
              <div style={{ display: "flex", gap: 6 }}>
                <input value={item.name} placeholder="Name" onChange={e => editItem(si, ii, "name", e.target.value)} style={{ ...input, flex: 2 }} />
                <input value={item.price} placeholder="Price" onChange={e => editItem(si, ii, "price", e.target.value)} style={{ ...input, width: 70 }} />
                <button onClick={() => deleteItem(si, ii)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 15 }}>×</button>
              </div>
              <input value={item.desc} placeholder="Description" onChange={e => editItem(si, ii, "desc", e.target.value)} style={{ ...input, width: "100%" }} />
              <input value={(item.tags || []).join(", ")} placeholder="Tags (comma separated, e.g. V, GF)" onChange={e => editTags(si, ii, e.target.value)} style={{ ...input, width: "100%" }} />
            </div>
          ))}
          <button onClick={() => addItem(si)} style={{
            width: "100%", padding: "7px", borderRadius: 6, marginTop: 2,
            border: `1px dashed ${theme.muted}30`, background: "transparent",
            color: theme.accent, cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: "'Outfit', sans-serif",
          }}>+ Add item</button>
        </div>
      ))}

      <button onClick={addSection} style={{
        width: "100%", padding: "8px", borderRadius: 6, marginBottom: 12,
        border: `1px dashed ${theme.muted}30`, background: "transparent",
        color: theme.muted, cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "'Outfit', sans-serif",
      }}>+ Add section</button>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={doSave} disabled={!dirty && saveState !== "error"} style={{
          flex: 1, padding: "10px", borderRadius: 8, border: "none",
          background: dirty ? theme.accent : `${theme.muted}30`,
          color: dirty ? "#fff" : theme.muted, cursor: dirty ? "pointer" : "not-allowed",
          fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
        }}>{saveState === "saving" ? "Saving…" : saveState === "saved" && !dirty ? "Saved ✓" : saveState === "error" ? "Retry save" : "Save Menu"}</button>
        <button onClick={doReset} title="Restore default menu" style={{
          padding: "10px 12px", borderRadius: 8, border: `1px solid ${theme.muted}20`,
          background: "transparent", color: theme.muted, cursor: "pointer", fontSize: 12,
          fontFamily: "'Outfit', sans-serif",
        }}>Reset</button>
      </div>
    </div>
  );
}

// ── Promotions Manager (Browser-persisted with instant real-time sync) ────
export function PromotionsManager({ theme }) {
  const { promotions, status, saveState, addPromotion, updatePromotion, deletePromotion, resetPromotions } = usePromotions();
  const [showForm, setShowForm] = useState(false);
  const blank = {
    title: "", description: "", discount_text: "", badge_text: "NEW",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    is_active: true,
  };
  const [draft, setDraft] = useState(blank);

  const inputStyle = {
    width: "100%", padding: "8px 10px", borderRadius: 6, marginTop: 4,
    border: `1px solid ${theme.muted}20`, background: theme.surfaceAlt,
    color: theme.text, fontFamily: "'Outfit', sans-serif", fontSize: 12,
  };

  const save = () => {
    if (!draft.title) return;
    addPromotion(draft);
    setDraft(blank);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.muted, lineHeight: 1.6, marginBottom: 12, fontWeight: 300 }}>
        Promotions show on the homepage while active and within their date window.
        {saveState === "saving" && <span style={{ color: theme.accent }}> · Saving…</span>}
        {saveState === "saved" && <span style={{ color: COLORS.mossGreen }}> · Saved ✓</span>}
        {saveState === "error" && <span style={{ color: "#EF4444" }}> · Save failed</span>}
      </div>


      {promotions.length === 0 && !showForm && (
        <div style={{ fontSize: 13, color: theme.muted, marginBottom: 12, fontWeight: 300 }}>No promotions yet.</div>
      )}

      {promotions.map(promo => {
        const live = isPromoLive(promo);
        return (
          <div key={promo.id} style={{
            padding: 12, borderRadius: 10, marginBottom: 8,
            background: theme.surfaceAlt, border: `1px solid ${theme.muted}10`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: theme.heading }}>
                  {promo.badge_text && <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                    background: `${theme.accent}20`, color: theme.accent, marginRight: 6,
                  }}>{promo.badge_text}</span>}
                  {promo.title}
                </div>
                <div style={{ fontSize: 11, color: theme.muted, marginTop: 3 }}>
                  {promo.discount_text}
                </div>
                <div style={{ fontSize: 10, color: theme.muted, marginTop: 3 }}>
                  {promo.start_date} → {promo.end_date} · {live ? "🟢 Live now" : "⚫ Not live"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button onClick={() => updatePromotion(promo.id, { is_active: !promo.is_active })} title="Toggle active" style={{
                  background: "none", border: `1px solid ${theme.muted}30`, borderRadius: 6,
                  padding: "3px 8px", fontSize: 10, cursor: "pointer", color: theme.muted,
                }}>{promo.is_active ? "Active" : "Paused"}</button>
                <button onClick={() => deletePromotion(promo.id)} style={{
                  background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 16,
                }}>×</button>
              </div>
            </div>
          </div>
        );
      })}

      {showForm ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.muted}15` }}>
          <input placeholder="Title (e.g. Happy Hour)" value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
          <input placeholder="Discount text (e.g. 20% off all wine)" value={draft.discount_text} onChange={e => setDraft(p => ({ ...p, discount_text: e.target.value }))} style={inputStyle} />
          <input placeholder="Description (optional)" value={draft.description} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))} style={inputStyle} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <label style={{ fontSize: 10, color: theme.muted }}>Start Date</label>
              <input type="date" value={draft.start_date} onChange={e => setDraft(p => ({ ...p, start_date: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: theme.muted }}>End Date</label>
              <input type="date" value={draft.end_date} onChange={e => setDraft(p => ({ ...p, end_date: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["NEW", "LIMITED", "HOT", "SEASONAL", "DAILY", "WEEKENDS"].map(b => (
              <button key={b} onClick={() => setDraft(p => ({ ...p, badge_text: p.badge_text === b ? "" : b }))} style={{
                padding: "4px 8px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600,
                background: draft.badge_text === b ? theme.accent : `${theme.muted}15`,
                color: draft.badge_text === b ? "#fff" : theme.text,
              }}>{b}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button onClick={save} disabled={!draft.title} style={{
              flex: 1, padding: "8px", borderRadius: 6, border: "none",
              background: draft.title ? theme.accent : `${theme.muted}30`,
              color: draft.title ? "#fff" : theme.muted,
              cursor: draft.title ? "pointer" : "not-allowed",
              fontSize: 12, fontWeight: 500, fontFamily: "'Outfit', sans-serif",
            }}>Save Promotion</button>
            <button onClick={() => { setShowForm(false); setDraft(blank); }} style={{
              padding: "8px 12px", borderRadius: 6, border: `1px solid ${theme.muted}20`,
              background: "transparent", color: theme.muted, cursor: "pointer", fontSize: 12,
              fontFamily: "'Outfit', sans-serif",
            }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => setShowForm(true)} style={{
            flex: 1, padding: "10px", borderRadius: 8,
            border: `1px dashed ${theme.muted}30`, background: "transparent",
            color: theme.accent, cursor: "pointer", fontSize: 12, fontWeight: 500,
            fontFamily: "'Outfit', sans-serif",
          }}>+ Add Promotion</button>
          <button onClick={resetPromotions} title="Restore default promotions" style={{
            padding: "10px 12px", borderRadius: 8,
            border: `1px solid ${theme.muted}20`, background: "transparent",
            color: theme.muted, cursor: "pointer", fontSize: 12,
            fontFamily: "'Outfit', sans-serif",
          }}>Reset</button>
        </div>
      )}
    </div>
  );
}



// ── Admin Panel (authenticated) ────────────────────────────────────
export function AdminPanel({
  theme,
  flags,
  updateFlag,
  resetFlags,
  adminUser,
  username,
  userRole = "admin",
  userTitle = "",
  onLogout,
  onClose,
  onOpenStudio,
}) {
  const roleDef = ROLES[userRole] || ROLES.staff;
  const canManageUsers = hasPermission(userRole, "canManageUsers");
  const canEditSettings = hasPermission(userRole, "canEditSettings");
  const canEditMenu = hasPermission(userRole, "canEditMenu");
  const canManagePromos = hasPermission(userRole, "canManagePromos");

  const toggleStyle = (active) => ({
    position: "relative", width: 44, height: 24, borderRadius: 12, cursor: "pointer",
    background: active ? COLORS.mossGreen : `${theme.muted}30`,
    border: "none", transition: "background 0.3s ease", flexShrink: 0,
  });
  const dotStyle = (active) => ({
    position: "absolute", top: 3, left: active ? 23 : 3,
    width: 18, height: 18, borderRadius: "50%", background: "#fff",
    transition: "left 0.3s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  });

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 380, maxWidth: "92vw",
      zIndex: 3000, background: theme.bg, borderLeft: `1px solid ${theme.muted}20`,
      boxShadow: "-4px 0 30px rgba(0,0,0,0.15)", overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: `calc(20px + env(safe-area-inset-top, 0px)) 24px calc(24px + env(safe-area-inset-bottom, 0px))`,
      animation: "slideDown 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: theme.heading }}>
            Staff &amp; Admin Panel
          </h2>
          <div style={{ fontSize: 11, color: theme.muted, letterSpacing: "0.08em", marginTop: 2 }}>
            The Sixth Element &middot; Richmond
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", fontSize: 24, color: theme.muted, cursor: "pointer",
        }}>×</button>
      </div>

      {/* Authenticated user card */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 14px", borderRadius: 10, marginBottom: 24,
        background: `${roleDef.color}12`, border: `1px solid ${roleDef.color}35`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: roleDef.color, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700,
          }}>
            {(adminUser || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.heading }}>
              {adminUser}
            </div>
            <div style={{ fontSize: 10, color: roleDef.color, fontWeight: 700, marginTop: 2 }}>
              {roleDef.label} {userTitle ? `· ${userTitle}` : ""}
            </div>
          </div>
        </div>
        <button onClick={onLogout} style={{
          background: "none", border: `1px solid ${theme.muted}25`,
          borderRadius: 6, padding: "5px 10px", cursor: "pointer",
          fontSize: 11, color: theme.muted, fontFamily: "'Outfit', sans-serif", fontWeight: 500,
          transition: "all 0.2s ease",
        }}
          onMouseEnter={e => { e.target.style.borderColor = "#EF4444"; e.target.style.color = "#EF4444"; }}
          onMouseLeave={e => { e.target.style.borderColor = `${theme.muted}25`; e.target.style.color = theme.muted; }}
        >
          Sign Out
        </button>
      </div>

      {/* Role notice if non-admin */}
      {!canEditSettings && (
        <div style={{
          padding: "10px 12px",
          borderRadius: 8,
          background: `${COLORS.warmAmber}15`,
          border: `1px solid ${COLORS.warmAmber}35`,
          fontSize: 11,
          color: theme.heading,
          lineHeight: 1.5,
          marginBottom: 20,
        }}>
          🔒 <strong>Staff Access Mode:</strong> You are logged in as <strong>{roleDef.label}</strong>. You can update menu items, prices, and drafts. Live worldwide publishing is reserved for <strong>Admins</strong>.
        </div>
      )}

      {/* Staff & User Management (Admins only) */}
      {canManageUsers && (
        <AdminSection theme={theme} title="Staff & User Management" icon="👥">
          <UserManager theme={theme} currentUser={username || adminUser} />
        </AdminSection>
      )}

      {/* Menu Manager */}
      {canEditMenu && (
        <AdminSection theme={theme} title="Menu Manager" icon="📋">
          <MenuManager theme={theme} onOpenStudio={onOpenStudio} />
        </AdminSection>
      )}

      {/* Promotions */}
      {canManagePromos && (
        <AdminSection theme={theme} title="Offers & Promotions" icon="🎁">
          <PromotionsManager theme={theme} />
        </AdminSection>
      )}

      {/* Settings & Feature Flags (Admins Only) */}
      {canEditSettings && (
        <>
          {/* Toggles */}
          <div style={{ marginBottom: 28, paddingTop: 16, borderTop: `1px solid ${theme.muted}15` }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 16 }}>
              Features
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: theme.heading }}>Instagram Feed</div>
                <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>Show feed on homepage</div>
              </div>
              <button onClick={() => updateFlag("instagram_feed", !flags.instagram_feed)} style={toggleStyle(flags.instagram_feed)}>
                <div style={dotStyle(flags.instagram_feed)} />
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: theme.heading }}>Reservations</div>
                <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>Enable booking system</div>
              </div>
              <button onClick={() => updateFlag("booking_enabled", !flags.booking_enabled)} style={toggleStyle(flags.booking_enabled)}>
                <div style={dotStyle(flags.booking_enabled)} />
              </button>
            </div>
          </div>

          {/* Display Mode */}
          <div style={{ marginBottom: 28, paddingTop: 20, borderTop: `1px solid ${theme.muted}15` }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 8 }}>
              Display Mode
            </div>
            <div style={{ fontSize: 12, color: theme.muted, fontWeight: 300, marginBottom: 12, lineHeight: 1.5 }}>
              The site shows the light "AM" look from 8am, then switches to the dark "evening" look at the time below (UK time).
            </div>
            <div style={{ fontSize: 13, color: theme.heading, marginBottom: 8 }}>Evening mode starts at</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[11, 12, 13, 14, 15, 16, 17, 18, 19].map(h => {
                const label = h === 12 ? "12pm" : h < 12 ? `${h}am` : `${h - 12}pm`;
                return (
                  <button key={h} onClick={() => updateFlag("pm_switch_hour", h)} style={{
                    padding: "6px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 500,
                    background: flags.pm_switch_hour === h ? theme.accent : `${theme.muted}15`,
                    color: flags.pm_switch_hour === h ? "#fff" : theme.text,
                    transition: "all 0.2s ease",
                  }}>{label}</button>
                );
              })}
            </div>
          </div>

          {/* Menu default tab */}
          <div style={{ marginBottom: 28, paddingTop: 20, borderTop: `1px solid ${theme.muted}15` }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 8 }}>
              Menu Default Tab
            </div>
            <div style={{ fontSize: 12, color: theme.muted, fontWeight: 300, marginBottom: 14, lineHeight: 1.5 }}>
              The Menu page opens on <strong style={{ color: theme.heading }}>Daytime</strong>, then switches to <strong style={{ color: theme.heading }}>Evening</strong> at the time below (UK).
            </div>
            <div style={{ fontSize: 13, color: theme.heading, marginBottom: 6 }}>Evening menu from</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[15, 16, 17, 18, 19, 20].map(h => (
                <button key={h} onClick={() => updateFlag("menu_evening_hour", h)} style={{
                  padding: "6px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 500,
                  background: flags.menu_evening_hour === h ? theme.accent : `${theme.muted}15`,
                  color: flags.menu_evening_hour === h ? "#fff" : theme.text,
                  transition: "all 0.2s ease",
                }}>{h === 12 ? "12pm" : h < 12 ? `${h}am` : `${h - 12}pm`}</button>
              ))}
            </div>
          </div>

          {/* Reservations (Toast Tables) */}
          <div style={{ marginBottom: 28, paddingTop: 20, borderTop: `1px solid ${theme.muted}15` }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 16 }}>
              Reservations (Toast Tables)
            </div>
            <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.7, fontWeight: 300 }}>
              Table bookings are handled by Toast Tables and open inside the
              "Reserve a Table" popup. To change the booking page, update{" "}
              <code style={{ background: `${theme.muted}15`, padding: "2px 6px", borderRadius: 4 }}>TOAST_CONFIG.reservationUrl</code>.
              <br /><br />
              Find your link in Toast Web → <strong style={{ color: theme.heading }}>Waitlist &amp; Reservations → Settings → Reservations → Online access → "Copy online reservation link"</strong>.
            </div>
          </div>



          {/* Reset */}
          <div style={{ paddingTop: 20, borderTop: `1px solid ${theme.muted}15` }}>
            <button onClick={resetFlags} style={{
              width: "100%", padding: "10px", borderRadius: 8,
              border: `1px solid #EF444440`, background: "#EF444410",
              color: "#EF4444", cursor: "pointer", fontSize: 13, fontWeight: 500,
              fontFamily: "'Outfit', sans-serif",
            }}>
              Reset All to Defaults
            </button>
            <div style={{ fontSize: 11, color: theme.muted, marginTop: 12, lineHeight: 1.6 }}>
              Access this panel at <code style={{ background: `${theme.muted}15`, padding: "2px 6px", borderRadius: 4 }}>yoursite.com?admin=true</code>
              <br />Settings are saved in your browser.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
