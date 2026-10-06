// src/components/admin/ItemAvailabilityManager.jsx
// Kitchen & Floor Availability Manager for 86ing Sold Out Dishes (Feature: BK-12)
import React, { useState, useMemo } from "react";
import { COLORS } from "../../theme/tokens";
import { useMenu } from "../../hooks/useContent";
import { useItemAvailability } from "../../hooks/useItemAvailability";

export function ItemAvailabilityManager({ theme }) {
  const { menu } = useMenu();
  const {
    soldOutItems,
    soldOutCount,
    isSoldOut,
    toggleSoldOut,
    resetAllAvailable,
  } = useItemAvailability();

  const [activeCategory, setActiveCategory] = useState("all"); // "all", "daytime", "evening"
  const [searchQuery, setSearchQuery] = useState("");
  const [resetConfirm, setResetConfirm] = useState(false);

  // Flatten items for listing and fast searching
  const allDishes = useMemo(() => {
    const list = [];
    const categories = ["daytime", "evening"];

    for (const catKey of categories) {
      const cat = menu[catKey];
      if (!cat) continue;
      for (const sec of cat.sections || []) {
        for (const item of sec.items || []) {
          list.push({
            ...item,
            categoryKey: catKey,
            categoryTitle: cat.title || catKey,
            categoryIcon: cat.icon || "",
            sectionName: sec.name || "General",
          });
        }
      }
    }
    return list;
  }, [menu]);

  // Filter dishes by selected category and search query
  const filteredDishes = useMemo(() => {
    return allDishes.filter((dish) => {
      if (activeCategory !== "all" && dish.categoryKey !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = dish.name.toLowerCase().includes(q);
        const matchSec = dish.sectionName.toLowerCase().includes(q);
        const matchDesc = (dish.desc || "").toLowerCase().includes(q);
        if (!matchName && !matchSec && !matchDesc) return false;
      }
      return true;
    });
  }, [allDishes, activeCategory, searchQuery]);

  const handleResetClick = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
    } else {
      resetAllAvailable();
      setResetConfirm(false);
    }
  };

  return (
    <div
      style={{
        background: theme.surface,
        borderRadius: 20,
        padding: "28px 24px",
        border: `1px solid ${theme.muted}25`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: `1px solid ${theme.muted}18`,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26,
                fontWeight: 500,
                color: theme.heading,
                margin: 0,
              }}
            >
              86 / Item Availability Manager
            </h2>
            <span
              style={{
                background: soldOutCount > 0 ? "rgba(197, 48, 48, 0.14)" : `${COLORS.mossGreen}20`,
                color: soldOutCount > 0 ? "#C53030" : COLORS.mossGreen,
                border: `1px solid ${soldOutCount > 0 ? "rgba(197, 48, 48, 0.3)" : `${COLORS.mossGreen}40`}`,
                padding: "3px 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.03em",
              }}
            >
              {soldOutCount > 0 ? `🔴 ${soldOutCount} Sold Out Today` : "🟢 All Items Available"}
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: theme.muted,
              marginTop: 6,
              marginBottom: 0,
              fontWeight: 300,
              maxWidth: 580,
            }}
          >
            Instantly toggle dishes out of stock during service. Changes reflect on the guest-facing
            menu immediately with luxury badging and strike-through pricing.
          </p>
        </div>

        {/* Action Button: Reset All */}
        {soldOutCount > 0 && (
          <button
            onClick={handleResetClick}
            style={{
              background: resetConfirm ? "#C53030" : "transparent",
              color: resetConfirm ? "#FFFFFF" : theme.accent,
              border: `1px solid ${resetConfirm ? "#C53030" : `${theme.accent}60`}`,
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {resetConfirm ? "⚠️ Confirm Reset All to Available?" : "🔄 Reset All to Available"}
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {/* Category Pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All Menus" },
            { id: "daytime", label: "☀️ Daytime Brunch" },
            { id: "evening", label: "🌙 Evening Plates" },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: isActive ? theme.accent : `${theme.muted}12`,
                  color: isActive ? "#FFFFFF" : theme.heading,
                  border: "none",
                  borderRadius: 20,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: "relative", minWidth: 240 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish or section..."
            style={{
              width: "100%",
              padding: "8px 14px 8px 32px",
              borderRadius: 10,
              border: `1px solid ${theme.muted}25`,
              background: theme.surfaceAlt || "#FFFFFF",
              color: theme.heading,
              fontSize: 13,
              fontFamily: "'Outfit', sans-serif",
              outline: "none",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 12,
              color: theme.muted,
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                color: theme.muted,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Dishes List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxHeight: 560,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {filteredDishes.length === 0 ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: theme.muted,
              fontSize: 14,
            }}
          >
            No menu items matching your search.
          </div>
        ) : (
          filteredDishes.map((dish) => {
            const soldOut = isSoldOut(dish.name);
            return (
              <div
                key={`${dish.categoryKey}-${dish.name}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: soldOut ? "rgba(197, 48, 48, 0.05)" : (theme.surfaceAlt || "#FFFFFF"),
                  border: `1px solid ${soldOut ? "rgba(197, 48, 48, 0.25)" : `${theme.muted}15`}`,
                  transition: "all 0.25s ease",
                  gap: 12,
                }}
              >
                {/* Left: Dish Information */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: 11,
                        color: theme.muted,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {dish.categoryIcon} {dish.sectionName}
                    </span>
                    <span style={{ color: `${theme.muted}60` }}>•</span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: theme.heading,
                        textDecoration: soldOut ? "line-through" : "none",
                        opacity: soldOut ? 0.7 : 1,
                      }}
                    >
                      {dish.name}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: soldOut ? theme.muted : theme.accent,
                        fontWeight: 500,
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {dish.price === "TBA" ? "TBA" : `£${dish.price}`}
                    </span>
                  </div>

                  {dish.desc && (
                    <div
                      style={{
                        fontSize: 12,
                        color: theme.muted,
                        marginTop: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "90%",
                      }}
                    >
                      {dish.desc}
                    </div>
                  )}
                </div>

                {/* Right: Toggle Button */}
                <button
                  type="button"
                  aria-pressed={soldOut}
                  onClick={() => toggleSoldOut(dish.name)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 24,
                    border: `1.5px solid ${soldOut ? "#C53030" : `${COLORS.mossGreen}50`}`,
                    background: soldOut ? "rgba(197, 48, 48, 0.12)" : `${COLORS.mossGreen}12`,
                    color: soldOut ? "#C53030" : COLORS.mossGreen,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    fontFamily: "'Outfit', sans-serif",
                    flexShrink: 0,
                    touchAction: "manipulation",
                  }}
                  title={soldOut ? "Click to mark Available" : "Click to 86 / mark Sold Out"}
                >
                  <span style={{ fontSize: 10 }}>{soldOut ? "🔴" : "🟢"}</span>
                  <span>{soldOut ? "86'd / Sold Out" : "Available"}</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info Note */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${theme.muted}15`,
          fontSize: 12,
          color: theme.muted,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span>
          💡 <strong>Tip for Kitchen & Bar:</strong> Dishes marked 86'd remain listed on the menu with a
          badge so diners understand they are only sold out for the day.
        </span>
        <span>Real-time local sync active</span>
      </div>
    </div>
  );
}
