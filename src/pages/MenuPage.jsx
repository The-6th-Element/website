// src/pages/MenuPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { COLORS } from "../theme/tokens";
import { defaultMenuTab } from "../utils/time";
import { useMenu } from "../hooks/useContent";
import { FadeIn } from "../components/ui/FadeIn";
import { PrintMenuModal } from "../components/admin/PrintMenuModal";
import { trackMenuTab, trackDietaryFilter } from "../utils/analytics";
import {
  DietaryFilterBar,
  matchesDietaryFilter,
  DIETARY_FILTERS,
} from "../components/menu/DietaryFilterBar";
import { useItemAvailability } from "../hooks/useItemAvailability";

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

export function MenuPage({ theme, flags, onOpenStudio }) {
  const { menu } = useMenu();
  const { isSoldOut } = useItemAvailability();
  const tabs = Object.keys(menu).map((id) => ({ id, label: menu[id].title || id, icon: menu[id].icon || "" }));
  const [activeTab, setActiveTab] = useState(() => defaultMenuTab(flags));
  const [activeDietFilter, setActiveDietFilter] = useState("all");
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    setActiveTab(defaultMenuTab(flags));
  }, [flags?.menu_evening_hour]);

  const current = tabs.some((t) => t.id === activeTab) && menu[activeTab] ? activeTab : tabs[0]?.id || "";
  const data = menu[current] || { title: "", subtitle: "", icon: "", sections: [] };
  const rawSections = data.sections || [];

  // Compute live item counts for all dietary filter chips within the current category tab
  const filterCounts = useMemo(() => {
    const allItems = rawSections.flatMap((s) => s.items || []);
    return {
      all: allItems.length,
      V: allItems.filter((i) => matchesDietaryFilter(i, "V")).length,
      VE: allItems.filter((i) => matchesDietaryFilter(i, "VE")).length,
      GF: allItems.filter((i) => matchesDietaryFilter(i, "GF")).length,
      HALAL: allItems.filter((i) => matchesDietaryFilter(i, "HALAL")).length,
    };
  }, [rawSections]);

  // Option A: Filter / Hide non-matching dishes and empty section headers
  const displaySections = useMemo(() => {
    if (activeDietFilter === "all") return rawSections;
    return rawSections
      .map((section) => ({
        ...section,
        items: (section.items || []).filter((item) =>
          matchesDietaryFilter(item, activeDietFilter)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [rawSections, activeDietFilter]);

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
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
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
              Our Menu
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 400,
                color: theme.heading,
              }}
            >
              Day to Night
            </h1>
          </div>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={0.1}>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginBottom: 32,
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
                  minHeight: 44,
                  padding: "10px 20px",
                  borderRadius: 30,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  background: current === tab.id ? theme.accent : `${theme.muted}15`,
                  color: current === tab.id ? "#fff" : theme.text,
                  transition: "all 0.3s ease",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}

            {/* 1-Click Print / PDF Menu button (BK-23) */}
            <button
              onClick={() => setShowPrintModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                padding: "10px 18px",
                borderRadius: 30,
                border: `1.5px solid ${theme.accent}50`,
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.02em",
                background: `${theme.accent}16`,
                color: theme.heading,
                transition: "all 0.3s ease",
                gap: 6,
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
              title="Generate print-ready physical A4/A5 PDF menu for table service"
            >
              🖨️ Print / PDF Menu
            </button>
          </div>
        </FadeIn>

        {/* Interactive Dietary & Lifestyle Filter Chips (BK-29) */}
        {rawSections.length > 0 && (
          <FadeIn delay={0.15}>
            <DietaryFilterBar
              activeFilter={activeDietFilter}
              onSelectFilter={handleDietFilterChange}
              counts={filterCounts}
              theme={theme}
              categoryTitle={data.title}
            />
          </FadeIn>
        )}

        {/* Menu Content */}
        <div key={current}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 32 }}>{data.icon}</div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 32,
                  fontWeight: 400,
                  color: theme.heading,
                  marginTop: 8,
                }}
              >
                {data.title}
              </h2>
              <p style={{ fontSize: 14, color: theme.muted, fontWeight: 300, marginTop: 8 }}>{data.subtitle}</p>
            </div>
          </FadeIn>

          {/* Active Filter Notification Banner */}
          {activeDietFilter !== "all" && displaySections.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 18px",
                borderRadius: 14,
                background: `${COLORS.mossGreen}12`,
                border: `1px solid ${COLORS.mossGreen}35`,
                marginBottom: 36,
                fontSize: 13,
                color: theme.heading,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{activeFilterMeta?.icon}</span>
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
                  fontSize: 12,
                  padding: "4px 8px",
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
            <FadeIn key={section.name} delay={si * 0.08}>
              <div style={{ marginBottom: 48 }}>
                <h3
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: theme.accent,
                    marginBottom: 20,
                    fontWeight: 600,
                    paddingBottom: 8,
                    borderBottom: `1px solid ${theme.muted}20`,
                  }}
                >
                  {section.name}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {section.items.map((item, ii) => {
                    const soldOut = isSoldOut(item.name);
                    return (
                      <FadeIn key={item.name} delay={ii * 0.04}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            padding: "16px 0",
                            borderBottom: ii < section.items.length - 1 ? `1px solid ${theme.muted}10` : "none",
                            opacity: soldOut ? 0.58 : 1,
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                              <span
                                style={{
                                  fontSize: 16,
                                  fontWeight: 500,
                                  color: theme.heading,
                                  marginRight: 4,
                                  textDecoration: soldOut ? "line-through" : "none",
                                }}
                              >
                                {item.name}
                              </span>
                              {soldOut && (
                                <span
                                  className="sold-out-badge"
                                  style={{
                                    background: "rgba(197, 48, 48, 0.12)",
                                    color: "#C53030",
                                    border: "1px solid rgba(197, 48, 48, 0.35)",
                                    borderRadius: 6,
                                    padding: "2px 7px",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  🔴 Sold Out Today
                                </span>
                              )}
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
                                      borderRadius: 6,
                                      padding: "2px 7px",
                                      fontSize: 10,
                                      fontWeight: 600,
                                      letterSpacing: "0.05em",
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
                                  fontSize: 13,
                                  color: theme.muted,
                                  fontWeight: 300,
                                  marginTop: 4,
                                  lineHeight: 1.5,
                                }}
                              >
                                {item.desc}
                              </p>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 500,
                              color: soldOut ? theme.muted : theme.accent,
                              textDecoration: soldOut ? "line-through" : "none",
                              marginLeft: 20,
                              whiteSpace: "nowrap",
                              fontFamily: "'Cormorant Garamond', serif",
                            }}
                          >
                            {item.price === "TBA" ? "TBA" : `£${item.price}`}
                          </div>
                        </div>
                      </FadeIn>
                    );
                  })}
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
            {onOpenStudio && (
              <div style={{ marginTop: 24 }}>
                <button
                  onClick={onOpenStudio}
                  style={{
                    background: "none",
                    border: `1px dashed ${theme.muted}40`,
                    borderRadius: 20,
                    padding: "8px 18px",
                    fontSize: 12,
                    color: theme.muted,
                    cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.warmAmber;
                    e.currentTarget.style.color = COLORS.warmAmber;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${theme.muted}40`;
                    e.currentTarget.style.color = theme.muted;
                  }}
                >
                  <span>📊</span>
                  <span>Open Menu Studio (Edit on Screen or CSV Spreadsheet)</span>
                </button>
              </div>
            )}
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
    </div>
  );
}
