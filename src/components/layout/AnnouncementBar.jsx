// src/components/layout/AnnouncementBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { COLORS } from "../../theme/tokens";
import { usePromotions, isPromoLive } from "../../hooks/useContent";

export const ANNOUNCEMENT_BAR_H = 40;

const SPEED_SECONDS = {
  slow: 45,
  normal: 28,
  fast: 16,
};

export function AnnouncementBar({ theme, onToggle, navigate, setBookingOpen }) {
  const { promotions } = usePromotions();
  const live = promotions.filter(isPromoLive);

  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("tse_promo_bar_dismissed") === "1";
    } catch {
      return false;
    }
  });

  const [isPaused, setIsPaused] = useState(false);
  const [activeModalPromo, setActiveModalPromo] = useState(null);

  const [speedSetting, setSpeedSetting] = useState(() => {
    try {
      return localStorage.getItem("tse_ticker_speed") || "normal";
    } catch {
      return "normal";
    }
  });

  // Listen for admin speed setting changes
  useEffect(() => {
    const handleSpeedChange = () => {
      try {
        const saved = localStorage.getItem("tse_ticker_speed") || "normal";
        setSpeedSetting(saved);
      } catch {}
    };
    window.addEventListener("tse_ticker_speed_updated", handleSpeedChange);
    return () => window.removeEventListener("tse_ticker_speed_updated", handleSpeedChange);
  }, []);

  const visible = live.length > 0 && !dismissed;

  useEffect(() => {
    if (onToggle) onToggle(visible);
  }, [visible, onToggle]);

  // Close modal on Escape
  useEffect(() => {
    if (!activeModalPromo) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveModalPromo(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalPromo]);

  if (!visible) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("tse_promo_bar_dismissed", "1");
    } catch {}
  };

  // Build repeated groups so the track spans wide displays with no gap
  const repeatCount = Math.max(2, Math.ceil(8 / Math.max(1, live.length)));
  const groupItems = Array.from({ length: repeatCount }, () => live).flat();

  const durationSec = SPEED_SECONDS[speedSetting] || SPEED_SECONDS.normal;

  return (
    <>
      <style>{`
        @keyframes tseMarqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes tseShimmerSweep {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .tse-ticker-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: ${ANNOUNCEMENT_BAR_H}px;
          z-index: 1100;
          background: linear-gradient(90deg, #2E381A 0%, #4B3621 28%, #7A571E 55%, #BF8A2F 75%, #3D4A26 100%);
          background-size: 250% 100%;
          animation: tseShimmerSweep 24s ease infinite alternate;
          color: #fff;
          display: flex;
          align-items: center;
          overflow: hidden;
          box-shadow: 0 2px 14px rgba(0, 0, 0, 0.22);
          border-bottom: 1px solid rgba(191, 138, 47, 0.4);
          user-select: none;
        }

        .tse-ticker-marquee-wrap {
          position: relative;
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent 0, #000 36px, #000 calc(100% - 80px), transparent calc(100% - 10px));
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 36px, #000 calc(100% - 80px), transparent calc(100% - 10px));
        }

        .tse-ticker-track {
          display: flex;
          align-items: center;
          width: max-content;
          will-change: transform;
          animation: tseMarqueeScroll ${durationSec}s linear infinite;
        }

        /* Hover to pause, focus to pause, manual pause */
        .tse-ticker-bar:hover .tse-ticker-track,
        .tse-ticker-bar:focus-within .tse-ticker-track,
        .tse-ticker-track.is-paused {
          animation-play-state: paused !important;
        }

        .tse-ticker-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .tse-ticker-item-btn {
          display: inline-flex;
          align-items: center;
          background: transparent;
          border: none;
          color: #FFF;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 13px;
          cursor: pointer;
          padding: 4px 10px;
          border-radius: 6px;
          transition: background 0.2s ease, transform 0.2s ease, color 0.2s ease;
          text-decoration: none;
          outline: none;
        }

        .tse-ticker-item-btn:hover,
        .tse-ticker-item-btn:focus-visible {
          background: rgba(255, 255, 255, 0.16);
          transform: translateY(-1px);
          color: #FFF;
        }

        .tse-ticker-item-btn:focus-visible {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6);
        }

        .tse-ticker-badge {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: #FFF;
          padding: 2px 7px;
          border-radius: 12px;
          margin-right: 8px;
          flex-shrink: 0;
          line-height: 1.2;
        }

        .tse-ticker-title {
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #FFFFFF;
        }

        .tse-ticker-discount {
          font-weight: 400;
          color: #F6F4E3;
          margin-left: 6px;
          opacity: 0.94;
        }

        .tse-ticker-cta-hint {
          font-size: 10.5px;
          font-weight: 500;
          color: #FFDE9E;
          margin-left: 8px;
          opacity: 0.85;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .tse-ticker-separator {
          color: #BF8A2F;
          margin: 0 22px;
          font-size: 11px;
          opacity: 0.88;
          text-shadow: 0 0 6px rgba(191, 138, 47, 0.6);
          user-select: none;
        }

        /* Controls cluster */
        .tse-ticker-controls {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 10px 0 6px;
          flex-shrink: 0;
          background: rgba(43, 33, 20, 0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          height: 100%;
          border-left: 1px solid rgba(255, 255, 255, 0.12);
        }

        .tse-ticker-ctrl-btn {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #FFFFFF;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 11px;
          padding: 0;
          transition: all 0.2s ease;
          outline: none;
        }

        .tse-ticker-ctrl-btn:hover,
        .tse-ticker-ctrl-btn:focus-visible {
          background: rgba(255, 255, 255, 0.26);
          color: #FFF;
          transform: scale(1.08);
        }

        .tse-ticker-ctrl-btn:focus-visible {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6);
        }

        /* Respect accessibility preferences */
        @media (prefers-reduced-motion: reduce) {
          .tse-ticker-track {
            animation: none !important;
            transform: none !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
          }
          .tse-ticker-marquee-wrap {
            mask-image: none !important;
            -webkit-mask-image: none !important;
          }
        }
      `}</style>

      <div
        className="tse-ticker-bar"
        role="region"
        aria-label="Promotional announcements and special offers"
      >
        <div className="tse-ticker-marquee-wrap">
          <div className={`tse-ticker-track ${isPaused ? "is-paused" : ""}`}>
            {/* Group 1 */}
            <div className="tse-ticker-group">
              {groupItems.map((promo, i) => (
                <React.Fragment key={`g1-${promo.id}-${i}`}>
                  <button
                    type="button"
                    className="tse-ticker-item-btn"
                    onClick={() => setActiveModalPromo(promo)}
                    title={`Click for details: ${promo.title}`}
                  >
                    {promo.badge_text && (
                      <span className="tse-ticker-badge">{promo.badge_text}</span>
                    )}
                    <span className="tse-ticker-title">{promo.title}</span>
                    {promo.discount_text && (
                      <span className="tse-ticker-discount">— {promo.discount_text}</span>
                    )}
                    <span className="tse-ticker-cta-hint">Details ›</span>
                  </button>
                  <span className="tse-ticker-separator" aria-hidden="true">✦</span>
                </React.Fragment>
              ))}
            </div>

            {/* Group 2 (Mirrored for seamless infinite marquee loop) */}
            <div className="tse-ticker-group" aria-hidden="true">
              {groupItems.map((promo, i) => (
                <React.Fragment key={`g2-${promo.id}-${i}`}>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="tse-ticker-item-btn"
                    onClick={() => setActiveModalPromo(promo)}
                  >
                    {promo.badge_text && (
                      <span className="tse-ticker-badge">{promo.badge_text}</span>
                    )}
                    <span className="tse-ticker-title">{promo.title}</span>
                    {promo.discount_text && (
                      <span className="tse-ticker-discount">— {promo.discount_text}</span>
                    )}
                    <span className="tse-ticker-cta-hint">Details ›</span>
                  </button>
                  <span className="tse-ticker-separator" aria-hidden="true">✦</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed controls on far right */}
        <div className="tse-ticker-controls">
          <button
            type="button"
            className="tse-ticker-ctrl-btn"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? "Resume ticker scrolling" : "Pause ticker scrolling"}
            title={isPaused ? "Resume scrolling" : "Pause scrolling"}
          >
            {isPaused ? "▶" : "⏸"}
          </button>
          <button
            type="button"
            className="tse-ticker-ctrl-btn"
            onClick={dismiss}
            aria-label="Dismiss announcement banner"
            title="Dismiss announcement bar"
            style={{ fontSize: "14px", fontWeight: "bold" }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Interactive Offer Details Modal */}
      {activeModalPromo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tse-promo-modal-title"
          onClick={() => setActiveModalPromo(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(15, 13, 10, 0.78)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            animation: "fadeIn 0.25s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 520,
              background: theme.surfaceAlt || "#FFFFFF",
              border: `1px solid ${COLORS.warmAmber}50`,
              borderRadius: 20,
              padding: "36px 32px 30px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
              color: theme.text,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalPromo(null)}
              aria-label="Close offer details"
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background: "rgba(0,0,0,0.06)",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
                color: theme.heading,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s ease",
              }}
            >
              ×
            </button>

            {/* Badge */}
            {activeModalPromo.badge_text && (
              <span
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: `${COLORS.warmAmber}22`,
                  color: COLORS.warmAmber,
                  border: `1px solid ${COLORS.warmAmber}50`,
                  padding: "4px 10px",
                  borderRadius: 20,
                  marginBottom: 14,
                }}
              >
                {activeModalPromo.badge_text}
              </span>
            )}

            {/* Title */}
            <h3
              id="tse-promo-modal-title"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 600,
                color: theme.heading,
                margin: "0 0 10px",
                lineHeight: 1.15,
              }}
            >
              {activeModalPromo.title}
            </h3>

            {/* Discount / Highlight */}
            {activeModalPromo.discount_text && (
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: COLORS.mossGreen,
                  marginBottom: 14,
                }}
              >
                {activeModalPromo.discount_text}
              </div>
            )}

            {/* Description */}
            {activeModalPromo.description && (
              <p
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.7,
                  color: theme.muted,
                  margin: "0 0 20px",
                  fontWeight: 300,
                }}
              >
                {activeModalPromo.description}
              </p>
            )}

            {/* Validity details */}
            {activeModalPromo.end_date && activeModalPromo.end_date < "2030-01-01" && (
              <div
                style={{
                  fontSize: 12,
                  color: theme.muted,
                  marginBottom: 24,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.03)",
                  display: "inline-block",
                }}
              >
                Valid until{" "}
                <strong>
                  {new Date(activeModalPromo.end_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 10,
              }}
            >
              {setBookingOpen && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalPromo(null);
                    setBookingOpen(true);
                  }}
                  style={{
                    flex: "1 1 180px",
                    background: `linear-gradient(135deg, ${COLORS.mossGreen}, #4B5A2C)`,
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(96, 110, 61, 0.35)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  Book a Table
                </button>
              )}

              {navigate && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalPromo(null);
                    navigate("menu");
                  }}
                  style={{
                    flex: "1 1 140px",
                    background: "transparent",
                    color: theme.heading,
                    border: `1px solid ${theme.heading}40`,
                    borderRadius: 12,
                    padding: "12px 20px",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                >
                  View Menu
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
