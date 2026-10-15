// src/pages/MenuPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { COLORS } from "../theme/tokens";
import { defaultMenuTab } from "../utils/time";
import { useMenu } from "../hooks/useContent";
import { FadeIn } from "../components/ui/FadeIn";
import { PrintMenuModal } from "../components/admin/PrintMenuModal";
import { GroupEnquiryModal } from "../components/features/GroupEnquiryModal";
import { BookTableButton } from "../components/ui/BookTableButton";
import { trackMenuTab, trackDietaryFilter } from "../utils/analytics";
import {
  DietaryFilterBar,
  matchesDietaryFilter,
  DIETARY_FILTERS,
} from "../components/menu/DietaryFilterBar";

/**
 * Returns curated background and accent colors for dietary badges.
 */
function getTagStyle(t, theme) {
  if (t === "COMING SOON") {
    return { bg: `${theme.accent}20`, color: theme.accent, border: `${theme.accent}40` };
  }
  if (t === "HALAL" || t === "H") {
    return { bg: "rgba(74, 124, 143, 0.16)", color: "#3B6E80", border: "rgba(74, 124, 143, 0.3)" };
  }
  if (t === "GF" || t === "GF*") {
    return { bg: `${COLORS.warmAmber}18`, color: COLORS.warmAmber, border: `${COLORS.warmAmber}35` };
  }
  if (t === "VE") {
    return { bg: `${COLORS.mossGreen}22`, color: COLORS.mossGreen, border: `${COLORS.mossGreen}40` };
  }
  return { bg: `${COLORS.mossGreen}15`, color: COLORS.mossGreen, border: `${COLORS.mossGreen}30` };
}

/**
 * Formats price cleanly handling packages, upgrades, and included items.
 */
function formatPriceDisplay(price) {
  if (price === undefined || price === null || price === "" || price === "TBA") return price || "";
  const s = String(price).trim();
  if (s === "Included") return "Included";
  if (s.startsWith("+") || s.startsWith("£")) return s;
  if (s.toLowerCase().includes("free")) return s;
  const num = parseFloat(s);
  if (!isNaN(num)) return `£${s}`;
  return s;
}

/**
 * Returns formatted service hours in one line for the header.
 */
function getServiceHoursDisplay(categoryKey, data) {
  if (categoryKey === "daytime") return "Served 8am - 2PM";
  if (categoryKey === "evening") return "Served 5pm - 10PM";
  if (categoryKey === "festive") return "Served 20 Nov - 31 Dec 2026";
  if (data?.subtitle) {
    const parts = data.subtitle.split("·");
    return parts[0]?.trim() || data.subtitle;
  }
  return "";
}

const FESTIVE_PACKAGES = [
  {
    id: "dinner",
    title: "FESTIVE DINNER",
    price: "£35.95",
    unit: "pp",
    desc: "2–8 guests · 3 Courses",
    matches: (s) => s.package === "dinner" || s.name.toLowerCase().includes("festive dinner"),
  },
  {
    id: "feast",
    title: "CHRISTMAS FEAST",
    price: "£37.95",
    unit: "pp",
    desc: "9+ guests · Sharing table",
    matches: (s) => s.package === "feast" || s.name.toLowerCase().includes("christmas feast") || s.name.toLowerCase().includes("signature feast"),
  },
  {
    id: "brunch",
    title: "FESTIVE BOTTOMLESS BRUNCH",
    price: "£45.00",
    unit: "pp",
    desc: "Fri–Sun · 90m drinks",
    matches: (s) => s.package === "brunch" || s.name.toLowerCase().includes("bottomless brunch"),
  },
  {
    id: "drinks",
    title: "DRINKS & NIBBLES",
    price: "from £20",
    unit: "pp",
    desc: "Office parties (10+)",
    matches: (s) => s.package === "drinks" || s.name.toLowerCase().includes("drinks & nibbles"),
  },
];

