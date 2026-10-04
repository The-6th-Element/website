// src/components/layout/AnnouncementBar.jsx
import React, { useState, useEffect } from "react";
import { COLORS } from "../../theme/tokens";
import { usePromotions, isPromoLive } from "../../hooks/useContent";

export const ANNOUNCEMENT_BAR_H = 40;

export function AnnouncementBar({ theme, onToggle }) {
  const { promotions } = usePromotions();
  const live = promotions.filter(isPromoLive);
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("tse_promo_bar_dismissed") === "1";
    } catch {
      return false;
    }
  });
  const visible = live.length > 0 && !dismissed;

  useEffect(() => {
    onToggle(visible);
  }, [visible, onToggle]);

  useEffect(() => {
    if (live.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % live.length), 5000);
    return () => clearInterval(t);
  }, [live.length]);

  if (!visible) return null;
  const promo = live[idx % live.length];

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("tse_promo_bar_dismissed", "1");
    } catch {}
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: ANNOUNCEMENT_BAR_H,
        zIndex: 1100,
        background: `linear-gradient(90deg, ${theme.accent}, ${COLORS.warmAmber})`,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 44px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
      }}
    >
      <div
        key={promo.id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          maxWidth: 960,
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13,
          fontWeight: 400,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          animation: "slideDown 0.4s ease",
        }}
      >
        {promo.badge_text && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              background: "rgba(255,255,255,0.22)",
              padding: "2px 8px",
              borderRadius: 20,
              flexShrink: 0,
            }}
          >
            {promo.badge_text}
          </span>
        )}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          <strong style={{ fontWeight: 600 }}>{promo.title}</strong>
          {promo.discount_text ? ` — ${promo.discount_text}` : ""}
        </span>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss offer"
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: 18,
          lineHeight: 1,
          opacity: 0.85,
          padding: 4,
        }}
      >
        ×
      </button>
    </div>
  );
}
