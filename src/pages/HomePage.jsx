// src/pages/HomePage.jsx
import React from "react";
import { COLORS } from "../theme/tokens";
import { ELEMENTS } from "../data/config";
import { FadeIn } from "../components/ui/FadeIn";
import { CTAButton } from "../components/ui/CTAButton";
import { InstagramSection } from "../components/features/InstagramSection";

export function HomePage({ theme, isAM, navigate, setBookingOpen, flags }) {
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: theme.hero,
          position: "relative",
          textAlign: "center",
          padding: "120px 24px 80px",
          overflow: "hidden",
        }}
      >
        {/* Atmospheric background photo (day / evening) */}
        <div
          className="ken-burns"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${isAM ? "/day-cafe.jpg" : "/evening-lounge.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: isAM ? 0.4 : 0.28,
            pointerEvents: "none",
          }}
        />
        {/* Gradient veil to keep text legible over the photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: isAM
              ? `linear-gradient(180deg, ${theme.bg}CC 0%, ${theme.bg}59 40%, ${theme.bg}CC 100%)`
              : `linear-gradient(180deg, ${theme.bg}CC 0%, ${theme.bg}66 40%, ${theme.bg}CC 100%)`,
          }}
        />

        {/* Faint oversized emblem for depth */}
        <img
          src="/elements-mark.png"
          alt=""
          aria-hidden="true"
          className="rotate-emblem"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "min(90vw, 780px)",
            height: "min(90vw, 780px)",
            transform: "translate(-50%, -50%)",
            opacity: isAM ? 0.12 : 0.1,
            pointerEvents: "none",
            zIndex: 0,
            filter: isAM ? "brightness(0.5) contrast(1.1)" : "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 1080,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(24px, 5vw, 64px)",
          }}
        >
          {/* Left: rotating five-elements emblem medallion with the "VI" mark */}
          <FadeIn>
            <div
              style={{
                position: "relative",
                width: "min(52vw, 260px)",
                height: "min(52vw, 260px)",
                flexShrink: 0,
              }}
            >
              <img
                src="/elements-mark.png"
                alt="The Sixth Element — five elements emblem"
                className="rotate-emblem"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  opacity: isAM ? 0.9 : 0.92,
                  filter: isAM
                    ? "brightness(0.5) contrast(1.15) drop-shadow(0 4px 14px rgba(75,54,33,0.25))"
                    : "drop-shadow(0 0 22px rgba(191,138,47,0.4))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(26px, 4.5vw, 40px)",
                    fontWeight: 500,
                    background: "linear-gradient(135deg, #E8C57D 0%, #BF8A2F 60%, #8A6220 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: theme.accent,
                    letterSpacing: "0.02em",
                  }}
                >
                  VI
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Right: headline + copy */}
          <div
            className="hero-copy"
            style={{ flex: "1 1 340px", minWidth: 280, maxWidth: 620, textAlign: "left" }}
          >
            <FadeIn delay={0.1}>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: theme.muted,
                  marginBottom: 20,
                  fontWeight: 500,
                }}
              >
                Richmond-upon-Thames
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(36px, 6vw, 72px)",
                  fontWeight: 300,
                  color: theme.heading,
                  lineHeight: 1.1,
                  marginBottom: 16,
                }}
              >
                The Five Elements Shape Life.
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(26px, 4.5vw, 48px)",
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: theme.accent,
                  marginBottom: 28,
                }}
              >
                We Offer the Sixth.
              </h2>
            </FadeIn>
            <FadeIn delay={0.45}>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: theme.muted,
                  maxWidth: 520,
                  marginBottom: 36,
                  fontWeight: 300,
                }}
              >
                A space where morning light meets evening warmth. Specialty coffee by day, natural wine by
                night. Always intentional. Always Richmond.
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <div className="hero-cta" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {flags?.booking_enabled !== false ? (
                  <CTAButton label="Book a Table" onClick={() => setBookingOpen(true)} primary theme={theme} />
                ) : (
                  <CTAButton label="Explore Menu" onClick={() => navigate("menu")} primary theme={theme} />
                )}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            animation: "float 2s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: 1,
              height: 40,
              background: `linear-gradient(to bottom, ${theme.muted}, transparent)`,
            }}
          />
        </div>
      </section>

      {/* Elemental Story Scroller */}
      <section style={{ padding: "100px 24px", background: theme.surface, transition: "background 1.2s ease" }}>
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
              Our Foundation
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 400,
                color: theme.heading,
              }}
            >
              Five Elements, One Space
            </h2>
          </div>
        </FadeIn>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 24,
            padding: "0 0 20px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {ELEMENTS.map((el, i) => (
            <FadeIn key={el.name} delay={i * 0.1} style={{ flex: "1 1 200px", minWidth: 200, maxWidth: 280 }}>
              <div
                className="hover-lift"
                style={{
                  height: "100%",
                  padding: 32,
                  background: theme.surfaceAlt,
                  borderRadius: 16,
                  border: `1px solid ${theme.muted}15`,
                  cursor: "default",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 16, color: el.color }}>{el.symbol}</div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 24,
                    fontWeight: 500,
                    color: theme.heading,
                    marginBottom: 12,
                  }}
                >
                  {el.name}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: theme.muted, fontWeight: 300 }}>
                  {el.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Phase Showcase */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
                Dynamic Experience
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 400,
                  color: theme.heading,
                }}
              >
                Two Moods, One Space
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            <FadeIn delay={0.1}>
              <div
                className="hover-lift"
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  background: `linear-gradient(135deg, ${COLORS.ivory}, ${COLORS.cream})`,
                  border: `1px solid ${COLORS.sand}40`,
                }}
              >
                <div style={{ padding: "40px 32px" }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: COLORS.mossGreen,
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    ☀️ AM Phase · 8am – 2pm
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 28,
                      fontWeight: 400,
                      color: COLORS.earthBrown,
                      marginBottom: 12,
                    }}
                  >
                    Air
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.charcoal, fontWeight: 300 }}>
                    Bright, breathable mornings. Sunlit interiors, specialty coffee, and honest brunch plates. The
                    space feels open, airy, and full of possibility.
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                    {["Coffee", "Brunch", "Light"].map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 500,
                          background: `${COLORS.mossGreen}15`,
                          color: COLORS.mossGreen,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.25}>
              <div
                className="hover-lift"
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  background: `linear-gradient(135deg, #1A1410, #2A1E14)`,
                  border: `1px solid ${COLORS.warmAmber}20`,
                }}
              >
                <div style={{ padding: "40px 32px" }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: COLORS.warmAmber,
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    🌙 PM Phase · 2pm – Close
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 28,
                      fontWeight: 400,
                      color: COLORS.ivory,
                      marginBottom: 12,
                    }}
                  >
                    Fire
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.sand, fontWeight: 300 }}>
                    Warmer tones, lower light. The space transforms for natural wine, craft beers, and soon,
                    curated cocktails. An intimate evening atmosphere.
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                    {["Wine", "Beer", "Cocktails"].map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 500,
                          background: `${COLORS.warmAmber}20`,
                          color: COLORS.warmAmber,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Instagram Feed — controlled by flags.instagram_feed */}
      {flags.instagram_feed && <InstagramSection theme={theme} />}

      {/* CTA Section */}
      <section
        style={{
          padding: "100px 24px",
          textAlign: "center",
          background: `linear-gradient(135deg, ${COLORS.earthBrown}, ${COLORS.warmBlack})`,
        }}
      >
        <FadeIn>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 300,
              color: COLORS.ivory,
              marginBottom: 16,
            }}
          >
            Find Your Element
          </h2>
          <p style={{ fontSize: 16, color: COLORS.sand, marginBottom: 40, fontWeight: 300 }}>
            Whether it's morning light or evening warmth — your table awaits.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <CTAButton label="Book a Table" onClick={() => setBookingOpen(true)} primary theme={{ ...theme, text: COLORS.ivory }} />
            <CTAButton label="View Menu" onClick={() => navigate("menu")} theme={{ ...theme, text: COLORS.ivory, accent: COLORS.ivory }} />
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