export function MenuPage({ theme, flags, setBookingOpen, navigate }) {
  const { menu } = useMenu();
  const tabs = Object.keys(menu).map((id) => ({ id, label: menu[id].title || id, icon: menu[id].icon || "" }));
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const hash = window.location.hash || "";
      if (hash.includes("festive") || hash.includes("christmas")) return "festive";
      if (hash.includes("evening")) return "evening";
      if (hash.includes("daytime")) return "daytime";
      const q = new URLSearchParams(window.location.search).get("tab");
      if (q && ["daytime", "evening", "festive"].includes(q)) return q;
    } catch {}
    return defaultMenuTab(flags);
  });
  const [activeDietFilter, setActiveDietFilter] = useState("all");
  const [selectedFestivePackage, setSelectedFestivePackage] = useState("dinner");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [groupEnquiryOpen, setGroupEnquiryOpen] = useState(false);

  useEffect(() => {
    // Only auto-override if the user isn't currently viewing the festive menu
    if (activeTab !== "festive") {
      setActiveTab(defaultMenuTab(flags));
    }
  }, [flags?.menu_evening_hour]);

  const current = tabs.some((t) => t.id === activeTab) && menu[activeTab] ? activeTab : tabs[0]?.id || "";
  const data = menu[current] || { title: "", subtitle: "", icon: "", sections: [] };
  const rawSections = data.sections || [];

  // Filter sections by active festive package when viewing the Festive tab (Default: Festive Dinner)
  const festiveFilteredSections = useMemo(() => {
    if (current !== "festive") return rawSections;
    const pkg = FESTIVE_PACKAGES.find((p) => p.id === selectedFestivePackage);
    if (!pkg) return rawSections;
    return rawSections.filter((section) => pkg.matches(section));
  }, [rawSections, current, selectedFestivePackage]);

  const activeBaseSections = current === "festive" ? festiveFilteredSections : rawSections;

  // Compute live item counts for all dietary filter chips within the current category tab
  const filterCounts = useMemo(() => {
    const allItems = activeBaseSections.flatMap((s) => s.items || []);
    return {
      all: allItems.length,
      V: allItems.filter((i) => matchesDietaryFilter(i, "V")).length,
      VE: allItems.filter((i) => matchesDietaryFilter(i, "VE")).length,
      GF: allItems.filter((i) => matchesDietaryFilter(i, "GF")).length,
      HALAL: allItems.filter((i) => matchesDietaryFilter(i, "HALAL")).length,
    };
  }, [activeBaseSections]);

  // Option A: Filter / Hide non-matching dishes and empty section headers
  const displaySections = useMemo(() => {
    if (activeDietFilter === "all") return activeBaseSections;
    return activeBaseSections
      .map((section) => ({
        ...section,
        items: (section.items || []).filter((item) =>
          matchesDietaryFilter(item, activeDietFilter)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [activeBaseSections, activeDietFilter]);

  const handleDietFilterChange = (filterId) => {
    setActiveDietFilter(filterId);
    trackDietaryFilter(filterId, current);
  };

  const totalFilteredDishes = displaySections.reduce(
    (acc, sec) => acc + (sec.items?.length || 0),
    0
  );

  const activeFilterMeta = DIETARY_FILTERS.find((f) => f.id === activeDietFilter);

  return (
    <div style={{ paddingTop: 120, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
        {/* Page Top Header - Consistent with Social Impact, Our Story, and Contact Us */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: theme.muted,
                marginBottom: 12,
              }}
            >
              Our Menu
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 400,
                color: theme.heading,
                margin: 0,
              }}
            >
              Inspired by the five elements
            </h1>
          </div>
        </FadeIn>

        {/* Unified Top Control Bar: Left = Tabs & Print Menu, Right = Dietary & Lifestyle Filters */}
        <FadeIn delay={0.1}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 20,
              background: `${theme.muted}06`,
              border: `1px solid ${theme.muted}15`,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {/* Left: Daytime, Evening, Festive Menu, Print Menu */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    trackMenuTab(tab.id);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 38,
                    padding: "7px 16px",
                    borderRadius: 24,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12.5,
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                    background: current === tab.id ? theme.accent : `${theme.muted}14`,
                    color: current === tab.id ? "#fff" : theme.text,
                    transition: "all 0.25s ease",
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}

              <button
                onClick={() => setShowPrintModal(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 38,
                  padding: "7px 14px",
                  borderRadius: 24,
                  border: `1.5px solid ${theme.accent}45`,
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  background: `${theme.accent}14`,
                  color: theme.heading,
                  transition: "all 0.25s ease",
                  gap: 6,
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                  whiteSpace: "nowrap",
                }}
                title="Generate print-ready physical A4/A5 PDF menu for table service"
              >
                🖨️ Print Menu
              </button>
            </div>

            {/* Right: Dietary & Lifestyle Filters */}
            {rawSections.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <DietaryFilterBar
                  inline={true}
                  activeFilter={activeDietFilter}
                  onSelectFilter={handleDietFilterChange}
                  counts={filterCounts}
                  theme={theme}
                  categoryTitle={data.title}
                />
              </div>
            )}
          </div>
        </FadeIn>

        {/* Menu Content */}
        <div key={current}>
          <FadeIn>
            <div style={{ textAlign: "center", margin: "14px 0 16px" }}>
              {/* One-Line Heading: Logo - Daytime - Served 8am - 2PM */}
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(20px, 3.2vw, 26px)",
                  fontWeight: 600,
                  color: theme.heading,
                  margin: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  letterSpacing: "0.02em",
                }}
              >
                <span>{data.icon}</span>
                <span style={{ color: theme.muted, opacity: 0.5 }}>-</span>
                <span>{data.title}</span>
                <span style={{ color: theme.muted, opacity: 0.5 }}>-</span>
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: theme.muted,
                    letterSpacing: "0.03em",
                  }}
                >
                  {getServiceHoursDisplay(current, data)}
                </span>
              </h2>

              {/* Special Festive Experience Hero Banner */}
              {current === "festive" && (
                <div
                  style={{
                    maxWidth: 820,
                    margin: "12px auto 14px",
                    background: `linear-gradient(135deg, ${COLORS.warmAmber}16, ${COLORS.mossGreen}12)`,
                    border: `1.5px solid ${COLORS.warmAmber}50`,
                    borderRadius: 14,
                    padding: "12px 18px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: `${COLORS.warmAmber}22`,
                      border: `1px solid ${COLORS.warmAmber}60`,
                      padding: "4px 12px",
                      borderRadius: 30,
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: COLORS.warmAmber,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    <span>🥂 Early Reservation Perk</span>
                  </div>
                  <p
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.5,
                      color: theme.heading,
                      fontWeight: 500,
                      margin: "0 0 10px",
                    }}
                  >
                    Book by <strong>31st October</strong> and enjoy a complimentary glass of chilled Prosecco for every guest on Festive Dinner &amp; Christmas Feast bookings.
                  </p>

                  {/* Selectable Festive Package Cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: 8,
                      marginBottom: 12,
                      textAlign: "left",
                    }}
                    role="tablist"
                    aria-label="Festive Dining Packages"
                  >
                    {FESTIVE_PACKAGES.map((pkg) => {
                      const isSelected = selectedFestivePackage === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          aria-label={`${pkg.title} · ${pkg.price} ${pkg.unit} · ${pkg.desc}`}
                          onClick={() => setSelectedFestivePackage(pkg.id)}
                          style={{
                            background: isSelected
                              ? (theme.surfaceAlt ? `${COLORS.warmAmber}16` : "rgba(191, 138, 47, 0.12)")
                              : (theme.surfaceAlt || "#FFFFFF"),
                            border: isSelected
                              ? `2px solid ${COLORS.warmAmber}`
                              : `1px solid ${COLORS.warmAmber}30`,
                            borderRadius: 8,
                            padding: "8px 10px",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: isSelected
                              ? `0 3px 12px ${COLORS.warmAmber}35`
                              : "none",
                            transform: isSelected ? "translateY(-1px)" : "none",
                            display: "block",
                            width: "100%",
                            fontFamily: "inherit",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: 9.5, fontWeight: 700, color: COLORS.warmAmber, letterSpacing: "0.05em" }}>
                              {pkg.title}
                            </div>
                            {isSelected && (
                              <span style={{ fontSize: 9, color: COLORS.warmAmber, fontWeight: 700, letterSpacing: "0.04em" }}>
                                ● Active
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: theme.heading, marginTop: 2 }}>
                            {pkg.price} <span style={{ fontSize: 10, fontWeight: 400, color: theme.muted }}>{pkg.unit}</span>
                          </div>
                          <div style={{ fontSize: 10.5, color: isSelected ? theme.heading : theme.muted, marginTop: 1 }}>
                            {pkg.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Direct Action Buttons */}
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
                    {setBookingOpen && (
                      <BookTableButton
                        onClick={() => setBookingOpen(true)}
                        theme={theme}
                        size="sm"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setGroupEnquiryOpen(true)}
                      style={{
                        background: "transparent",
                        color: theme.heading,
                        border: `1.5px solid ${COLORS.warmAmber}`,
                        borderRadius: 20,
                        padding: "7px 15px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      <span>Group &amp; Office Enquiry</span>
                      <span>✉</span>
                    </button>
                    {navigate && (
                      <button
                        type="button"
                        onClick={() => navigate("events")}
                        style={{
                          background: `${COLORS.warmAmber}15`,
                          color: theme.heading,
                          border: `1px solid ${COLORS.warmAmber}35`,
                          borderRadius: 20,
                          padding: "7px 14px",
                          fontSize: 11.5,
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        <span>Events Hub</span>
                        <span>✦</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Active Filter Notification Banner */}
          {activeDietFilter !== "all" && displaySections.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 14px",
                borderRadius: 12,
                background: `${COLORS.mossGreen}12`,
                border: `1px solid ${COLORS.mossGreen}35`,
                marginBottom: 16,
                fontSize: 12.5,
                color: theme.heading,
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15 }}>{activeFilterMeta?.icon}</span>
                <span>
                  Showing <strong>{totalFilteredDishes}</strong>{" "}
                  {activeFilterMeta?.label} dishes in {data.title}
                </span>
              </div>
              <button
                onClick={() => handleDietFilterChange("all")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: theme.accent,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 11.5,
                  padding: "3px 6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Show All Dishes ✕
              </button>
            </div>
          )}

          {displaySections.map((section, si) => (
            <FadeIn key={section.name} delay={si * 0.06}>
              <div style={{ marginBottom: 26 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: "4px 12px",
                    marginBottom: 8,
                    paddingBottom: 6,
                    borderBottom: `1px solid ${theme.muted}20`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 11.5,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: theme.accent,
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {section.name}
                  </h3>
                  {section.subtitle && (
                    <span
                      style={{
                        fontSize: 11,
                        color: theme.muted,
                        fontStyle: "italic",
                        fontWeight: 400,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {section.subtitle}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {section.items.map((item, ii) => (
                    <FadeIn key={item.name} delay={ii * 0.03}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          padding: "8px 0",
                          borderBottom: ii < section.items.length - 1 ? `1px solid ${theme.muted}10` : "none",
                          transition: "all 0.25s ease",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                            <span style={{ fontSize: 15, fontWeight: 500, color: theme.heading, marginRight: 6 }}>
                              {item.name}
                            </span>
                            {item.tags.map((t) => {
                              const badgeStyle = getTagStyle(t, theme);
                              return (
                                <span
                                  key={t}
                                  className="menu-tag"
                                  style={{
                                    background: badgeStyle.bg,
                                    color: badgeStyle.color,
                                    border: `1px solid ${badgeStyle.border}`,
                                    borderRadius: 5,
                                    padding: "1px 6px",
                                    fontSize: 9.5,
                                    fontWeight: 600,
                                    letterSpacing: "0.04em",
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {t}
                                </span>
                              );
                            })}
                          </div>
                          {item.desc && (
                            <p
                              style={{
                                fontSize: 12.5,
                                color: theme.muted,
                                fontWeight: 300,
                                marginTop: 2,
                                lineHeight: 1.35,
                              }}
                            >
                              {item.desc}
                            </p>
                          )}
                        </div>
                        {formatPriceDisplay(item.price) ? (
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: theme.accent,
                              marginLeft: 16,
                              whiteSpace: "nowrap",
                              fontFamily: "'Cormorant Garamond', serif",
                            }}
                          >
                            {formatPriceDisplay(item.price)}
                          </div>
                        ) : null}
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Option A Empty State when filter yields 0 items */}
          {rawSections.length > 0 && displaySections.length === 0 && (
            <FadeIn>
              <div
                style={{
                  textAlign: "center",
                  padding: "54px 24px",
                  borderRadius: 20,
                  background: `${theme.muted}08`,
                  border: `1px solid ${theme.muted}18`,
                  margin: "24px 0 48px",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>
                  {activeFilterMeta?.icon || "🍽️"}
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 26,
                    fontWeight: 400,
                    color: theme.heading,
                    marginBottom: 8,
                  }}
                >
                  No strictly tagged {activeFilterMeta?.label} items in {data.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: theme.muted,
                    maxWidth: 460,
                    margin: "0 auto 24px",
                    lineHeight: 1.6,
                    fontWeight: 300,
                  }}
                >
                  Our kitchen prepares dishes fresh to order and can adapt several recipes to your dietary needs upon request. Speak with your server or add a note when booking.
                </p>
                <button
                  onClick={() => handleDietFilterChange("all")}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 30,
                    background: theme.accent,
                    color: "#FAF8F0",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: `0 4px 14px ${theme.accent}30`,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  View All {data.title} Dishes
                </button>
              </div>
            </FadeIn>
          )}

          {rawSections.length === 0 && (
            <FadeIn>
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  borderRadius: 16,
                  background: theme.surfaceAlt,
                  border: `1px solid ${theme.muted}15`,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{data.icon}</div>
                <div style={{ fontSize: 15, color: theme.heading, fontWeight: 500 }}>Coming soon</div>
                <div style={{ fontSize: 13, color: theme.muted, fontWeight: 300, marginTop: 6 }}>
                  This menu is being finalised — check back shortly.
                </div>
              </div>
            </FadeIn>
          )}
        </div>

        <FadeIn>
          <div
            style={{
              textAlign: "center",
              padding: "40px 0 80px",
              fontSize: 13,
              color: theme.muted,
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            <p>(V) Vegetarian · (VE) Vegan · (GF) Gluten Free · (*) available on request</p>
            <p style={{ marginTop: 8 }}>Please inform our team of any allergies or dietary requirements. All prices include VAT.</p>
          </div>
        </FadeIn>
      </div>

      {/* 1-Click Print Menu Modal (BK-23) */}
      {showPrintModal && (
        <PrintMenuModal
          theme={theme}
          menuData={menu}
          initialCategory={current}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Group & Office Enquiry Dialog */}
      {groupEnquiryOpen && (
        <GroupEnquiryModal
          isOpen={groupEnquiryOpen}
          onClose={() => setGroupEnquiryOpen(false)}
          theme={theme}
          defaultPackage="Festive Dinner"
        />
      )}
    </div>
  );
}
