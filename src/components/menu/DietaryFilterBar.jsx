// src/components/menu/DietaryFilterBar.jsx
// Interactive dietary and lifestyle filter chips for The Sixth Element menu (Feature: BK-29)
import React from "react";
import { COLORS } from "../../theme/tokens";

export const DIETARY_FILTERS = [
  { id: "all", label: "All Items", icon: "🍽️", description: "Complete menu catalog" },
  { id: "V", label: "Vegetarian", icon: "🌿", description: "Vegetarian and plant-based dishes" },
  { id: "VE", label: "Plant-Based", icon: "🌱", description: "100% plant-based / vegan dishes" },
  { id: "GF", label: "Gluten-Friendly", icon: "🌾", description: "Gluten-free and gluten-friendly options" },
  { id: "HALAL", label: "Halal Friendly", icon: "🌙", description: "Halal-suitable poultry, lamb & preparations" },
];

/**
 * Checks whether a given menu item matches the specified dietary filter.
 */
export function matchesDietaryFilter(item, filterId) {
  if (!filterId || filterId === "all") return true;
  const tags = item?.tags || [];

  if (filterId === "V") {
    // Vegan dishes are inherently vegetarian
    return tags.includes("V") || tags.includes("VE");
  }
  if (filterId === "VE") {
    return tags.includes("VE");
  }
  if (filterId === "GF") {
    return tags.includes("GF") || tags.includes("GF*");
  }
  if (filterId === "HALAL") {
    return tags.includes("HALAL") || tags.includes("H");
  }

  return tags.includes(filterId);
}

/**
 * DietaryFilterBar component
 * Renders interactive, mobile-optimized pill buttons with dynamic count badges.
 */
export function DietaryFilterBar({
  activeFilter = "all",
  onSelectFilter,
  counts = {},
  theme,
  categoryTitle = "menu",
}) {
  const isFiltered = activeFilter !== "all";

  return (
    <div
      style={{
        marginBottom: 36,
        padding: "16px 20px",
        borderRadius: 20,
        background: `${theme.muted}08`,
        border: `1px solid ${theme.muted}18`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
            Dietary & Lifestyle Filters
          </span>
          {isFiltered && (
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 12,
                background: `${COLORS.warmAmber}22`,
                color: COLORS.warmAmber,
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              Filtering Active
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={() => onSelectFilter("all")}
            style={{
              background: "transparent",
              border: "none",
              color: theme.accent,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            ✕ Reset to All
          </button>
        )}
      </div>

      {/* Horizontally scrollable on mobile, wrapping on desktop */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {DIETARY_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          const count = counts[filter.id] ?? 0;
          const isDisabled = filter.id !== "all" && count === 0;

          return (
            <button
              key={filter.id}
              disabled={isDisabled}
              onClick={() => {
                if (isActive && filter.id !== "all") {
                  onSelectFilter("all");
                } else {
                  onSelectFilter(filter.id);
                }
              }}
              title={isDisabled ? `No items in ${categoryTitle} match ${filter.label}` : filter.description}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                minHeight: 44,
                padding: "8px 16px",
                borderRadius: 24,
                border: isActive
                  ? `1.5px solid ${COLORS.mossGreen}`
                  : `1px solid ${theme.muted}25`,
                cursor: isDisabled ? "not-allowed" : "pointer",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                letterSpacing: "0.02em",
                background: isActive
                  ? COLORS.mossGreen
                  : isDisabled
                  ? `${theme.muted}06`
                  : `${theme.muted}12`,
                color: isActive
                  ? "#FAF8F0"
                  : isDisabled
                  ? `${theme.muted}60`
                  : theme.heading,
                opacity: isDisabled ? 0.45 : 1,
                boxShadow: isActive ? "0 4px 14px rgba(96, 110, 61, 0.28)" : "none",
                transition: "all 0.25s ease",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 14 }}>{filter.icon}</span>
              <span>{filter.label}</span>
              {filter.id !== "all" && (
                <span
                  style={{
                    marginLeft: 2,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 10,
                    background: isActive ? "rgba(255, 255, 255, 0.22)" : `${theme.muted}18`,
                    color: isActive ? "#FAF8F0" : theme.muted,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
