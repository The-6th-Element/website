// src/components/features/PromotionsSection.jsx
import React from "react";
import { FadeIn } from "../ui/FadeIn";
import { usePromotions, isPromoLive } from "../../hooks/useContent";

export function PromotionsSection({ theme }) {
  const { promotions } = usePromotions();
  const live = promotions.filter(isPromoLive);
  if (live.length === 0) return null;

  return (
    <section style={{ padding: "90px 24px", background: theme.surface, transition: "background 1.2s ease" }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: theme.muted,
              marginBottom: 12,
            }}
          >
            What's On
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 400,
              color: theme.heading,
            }}
          >
            Current Offers
          </h2>
        </div>
      </FadeIn>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {live.map((promo, i) => (
          <FadeIn key={promo.id} delay={i * 0.1}>
            <div
              className="hover-lift"
              style={{
                position: "relative",
                height: "100%",
                padding: 32,
                borderRadius: 20,
                background: `linear-gradient(135deg, ${theme.accent}12, ${theme.surfaceAlt})`,
                border: `1px solid ${theme.accent}25`,
              }}
            >
              {promo.badge_text && (
                <span
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: theme.accent,
                    color: "#fff",
                  }}
                >
                  {promo.badge_text}
                </span>
              )}
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 26,
                  fontWeight: 500,
                  color: theme.heading,
                  marginBottom: 10,
                  paddingRight: 70,
                }}
              >
                {promo.title}
              </h3>
              {promo.discount_text && (
                <div style={{ fontSize: 15, fontWeight: 500, color: theme.accent, marginBottom: 10 }}>
                  {promo.discount_text}
                </div>
              )}
              {promo.description && (
                <p style={{ fontSize: 14, lineHeight: 1.7, color: theme.muted, fontWeight: 300 }}>
                  {promo.description}
                </p>
              )}
              {promo.end_date && promo.end_date < "2030-01-01" && (
                <div style={{ fontSize: 11, color: theme.muted, marginTop: 16, fontWeight: 300 }}>
                  Until{" "}
                  {new Date(promo.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
