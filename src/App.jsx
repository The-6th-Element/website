// src/App.jsx
import React, { useState, useEffect, useCallback } from "react";
import { COLORS, AM_THEME, PM_THEME } from "./theme/tokens";
import { computeIsAM, scrollToTop } from "./utils/time";
import { useFeatureFlags } from "./hooks/useFeatureFlags";
import { AnnouncementBar, ANNOUNCEMENT_BAR_H } from "./components/layout/AnnouncementBar";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { PersistentCTA } from "./components/ui/PersistentCTA";
import { ReservationModal } from "./components/features/ReservationModal";
import { StructuredData } from "./components/features/StructuredData";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { SocialImpactPage } from "./pages/SocialImpactPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminLogin, AdminPanel } from "./components/admin/AdminComponents";
import { MenuStudio } from "./components/admin/MenuStudio";
import { authenticateAdmin, verifyAdminSession } from "./utils/auth";

// ── Main App ───────────────────────────────────────────────────────
export default function TheSixthElement() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAM, setIsAM] = useState(() => {
    let pm = 14;
    try {
      const s = JSON.parse(localStorage.getItem("tse_flags"));
      if (s && s.pm_switch_hour) pm = s.pm_switch_hour;
    } catch {}
    return computeIsAM(pm);
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const { flags, updateFlag, resetFlags } = useFeatureFlags();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showStudio, setShowStudio] = useState(false);
  const [adminAuth, setAdminAuth] = useState({ authenticated: false, user: null, token: null, loading: true });
  const [showLogin, setShowLogin] = useState(false);

  // Studio direct access: ?studio=menu or ?admin=menu
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("studio") === "menu" || params.get("admin") === "menu") {
      setShowStudio(true);
    }
  }, []);

  // Admin auth: ?admin=true opens login gate, verifies existing session
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") !== "true") {
      setAdminAuth(a => ({ ...a, loading: false }));
      return;
    }
    const savedToken = sessionStorage.getItem("tse_admin_token");
    if (savedToken && verifyAdminSession(savedToken)) {
      setAdminAuth({ authenticated: true, user: "Deepak", token: savedToken, loading: false });
      setShowAdmin(true);
    } else {
      setAdminAuth(a => ({ ...a, loading: false }));
      setShowLogin(true);
    }
  }, []);

  const handleAdminLogin = async (username, password) => {
    const result = await authenticateAdmin(username, password);
    sessionStorage.setItem("tse_admin_token", result.token);
    setAdminAuth({ authenticated: true, user: result.user, token: result.token, loading: false });
    setShowLogin(false);
    setShowAdmin(true);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("tse_admin_token");
    setAdminAuth({ authenticated: false, user: null, token: null, loading: false });
    setShowAdmin(false);
  };

  // Auto-detect AM/PM based on UK time (Europe/London handles BST/GMT automatically).
  // The evening switch hour is admin-configurable via flags.pm_switch_hour.
  useEffect(() => {
    const checkTime = () => setIsAM(computeIsAM(flags.pm_switch_hour));
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [flags.pm_switch_hour]);

  const theme = isAM ? AM_THEME : PM_THEME;

  const navigate = useCallback((page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    scrollToTop();
  }, []);

  // Also reset scroll *after* the new page commits. On mobile Safari a scroll
  // started before the content swap gets cancelled as the document height
  // changes, leaving you stranded at the old footer.
  useEffect(() => { scrollToTop(); }, [currentPage]);

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif",
      background: theme.bg,
      color: theme.text,
      minHeight: "100vh",
      transition: "background 1.2s ease, color 1.2s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Global Styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${COLORS.warmAmber}40; color: ${COLORS.earthBrown}; }
        html { scroll-behavior: smooth; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes slideDown { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes kenburns { 0% { transform: scale(1); } 100% { transform: scale(1.12); } }
        .rotate-emblem { animation: spin 60s linear infinite; }
        .ken-burns { animation: kenburns 24s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) {
          .rotate-emblem, .ken-burns, [style*="animation"] { animation: none !important; }
        }
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        .menu-tag { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; margin-left: 6px; }
        input:focus, textarea:focus, select:focus { outline: 2px solid ${COLORS.warmAmber}; outline-offset: 2px; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-trigger { display: flex !important; }
          .hero-copy { text-align: center; }
          .hero-copy p { margin-left: auto; margin-right: auto; }
          .hero-cta { justify-content: center; }
        }
        @media (min-width: 769px) {
          .mobile-trigger { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
      `}</style>

      <AnnouncementBar theme={theme} onToggle={setBarVisible} />
      <Navbar
        theme={theme}
        isAM={isAM}
        setIsAM={setIsAM}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        navigate={navigate}
        currentPage={currentPage}
        topOffset={barVisible ? ANNOUNCEMENT_BAR_H : 0}
      />

      {currentPage === "home" && (
        <HomePage
          theme={theme}
          isAM={isAM}
          navigate={navigate}
          setBookingOpen={setBookingOpen}
          flags={flags}
        />
      )}
      {currentPage === "menu" && (
        <MenuPage
          theme={theme}
          flags={flags}
          onOpenStudio={() => setShowStudio(true)}
        />
      )}
      {currentPage === "impact" && <SocialImpactPage theme={theme} />}
      {currentPage === "about" && <AboutPage theme={theme} />}
      {currentPage === "contact" && <ContactPage theme={theme} />}

      <PersistentCTA theme={theme} setBookingOpen={setBookingOpen} />
      {bookingOpen && <ReservationModal theme={theme} onClose={() => setBookingOpen(false)} />}
      {showLogin && <AdminLogin theme={theme} onLogin={handleAdminLogin} onClose={() => setShowLogin(false)} />}
      {showAdmin && adminAuth.authenticated && (
        <AdminPanel
          theme={theme}
          flags={flags}
          updateFlag={updateFlag}
          resetFlags={resetFlags}
          adminUser={adminAuth.user}
          onLogout={handleAdminLogout}
          onClose={() => setShowAdmin(false)}
          onOpenStudio={() => setShowStudio(true)}
        />
      )}
      {showStudio && (
        <MenuStudio
          theme={theme}
          onClose={() => setShowStudio(false)}
        />
      )}
      <StructuredData />
      <Footer
        theme={theme}
        navigate={navigate}
        onOpenAdmin={() => (adminAuth.authenticated ? setShowAdmin(true) : setShowLogin(true))}
      />
    </div>
  );
}
