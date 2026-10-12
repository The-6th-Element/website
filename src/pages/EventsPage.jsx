// src/pages/EventsPage.jsx
// Dedicated master-detail Events & Celebrations page for The Sixth Element
import React, { useState, useEffect } from "react";
import { COLORS } from "../theme/tokens";
import { useEvents } from "../hooks/useContent";
import { GroupEnquiryModal } from "../components/features/GroupEnquiryModal";

export function EventsPage({ theme, setBookingOpen, initialEventId = "christmas-2026" }) {
  const { events } = useEvents();
  const currentList = events && events.length > 0 ? events : [];

  const [selectedEventId, setSelectedEventId] = useState(() => {
    // Check if URL hash has an event id e.g. #events/diwali-2026 or ?event=diwali-2026
    try {
      const hash = window.location.hash || "";
      const match = hash.match(/#events\/([a-zA-Z0-9_-]+)/);
      if (match) {
        return match[1];
      }
      const params = new URLSearchParams(window.location.search);
      const q = params.get("event");
      if (q) {
        return q;
      }
    } catch {}
    return initialEventId;
  });

  const [groupEnquiryOpen, setGroupEnquiryOpen] = useState(false);

  // Sync hash when event selection changes
  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    try {
      window.history.replaceState(null, null, `/#events/${id}`);
    } catch {}
  };

  const selectedEvent =
    currentList.find((e) => e.id === selectedEventId) || currentList[0] || {};

  return (
    <div
      style={{
        paddingTop: "calc(90px + env(safe-area-inset-top, 0px))",
        paddingBottom: 80,
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Page Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: COLORS.warmAmber,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Curated Gatherings & Seasonal Celebrations
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(34px, 5vw, 48px)",
              fontWeight: 700,
              color: theme.heading,
              lineHeight: 1.15,
              margin: "0 0 12px",
            }}
          >
            Events & Festive Experiences
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: theme.muted,
              maxWidth: 620,
              margin: "0 auto",
              fontWeight: 300,
            }}
          >
            From candlelit seasonal feasts and regional Diwali banquets to intimate natural wine masterclasses and live jazz mornings — discover our calendar of memorable gatherings in East Sheen.
          </p>
        </div>

        {/* Master-Detail Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 320px) 1fr",
            gap: 28,
            alignItems: "start",
          }}
          className="events-grid-layout"
        >
          {/* LEFT SIDEBAR: Events Directory */}
          <aside
            style={{
              background: theme.surfaceAlt || "#FFFFFF",
              border: `1px solid ${COLORS.warmAmber}35`,
              borderRadius: 18,
              padding: "16px 14px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              position: "sticky",
              top: 100,
            }}
            className="events-sidebar"
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: theme.heading,
                padding: "4px 8px 12px",
                borderBottom: `1px solid ${COLORS.warmAmber}25`,
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Current & Upcoming</span>
              <span
                style={{
                  fontSize: 10,
                  background: `${COLORS.warmAmber}20`,
                  color: COLORS.warmAmber,
                  padding: "2px 7px",
                  borderRadius: 10,
                }}
              >
                {currentList.length} Events
              </span>
            </div>

            <nav
              aria-label="Events list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {currentList.map((event) => {
                const isSelected = event.id === selectedEvent.id;
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => handleSelectEvent(event.id)}
                    style={{
                      textAlign: "left",
                      background: isSelected
                        ? `${COLORS.warmAmber}16`
                        : "transparent",
                      border: isSelected
                        ? `1.5px solid ${COLORS.warmAmber}`
                        : "1.5px solid transparent",
                      borderRadius: 12,
                      padding: "12px 14px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: isSelected
                            ? COLORS.warmAmber
                            : event.badgeColor || theme.muted,
                          background: `${event.badgeColor || COLORS.warmAmber}18`,
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {event.badge}
                      </span>
                      {isSelected && (
                        <span
                          style={{
                            color: COLORS.warmAmber,
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          ›
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 16.5,
                        fontWeight: isSelected ? 700 : 600,
                        color: isSelected ? theme.heading : theme.text,
                        lineHeight: 1.25,
                        marginBottom: 3,
                      }}
                    >
                      {event.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: theme.muted,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span>📅</span>
                      <span>{event.dateDisplay.split("·")[0]}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* RIGHT VIEW: Selected Event Details */}
          <main
            style={{
              background: theme.surfaceAlt || "#FFFFFF",
              border: `1px solid ${COLORS.warmAmber}40`,
              borderRadius: 20,
              padding: "clamp(22px, 4vw, 36px)",
              boxShadow: "0 15px 45px rgba(0,0,0,0.08)",
            }}
            aria-live="polite"
          >
            {/* Event Header Flourish */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    background: `${selectedEvent.badgeColor || COLORS.warmAmber}18`,
                    color: selectedEvent.badgeColor || COLORS.warmAmber,
                    border: `1px solid ${selectedEvent.badgeColor || COLORS.warmAmber}50`,
                    padding: "3px 10px",
                    borderRadius: 20,
                  }}
                >
                  {selectedEvent.badge}
                </span>
                <span style={{ fontSize: 11, color: COLORS.warmAmber }}>
                  ✦ ✧ ✦
                </span>
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: theme.muted,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>⏰ {selectedEvent.timing}</span>
              </div>
            </div>

            {/* Event Title & Subtitle */}
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(26px, 3.8vw, 38px)",
                fontWeight: 700,
                color: theme.heading,
                lineHeight: 1.2,
                margin: "0 0 6px",
              }}
            >
              {selectedEvent.title}
            </h2>

            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(16px, 2.2vw, 20px)",
                fontStyle: "italic",
                color: COLORS.warmAmber,
                marginBottom: 16,
              }}
            >
              {selectedEvent.subtitle}
            </div>

            {/* Date Window Callout Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(191, 138, 47, 0.08)",
                border: `1px solid ${COLORS.warmAmber}40`,
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                color: theme.heading,
                marginBottom: 20,
              }}
            >
              <span>📅 Event Dates:</span>
              <span>{selectedEvent.dateDisplay}</span>
            </div>

            {/* Rich Narrative Description */}
            <p
              style={{
                fontSize: 14.5,
                lineHeight: 1.7,
                color: theme.text,
                marginBottom: 22,
                fontWeight: 300,
              }}
            >
              {selectedEvent.description}
            </p>

            {/* Early Bird Callout (if available) */}
            {selectedEvent.earlyBird && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(191, 138, 47, 0.14), rgba(96, 110, 61, 0.12))",
                  border: `1px solid ${COLORS.warmAmber}70`,
                  borderRadius: 14,
                  padding: "14px 18px",
                  marginBottom: 26,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 24, lineHeight: 1 }}>🥂</div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: COLORS.warmAmber,
                      marginBottom: 2,
                    }}
                  >
                    Early Reservation Perk
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: theme.heading,
                      fontWeight: 500,
                    }}
                  >
                    {selectedEvent.earlyBird}
                  </div>
                </div>
              </div>
            )}

            {/* Offers & Packages Section */}
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                  paddingBottom: 6,
                  borderBottom: `1px solid ${COLORS.warmAmber}30`,
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: theme.heading,
                    margin: 0,
                  }}
                >
                  Offers & Packages
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    color: theme.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {selectedEvent.offers.length} Options
                </span>
              </div>

              {/* Packages Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    selectedEvent.offers.length > 2
                      ? "repeat(auto-fit, minmax(230px, 1fr))"
                      : "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 12,
                }}
              >
                {selectedEvent.offers.map((pkg, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: theme.bg,
                      border: `1px solid ${COLORS.warmAmber}35`,
                      borderRadius: 12,
                      padding: "14px 16px",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s ease, border-color 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 4,
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 17,
                          fontWeight: 700,
                          color: theme.heading,
                          margin: 0,
                        }}
                      >
                        {pkg.name}
                      </h4>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: COLORS.mossGreen,
                          background: `${COLORS.mossGreen}18`,
                          padding: "2px 6px",
                          borderRadius: 6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pkg.guests}
                      </span>
                    </div>

                    <div
                      style={{
                        margin: "6px 0 8px",
                        display: "flex",
                        alignItems: "baseline",
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 24,
                          fontWeight: 700,
                          color: COLORS.warmAmber,
                        }}
                      >
                        {pkg.price}
                      </span>
                      {pkg.unit && (
                        <span
                          style={{
                            fontSize: 11.5,
                            color: theme.muted,
                            fontWeight: 500,
                          }}
                        >
                          {pkg.unit}
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: 12,
                        lineHeight: 1.45,
                        color: theme.text,
                        margin: "0 0 8px",
                        flex: 1,
                      }}
                    >
                      {pkg.description}
                    </p>

                    {pkg.extra && (
                      <div
                        style={{
                          fontSize: 10.5,
                          fontStyle: "italic",
                          color: COLORS.warmAmber,
                          borderTop: `1px dashed ${COLORS.warmAmber}30`,
                          paddingTop: 6,
                          marginTop: "auto",
                        }}
                      >
                        {pkg.extra}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Service & Booking Terms Banner */}
            {selectedEvent.terms && (
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.02)",
                  border: `1px dashed ${COLORS.warmAmber}40`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 11.5,
                  lineHeight: 1.5,
                  color: theme.muted,
                  marginBottom: 24,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: COLORS.warmAmber,
                    marginBottom: 2,
                  }}
                >
                  Booking Guidelines & Dietary Accreditations
                </div>
                <div>{selectedEvent.terms}</div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                style={{
                  flex: "1 1 200px",
                  background: `linear-gradient(135deg, ${COLORS.mossGreen}, #4A562B)`,
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 24px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(96, 110, 61, 0.35)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s ease",
                }}
              >
                <span>Book Table</span>
                <span>›</span>
              </button>

              {selectedEvent.hasGroupEnquiry && (
                <button
                  type="button"
                  onClick={() => setGroupEnquiryOpen(true)}
                  style={{
                    flex: "1 1 180px",
                    background: "transparent",
                    color: theme.heading,
                    border: `1.5px solid ${COLORS.warmAmber}`,
                    borderRadius: 12,
                    padding: "13px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <span>Group & Private Enquiry</span>
                  <span>✉</span>
                </button>
              )}

              <a
                href="tel:+442035188688"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12.5,
                  color: theme.muted,
                  textDecoration: "none",
                  padding: "10px 14px",
                }}
              >
                <span>Questions?</span>
                <strong style={{ color: theme.heading }}>+44 20 3518 8688</strong>
              </a>
            </div>
          </main>
        </div>
      </div>

      {/* Group Enquiry Dialog */}
      {groupEnquiryOpen && (
        <GroupEnquiryModal
          isOpen={groupEnquiryOpen}
          onClose={() => setGroupEnquiryOpen(false)}
          theme={theme}
          defaultPackage={
            selectedEvent.offers[0] ? selectedEvent.offers[0].name : undefined
          }
        />
      )}

      {/* Responsive Layout Styles */}
      <style>{`
        @media (max-width: 768px) {
          .events-grid-layout {
            grid-template-columns: 1fr !important;
          }
          .events-sidebar {
            position: static !important;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
}
