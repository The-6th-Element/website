// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Logomark } from "../ui/Logomark";

export function Navbar({ theme, menuOpen, setMenuOpen, navigate, currentPage, topOffset = 0 }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Lock body scroll when mobile navigation drawer is open (prevents iOS rubber-banding)
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${theme.muted}20` : "none",
        transition: "all 0.4s ease",
        padding: scrolled
          ? "calc(10px + env(safe-area-inset-top, 0px)) 0 10px 0"
          : "calc(13px + env(safe-area-inset-top, 0px)) 0 13px 0",
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
          <Logomark size={scrolled ? 34 : 38} color={theme.accent} />
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(20px, 2vw, 24px)",
              fontWeight: 500,
              color: theme.heading,
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            The Sixth Element
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
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-trigger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-drawer"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            padding: 8,
            width: 44,
            height: 44,
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
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
          id="mobile-nav-drawer"
          role="region"
          aria-label="Mobile Navigation"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: theme.navBg,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: `1px solid ${theme.muted}20`,
            padding: "16px 24px calc(24px + env(safe-area-inset-bottom, 0px))",
            animation: "slideDown 0.3s ease",
          }}
        >
          {links.map((l, i) => (
            <button
              key={l.id}
              onClick={() => navigate(l.id)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                minHeight: 44,
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 16,
                padding: "8px 0",
                color: currentPage === l.id ? theme.accent : theme.text,
                borderBottom: i < links.length - 1 ? `1px solid ${theme.muted}15` : "none",
                letterSpacing: "0.05em",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
