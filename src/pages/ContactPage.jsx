// src/pages/ContactPage.jsx
import React from "react";
import { MAP_EMBED_SRC, MAP_DIRECTIONS_URL, DELIVEROO_CONFIG, GOOGLE_CONFIG } from "../data/config";
import { FadeIn } from "../components/ui/FadeIn";
import { trackDirectionsClick, trackContactClick } from "../utils/analytics";
import { BookTableButton } from "../components/ui/BookTableButton";

export function ContactPage({ theme, setBookingOpen }) {
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
                { icon: "📞", label: "Phone", value: "+44 (0) 20 3518 8688", href: "tel:+442035188688", type: "phone" },
                { icon: "📧", label: "Email", value: "info@the6thelement.co.uk", href: "mailto:info@the6thelement.co.uk", type: "email" },
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
                    {item.href ? (
                      <a
                        href={item.href}
                        onClick={() => trackContactClick(item.type)}
                        style={{
                          fontSize: 14,
                          color: theme.accent,
                          fontWeight: 400,
                          textDecoration: "none",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.value}
                      </a>
                    ) : (
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
                    )}
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                {setBookingOpen && (
                  <BookTableButton
                    size="md"
                    theme={theme}
                    onClick={() => setBookingOpen(true)}
                  />
                )}
                <a
                  href={MAP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackDirectionsClick("contact_page")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 24px",
                    borderRadius: 30,
                    textDecoration: "none",
                    background: "transparent",
                    color: theme.heading,
                    border: `1.5px solid ${theme.accent || theme.text}60`,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0.03em",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  📍 Get Directions
                </a>
                <a
                  href={GOOGLE_CONFIG.reviewUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "12px 20px",
                    borderRadius: 30,
                    textDecoration: "none",
                    background: `${theme.accent}14`,
                    color: theme.heading,
                    border: `1.5px solid ${theme.accent}50`,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0.03em",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  ⭐ Review Us on Google ↗
                </a>
              </div>

              {/* Delivery & Takeaway (FEATURE-79) */}
              <div
                style={{
                  marginTop: 24,
                  padding: "16px 18px",
                  borderRadius: 14,
                  background: `${theme.muted}0a`,
                  border: `1px solid ${theme.muted}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#00CDBC",
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    🛵 Local Delivery
                  </div>
                  <div style={{ fontSize: 14, color: theme.heading, fontWeight: 500 }}>
                    Order directly via Deliveroo
                  </div>
                  <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>
                    Delivering across East Sheen, Richmond, Mortlake &amp; Barnes
                  </div>
                </div>
                <a
                  href={DELIVEROO_CONFIG.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 18px",
                    borderRadius: 24,
                    background: "#00CDBC",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12.5,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    boxShadow: "0 2px 8px rgba(0,205,188,0.3)",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  Order on Deliveroo ↗
                </a>
              </div>
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
