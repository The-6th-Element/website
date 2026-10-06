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
      {/* Hero Viewport (reclaimed vertical space) */}
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
          padding: "calc(74px + env(safe-area-inset-top, 0px)) 24px 36px",
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
            opacity: isAM ? 0.35 : 0.22,
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
              ? `linear-gradient(180deg, ${theme.bg}D9 0%, ${theme.bg}66 40%, ${theme.bg}D9 100%)`
              : `linear-gradient(180deg, ${theme.bg}E6 0%, ${theme.bg}77 40%, ${theme.bg}E6 100%)`,
          }}
        />

        <style>{`
          .hero-grid-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: 28px;
            align-items: stretch;
            width: 100%;
            max-width: 1240px;
            margin: 0 auto;
            max-height: calc(100vh - 120px);
          }
          @media (min-width: 960px) {
            .hero-grid-layout {
              grid-template-columns: 0.95fr 1.05fr;
              gap: 32px;
            }
            .hero-poster-col {
              order: 1;
              height: 100%;
            }
            .hero-stack-col {
              order: 2;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              gap: 16px;
              height: 100%;
            }
          }
          @media (max-width: 959px) {
            .hero-grid-layout {
              max-height: none;
            }
            .hero-poster-col {
              order: 1;
              max-height: 480px;
            }
            .hero-stack-col {
              order: 2;
              gap: 20px;
            }
            .hero-cta {
              justify-content: center;
            }
          }

          /* Showcase Poster Frame */
          .showcase-frame {
            position: relative;
            border-radius: 18px;
            overflow: hidden;
            border: 1px solid ${theme.accent}45;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 0 24px ${theme.accent}15;
            background: ${theme.surface};
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .showcase-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .showcase-frame:hover img {
            transform: scale(1.02);
          }
          .showcase-badge-overlay {
            position: absolute;
            top: 14px;
            left: 14px;
            padding: 4px 12px;
            border-radius: 999px;
            background: rgba(15, 13, 10, 0.8);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid ${theme.accent}40;
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: ${theme.accent};
            font-weight: 600;
            z-index: 2;
          }

          /* Pill Eyebrow */
          .pill-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 3px 10px;
            border-radius: 999px;
            background: ${theme.accent}18;
            border: 1px solid ${theme.accent}35;
            font-size: 10px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: ${theme.accent};
            font-weight: 600;
            margin-bottom: 6px;
          }

          /* Section 1 Card: Foundation & 5 Elements */
          .box-card-foundation {
            background: ${theme.surface};
            border: 1px solid ${theme.accent}25;
            border-radius: 16px;
            padding: 16px 20px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
            text-align: left;
            transition: all 0.3s ease;
          }
          .box-card-foundation:hover {
            border-color: ${theme.accent}55;
          }
          .elements-matrix-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-top: 10px;
          }
          .elem-tile-compact {
            background: ${theme.surfaceAlt};
            border: 1px solid ${theme.muted}20;
            border-radius: 10px;
            padding: 9px 8px;
            text-align: center;
            transition: all 0.25s ease;
          }
          .elem-tile-compact:hover {
            border-color: ${theme.accent}50;
            transform: translateY(-2px);
          }
          .ether-span-compact {
            grid-column: span 4;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 14px;
            margin-top: 8px;
            background: ${isAM
              ? `linear-gradient(90deg, ${theme.surfaceAlt} 0%, ${theme.surface} 100%)`
              : `linear-gradient(90deg, rgba(191,138,47,0.12) 0%, rgba(23,21,18,0.85) 100%)`};
            border: 1px solid ${theme.accent}35;
            border-radius: 10px;
          }

          /* Section 2 Card: The Sixth Element */
          .box-card-sixth {
            background: ${isAM
              ? `linear-gradient(145deg, ${theme.surfaceAlt} 0%, ${theme.surface} 100%)`
              : `linear-gradient(145deg, rgba(191,138,47,0.09) 0%, rgba(20,18,16,0.95) 100%)`};
            border: 1px solid ${theme.accent}35;
            border-radius: 16px;
            padding: 18px 22px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
            text-align: left;
            transition: all 0.3s ease;
          }
          .box-card-sixth:hover {
            border-color: ${theme.accent}65;
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
          }
          .dual-phase-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 8px 0 14px;
          }
          .phase-subcard {
            background: rgba(0, 0, 0, 0.2);
            border-left: 2px solid ${theme.accent};
            padding: 7px 10px;
            border-radius: 0 8px 8px 0;
          }
        `}</style>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 1240,
            margin: "0 auto",
            height: "100%",
          }}
        >
          <div className="hero-grid-layout">
            {/* Left: Vertical Showcase Poster Card */}
            <div className="hero-poster-col">
              <FadeIn>
                <div className="showcase-frame">
                  <div className="showcase-badge-overlay">Richmond · London</div>
                  <img
                    src="/images/the-sixth-element-showcase.jpg"
                    alt="The Sixth Element — All Day. Into The Evening."
                  />
                </div>
              </FadeIn>
            </div>

            {/* Right: Stacked Foundation & Sixth Element Cards */}
            <div className="hero-stack-col">
              {/* Top Box: Our Foundation · The Five Elements */}
              <FadeIn delay={0.1}>
                <div className="box-card-foundation">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 6 }}>
                    <div>
                      <div className="pill-eyebrow">Our Foundation</div>
                      <h2
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "clamp(22px, 2.2vw, 28px)",
                          fontWeight: 400,
                          color: theme.heading,
                          lineHeight: 1.1,
                        }}
                      >
                        The Five Elements
                      </h2>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 14,
                        fontStyle: "italic",
                        color: theme.accent,
                      }}
                    >
                      Earth · Water · Air · Fire · Space
                    </div>
                  </div>

                  {/* 4 Core Elements 4-Column Row */}
                  <div className="elements-matrix-row">
                    {/* Earth */}
                    <div className="elem-tile-compact">
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                        <ElementIcon name="Earth" color={COLORS.earthBrown} size={18} />
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 600, color: theme.heading }}>
                        Earth
                      </div>
                      <div style={{ fontSize: 10, color: theme.muted, lineHeight: 1.25, fontWeight: 300 }}>
                        Soil &amp; Season
                      </div>
                    </div>

                    {/* Water */}
                    <div className="elem-tile-compact">
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                        <ElementIcon name="Water" color="#4A7C8F" size={18} />
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 600, color: theme.heading }}>
                        Water
                      </div>
                      <div style={{ fontSize: 10, color: theme.muted, lineHeight: 1.25, fontWeight: 300 }}>
                        Community Flow
                      </div>
                    </div>

                    {/* Air */}
                    <div className="elem-tile-compact">
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                        <ElementIcon name="Air" color={COLORS.mossGreen} size={18} />
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 600, color: theme.heading }}>
                        Air
                      </div>
                      <div style={{ fontSize: 10, color: theme.muted, lineHeight: 1.25, fontWeight: 300 }}>
                        Morning Light
                      </div>
                    </div>

                    {/* Fire */}
                    <div className="elem-tile-compact">
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                        <ElementIcon name="Fire" color={COLORS.warmAmber} size={18} />
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 600, color: theme.heading }}>
                        Fire
                      </div>
                      <div style={{ fontSize: 10, color: theme.muted, lineHeight: 1.25, fontWeight: 300 }}>
                        Evening Warmth
                      </div>
                    </div>

                    {/* Space (The Fifth Element) */}
                    <div className="ether-span-compact">
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <ElementIcon name="Ether" color={theme.accent} size={18} />
                        <div>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: theme.heading }}>
                            Space <span style={{ fontSize: 12, color: theme.accent, fontStyle: "italic", fontWeight: "normal" }}>(The Fifth Element)</span>
                          </div>
                          <div style={{ fontSize: 10.5, color: theme.muted, fontWeight: 300 }}>
                            The sanctuary atmosphere that connects every moment.
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 20,
                          color: theme.accent,
                          fontWeight: 600,
                          paddingLeft: 10,
                        }}
                      >
                        V
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Bottom Box: The Sixth Element */}
              <FadeIn delay={0.25}>
                <div className="box-card-sixth">
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <div className="pill-eyebrow">Where Life Slows Down</div>
                        <h2
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "clamp(24px, 2.4vw, 32px)",
                            fontWeight: 400,
                            color: theme.heading,
                            lineHeight: 1.1,
                          }}
                        >
                          The Sixth Element
                        </h2>
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 15,
                            fontStyle: "italic",
                            color: theme.accent,
                            marginTop: 2,
                          }}
                        >
                          A Sense of Belonging — You
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 34,
                          fontWeight: 600,
                          color: theme.accent,
                          lineHeight: 1,
                          letterSpacing: "0.05em",
                          paddingLeft: 12,
                        }}
                      >
                        VI
                      </div>
                    </div>

                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(15px, 1.6vw, 18px)",
                        lineHeight: 1.4,
                        color: theme.heading,
                        fontStyle: "italic",
                        margin: "6px 0 8px",
                        fontWeight: 400,
                      }}
                    >
                      "Five elements shape life. The Sixth Element makes it extraordinary."
                    </p>

                    <div className="dual-phase-grid">
                      <div className="phase-subcard">
                        <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 2 }}>
                          ☀️ Modern Daytime Favourites
                        </div>
                        <div style={{ fontSize: 11, lineHeight: 1.4, color: theme.muted, fontWeight: 300 }}>
                          Vibrant brunches, wholesome dishes, and barista-perfect specialty coffee.
                        </div>
                      </div>
                      <div className="phase-subcard">
                        <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 2 }}>
                          🌙 Indian-Inspired Evenings
                        </div>
                        <div style={{ fontSize: 11, lineHeight: 1.4, color: theme.muted, fontWeight: 300 }}>
                          Sharing plates, bold flavours, creative cocktails, and fine wines.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hero-cta" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: "auto" }}>
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
