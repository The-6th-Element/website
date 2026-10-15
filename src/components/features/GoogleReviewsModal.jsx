// src/components/features/GoogleReviewsModal.jsx
import React, { useState, useEffect } from "react";
import { COLORS } from "../../theme/tokens";
import { GOOGLE_CONFIG } from "../../data/config";
import { getGoogleReviews } from "../../utils/reviewsManager";

export function GoogleReviewsModal({ theme, onClose }) {
  const [filter, setFilter] = useState("ALL");
  const data = getGoogleReviews();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const categories = [
    { id: "ALL", label: "All Reviews" },
    { id: "Brunch", label: "Brunch & Coffee" },
    { id: "Evening", label: "Evening Plates & Wine" },
    { id: "Gluten-Free", label: "Gluten-Free" },
    { id: "Terrace", label: "Terrace & Vibe" },
  ];

  const filteredReviews = data.reviews.filter((r) => {
    if (filter === "ALL") return true;
    if (filter === "Brunch") return r.tags.some((t) => /toast|brunch|coffee|chai/i.test(t));
    if (filter === "Evening") return r.tags.some((t) => /chicken|shank|wine|plates/i.test(t));
    if (filter === "Gluten-Free") return r.tags.some((t) => /gluten|dietary/i.test(t));
    if (filter === "Terrace") return r.tags.some((t) => /terrace|dog|atmosphere/i.test(t));
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Google Customer Reviews"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(20, 16, 12, 0.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          height: 650,
          maxHeight: "88vh",
          background: theme.surface || "#FFFFFF",
          border: `1px solid ${theme.muted}25`,
          borderRadius: 18,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${theme.muted}15`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: theme.surfaceAlt || "#FAF8F3",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>⭐</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.warmAmber }}>
                Google Verified Reviews
              </span>
            </div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26,
                fontWeight: 600,
                color: theme.heading,
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Guest Stories &amp; Experiences
            </h3>
            <div style={{ fontSize: 12.5, color: theme.muted, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 700, color: theme.text }}>4.8 ★★★★★</span>
              <span>·</span>
              <span>Based on authentic local reviews</span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: `1px solid ${theme.muted}25`,
              background: "transparent",
              color: theme.muted,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Filter Chips */}
        <div
          style={{
            padding: "12px 24px",
            borderBottom: `1px solid ${theme.muted}15`,
            display: "flex",
            gap: 8,
            overflowX: "auto",
            scrollbarWidth: "none",
            background: theme.surface,
            flexShrink: 0,
          }}
        >
          {categories.map((c) => {
            const active = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 34,
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: active ? `1.5px solid ${COLORS.warmAmber}` : `1px solid ${theme.muted}30`,
                  background: active ? `${COLORS.warmAmber}18` : "transparent",
                  color: active ? COLORS.warmAmber : theme.muted,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  lineHeight: 1,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Reviews List */}
        <div
          style={{
            padding: "20px 24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            flex: 1,
            minHeight: 0,
          }}
        >
          {filteredReviews.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
                textAlign: "center",
                color: theme.muted,
              }}
            >
              <span style={{ fontSize: 32, marginBottom: 12, opacity: 0.6 }}>🌿</span>
              <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: theme.heading }}>
                No reviews found under this category
              </p>
              <p style={{ fontSize: 12, marginTop: 4, color: theme.muted }}>
                Select "All Reviews" to explore guest feedback.
              </p>
            </div>
          )}

          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                padding: "16px 18px",
                borderRadius: 12,
                background: theme.surfaceAlt || "#FAF8F3",
                border: `1px solid ${theme.muted}15`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: `${COLORS.warmAmber}25`,
                      color: COLORS.warmAmber,
                      fontWeight: 700,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {rev.authorName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.heading }}>
                      {rev.authorName}
                    </div>
                    <div style={{ fontSize: 11, color: theme.muted }}>
                      {rev.relativeTimeDescription} · Verified Diner
                    </div>
                  </div>
                </div>
                <div style={{ color: COLORS.warmAmber, fontSize: 12, letterSpacing: 2 }}>
                  {"★".repeat(rev.rating)}
                </div>
              </div>

              <p style={{ fontSize: 12.5, lineHeight: 1.6, color: theme.text, margin: "6px 0 10px", fontWeight: 300 }}>
                &ldquo;{rev.text}&rdquo;
              </p>

              {rev.tags && rev.tags.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: rev.reply ? 10 : 0 }}>
                  {rev.tags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: 10.5,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: `${theme.muted}12`,
                        color: theme.muted,
                        fontWeight: 500,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {rev.reply && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: `${COLORS.mossGreen}10`,
                    borderLeft: `3px solid ${COLORS.mossGreen}`,
                    fontSize: 11.5,
                    color: theme.text,
                    lineHeight: 1.5,
                    marginTop: 8,
                  }}
                >
                  <span style={{ fontWeight: 600, color: COLORS.mossGreen }}>Response from The Sixth Element: </span>
                  {rev.reply}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal Footer CTA */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: `1px solid ${theme.muted}15`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: theme.surfaceAlt || "#FAF8F3",
            flexWrap: "wrap",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 12, color: theme.muted }}>
            Dined with us in East Sheen recently?
          </div>
          <a
            href={GOOGLE_CONFIG.reviewUri}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              borderRadius: 20,
              background: COLORS.earthBrown,
              color: "#FAF8F0",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: "0.02em",
              boxShadow: "0 2px 8px rgba(75,54,33,0.25)",
            }}
          >
            ⭐ Review Us on Google ↗
          </a>
        </div>
      </div>
    </div>
  );
}
