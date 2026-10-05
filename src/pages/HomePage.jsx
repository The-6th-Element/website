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
          loading="eager"
          decoding="async"
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

        <style>{`
          .hero-grid-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: 36px;
            align-items: center;
            width: 100%;
            max-width: 1180px;
            margin: 0 auto;
          }
          @media (min-width: 920px) {
            .hero-grid-layout {
              grid-template-columns: 1fr 1.15fr;
              gap: 52px;
            }
            .hero-foundation-col {
              order: 1;
            }
            .hero-copy-col {
              order: 2;
              text-align: left;
            }
          }
          @media (max-width: 919px) {
            .hero-copy-col {
              order: 1;
              text-align: center;
            }
            .hero-foundation-col {
              order: 2;
            }
            .hero-cta {
              justify-content: center;
            }
            .hero-copy-col p {
              margin-left: auto;
              margin-right: auto;
            }
          }
          .element-badge-tile {
            background: ${theme.surfaceAlt};
            border: 1px solid ${theme.muted}20;
            border-radius: 14px;
            padding: 16px 14px;
            text-align: left;
            transition: all 0.3s ease;
          }
          .element-badge-tile:hover {
            border-color: ${theme.accent}60;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.25);
          }
        `}</style>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 1180,
            margin: "0 auto",
            padding: "20px 0 40px",
          }}
        >
          <div className="hero-grid-layout">
            {/* Left: Our Foundation — Compact Five Elements Matrix */}
            <div className="hero-foundation-col">
              <FadeIn>
                <div style={{ textAlign: "left", marginBottom: 18 }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: theme.muted,
                      marginBottom: 6,
                      fontWeight: 500,
                    }}
                  >
                    Our Foundation
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(24px, 3.2vw, 32px)",
                      fontWeight: 400,
                      color: theme.heading,
                    }}
                  >
                    Five Elements, One Space
                  </h2>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 12,
                  }}
                >
                  {/* Four Elements 2x2 */}
                  {ELEMENTS.slice(0, 4).map((el) => (
                    <div key={el.name} className="element-badge-tile">
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 18, color: el.color }}>{el.symbol}</span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: theme.heading }}>
                          {el.name}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, lineHeight: 1.5, color: theme.muted, fontWeight: 300 }}>
                        {el.name === "Earth" && "Honest provenance. Soil and season."}
                        {el.name === "Water" && "Social impact & community flow."}
                        {el.name === "Fire" && "Evening warmth & natural wine."}
                        {el.name === "Air" && "Morning lightness & specialty coffee."}
                      </p>
                    </div>
                  ))}

                  {/* Space (The Sixth Element) — Spans 2 columns */}
                  <div
                    className="element-badge-tile"
                    style={{
                      gridColumn: "span 2",
                      background: isAM
                        ? `linear-gradient(135deg, ${theme.surfaceAlt} 0%, ${theme.surface} 100%)`
                        : `linear-gradient(135deg, rgba(191,138,47,0.12) 0%, rgba(20,18,16,0.9) 100%)`,
                      border: `1px solid ${theme.accent}35`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 16, color: theme.accent }}>✦</span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: theme.heading }}>
                          Space <span style={{ fontSize: 13, color: theme.accent, fontStyle: "italic", marginLeft: 4 }}>(The Sixth Element)</span>
                        </span>
                      </div>
                      <p style={{ fontSize: 12, lineHeight: 1.5, color: theme.muted, fontWeight: 300 }}>
                        The intangible feeling of belonging — the pause you return for.
                      </p>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 26,
                        fontWeight: 600,
                        color: theme.accent,
                        letterSpacing: "0.05em",
                        paddingLeft: 12,
                        flexShrink: 0,
                      }}
                    >
                      VI
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right: Headline + Copy + CTA */}
            <div className="hero-copy-col">
              <FadeIn delay={0.1}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: 999,
                    background: `${theme.accent}15`,
                    border: `1px solid ${theme.accent}30`,
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: theme.accent,
                    marginBottom: 16,
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
                    fontSize: "clamp(32px, 5vw, 64px)",
                    fontWeight: 300,
                    color: theme.heading,
                    lineHeight: 1.12,
                    marginBottom: 14,
                  }}
                >
                  The Five Elements Shape Life.
                </h1>
              </FadeIn>
              <FadeIn delay={0.3}>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(24px, 4vw, 42px)",
                    fontWeight: 500,
                    fontStyle: "italic",
                    color: theme.accent,
                    marginBottom: 22,
                  }}
                >
                  We Offer the Sixth.
                </h2>
              </FadeIn>
              <FadeIn delay={0.45}>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: theme.muted,
                    maxWidth: 500,
                    marginBottom: 28,
                    fontWeight: 300,
                  }}
                >
                  A space where morning light meets evening warmth. Specialty coffee by day, natural wine by
                  night. Always intentional. Always Richmond.
                </p>
              </FadeIn>
              <FadeIn delay={0.6}>
                <div className="hero-cta" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {flags?.booking_enabled !== false && (
                    <CTAButton label="Book a Table" onClick={() => setBookingOpen(true)} primary theme={theme} />
                  )}
                  <CTAButton
                    label="Explore Menu"
                    onClick={() => navigate("menu")}
                    primary={flags?.booking_enabled === false}
                    theme={theme}
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Scroll indicator pointing to Instagram Moments */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            animation: "float 2s ease-in-out infinite",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: 0.75,
            cursor: "pointer",
          }}
          onClick={() => {
            const el = document.getElementById("instagram-feed");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.muted }}>
            Live Moments
          </span>
          <div
            style={{
              width: 1,
              height: 24,
              background: `linear-gradient(to bottom, ${theme.accent}, transparent)`,
            }}
          />
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
