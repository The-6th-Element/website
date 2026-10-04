// src/components/ui/PersistentCTA.jsx
import React, { useState, useEffect } from "react";

export function PersistentCTA({ theme, flags = {}, setBookingOpen }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (!visible || flags.booking_enabled === false) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
        right: "calc(20px + env(safe-area-inset-right, 0px))",
        zIndex: 1500,
        display: "flex",
        gap: 10,
        animation: "slideDown 0.3s ease",
      }}
    >
      <button
        onClick={() => setBookingOpen(true)}
        style={{
          padding: "12px 24px",
          minHeight: 44,
          borderRadius: 30,
          border: "none",
          background: theme.accent,
          color: "#fff",
          cursor: "pointer",
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          transition: "transform 0.3s ease",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.target.style.transform = "none")}
      >
        Book a Table
      </button>
    </div>
  );
}
