// src/pages/ContactPage.jsx
import React from "react";
import { MAP_EMBED_SRC, MAP_DIRECTIONS_URL } from "../data/config";
import { FadeIn } from "../components/ui/FadeIn";

export function ContactPage({ theme }) {
  return (
    <div style={{ paddingTop: 120, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: theme.muted,
                marginBottom: 12,
              }}
            >
              Get in Touch
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 400,
                color: theme.heading,
              }}
            >
              Find Us
            </h1>
          </div>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Info */}
          <FadeIn delay={0.1}>
            <div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24,
                  fontWeight: 500,
                  color: theme.heading,
                  marginBottom: 24,
                }}
              >
                Visit The Sixth Element
              </h3>
              {[
                { icon: "📍", label: "Address", value: "210 Upper Richmond Road West\nLondon, SW14 8AH" },
                { icon: "🕐", label: "Hours", value: "Mon–Fri: 8am – 10pm\nSat–Sun: 9am – 11pm" },
                { icon: "📞", label: "Phone", value: "+44(0)20 35188688" },
                { icon: "📧", label: "Email", value: "info@the6thelement.co.uk" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <div style={{ fontSize: 20, marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: theme.muted,
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: theme.text,
                        fontWeight: 300,
                        whiteSpace: "pre-line",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}

              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                  padding: "12px 24px",
                  borderRadius: 30,
                  textDecoration: "none",
                  background: theme.accent,
                  color: "#fff",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                📍 Get Directions
              </a>
            </div>
          </FadeIn>

          {/* Interactive Google Map */}
          <FadeIn delay={0.2}>
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: `1px solid ${theme.muted}20`,
                height: 460,
                minHeight: 320,
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              }}
            >
              <iframe
                title="The Sixth Element — location map"
                src={MAP_EMBED_SRC}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
