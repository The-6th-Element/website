// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Logomark } from "../ui/Logomark";

export function Navbar({ theme, isAM, setIsAM, menuOpen, setMenuOpen, navigate, currentPage, topOffset = 0 }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { id: "home", label: "Home" },
    { id: "menu", label: "Menu" },
    { id: "impact", label: "Social Impact" },
    { id: "about", label: "Our Story" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: topOffset,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? theme.navBg : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${theme.muted}20` : "none",
        transition: "all 0.4s ease",
        padding: scrolled ? "12px 0" : "20px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("home")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
        >
          <Logomark size={scrolled ? 36 : 42} color={theme.accent} />
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22,
                fontWeight: 500,
                color: theme.heading,
                letterSpacing: "0.05em",
                lineHeight: 1.1,
              }}
            >
              THE SIXTH
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22,
                fontWeight: 300,
                color: theme.heading,
                letterSpacing: "0.15em",
              }}
            >
              ELEMENT
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => navigate(l.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "0.08em",
                color: currentPage === l.id ? theme.accent : theme.text,
                textTransform: "uppercase",
                padding: "4px 0",
                borderBottom: currentPage === l.id ? `2px solid ${theme.accent}` : "2px solid transparent",
                transition: "all 0.3s ease",
              }}
            >
              {l.label}
            </button>
          ))}
          {/* AM/PM Toggle */}
          <button
            onClick={() => setIsAM(!isAM)}
            style={{
              background: `${theme.accent}18`,
              border: `1px solid ${theme.accent}40`,
              borderRadius: 20,
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: 12,
              color: theme.accent,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {isAM ? "☀️" : "🌙"} {isAM ? "AM" : "PM"}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-trigger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            flexDirection: "column",
            gap: 5,
            padding: 8,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 2,
                background: theme.text,
                borderRadius: 2,
                transition: "all 0.3s ease",
                transform: menuOpen
                  ? i === 0
                    ? "rotate(45deg) translateY(7px)"
                    : i === 2
                    ? "rotate(-45deg) translateY(-7px)"
                    : "scaleX(0)"
                  : "none",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: theme.navBg,
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${theme.muted}20`,
            padding: "16px 24px",
            animation: "slideDown 0.3s ease",
          }}
        >
          {links.map((l, i) => (
            <button
              key={l.id}
              onClick={() => navigate(l.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 15,
                padding: "12px 0",
                color: currentPage === l.id ? theme.accent : theme.text,
                borderBottom: i < links.length - 1 ? `1px solid ${theme.muted}15` : "none",
                letterSpacing: "0.05em",
              }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => setIsAM(!isAM)}
            style={{
              marginTop: 12,
              background: `${theme.accent}18`,
              border: `1px solid ${theme.accent}40`,
              borderRadius: 20,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              color: theme.accent,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Switch to {isAM ? "PM 🌙" : "AM ☀️"} mode
          </button>
        </div>
      )}
    </nav>
  );
}
