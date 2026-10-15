// src/components/ui/PersistentCTA.jsx
import React, { useState, useEffect } from "react";
import { BookTableButton } from "./BookTableButton";

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
      <BookTableButton
        onClick={() => setBookingOpen(true)}
        theme={theme}
        size="md"
        style={{
          boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
}
