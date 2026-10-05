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
import { StaffPage } from "./pages/StaffPage";
import { MenuStudio } from "./components/admin/MenuStudio";
import { authenticateStaff, verifyStaffSession } from "./utils/userManager";

// ── Main App ───────────────────────────────────────────────────────
export default function TheSixthElement() {
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
      if (path === "admin" || path === "staff") return "staff";
      if (path === "studio") return "studio";
      if (["home", "menu", "impact", "about", "contact"].includes(path)) {
        return path;
      }
    } catch {}
    return "home";
  });
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
  const [adminAuth, setAdminAuth] = useState({
    authenticated: false,
    user: null,
    username: null,
    role: null,
    title: null,
    token: null,
    loading: true,
  });

  // Query parameter handlers: ?studio=menu or ?admin=true / ?staff=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("studio") === "menu" || params.get("studio") === "true") {
      setCurrentPage("studio");
    }
    if (params.get("admin") === "true" || params.get("staff") === "true") {
      setCurrentPage("staff");
    }
  }, []);

  // Staff auth: restore existing session if token is saved in sessionStorage
  useEffect(() => {
    const savedToken = sessionStorage.getItem("tse_admin_token");
    const session = verifyStaffSession(savedToken);

    if (session) {
      setAdminAuth({
        authenticated: true,
        user: session.user,
        username: session.username,
        role: session.role,
        title: session.title,
        token: savedToken,
        loading: false,
      });
    } else {
      setAdminAuth(a => ({ ...a, loading: false }));
    }
  }, []);

  const handleAdminLogin = async (username, password) => {
    const result = await authenticateStaff(username, password);
    sessionStorage.setItem("tse_admin_token", result.token);
    setAdminAuth({
      authenticated: true,
      user: result.user,
      username: result.username,
      role: result.role,
      title: result.title,
      token: result.token,
      loading: false,
    });
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("tse_admin_token");
    setAdminAuth({
      authenticated: false,
      user: null,
      username: null,
      role: null,
      title: null,
      token: null,
      loading: false,
    });
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
    try {
      const targetUrl = page === "home" ? "/" : `/${page}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, null, targetUrl);
      }
    } catch {}
    scrollToTop();
  }, []);

  // Listen for browser back / forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
      if (path === "admin" || path === "staff") {
        setCurrentPage("staff");
      } else if (path === "studio") {
        setCurrentPage("studio");
      } else {
        setCurrentPage(["home", "menu", "impact", "about", "contact"].includes(path) ? path : "home");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Dynamic SEO title & route metadata (BK-16)
  useEffect(() => {
    scrollToTop();
    const PAGE_TITLES = {
      home: "The Sixth Element | Modern Indian & Specialty Coffee | Richmond, London",
      menu: "Food & Drinks Menu | Daytime Brunch & Evening Dining | The Sixth Element",
      about: "Our Story & Culinary Philosophy | Inspired by the Elements | The Sixth Element",
      impact: "Social Impact & Ethical Sourcing | The Sixth Element London",
      contact: "Find Us, Hours & Reservations | 210 Upper Richmond Road West, SW14",
      staff: "Staff & Management Portal | The Sixth Element",
      studio: "Menu Studio & Spreadsheet Editor | The Sixth Element",
    };
    if (PAGE_TITLES[currentPage]) {
      document.title = PAGE_TITLES[currentPage];
    }
  }, [currentPage]);

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif",
      background: theme.bg,
      color: theme.text,
      minHeight: "100dvh",
      transition: "background 1.2s ease, color 1.2s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Global Styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        ::selection { background: ${COLORS.warmAmber}40; color: ${COLORS.earthBrown}; }
        html { scroll-behavior: smooth; }
        button, a, input, select, textarea { touch-action: manipulation; }
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
        
        /* Prevent iOS Safari automatic zoom on focus while maintaining design on desktop */
        @media screen and (max-width: 768px) {
          input, select, textarea { font-size: 16px !important; }
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

        /* Instagram Responsive Grid */
        .insta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          max-width: 1000px;
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .insta-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 4px;
          }
        }
      `}</style>

      <AnnouncementBar
        theme={theme}
        onToggle={setBarVisible}
        navigate={navigate}
        setBookingOpen={setBookingOpen}
      />
      <Navbar
        theme={theme}
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
          onOpenStudio={() => navigate("studio")}
        />
      )}
      {currentPage === "impact" && <SocialImpactPage theme={theme} />}
      {currentPage === "about" && <AboutPage theme={theme} />}
      {currentPage === "contact" && <ContactPage theme={theme} />}
      {currentPage === "staff" && (
        <StaffPage
          theme={theme}
          flags={flags}
          updateFlag={updateFlag}
          adminAuth={adminAuth}
          onLogin={handleAdminLogin}
          onLogout={handleAdminLogout}
          onOpenStudio={() => navigate("studio")}
          navigate={navigate}
        />
      )}
      {currentPage === "studio" && (
        <MenuStudio
          theme={theme}
          userRole={adminAuth.role}
          userName={adminAuth.user}
          onClose={() => navigate("staff")}
        />
      )}

      <PersistentCTA theme={theme} flags={flags} setBookingOpen={setBookingOpen} />
      {bookingOpen && <ReservationModal theme={theme} onClose={() => setBookingOpen(false)} />}
      <StructuredData />
      <Footer theme={theme} navigate={navigate} />
    </div>
  );
}
