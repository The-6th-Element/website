// src/components/admin/PromotionsManager.jsx
import React, { useState } from "react";
import { COLORS } from "../../theme/tokens";
import { usePromotions, isPromoLive } from "../../hooks/useContent";

export function PromotionsManager({ theme }) {
  const { promotions, saveState, addPromotion, updatePromotion, deletePromotion, resetPromotions } = usePromotions();
  const [showForm, setShowForm] = useState(false);
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

  const save = () => {
    if (!draft.title) return;
    addPromotion(draft);
    setDraft(blank);
    setShowForm(false);
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
