// src/pages/HomePage.jsx
import React from "react";
import { COLORS } from "../theme/tokens";
import { ELEMENTS } from "../data/config";
import { FadeIn } from "../components/ui/FadeIn";
import { CTAButton } from "../components/ui/CTAButton";
import { InstagramSection } from "../components/features/InstagramSection";

// Element icons defining each natural element
function ElementIcon({ name, color, size = 18 }) {
  if (name === "Earth") {
    // Elegant sprout rooted in soil
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M12 22v-9" />
        <path d="M12 13c-4.5 0-7.5-3.5-7.5-7.5 4.5 0 7.5 3.5 7.5 7.5z" />
        <path d="M12 13c4.5 0 7.5-3.5 7.5-7.5-4.5 0-7.5 3.5-7.5 7.5z" />
      </svg>
    );
  }
  if (name === "Water") {
    // Pure water droplet with ripple wave
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M12 2.5C12 2.5 5.5 11 5.5 16a6.5 6.5 0 0 0 13 0C18.5 11 12 2.5 12 2.5z" />
        <path d="M9 16c0 1.66 1.34 3 3 3" />
      </svg>
    );
  }
  if (name === "Fire") {
    // Upward rising flame
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 3z" />
      </svg>
    );
  }
  if (name === "Air") {
    // Flowing breeze
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
        <path d="M9.5 5A2 2 0 1 1 11 8H2" />
        <path d="M12.5 19a2 2 0 1 0 1.5-3.5H2" />
      </svg>
    );
  }
  if (name === "Ether") {
    // Celestial 8-pointed quintessence star
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polygon points="12 2 14.8 9.2 22 12 14.8 14.8 12 22 9.2 14.8 2 12 9.2 9.2 12 2" fill={`${color}25`} />
      </svg>
    );
  }
  return <span style={{ color, flexShrink: 0 }}>✦</span>;
}

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
            align-items: stretch;
            width: 100%;
            max-width: 1180px;
            margin: 0 auto;
          }
          @media (min-width: 960px) {
            .hero-grid-layout {
              grid-template-columns: 1fr 1fr;
              gap: 48px;
            }
            .hero-foundation-col {
              order: 1;
              text-align: left;
              display: flex;
              flex-direction: column;
            }
            .hero-copy-col {
              order: 2;
              text-align: left;
              display: flex;
              flex-direction: column;
            }
          }
          @media (max-width: 959px) {
            .hero-copy-col {
              order: 1;
              text-align: center;
              margin-bottom: 8px;
            }
            .hero-foundation-col {
              order: 2;
              text-align: left;
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
          .sixth-element-panel {
            background: ${isAM
              ? `linear-gradient(135deg, ${theme.surfaceAlt} 0%, ${theme.surface} 100%)`
              : `linear-gradient(135deg, rgba(191,138,47,0.1) 0%, rgba(20,18,16,0.92) 100%)`};
            border: 1px solid ${theme.accent}35;
            border-radius: 16px;
            padding: 24px 22px;
            text-align: left;
            transition: all 0.3s ease;
            box-shadow: 0 8px 30px rgba(0,0,0,0.18);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
          }
          .sixth-element-panel:hover {
            border-color: ${theme.accent}70;
            box-shadow: 0 12px 36px rgba(0,0,0,0.28);
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
            {/* Left: The Five Elements */}
            <div className="hero-foundation-col">
              <FadeIn>
                <div style={{ textAlign: "left", marginBottom: 18 }}>
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
                      marginBottom: 10,
                      fontWeight: 600,
                    }}
                  >
                    Our Foundation
                  </div>
                  <h1
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(28px, 3.4vw, 42px)",
                      fontWeight: 400,
                      color: theme.heading,
                      lineHeight: 1.15,
                      marginBottom: 6,
                    }}
                  >
                    The Five Elements
                  </h1>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(18px, 2.2vw, 24px)",
                      fontWeight: 400,
                      fontStyle: "italic",
                      color: theme.accent,
                      marginBottom: 20,
                    }}
                  >
                    Earth · Water · Fire · Air · Ether
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
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <ElementIcon name={el.name} color={el.color} size={18} />
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: theme.heading }}>
                          {el.name}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, lineHeight: 1.5, color: theme.muted, fontWeight: 300 }}>
                        {el.name === "Earth" && "Honest provenance. Soil and season."}
                        {el.name === "Water" && "Direct-trade coffee & ethical flow."}
                        {el.name === "Fire" && "Evening warmth & natural wine."}
                        {el.name === "Air" && "Morning lightness & specialty coffee."}
                      </p>
                    </div>
                  ))}

                  {/* Ether (The Fifth Element) — Spans 2 columns */}
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
                        <ElementIcon name="Ether" color={theme.accent} size={18} />
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: theme.heading }}>
                          Ether <span style={{ fontSize: 13, color: theme.accent, fontStyle: "italic", marginLeft: 4 }}>(The Fifth Element)</span>
                        </span>
                      </div>
                      <p style={{ fontSize: 12, lineHeight: 1.5, color: theme.muted, fontWeight: 300 }}>
                        The celestial atmosphere that binds all together — music, vibration, and space.
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
                      V
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right: The Sixth Element — A Sense of Belonging */}
            <div className="hero-copy-col">
              <FadeIn delay={0.1}>
                <div style={{ textAlign: "left", marginBottom: 18 }}>
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
                      marginBottom: 10,
                      fontWeight: 600,
                    }}
                  >
                    Richmond-upon-Thames
                  </div>
                  <h1
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(28px, 3.4vw, 42px)",
                      fontWeight: 400,
                      color: theme.heading,
                      lineHeight: 1.15,
                      marginBottom: 6,
                    }}
                  >
                    The Sixth Element
                  </h1>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(18px, 2.2vw, 24px)",
                      fontWeight: 400,
                      fontStyle: "italic",
                      color: theme.accent,
                      marginBottom: 20,
                    }}
                  >
                    A Sense of Belonging
                  </h2>
                </div>

                <div className="sixth-element-panel">
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: theme.accent,
                          fontWeight: 600,
                        }}
                      >
                        Our Purpose
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 32,
                          fontWeight: 600,
                          color: theme.accent,
                          lineHeight: 1,
                          letterSpacing: "0.08em",
                          paddingLeft: 12,
                          flexShrink: 0,
                        }}
                      >
                        VI
                      </div>
                    </div>

                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(17px, 1.9vw, 21px)",
                        lineHeight: 1.45,
                        color: theme.heading,
                        fontStyle: "italic",
                        marginBottom: 14,
                        fontWeight: 400,
                      }}
                    >
                      "The five elements shape the physical world. We offer the sixth: a place where you belong."
                    </p>

                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.65,
                        color: theme.muted,
                        marginBottom: 12,
                        fontWeight: 300,
                      }}
                    >
                      Specialty coffee and light-filled mornings transform effortlessly into warm evening light, shared plates, and low-intervention natural wine.
                    </p>

                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.65,
                        color: theme.muted,
                        marginBottom: 22,
                        fontWeight: 300,
                      }}
                    >
                      More than a café, more than a wine bar — an intentional sanctuary created for genuine conversation, warmth, and neighborhood connection in Richmond.
                    </p>
                  </div>

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
