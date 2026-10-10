// src/components/admin/PromotionsManager.jsx
import React, { useState } from "react";
import { COLORS } from "../../theme/tokens";
import { usePromotions, isPromoLive } from "../../hooks/useContent";

export function PromotionsManager({ theme }) {
  const { promotions, saveState, addPromotion, updatePromotion, deletePromotion, resetPromotions } = usePromotions();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const blank = {
    title: "", description: "", discount_text: "", badge_text: "NEW",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    is_active: true,
  };
  const [draft, setDraft] = useState(blank);
  const [tickerSpeed, setTickerSpeed] = useState(() => {
    try {
      return localStorage.getItem("tse_ticker_speed") || "normal";
    } catch {
      return "normal";
    }
  });

  const changeSpeed = (speed) => {
    setTickerSpeed(speed);
    try {
      localStorage.setItem("tse_ticker_speed", speed);
      window.dispatchEvent(new Event("tse_ticker_speed_updated"));
    } catch {}
  };

  const inputStyle = {
    width: "100%", padding: "8px 10px", borderRadius: 6, marginTop: 4,
    border: `1px solid ${theme.muted}20`, background: theme.surfaceAlt,
    color: theme.text, fontFamily: "'Outfit', sans-serif", fontSize: 12,
  };

  const startEdit = (promo) => {
    setEditingId(promo.id);
    setDraft({
      title: promo.title || "",
      discount_text: promo.discount_text || "",
      description: promo.description || "",
      badge_text: promo.badge_text || "",
      start_date: promo.start_date || "",
      end_date: promo.end_date || "",
      is_active: promo.is_active !== undefined ? promo.is_active : true,
      early_bird: promo.early_bird || "",
      served_from: promo.served_from || "",
      notes: promo.notes || "",
      phone: promo.phone || "",
      email: promo.email || "",
      packages: promo.packages ? JSON.parse(JSON.stringify(promo.packages)) : null,
    });
    setShowForm(true);
  };

  const save = () => {
    if (!draft.title) return;
    if (editingId) {
      updatePromotion(editingId, draft);
      setEditingId(null);
    } else {
      addPromotion(draft);
    }
    setDraft(blank);
    setShowForm(false);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setDraft(blank);
  };

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.muted, lineHeight: 1.6, marginBottom: 12, fontWeight: 300 }}>
        Promotions show continuously on the top scrolling ticker and homepage while active and within their date window.
        {saveState === "saving" && <span style={{ color: theme.accent }}> · Saving…</span>}
        {saveState === "saved" && <span style={{ color: COLORS.mossGreen }}> · Saved ✓</span>}
        {saveState === "error" && <span style={{ color: "#EF4444" }}> · Save failed</span>}
      </div>

      {/* Ticker Speed Settings */}
      <div style={{
        padding: "12px 14px",
        borderRadius: 10,
        background: theme.surfaceAlt,
        border: `1px solid ${theme.muted}20`,
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.heading }}>
            Top Ticker Marquee Speed
          </div>
          <div style={{ fontSize: 10.5, color: theme.muted, fontWeight: 300 }}>
            Controls the scrolling pace of live offers across the top bar
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "slow", label: "Slow (45s)" },
            { id: "normal", label: "Normal (28s)" },
            { id: "fast", label: "Fast (16s)" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => changeSpeed(opt.id)}
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: tickerSpeed === opt.id ? 600 : 400,
                border: `1px solid ${tickerSpeed === opt.id ? theme.accent : theme.muted + "30"}`,
                background: tickerSpeed === opt.id ? `${theme.accent}20` : "transparent",
                color: tickerSpeed === opt.id ? theme.accent : theme.muted,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {promotions.length === 0 && !showForm && (
        <div style={{ fontSize: 13, color: theme.muted, marginBottom: 12, fontWeight: 300 }}>No promotions yet.</div>
      )}

      {promotions.map(promo => {
        const live = isPromoLive(promo);
        const isEditingThis = editingId === promo.id;
        return (
          <div key={promo.id} style={{
            padding: 12, borderRadius: 10, marginBottom: 8,
            background: theme.surfaceAlt,
            border: isEditingThis ? `1px solid ${theme.accent}` : `1px solid ${theme.muted}10`,
            boxShadow: isEditingThis ? `0 0 0 1px ${theme.accent}40` : "none",
            transition: "all 0.2s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
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
                {promo.packages && (
                  <div style={{ fontSize: 10, color: theme.accent, marginTop: 4, fontWeight: 500 }}>
                    🎁 {promo.packages.length} Festive Packages ({promo.packages.map(p => p.name).join(", ")})
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => startEdit(promo)}
                  title="Edit promotion details"
                  style={{
                    background: isEditingThis ? theme.accent : `${theme.accent}15`,
                    border: `1px solid ${theme.accent}50`,
                    borderRadius: 6,
                    padding: "3px 9px",
                    fontSize: 10.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    color: isEditingThis ? "#fff" : theme.accent,
                    transition: "all 0.2s ease",
                  }}
                >
                  Edit ✎
                </button>
                <button
                  type="button"
                  onClick={() => updatePromotion(promo.id, { is_active: !promo.is_active })}
                  title="Toggle active"
                  style={{
                    background: "none",
                    border: `1px solid ${theme.muted}30`,
                    borderRadius: 6,
                    padding: "3px 8px",
                    fontSize: 10,
                    cursor: "pointer",
                    color: promo.is_active ? COLORS.mossGreen : theme.muted,
                  }}
                >
                  {promo.is_active ? "Active" : "Paused"}
                </button>
                <button
                  type="button"
                  onClick={() => deletePromotion(promo.id)}
                  title="Delete promotion"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#EF4444",
                    cursor: "pointer",
                    fontSize: 16,
                    lineHeight: 1,
                    padding: "0 4px",
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {showForm ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 14,
          borderRadius: 10,
          background: theme.surfaceAlt,
          border: `1px solid ${editingId ? theme.accent : theme.muted + "20"}`,
          marginTop: 10,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.heading }}>
              {editingId ? "Edit Promotion" : "New Promotion"}
            </div>
            {editingId && (
              <span style={{ fontSize: 10, color: theme.accent, fontWeight: 500 }}>
                Editing #{editingId}
              </span>
            )}
          </div>

          <div>
            <label style={{ fontSize: 10, color: theme.muted }}>Title</label>
            <input
              placeholder="Title (e.g. Make It a Christmas to Remember)"
              value={draft.title}
              onChange={e => setDraft(p => ({ ...p, title: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 10, color: theme.muted }}>Discount / Highlight Text</label>
            <input
              placeholder="Discount text (e.g. Festive Dinners, Sharing Feasts & Bottomless)"
              value={draft.discount_text}
              onChange={e => setDraft(p => ({ ...p, discount_text: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 10, color: theme.muted }}>Description (optional)</label>
            <input
              placeholder="Description"
              value={draft.description}
              onChange={e => setDraft(p => ({ ...p, description: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {draft.early_bird !== undefined && draft.early_bird !== null && (
            <div>
              <label style={{ fontSize: 10, color: theme.muted }}>Early Bird Offer / Perk (optional)</label>
              <input
                placeholder="e.g. Book by 31st October & enjoy a complimentary glass of Prosecco"
                value={draft.early_bird || ""}
                onChange={e => setDraft(p => ({ ...p, early_bird: e.target.value }))}
                style={inputStyle}
              />
            </div>
          )}

          {draft.packages && draft.packages.length > 0 && (
            <div style={{ marginTop: 4, padding: "8px 10px", background: `${theme.muted}10`, borderRadius: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: theme.heading, marginBottom: 6 }}>
                Festive Packages & Pricing
              </div>
              {draft.packages.map((pkg, pIdx) => (
                <div key={pIdx} style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 6, marginBottom: 6 }}>
                  <input
                    value={pkg.name}
                    placeholder="Package name"
                    onChange={(e) => {
                      const updated = [...draft.packages];
                      updated[pIdx] = { ...updated[pIdx], name: e.target.value };
                      setDraft((p) => ({ ...p, packages: updated }));
                    }}
                    style={inputStyle}
                  />
                  <input
                    value={pkg.price}
                    placeholder="Price (e.g. £35.95)"
                    onChange={(e) => {
                      const updated = [...draft.packages];
                      updated[pIdx] = { ...updated[pIdx], price: e.target.value };
                      setDraft((p) => ({ ...p, packages: updated }));
                    }}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          )}

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

          <div>
            <label style={{ fontSize: 10, color: theme.muted, display: "block", marginBottom: 4 }}>Badge Text</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["NEW", "LIMITED", "HOT", "SEASONAL", "DAILY", "WEEKENDS", "CHRISTMAS 2026"].map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setDraft(p => ({ ...p, badge_text: p.badge_text === b ? "" : b }))}
                  style={{
                    padding: "4px 8px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600,
                    background: draft.badge_text === b ? theme.accent : `${theme.muted}15`,
                    color: draft.badge_text === b ? "#fff" : theme.text,
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button
              type="button"
              onClick={save}
              disabled={!draft.title}
              style={{
                flex: 1, padding: "8px", borderRadius: 6, border: "none",
                background: draft.title ? theme.accent : `${theme.muted}30`,
                color: draft.title ? "#fff" : theme.muted,
                cursor: draft.title ? "pointer" : "not-allowed",
                fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
              }}
            >
              {editingId ? "Update Promotion" : "Save Promotion"}
            </button>
            <button
              type="button"
              onClick={cancel}
              style={{
                padding: "8px 12px", borderRadius: 6, border: `1px solid ${theme.muted}20`,
                background: "transparent", color: theme.muted, cursor: "pointer", fontSize: 12,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setDraft(blank);
              setShowForm(true);
            }}
            style={{
              flex: 1, padding: "10px", borderRadius: 8,
              border: `1px dashed ${theme.muted}30`, background: "transparent",
              color: theme.accent, cursor: "pointer", fontSize: 12, fontWeight: 500,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            + Add Promotion
          </button>
          <button
            type="button"
            onClick={resetPromotions}
            title="Restore default promotions"
            style={{
              padding: "10px 12px", borderRadius: 8,
              border: `1px solid ${theme.muted}20`, background: "transparent",
              color: theme.muted, cursor: "pointer", fontSize: 12,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
