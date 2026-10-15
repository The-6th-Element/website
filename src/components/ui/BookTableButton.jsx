// src/components/ui/BookTableButton.jsx
import React from "react";
import { COLORS } from "../../theme/tokens";

export function BookTableButton({
  onClick,
  theme,
  size = "md", // "sm" | "md" | "lg"
  style = {},
  className = "",
  fullWidth = false,
  label = "Book Table",
}) {
  const sizeStyles = {
    sm: {
      padding: "8px 18px",
      fontSize: 13,
      borderRadius: 20,
    },
    md: {
      padding: "12px 26px",
      fontSize: 14,
      borderRadius: 25,
      minHeight: 44,
    },
    lg: {
      padding: "14px 34px",
      fontSize: 15,
      borderRadius: 30,
      minHeight: 48,
    },
  }[size] || {
    padding: "12px 26px",
    fontSize: 14,
    borderRadius: 25,
  };

  const accentColor = theme?.accent || COLORS.warmAmber;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`hover-lift ${className}`}
      aria-label={`${label} with Toast Tables`}
      style={{
        ...sizeStyles,
        background: `linear-gradient(135deg, ${accentColor}, #B57948)`,
        color: "#FFFFFF",
        border: "none",
        cursor: "pointer",
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 600,
        letterSpacing: "0.04em",
        boxShadow: `0 4px 16px ${accentColor}40`,
        transition: "all 0.25s ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: fullWidth ? "100%" : "auto",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 6px 22px ${accentColor}60`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = `0 4px 16px ${accentColor}40`;
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: "1.1em", lineHeight: 1 }}>›</span>
    </button>
  );
}
