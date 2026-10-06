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
      {/* Hero Viewport (reclaimed vertical space, fits in one clean view) */}
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
          padding: "calc(108px + env(safe-area-inset-top, 0px)) 24px 30px",
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
            gap: 16px;
            align-items: stretch;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
          }
          @media (min-width: 960px) {
            .hero-grid-layout {
              grid-template-columns: 0.82fr 1.18fr;
              gap: 20px;
              align-items: stretch;
            }
            .hero-poster-col {
              order: 1;
              display: flex;
              flex-direction: column;
              height: 100%;
              min-height: 0;
            }
            .hero-poster-col > div {
              height: 100%;
              display: flex;
              flex-direction: column;
              flex: 1;
              min-height: 0;
            }
            .hero-stack-col {
              order: 2;
              display: flex;
              flex-direction: column;
              gap: 12px;
              height: 100%;
              justify-content: flex-start;
            }
          }
          @media (max-width: 959px) {
            .hero-grid-layout {
              max-height: none;
              grid-template-columns: 1fr;
              gap: 14px;
              align-items: start;
            }
            .hero-poster-col {
              order: 1;
              height: 320px;
              max-height: 340px;
            }
            .hero-stack-col {
              order: 2;
              gap: 12px;
            }
            .hero-cta {
              justify-content: center;
            }
          }

          /* Showcase Poster Frame — matches exact combined height of the two cards */
          .showcase-frame {
            position: relative;
            border-radius: 14px;
            overflow: hidden;
            border: 1px solid ${theme.accent}45;
            box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45), 0 0 20px ${theme.accent}12;
            background: ${theme.surface};
            height: 100%;
            width: 100%;
            min-height: 0;
            display: flex;
            flex-direction: column;
          }
          .showcase-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
            flex: 1;
            min-height: 0;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .showcase-frame:hover img {
            transform: scale(1.02);
          }
          .showcase-badge-overlay {
            position: absolute;
            top: 12px;
            left: 12px;
            padding: 3px 10px;
            border-radius: 999px;
            background: rgba(15, 13, 10, 0.82);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid ${theme.accent}40;
            font-size: 9px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: ${theme.accent};
            font-weight: 600;
            z-index: 2;
          }

          /* Pill Eyebrow */
          .pill-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 2px 8px;
            border-radius: 999px;
            background: ${theme.accent}18;
            border: 1px solid ${theme.accent}35;
            font-size: 9px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: ${theme.accent};
            font-weight: 600;
            margin-bottom: 3px;
          }

          /* Section 1 Card: Foundation & 5 Elements (Compact & Streamlined) */
          .box-card-foundation {
            background: ${theme.surface};
            border: 1px solid ${theme.accent}25;
            border-radius: 14px;
            padding: 12px 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
            text-align: left;
            transition: all 0.3s ease;
          }
          .box-card-foundation:hover {
            border-color: ${theme.accent}55;
          }
          .elements-matrix-5col {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 6px;
            margin-top: 6px;
          }
          @media (max-width: 680px) {
            .elements-matrix-5col {
              grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            }
          }
          .elem-tile-compact {
            background: ${theme.surfaceAlt};
            border: 1px solid ${theme.muted}20;
            border-radius: 8px;
            padding: 6px 4px;
            text-align: center;
            transition: all 0.25s ease;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }
          .elem-tile-compact:hover {
            border-color: ${theme.accent}50;
            transform: translateY(-2px);
          }
          .elem-tile-desc {
            font-size: 10px;
            color: ${theme.muted};
            line-height: 1.25;
            font-weight: 300;
            margin-top: 2px;
          }

          /* Section 2 Card: The Sixth Element (Compact & Streamlined) */
          .box-card-sixth {
            background: ${isAM
              ? `linear-gradient(145deg, ${theme.surfaceAlt} 0%, ${theme.surface} 100%)`
              : `linear-gradient(145deg, rgba(191, 138, 47, 0.09) 0%, rgba(20, 18, 16, 0.95) 100%)`};
            border: 1px solid ${theme.accent}35;
            border-radius: 14px;
            padding: 14px 18px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
            text-align: left;
            transition: all 0.3s ease;
          }
          .box-card-sixth:hover {
            border-color: ${theme.accent}65;
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
          }
          .sixth-story-box {
            background: rgba(0, 0, 0, 0.16);
            border: 1px solid ${theme.accent}20;
            border-radius: 8px;
            padding: 6px 12px;
            margin: 4px 0 6px;
            font-size: 11px;
            line-height: 1.35;
            color: ${theme.muted};
            font-weight: 300;
          }
          .dual-phase-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin: 4px 0 8px;
          }
          @media (max-width: 580px) {
            .dual-phase-grid {
              grid-template-columns: 1fr;
            }
          }
          .phase-subcard {
            background: rgba(0, 0, 0, 0.2);
            border-left: 2px solid ${theme.accent};
            padding: 6px 10px;
            border-radius: 0 6px 6px 0;
          }
        `}</style>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 1220,
            margin: "0 auto",
          }}
        >
          <div className="hero-grid-layout">
            {/* Left: Vertical Showcase Poster Card (Matches combined height of right cards) */}
            <div className="hero-poster-col">
              <FadeIn style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
                <div className="showcase-frame">
                  <div className="showcase-badge-overlay">Richmond · London</div>
                  <img
                    src="/images/the-sixth-element-showcase.jpg"
                    alt="The Sixth Element — All Day. Into The Evening."
                  />
                </div>
              </FadeIn>
            </div>

            {/* Right: Stacked Foundation & Sixth Element Cards (Zero excessive gap, ready for revised copy) */}
            <div className="hero-stack-col">
              {/* Top Box: Our Foundation · The Five Elements */}
              <FadeIn delay={0.1}>
                <div className="box-card-foundation">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div className="pill-eyebrow">Our Foundation</div>
                      <h2
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "clamp(18px, 1.8vw, 22px)",
                          fontWeight: 400,
                          color: theme.heading,
                          lineHeight: 1.1,
                        }}
                      >
                        The Five Elements
                      </h2>
                    </div>
                  </div>

                  {/* 5 Equal Elements: Earth, Water, Air, Fire, Space (Clean, compact, flexible for revised content) */}
                  <div className="elements-matrix-5col">
                    {/* Earth */}
                    <div className="elem-tile-compact">
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
                        <ElementIcon name="Earth" color={COLORS.earthBrown} size={15} />
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13.5, fontWeight: 600, color: theme.heading }}>
                        Earth
                      </div>
                      <div className="elem-tile-desc">
                        Soil &amp; Season
                      </div>
                    </div>

                    {/* Water */}
                    <div className="elem-tile-compact">
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
                        <ElementIcon name="Water" color="#4A7C8F" size={15} />
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13.5, fontWeight: 600, color: theme.heading }}>
                        Water
                      </div>
                      <div className="elem-tile-desc">
                        Community Flow
                      </div>
                    </div>

                    {/* Air */}
                    <div className="elem-tile-compact">
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
                        <ElementIcon name="Air" color={COLORS.mossGreen} size={15} />
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13.5, fontWeight: 600, color: theme.heading }}>
                        Air
                      </div>
                      <div className="elem-tile-desc">
                        Morning Light
                      </div>
                    </div>

                    {/* Fire */}
                    <div className="elem-tile-compact">
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
                        <ElementIcon name="Fire" color={COLORS.warmAmber} size={15} />
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13.5, fontWeight: 600, color: theme.heading }}>
                        Fire
                      </div>
                      <div className="elem-tile-desc">
                        Evening Warmth
                      </div>
                    </div>

                    {/* Space (Clean label, no '(The Fifth Element)', no Roman numeral V) */}
                    <div className="elem-tile-compact">
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
                        <ElementIcon name="Ether" color={theme.accent} size={15} />
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13.5, fontWeight: 600, color: theme.heading }}>
                        Space
                      </div>
                      <div className="elem-tile-desc">
                        The Sanctuary
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Bottom Box: The Sixth Element (Compact, elegant, expandable narrative area) */}
              <FadeIn delay={0.2}>
                <div className="box-card-sixth">
                  <div>
                    <div className="pill-eyebrow">Where Life Slows Down</div>
                    <h2
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(20px, 2vw, 24px)",
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
                        fontSize: 13,
                        fontStyle: "italic",
                        color: theme.accent,
                        marginTop: 1,
                      }}
                    >
                      A Sense of Belonging — You
                    </div>

                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(13px, 1.3vw, 15px)",
                        lineHeight: 1.3,
                        color: theme.heading,
                        fontStyle: "italic",
                        margin: "4px 0 6px",
                        fontWeight: 400,
                      }}
                    >
                      "Five elements shape life. The Sixth Element makes it extraordinary."
                    </p>

                    {/* Story / Narrative container — styled flexibly for revised content */}
                    <div className="sixth-story-box">
                      Rooted in Richmond upon Thames, The Sixth Element harmonises mindful craft with genuine hospitality. From artisan morning roasts to atmospheric evenings, your presence completes our story.
                    </div>

                    <div className="dual-phase-grid">
                      <div className="phase-subcard">
                        <div style={{ fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 1 }}>
                          ☀️ Modern Daytime Favourites
                        </div>
                        <div style={{ fontSize: 10.5, lineHeight: 1.3, color: theme.muted, fontWeight: 300 }}>
                          Vibrant brunches, wholesome dishes, and barista-perfect specialty coffee.
                        </div>
                      </div>
                      <div className="phase-subcard">
                        <div style={{ fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 1 }}>
                          🌙 Indian-Inspired Evenings
                        </div>
                        <div style={{ fontSize: 10.5, lineHeight: 1.3, color: theme.muted, fontWeight: 300 }}>
                          Sharing plates, bold flavours, creative cocktails, and fine wines.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hero-cta" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
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
