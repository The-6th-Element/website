// src/components/ui/PersistentCTA.jsx
import React, { useState, useEffect } from "react";

export function PersistentCTA({ theme, setBookingOpen }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
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
        }}
        onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.target.style.transform = "none")}
      >
        Book a Table
      </button>
    </div>
  );
}
