// src/pages/AboutPage.jsx
import React from "react";
import { FadeIn } from "../components/ui/FadeIn";

export function AboutPage({ theme }) {
  return (
    <div style={{ paddingTop: 120, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 80px" }}>
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
              Our Story
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 400,
                color: theme.heading,
              }}
            >
              The Space Between
            </h1>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              lineHeight: 1.8,
              color: theme.heading,
              fontWeight: 300,
              marginBottom: 40,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            "In ancient philosophy, five elements compose all of existence — Earth, Water, Fire, Air, and Ether.
            We believe there is a sixth: the feeling of belonging."
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ fontSize: 15, lineHeight: 1.9, color: theme.muted, fontWeight: 300 }}>
            <p style={{ marginBottom: 20 }}>
              The Sixth Element was born from a simple observation: Richmond-upon-Thames has extraordinary
              places to eat and drink, but few that truly transform with the rhythms of the day.
            </p>
            <p style={{ marginBottom: 20 }}>
              We designed a space that breathes — bright and airy for morning coffee and brunch, warm and
              intimate for evening wine and conversation. Not two venues in one, but a single space that
              flows naturally from dawn to dusk.
            </p>
            <p style={{ marginBottom: 20 }}>
              Our coffee is sourced through direct-trade partnerships with farming communities, because every
              element of what we do must carry intention. Our food is simple, honest, and grounded in seasonal
              ingredients. Our wine list celebrates natural and biodynamic producers.
            </p>
            <p>
              But the sixth element — the one that brings people back — isn't on any menu. It's the feeling you
              get when you walk through the door. That's the space we're building.
            </p>
          </div>
        </FadeIn>

        {/* Values */}
        <FadeIn delay={0.3}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 24,
              marginTop: 60,
            }}
          >
            {[
              { label: "Intentional", value: "Every detail considered" },
              { label: "Seasonal", value: "Menus that follow nature" },
              { label: "Community", value: "Richmond at our heart" },
              { label: "Sustainable", value: "From farm to cup to plate" },
            ].map((v) => (
              <div
                key={v.label}
                style={{
                  textAlign: "center",
                  padding: 24,
                  borderTop: `2px solid ${theme.accent}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 500,
                    color: theme.heading,
                    marginBottom: 4,
                  }}
                >
                  {v.label}
                </div>
                <div style={{ fontSize: 13, color: theme.muted, fontWeight: 300 }}>{v.value}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
