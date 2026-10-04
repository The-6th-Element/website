// src/pages/SocialImpactPage.jsx
import React from "react";
import { COLORS } from "../theme/tokens";
import { OLD_SPIKE_URL } from "../data/config";
import { FadeIn } from "../components/ui/FadeIn";

export function SocialImpactPage({ theme }) {
  const stats = [
    { value: "350+", label: "people supported out of homelessness" },
    { value: "65%", label: "of profits reinvested into social impact" },
    { value: "8", label: "London cafés offering paid placements" },
    { value: "LLW", label: "every placement paid at London Living Wage" },
  ];

  const steps = [
    { n: "01", title: "Referral Partners", desc: "Working with charities like Crisis, St Giles Trust and Centrepoint to reach people experiencing homelessness." },
    { n: "02", title: "Taster Day", desc: "An informal day behind the bar to see if barista life is the right fit — no pressure, no experience needed." },
    { n: "03", title: "Barista Training", desc: "A hands-on training course covering coffee origins, extraction, equipment, plus CV support and work confidence." },
    { n: "04", title: "Paid Work Placement", desc: "A paid placement at London Living Wage across the Old Spike café network — real shifts, real income." },
    { n: "05", title: "Into Employment", desc: "A network of employer partners helps graduates step into long-term jobs and a life beyond the streets." },
  ];

  return (
    <div style={{ paddingTop: 120, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
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
              Our Coffee Partner · Old Spike Roastery
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 400,
                color: theme.heading,
                marginBottom: 16,
              }}
            >
              Every Cup Fights Homelessness
            </h1>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: theme.muted,
                fontWeight: 300,
                maxWidth: 640,
                margin: "0 auto",
              }}
            >
              The coffee we pour is roasted by <strong style={{ color: theme.heading, fontWeight: 500 }}>Old Spike Roastery</strong> — a London social enterprise and Community Interest Company that trains and employs people who have experienced homelessness. Choosing our coffee helps fund their journey from the street into lasting work.
            </p>
          </div>
        </FadeIn>

        {/* Hero image band */}
        <FadeIn delay={0.1}>
          <div
            style={{
              height: 240,
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 48,
              backgroundImage: "url(/day-cafe.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, transparent, ${COLORS.deepMoss}CC)`,
                display: "flex",
                alignItems: "flex-end",
                padding: 24,
              }}
            >
              <span
                style={{
                  color: COLORS.ivory,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontStyle: "italic",
                }}
              >
                “Great coffee, poured with purpose.”
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Impact stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 64,
          }}
        >
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08}>
              <div
                style={{
                  padding: "28px 20px",
                  borderRadius: 16,
                  textAlign: "center",
                  height: "100%",
                  background: theme.surfaceAlt,
                  border: `1px solid ${theme.muted}15`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 40,
                    fontWeight: 500,
                    color: theme.accent,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: theme.muted,
                    fontWeight: 300,
                    marginTop: 10,
                    lineHeight: 1.5,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* How the model works */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(26px, 4vw, 38px)",
                fontWeight: 400,
                color: theme.heading,
              }}
            >
              From the Street to a Career
            </h2>
            <p style={{ fontSize: 14, color: theme.muted, fontWeight: 300, marginTop: 8 }}>
              Old Spike's five-step programme, funded in part by every bag and every cup.
            </p>
          </div>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 72 }}>
          {steps.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.08}>
              <div
                className="hover-lift"
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  padding: 24,
                  borderRadius: 16,
                  background: theme.surfaceAlt,
                  border: `1px solid ${theme.muted}15`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 32,
                    fontWeight: 500,
                    color: theme.accent,
                    minWidth: 48,
                  }}
                >
                  {step.n}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 21,
                      fontWeight: 500,
                      color: theme.heading,
                      marginBottom: 6,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: theme.muted, fontWeight: 300 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn>
          <div
            style={{
              padding: 40,
              borderRadius: 20,
              background: `linear-gradient(135deg, ${COLORS.mossGreen}, ${COLORS.deepMoss})`,
              textAlign: "center",
              marginBottom: 80,
            }}
          >
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 28,
                fontWeight: 400,
                color: COLORS.ivory,
                marginBottom: 12,
              }}
            >
              Read the Full Impact Story
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "#B8C4A0",
                fontWeight: 300,
                marginBottom: 24,
                maxWidth: 520,
                margin: "0 auto 24px",
              }}
            >
              Explore Old Spike Roastery's programmes, trainee stories, and their latest Impact Report.
            </p>
            <a
              href={OLD_SPIKE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                borderRadius: 30,
                border: `2px solid ${COLORS.ivory}`,
                background: "transparent",
                color: COLORS.ivory,
                cursor: "pointer",
                textDecoration: "none",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.05em",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = COLORS.ivory;
                e.target.style.color = COLORS.deepMoss;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = COLORS.ivory;
              }}
            >
              Visit Old Spike Roastery →
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
