// src/pages/ContactPage.jsx
import React, { useState, useEffect } from "react";
import { MAP_EMBED_SRC, MAP_DIRECTIONS_URL, DELIVEROO_CONFIG, GOOGLE_CONFIG } from "../data/config";
import { FadeIn } from "../components/ui/FadeIn";
import { trackDirectionsClick, trackContactClick } from "../utils/analytics";
import { BookTableButton } from "../components/ui/BookTableButton";
import {
  getOperatingHoursConfig,
  getLiveOperatingStatus,
  getFormattedHoursSummary,
  formatTime12h,
} from "../data/operatingHours";

export function ContactPage({ theme, setBookingOpen }) {
  const [hoursConfig, setHoursConfig] = useState(() => getOperatingHoursConfig());
  const [liveStatus, setLiveStatus] = useState(() => getLiveOperatingStatus(hoursConfig));
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      const cfg = getOperatingHoursConfig();
      setHoursConfig(cfg);
      setLiveStatus(getLiveOperatingStatus(cfg));
    };
    window.addEventListener("tse_operating_hours_updated", handleUpdate);
    const interval = setInterval(() => {
      setLiveStatus(getLiveOperatingStatus(getOperatingHoursConfig()));
    }, 20000);
    return () => {
      window.removeEventListener("tse_operating_hours_updated", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const todayLondonName = new Date().toLocaleDateString("en-GB", { timeZone: "Europe/London", weekday: "long" });
  const summary = getFormattedHoursSummary(hoursConfig.weekly);
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
                {
                  icon: "🕐",
                  label: "Hours",
                  isHours: true,
                  value: `${summary.line1}\n${summary.line2}\n${summary.line3}`,
                },
                { icon: "📞", label: "Phone", value: "+44 (0) 20 3518 8688", href: "tel:+442035188688", type: "phone" },
                { icon: "📧", label: "Email", value: "info@the6thelement.co.uk", href: "mailto:info@the6thelement.co.uk", type: "email" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <div style={{ fontSize: 20, marginTop: 2 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
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

                    {item.isHours ? (
                      <div>
                        {/* Real-time Status Badge */}
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: `${liveStatus.color || "#2ECC71"}15`,
                            border: `1px solid ${liveStatus.color || "#2ECC71"}40`,
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: liveStatus.color || "#2ECC71",
                            }}
                          />
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: liveStatus.color || "#2ECC71",
                            }}
                          >
                            {liveStatus.badge} · {liveStatus.detail}
                          </span>
                        </div>

                        {/* Emergency Notice if Active */}
                        {hoursConfig.emergencyNotice?.enabled && (
                          <div
                            style={{
                              padding: "8px 12px",
                              borderRadius: 8,
                              background:
                                hoursConfig.emergencyNotice.type === "closure"
                                  ? "rgba(231, 76, 60, 0.15)"
                                  : "rgba(230, 126, 34, 0.15)",
                              border: `1px solid ${
                                hoursConfig.emergencyNotice.type === "closure" ? "#E74C3C" : "#E67E22"
                              }`,
                              fontSize: 12,
                              color: theme.heading,
                              marginBottom: 10,
                            }}
                          >
                            <strong>⚠️ {hoursConfig.emergencyNotice.badge || "SPECIAL NOTICE"}:</strong>{" "}
                            {hoursConfig.emergencyNotice.message}
                          </div>
                        )}

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

                        {/* Expandable Schedule Toggle */}
                        <button
                          onClick={() => setShowFullSchedule(!showFullSchedule)}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            color: theme.accent,
                            fontSize: 12,
                            fontWeight: 500,
                            marginTop: 6,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <span>{showFullSchedule ? "Hide Schedule ▴" : "View Day-by-Day Schedule ▾"}</span>
                        </button>

                        {showFullSchedule && (
                          <div
                            style={{
                              marginTop: 12,
                              padding: "12px 14px",
                              borderRadius: 10,
                              background: theme.surfaceAlt,
                              border: `1px solid ${theme.muted}20`,
                              fontSize: 12,
                            }}
                          >
                            <div style={{ fontWeight: 600, color: theme.heading, marginBottom: 8 }}>
                              Full Weekly Trading Hours
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {hoursConfig.weekly.map((d) => {
                                const isToday = d.day === todayLondonName;
                                return (
                                  <div
                                    key={d.day}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      padding: "4px 6px",
                                      borderRadius: 6,
                                      background: isToday ? `${theme.accent}15` : "transparent",
                                      color: isToday ? theme.accent : theme.text,
                                      fontWeight: isToday ? 600 : 300,
                                    }}
                                  >
                                    <span>
                                      {d.day} {isToday && "(Today)"}
                                    </span>
                                    <span>
                                      {d.open ? `${formatTime12h(d.openTime)} – ${formatTime12h(d.closeTime)}` : "Closed"}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {hoursConfig.holidays && hoursConfig.holidays.length > 0 && (
                              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${theme.muted}20` }}>
                                <div style={{ fontWeight: 600, color: theme.heading, marginBottom: 6 }}>
                                  Upcoming Holiday Hours
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  {hoursConfig.holidays.slice(0, 3).map((h) => (
                                    <div
                                      key={h.id || h.date}
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        color: theme.muted,
                                        fontSize: 11,
                                      }}
                                    >
                                      <span>{h.name}</span>
                                      <span>
                                        {h.isClosed ? "Closed" : `${formatTime12h(h.openTime)}–${formatTime12h(h.closeTime)}`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : item.href ? (
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
