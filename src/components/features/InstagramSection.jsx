// src/components/features/InstagramSection.jsx
import React, { useEffect, useRef } from "react";
import { FadeIn } from "../ui/FadeIn";
import { INSTAGRAM_CONFIG } from "../../data/config";

export function InstagramSection({ theme }) {
  const embedRef = useRef(null);

  useEffect(() => {
    if (INSTAGRAM_CONFIG.elfsightWidgetId) {
      const script = document.createElement("script");
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    }
    if (INSTAGRAM_CONFIG.curatorFeedId) {
      const script = document.createElement("script");
      script.src = `https://cdn.curator.io/published/${INSTAGRAM_CONFIG.curatorFeedId}.js`;
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    }
  }, []);

  return (
    <section style={{ padding: "80px 24px", background: theme.surface }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <a
            href={INSTAGRAM_CONFIG.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: theme.muted,
              marginBottom: 12,
              display: "block",
              textDecoration: "none",
            }}
          >
            @{INSTAGRAM_CONFIG.handle}
          </a>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(24px, 3.5vw, 36px)",
              fontWeight: 400,
              color: theme.heading,
            }}
          >
            A Sense of Belonging
          </h2>
        </div>
      </FadeIn>

      {/* Live feed embed area */}
      {INSTAGRAM_CONFIG.elfsightWidgetId ? (
        <div className={`elfsight-app-${INSTAGRAM_CONFIG.elfsightWidgetId}`} ref={embedRef} />
      ) : INSTAGRAM_CONFIG.curatorFeedId ? (
        <div id={`curator-feed-${INSTAGRAM_CONFIG.curatorFeedId}`} ref={embedRef} />
      ) : (
        /* Styled placeholders — replaced by live feed once connected */
        <div className="insta-grid">
          {[
            { emoji: "☕", bg: "#D4C5A9" },
            { emoji: "🍳", bg: "#C8B896" },
            { emoji: "🌿", bg: "#8B9E6B" },
            { emoji: "🍷", bg: "#8B6B4E" },
            { emoji: "✨", bg: "#BFA87A" },
            { emoji: "🍺", bg: "#A08B6B" },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <a
                href={INSTAGRAM_CONFIG.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  aspectRatio: "1",
                  background: item.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "transform 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {item.emoji}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  View on Instagram →
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      )}

      <FadeIn delay={0.3}>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <a
            href={INSTAGRAM_CONFIG.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              borderRadius: 30,
              border: `1px solid ${theme.muted}30`,
              color: theme.text,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.color = theme.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${theme.muted}30`;
              e.currentTarget.style.color = theme.text;
            }}
          >
            Follow us on Instagram
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
