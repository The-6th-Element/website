// src/components/ui/CTAButton.jsx
import React from "react";

export function CTAButton({ label, onClick, primary, theme }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "14px 36px",
        borderRadius: 30,
        cursor: "pointer",
        fontFamily: "'Outfit', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.05em",
        transition: "all 0.3s ease",
        background: primary ? theme.accent : "transparent",
        color: primary ? "#fff" : theme.text,
        border: primary ? "none" : `1.5px solid ${theme.accent || theme.text}60`,
      }}
      onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.target.style.transform = "none")}
    >
      {label}
    </button>
  );
}
