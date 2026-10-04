// src/components/layout/Footer.jsx
import React from "react";
import { Logomark } from "../ui/Logomark";

export function Footer({ theme, navigate, onOpenAdmin }) {
  return (
    <footer
      style={{
        padding: "60px 24px 40px",
        borderTop: `1px solid ${theme.muted}15`,
        background: theme.surface,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
            marginBottom: 40,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <Logomark size={40} color={theme.accent} />
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20,
                  fontWeight: 500,
                  color: theme.heading,
                }}
              >
                The Sixth Element
              </div>
            </div>
            <p style={{ fontSize: 13, color: theme.muted, fontWeight: 300, lineHeight: 1.7 }}>
              Specialty coffee by day, natural wine by night. A space designed to transform with you.
            </p>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: theme.muted,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Navigate
            </div>
            {["home", "menu", "impact", "about", "contact"].map((p) => (
              <button
                key={p}
                onClick={() => navigate(p)}
                style={{
                  display: "block",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: theme.text,
                  fontSize: 13,
                  fontWeight: 300,
                  padding: "4px 0",
                  fontFamily: "'Outfit', sans-serif",
                  textTransform: "capitalize",
                }}
              >
                {p === "impact" ? "Social Impact" : p === "about" ? "Our Story" : p}
              </button>
            ))}
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: theme.muted,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Connect
            </div>
            {["Instagram", "Facebook", "TikTok"].map((s) => (
              <div
                key={s}
                style={{
                  fontSize: 13,
                  color: theme.text,
                  fontWeight: 300,
                  padding: "4px 0",
                  cursor: "pointer",
                }}
              >
                {s}
              </div>
            ))}
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: theme.muted,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Hours
            </div>
            <div style={{ fontSize: 13, color: theme.text, fontWeight: 300, lineHeight: 1.7 }}>
              Mon – Fri: 8am – 10pm
              <br />
              Sat – Sun: 9am – 11pm
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: `1px solid ${theme.muted}15`,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 12, color: theme.muted, fontWeight: 300 }}>
            © 2026 The Sixth Element. Richmond-upon-Thames.
          </div>
          <div style={{ fontSize: 12, color: theme.muted, fontWeight: 300, display: "flex", gap: 16 }}>
            <span style={{ cursor: "pointer" }}>Privacy</span>
            <span style={{ cursor: "pointer" }}>Terms</span>
            <span style={{ cursor: "pointer" }}>Accessibility</span>
            {onOpenAdmin && (
              <span
                onClick={onOpenAdmin}
                style={{
                  cursor: "pointer",
                  opacity: 0.7,
                  transition: "opacity 0.2s ease",
                  borderLeft: `1px solid ${theme.muted}30`,
                  paddingLeft: 12,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)}
                title="Staff Portal & Admin Sign-in"
              >
                🔒 Staff
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
