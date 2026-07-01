import { useState, useEffect, useRef, useCallback } from "react";

// ── Feature Flags (persisted in localStorage) ─────────────────────
// Toggle these in the authenticated admin panel (?admin=true → login) or set defaults here
const DEFAULT_FLAGS = {
  cocktails_live: false,    // false = "Coming Soon" teaser, true = full live menu
  instagram_feed: true,     // show/hide Instagram grid
  booking_enabled: true,    // enable/disable reservations
  brunch_duration: 60,      // minutes
  evening_duration: 90,     // minutes.
  pm_switch_hour: 14,       // UK hour (24h) when the site switches to evening/dark mode
};

// AM (light) between 8am and the configurable evening switch hour, UK time.
function computeIsAM(pmSwitchHour = 14) {
  const h = parseInt(new Date().toLocaleString("en-GB", { timeZone: "Europe/London", hour: "numeric", hour12: false }), 10);
  return h >= 8 && h < pmSwitchHour;
}

function useFeatureFlags() {
  const [flags, setFlags] = useState(() => {
    try {
      const saved = localStorage.getItem("tse_flags");
      return saved ? { ...DEFAULT_FLAGS, ...JSON.parse(saved) } : DEFAULT_FLAGS;
    } catch { return DEFAULT_FLAGS; }
  });
  const updateFlag = (key, value) => {
    setFlags(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem("tse_flags", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const resetFlags = () => {
    try { localStorage.removeItem("tse_flags"); } catch {}
    setFlags(DEFAULT_FLAGS);
  };
  return { flags, updateFlag, resetFlags };
}

// ── Toast Tables Reservation Config ───────────────────────────────
// Reservations are handled by Toast Tables. Paste your restaurant's
// online reservation link below.
//   Toast Web → Waitlist & Reservations → Settings → Reservations →
//   Online access → "Copy online reservation link"
// The "Book a Table" buttons open this link inside an embedded modal,
// with a "open in new tab" fallback (some Toast pages block iframing).
const TOAST_CONFIG = {
  reservationUrl: "https://tables.toasttab.com/restaurants/5503e03f-b188-421c-aa8f-5a2c8e27fd59/findTime", // e.g. "https://www.toasttab.com/the-sixth-element/reservations"
};

// ── Theme & Design Tokens ──────────────────────────────────────────
const COLORS = {
  earthBrown: "#4B3621",
  mossGreen: "#606E3D",
  charcoal: "#2C2C2C",
  warmAmber: "#BF8A2F",
  ivory: "#F6F4E3",
  cream: "#FAF8F0",
  darkBg: "#1A1410",
  warmBlack: "#0F0D0A",
  softWhite: "#FEFDFB",
  sand: "#D4C5A9",
  deepMoss: "#3D4A26",
};

const AM_THEME = {
  bg: COLORS.cream,
  text: COLORS.charcoal,
  heading: COLORS.earthBrown,
  accent: COLORS.warmAmber,
  surface: COLORS.ivory,
  surfaceAlt: "#FFFFFF",
  muted: "#9A9080",
  hero: `linear-gradient(135deg, ${COLORS.ivory} 0%, ${COLORS.cream} 50%, #E8E0D0 100%)`,
  navBg: "rgba(250,248,240,0.92)",
  label: "Morning Mode",
  icon: "☀️",
};

const PM_THEME = {
  bg: COLORS.warmBlack,
  text: COLORS.sand,
  heading: COLORS.ivory,
  accent: COLORS.warmAmber,
  surface: "#1E1914",
  surfaceAlt: "#252017",
  muted: "#7A7060",
  hero: `linear-gradient(135deg, #1A1410 0%, #2A1E14 50%, #1E1914 100%)`,
  navBg: "rgba(15,13,10,0.94)",
  label: "Evening Mode",
  icon: "🌙",
};

// Fonts loaded via index.html (Cormorant Garamond + Outfit)

// ── Menu Data ──────────────────────────────────────────────────────
const MENU_DATA = {
  grounded: {
    title: "Grounded",
    subtitle: "Honest, simple food rooted in the earth",
    icon: "🌿",
    sections: [
      {
        name: "Brunch Plates",
        items: [
          { name: "The Earth Bowl", desc: "Roasted sweet potato, avocado, poached eggs, dukkah, sourdough", price: "12.50", tags: ["V"] },
          { name: "Richmond Granola", desc: "House-made granola, seasonal compote, Greek yoghurt, raw honey", price: "8.50", tags: ["V","GF"] },
          { name: "The Full Element", desc: "Free-range eggs, sourdough, grilled halloumi, roasted tomato, mushrooms, greens", price: "14.00", tags: [] },
          { name: "Smashed Avocado Toast", desc: "Chilli flakes, lime, heritage tomatoes on rye", price: "10.50", tags: ["VG"] },
          { name: "Shakshuka", desc: "Spiced tomato, peppers, baked eggs, feta, warm flatbread", price: "11.50", tags: ["V"] },
        ]
      },
      {
        name: "Small Plates",
        items: [
          { name: "Soup of the Day", desc: "Seasonal, served with sourdough", price: "7.00", tags: ["VG"] },
          { name: "Hummus & Flatbread", desc: "Smoky beetroot hummus, za'atar, olive oil", price: "8.00", tags: ["VG"] },
          { name: "Halloumi Fries", desc: "With harissa yoghurt and mint", price: "7.50", tags: ["V","GF"] },
        ]
      }
    ]
  },
  coffee: {
    title: "Social Impact Coffee",
    subtitle: "Every cup tells a story of positive change",
    icon: "☕",
    sections: [
      {
        name: "Espresso Bar",
        items: [
          { name: "Espresso", desc: "Single origin, rotating roast", price: "2.80", tags: [] },
          { name: "Flat White", desc: "Double shot, silky microfoam", price: "3.80", tags: [] },
          { name: "Cortado", desc: "Equal parts espresso and steamed milk", price: "3.20", tags: [] },
          { name: "Long Black", desc: "Double shot over hot water", price: "3.00", tags: [] },
          { name: "Oat Latte", desc: "Creamy oat milk, double shot", price: "4.20", tags: ["VG"] },
        ]
      },
      {
        name: "Filter & Brew",
        items: [
          { name: "V60 Pour Over", desc: "Hand-brewed single origin", price: "4.50", tags: [] },
          { name: "Cold Brew", desc: "18-hour steeped, smooth and bold", price: "4.00", tags: [] },
          { name: "Matcha Latte", desc: "Ceremonial grade, oat milk", price: "4.50", tags: ["VG"] },
          { name: "Chai Latte", desc: "House-spiced masala blend", price: "4.00", tags: [] },
        ]
      }
    ]
  },
  wine: {
    title: "Flow",
    subtitle: "Refined wines & craft beers",
    icon: "🍷",
    sections: [
      {
        name: "Natural Wine",
        items: [
          { name: "Skin Contact Orange", desc: "Friuli, Italy — textured, amber, apricot", price: "8.50", tags: [] },
          { name: "Côtes du Rhône Rouge", desc: "Southern France — dark fruit, herbs, velvety", price: "7.50", tags: [] },
          { name: "Albariño", desc: "Rías Baixas, Spain — crisp, citrus, mineral", price: "8.00", tags: [] },
          { name: "Prosecco Superiore", desc: "Valdobbiadene — fine bubbles, apple, pear", price: "7.00", tags: [] },
        ]
      },
      {
        name: "Craft Beer",
        items: [
          { name: "Richmond Pale Ale", desc: "Local brewery, citrus hop, easy-drinking", price: "5.50", tags: [] },
          { name: "Belgian Wheat", desc: "Coriander and orange peel, hazy gold", price: "6.00", tags: [] },
          { name: "Oatmeal Stout", desc: "Chocolate, coffee, silky body", price: "6.50", tags: [] },
        ]
      }
    ]
  },
  cocktails: {
    title: "The Curator",
    subtitle_teaser: "High-end curated cocktails — Coming Soon",
    subtitle_live: "High-end curated cocktails",
    icon: "🍸",
    sections_teaser: [
      {
        name: "Phase 2 Preview",
        items: [
          { name: "The Fifth Element", desc: "A signature creation — details to be revealed", price: "TBA", tags: ["COMING SOON"] },
          { name: "Earth Old Fashioned", desc: "Barrel-aged bourbon, demerara, walnut bitters", price: "TBA", tags: ["COMING SOON"] },
          { name: "Fire Negroni", desc: "Smoked gin, Campari, sweet vermouth", price: "TBA", tags: ["COMING SOON"] },
        ]
      }
    ],
    sections_live: [
      {
        name: "Signature Cocktails",
        items: [
          { name: "The Fifth Element", desc: "Aged rum, cardamom, burnt honey, smoke — our signature", price: "14.00", tags: [] },
          { name: "Earth Old Fashioned", desc: "Barrel-aged bourbon, demerara, walnut bitters", price: "13.00", tags: [] },
          { name: "Fire Negroni", desc: "Smoked gin, Campari, sweet vermouth, charred orange", price: "13.50", tags: [] },
          { name: "Air Spritz", desc: "Elderflower, prosecco, soda, fresh mint", price: "11.00", tags: [] },
          { name: "Water Martini", desc: "Clarified gin, dry vermouth, saline, lemon oil", price: "14.00", tags: [] },
        ]
      },
      {
        name: "Low & No Alcohol",
        items: [
          { name: "Garden Tonic", desc: "Seedlip, cucumber, tonic, rosemary", price: "8.00", tags: ["0% ABV"] },
          { name: "Smoke & Honey", desc: "Lyre's dark spirit, lemon, smoked honey", price: "8.50", tags: ["0% ABV"] },
        ]
      }
    ]
  }
};

// ── Elements Data ──────────────────────────────────────────────────
const ELEMENTS = [
  { name: "Earth", symbol: "🜃", color: COLORS.earthBrown, desc: "Our foundation. Honest ingredients, grounded in provenance. Every plate tells a story of soil and season." },
  { name: "Water", symbol: "🜄", color: "#4A7C8F", desc: "The flow of community. Social impact coffee that connects Richmond to farming communities worldwide." },
  { name: "Fire", symbol: "🜂", color: COLORS.warmAmber, desc: "Evening warmth. As the sun sets, the space transforms — natural wines, craft beers, and curated cocktails." },
  { name: "Air", symbol: "🜁", color: "#B8C4A0", desc: "Morning lightness. Bright, breathable mornings filled with specialty coffee and sunlit brunch." },
  { name: "Space", symbol: "✦", color: COLORS.mossGreen, desc: "The sixth element. The intangible feeling of belonging — the reason you return. This is what we create." },
];

// ── Promotions (browser-managed via admin panel) ───────────────────
// Seed defaults so visitors always see something. The admin panel edits
// these in localStorage (per-device). Each promo supports a date window.
const DEFAULT_PROMOTIONS = [
  {
    id: "seed-golden-hour", title: "Golden Hour", badge_text: "DAILY",
    description: "Wind down as the space shifts from day to night.",
    discount_text: "2-for-1 on natural wine by the glass, 5–7pm",
    start_date: "2026-01-01", end_date: "2030-12-31", is_active: true,
  },
  {
    id: "seed-brunch", title: "Weekend Brunch Club", badge_text: "WEEKENDS",
    description: "Every Saturday & Sunday.",
    discount_text: "Free filter coffee with any brunch plate",
    start_date: "2026-01-01", end_date: "2030-12-31", is_active: true,
  },
];

// ── Supabase-backed content (menu + promotions) ────────────────────
// Menu and promotions live as JSON in the Supabase `site_content` table
// (keys "menu_data" / "promotions"), served via /api/content. Reads are
// public; writes need the admin token. Falls back to the built-in
// defaults when the CMS isn't configured, so the site always works.
function isPromoLive(p) {
  const today = new Date().toISOString().slice(0, 10);
  return p.is_active
    && (!p.start_date || p.start_date <= today)
    && (!p.end_date || p.end_date >= today);
}

async function saveContentKey(key, value) {
  const token = sessionStorage.getItem("tse_admin_token");
  const resp = await fetch("/api/content?resource=content", {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ key, value }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || "Save failed");
  }
  return resp.json();
}

// Loads one site_content key. status: "loading" | "connected" | "offline".
function useContentKey(key, fallback) {
  const [value, setValue] = useState(fallback);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    let alive = true;
    fetch("/api/content?resource=content")
      .then(r => (r.ok ? r.json() : Promise.reject(new Error("cms"))))
      .then(map => {
        if (!alive) return;
        if (map && map[key] != null) setValue(map[key]);
        setStatus("connected");
      })
      .catch(() => { if (alive) setStatus("offline"); });
    return () => { alive = false; };
  }, [key]);
  return [value, setValue, status];
}

function usePromotions() {
  const [promotions, setPromotions, status] = useContentKey("promotions", DEFAULT_PROMOTIONS);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const persist = (next) => {
    setPromotions(next);
    setSaveState("saving");
    saveContentKey("promotions", next).then(() => setSaveState("saved")).catch(() => setSaveState("error"));
  };
  const addPromotion = (promo) => persist([...promotions, { ...promo, id: `promo-${Date.now()}` }]);
  const updatePromotion = (id, patch) => persist(promotions.map(p => p.id === id ? { ...p, ...patch } : p));
  const deletePromotion = (id) => persist(promotions.filter(p => p.id !== id));
  const resetPromotions = () => persist(DEFAULT_PROMOTIONS);
  return { promotions, status, saveState, addPromotion, updatePromotion, deletePromotion, resetPromotions };
}

function useMenu() {
  const [menu, setMenu, status] = useContentKey("menu_data", MENU_DATA);
  const [saveState, setSaveState] = useState("idle");
  const persist = (next) => {
    setMenu(next);
    setSaveState("saving");
    saveContentKey("menu_data", next).then(() => setSaveState("saved")).catch(() => setSaveState("error"));
  };
  const saveMenu = (next) => persist(next);
  const resetMenu = () => persist(MENU_DATA);
  return { menu, status, saveState, saveMenu, resetMenu };
}

// ── Intersection Observer Hook ─────────────────────────────────────
function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); obs.unobserve(el); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, isInView];
}

// ── FadeIn Component ───────────────────────────────────────────────
function FadeIn({ children, delay = 0, direction = "up", style = {} }) {
  const [ref, isInView] = useInView();
  const transforms = { up: "translateY(30px)", down: "translateY(-30px)", left: "translateX(30px)", right: "translateX(-30px)", none: "none" };
  return (
    <div ref={ref} style={{
      opacity: isInView ? 1 : 0,
      transform: isInView ? "none" : transforms[direction],
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Brand Logomark (inline SVG; inherits color via fill prop) ──────
function Logomark({ size = 32, color = "currentColor", style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      width={size}
      height={size}
      role="img"
      aria-label="The Sixth Element"
      style={{ display: "block", flexShrink: 0, ...style }}
    >
      <path fill={color} d="M500.15,47.9c-249.37,0-452.26,202.88-452.26,452.26s202.88,452.26,452.26,452.26s452.26-202.88,452.26-452.26S749.53,47.9,500.15,47.9z M885.05,483.42H740.98l-224.1-224.1V115.25C716.37,123.79,876.52,283.93,885.05,483.42z M693.66,483.42H516.88V306.64L693.66,483.42z M483.42,115.25v157.49l-0.22,0.22l0.22,0.22v210.24H273.18l-0.22-0.22l-0.22,0.22H115.25C123.79,283.94,283.93,123.79,483.42,115.25z M483.42,693.66L306.64,516.88h176.77V693.66z M114.83,500.09v0.12c0-0.02,0-0.04,0-0.06C114.83,500.13,114.83,500.11,114.83,500.09z M115.25,516.88h144.06l224.1,224.1v144.06C283.93,876.51,123.79,716.37,115.25,516.88z M516.88,885.05V516.88h368.16C876.52,716.37,716.37,876.52,516.88,885.05z" />
    </svg>
  );
}

// ── Main App ───────────────────────────────────────────────────────
export default function TheSixthElement() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAM, setIsAM] = useState(() => {
    let pm = 14;
    try { const s = JSON.parse(localStorage.getItem("tse_flags")); if (s && s.pm_switch_hour) pm = s.pm_switch_hour; } catch {}
    return computeIsAM(pm);
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { flags, updateFlag, resetFlags } = useFeatureFlags();
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuth, setAdminAuth] = useState({ authenticated: false, user: null, token: null, loading: true });
  const [showLogin, setShowLogin] = useState(false);

  // Admin auth: ?admin=true opens login gate, verifies existing session
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") !== "true") {
      setAdminAuth(a => ({ ...a, loading: false }));
      return;
    }
    const savedToken = sessionStorage.getItem("tse_admin_token");
    if (savedToken) {
      fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", token: savedToken }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.valid) {
            setAdminAuth({ authenticated: true, user: data.user, token: savedToken, loading: false });
            setShowAdmin(true);
          } else {
            sessionStorage.removeItem("tse_admin_token");
            setAdminAuth({ authenticated: false, user: null, token: null, loading: false });
            setShowLogin(true);
          }
        })
        .catch(() => {
          setAdminAuth(a => ({ ...a, loading: false }));
          setShowLogin(true);
        });
    } else {
      setAdminAuth(a => ({ ...a, loading: false }));
      setShowLogin(true);
    }
  }, []);

  const handleAdminLogin = async (username, password) => {
    const resp = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", username, password }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || "Login failed");
    sessionStorage.setItem("tse_admin_token", data.token);
    setAdminAuth({ authenticated: true, user: username, token: data.token, loading: false });
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

      <Navbar theme={theme} isAM={isAM} setIsAM={setIsAM} menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} currentPage={currentPage} />

      {currentPage === "home" && <HomePage theme={theme} isAM={isAM} navigate={navigate} setBookingOpen={setBookingOpen} flags={flags} />}
      {currentPage === "menu" && <MenuPage theme={theme} isAM={isAM} flags={flags} />}
      {currentPage === "impact" && <SocialImpactPage theme={theme} />}
      {currentPage === "about" && <AboutPage theme={theme} />}
      {currentPage === "contact" && <ContactPage theme={theme} />}

      <PersistentCTA theme={theme} setBookingOpen={setBookingOpen} />
      {bookingOpen && <ReservationModal theme={theme} onClose={() => setBookingOpen(false)} />}
      {showLogin && <AdminLogin theme={theme} onLogin={handleAdminLogin} onClose={() => setShowLogin(false)} />}
      {showAdmin && adminAuth.authenticated && <AdminPanel theme={theme} flags={flags} updateFlag={updateFlag} resetFlags={resetFlags} adminUser={adminAuth.user} onLogout={handleAdminLogout} onClose={() => setShowAdmin(false)} />}
      <StructuredData />
      <Footer theme={theme} navigate={navigate} />
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────
function Navbar({ theme, isAM, setIsAM, menuOpen, setMenuOpen, navigate, currentPage }) {
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
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? theme.navBg : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${theme.muted}20` : "none",
      transition: "all 0.4s ease",
      padding: scrolled ? "12px 0" : "20px 0",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div onClick={() => navigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <Logomark size={scrolled ? 36 : 42} color={theme.accent} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: theme.heading, letterSpacing: "0.05em", lineHeight: 1.1 }}>
              THE SIXTH
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: theme.heading, letterSpacing: "0.15em" }}>
              ELEMENT
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => navigate(l.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 400, letterSpacing: "0.08em",
              color: currentPage === l.id ? theme.accent : theme.text,
              textTransform: "uppercase", padding: "4px 0",
              borderBottom: currentPage === l.id ? `2px solid ${theme.accent}` : "2px solid transparent",
              transition: "all 0.3s ease",
            }}>
              {l.label}
            </button>
          ))}
          {/* AM/PM Toggle */}
          <button onClick={() => setIsAM(!isAM)} style={{
            background: `${theme.accent}18`, border: `1px solid ${theme.accent}40`,
            borderRadius: 20, padding: "6px 14px", cursor: "pointer",
            fontSize: 12, color: theme.accent, fontFamily: "'Outfit', sans-serif",
            fontWeight: 500, letterSpacing: "0.05em",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {isAM ? "☀️" : "🌙"} {isAM ? "AM" : "PM"}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className="mobile-trigger" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer",
          flexDirection: "column", gap: 5, padding: 8,
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 24, height: 2, background: theme.text, borderRadius: 2,
              transition: "all 0.3s ease",
              transform: menuOpen ? (i === 0 ? "rotate(45deg) translateY(7px)" : i === 2 ? "rotate(-45deg) translateY(-7px)" : "scaleX(0)") : "none",
            }} />
          ))}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: theme.navBg, backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${theme.muted}20`, padding: "16px 24px",
          animation: "slideDown 0.3s ease",
        }}>
          {links.map((l, i) => (
            <button key={l.id} onClick={() => navigate(l.id)} style={{
              display: "block", width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Outfit', sans-serif", fontSize: 15, padding: "12px 0",
              color: currentPage === l.id ? theme.accent : theme.text,
              borderBottom: i < links.length - 1 ? `1px solid ${theme.muted}15` : "none",
              letterSpacing: "0.05em",
            }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => setIsAM(!isAM)} style={{
            marginTop: 12, background: `${theme.accent}18`, border: `1px solid ${theme.accent}40`,
            borderRadius: 20, padding: "8px 16px", cursor: "pointer",
            fontSize: 13, color: theme.accent, fontFamily: "'Outfit', sans-serif",
          }}>
            Switch to {isAM ? "PM 🌙" : "AM ☀️"} mode
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Homepage ───────────────────────────────────────────────────────
function HomePage({ theme, isAM, navigate, setBookingOpen, flags }) {
  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        background: theme.hero, position: "relative", textAlign: "center", padding: "120px 24px 80px",
        overflow: "hidden",
      }}>
        {/* Atmospheric background photo (day / evening) */}
        <div className="ken-burns" style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${isAM ? "/day-cafe.jpg" : "/evening-lounge.jpg"})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: isAM ? 0.5 : 0.28, pointerEvents: "none",
        }} />
        {/* Gradient veil to keep text legible over the photo — lighter in AM so the photo reads clearly */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: isAM
            ? `linear-gradient(180deg, ${theme.bg}99 0%, ${theme.bg}2E 40%, ${theme.bg}99 100%)`
            : `linear-gradient(180deg, ${theme.bg}CC 0%, ${theme.bg}66 40%, ${theme.bg}CC 100%)`,
        }} />

        {/* Faint oversized emblem for depth (darker in AM so it reads on the light background) */}
        <img src="/elements-mark.png" alt="" aria-hidden="true" className="rotate-emblem" style={{
          position: "absolute", top: "50%", left: "50%",
          width: "min(90vw, 780px)", height: "min(90vw, 780px)",
          transform: "translate(-50%, -50%)",
          opacity: isAM ? 0.12 : 0.1, pointerEvents: "none", zIndex: 0,
          filter: isAM ? "brightness(0.5) contrast(1.1)" : "none",
        }} />

        <div style={{
          position: "relative", zIndex: 1, width: "100%", maxWidth: 1080, margin: "0 auto",
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
          gap: "clamp(24px, 5vw, 64px)",
        }}>
          {/* Left: rotating five-elements emblem medallion with the "VI" mark */}
          <FadeIn>
            <div style={{ position: "relative", width: "min(52vw, 260px)", height: "min(52vw, 260px)", flexShrink: 0 }}>
              <img src="/elements-mark.png" alt="The Sixth Element — five elements emblem" className="rotate-emblem" style={{
                width: "100%", height: "100%", objectFit: "contain",
                opacity: isAM ? 0.9 : 0.92,
                filter: isAM
                  ? "brightness(0.5) contrast(1.15) drop-shadow(0 4px 14px rgba(75,54,33,0.25))"
                  : "drop-shadow(0 0 22px rgba(191,138,47,0.4))",
              }} />
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 500,
                  background: "linear-gradient(135deg, #E8C57D 0%, #BF8A2F 60%, #8A6220 100%)",
                  WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                  color: theme.accent, letterSpacing: "0.02em",
                }}>VI</span>
              </div>
            </div>
          </FadeIn>

          {/* Right: headline + copy */}
          <div className="hero-copy" style={{ flex: "1 1 340px", minWidth: 280, maxWidth: 620, textAlign: "left" }}>
            <FadeIn delay={0.1}>
              <div style={{
                fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase",
                color: theme.muted, marginBottom: 20, fontWeight: 500,
              }}>
                Richmond-upon-Thames
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: 300, color: theme.heading, lineHeight: 1.1, marginBottom: 16,
              }}>
                The Five Elements Shape Life.
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 4.5vw, 48px)",
                fontWeight: 500, fontStyle: "italic", color: theme.accent, marginBottom: 28,
              }}>
                We Offer the Sixth.
              </h2>
            </FadeIn>
            <FadeIn delay={0.45}>
              <p style={{
                fontSize: 16, lineHeight: 1.7, color: theme.muted,
                maxWidth: 520, marginBottom: 36, fontWeight: 300,
              }}>
                A space where morning light meets evening warmth. Specialty coffee by day,
                natural wine by night. Always intentional. Always Richmond.
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <div className="hero-cta" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <CTAButton label="Book a Table" onClick={() => setBookingOpen(true)} primary theme={theme} />
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          animation: "float 2s ease-in-out infinite",
        }}>
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${theme.muted}, transparent)` }} />
        </div>
      </section>

      {/* Elemental Story Scroller */}
      <section style={{ padding: "100px 24px", background: theme.surface, transition: "background 1.2s ease" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: theme.muted, marginBottom: 12 }}>
              Our Foundation
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, color: theme.heading }}>
              Five Elements, One Space
            </h2>
          </div>
        </FadeIn>
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: 24, padding: "0 0 20px",
          maxWidth: 1200, margin: "0 auto",
        }}>
          {ELEMENTS.map((el, i) => (
            <FadeIn key={el.name} delay={i * 0.1} style={{ flex: "1 1 200px", minWidth: 200, maxWidth: 280 }}>
              <div className="hover-lift" style={{
                height: "100%", padding: 32,
                background: theme.surfaceAlt, borderRadius: 16,
                border: `1px solid ${theme.muted}15`,
                cursor: "default",
                transition: "all 0.3s ease",
              }}>
                <div style={{ fontSize: 36, marginBottom: 16, color: el.color }}>{el.symbol}</div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 24,
                  fontWeight: 500, color: theme.heading, marginBottom: 12,
                }}>
                  {el.name}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: theme.muted, fontWeight: 300 }}>
                  {el.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Phase Showcase */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: theme.muted, marginBottom: 12 }}>
                Dynamic Experience
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, color: theme.heading }}>
                Two Moods, One Space
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            <FadeIn delay={0.1}>
              <div className="hover-lift" style={{
                borderRadius: 20, overflow: "hidden",
                background: `linear-gradient(135deg, ${COLORS.ivory}, ${COLORS.cream})`,
                border: `1px solid ${COLORS.sand}40`,
              }}>
                <div style={{ padding: "40px 32px" }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.mossGreen, marginBottom: 8, fontWeight: 600 }}>
                    ☀️ AM Phase · 8am – 2pm
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: COLORS.earthBrown, marginBottom: 12 }}>
                    Air
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.charcoal, fontWeight: 300 }}>
                    Bright, breathable mornings. Sunlit interiors, specialty coffee, and honest brunch plates. 
                    The space feels open, airy, and full of possibility.
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                    {["Coffee", "Brunch", "Light"].map(t => (
                      <span key={t} style={{
                        padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500,
                        background: `${COLORS.mossGreen}15`, color: COLORS.mossGreen,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.25}>
              <div className="hover-lift" style={{
                borderRadius: 20, overflow: "hidden",
                background: `linear-gradient(135deg, #1A1410, #2A1E14)`,
                border: `1px solid ${COLORS.warmAmber}20`,
              }}>
                <div style={{ padding: "40px 32px" }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.warmAmber, marginBottom: 8, fontWeight: 600 }}>
                    🌙 PM Phase · 2pm – Close
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: COLORS.ivory, marginBottom: 12 }}>
                    Fire
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.sand, fontWeight: 300 }}>
                    Warmer tones, lower light. The space transforms for natural wine, craft beers,
                    and soon, curated cocktails. An intimate evening atmosphere.
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                    {["Wine", "Beer", "Cocktails"].map(t => (
                      <span key={t} style={{
                        padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500,
                        background: `${COLORS.warmAmber}20`, color: COLORS.warmAmber,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Current promotions — managed from the admin panel */}
      <PromotionsSection theme={theme} />

      {/* Instagram Feed — controlled by flags.instagram_feed */}
      {flags.instagram_feed && <InstagramSection theme={theme} />}

      {/* CTA Section */}
      <section style={{
        padding: "100px 24px", textAlign: "center",
        background: `linear-gradient(135deg, ${COLORS.earthBrown}, ${COLORS.warmBlack})`,
      }}>
        <FadeIn>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 300, color: COLORS.ivory, marginBottom: 16,
          }}>
            Find Your Element
          </h2>
          <p style={{ fontSize: 16, color: COLORS.sand, marginBottom: 40, fontWeight: 300 }}>
            Whether it's morning light or evening warmth — your table awaits.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <CTAButton label="Book a Table" onClick={() => setBookingOpen(true)} primary theme={{ ...theme, text: COLORS.ivory }} />
            <CTAButton label="View Menu" onClick={() => navigate("menu")} theme={{ ...theme, text: COLORS.ivory, accent: COLORS.ivory }} />
          </div>
        </FadeIn>
      </section>
    </div>
  );
}

// ── Menu Page ──────────────────────────────────────────────────────
function MenuPage({ theme, isAM, flags }) {
  const tabs = [
    { id: "grounded", label: "Grounded", icon: "🌿" },
    { id: "coffee", label: "Coffee", icon: "☕" },
    { id: "wine", label: "Wine & Beer", icon: "🍷" },
    { id: "cocktails", label: flags.cocktails_live ? "Cocktails" : "Cocktails ✦", icon: "🍸" },
  ];
  const [activeTab, setActiveTab] = useState(isAM ? "grounded" : "wine");
  const { menu } = useMenu();
  const rawData = menu[activeTab];

  // Resolve cocktail teaser/live based on feature flag
  const data = activeTab === "cocktails" ? {
    ...rawData,
    subtitle: flags.cocktails_live ? rawData.subtitle_live : rawData.subtitle_teaser,
    sections: flags.cocktails_live ? rawData.sections_live : rawData.sections_teaser,
  } : rawData;

  return (
    <div style={{ paddingTop: 120, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: theme.muted, marginBottom: 12 }}>
              The Menu
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, color: theme.heading }}>
              Nourish & Flow
            </h1>
          </div>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={0.1}>
          <div style={{
            display: "flex", gap: 8, justifyContent: "center", marginBottom: 48,
            flexWrap: "wrap",
          }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "10px 20px", borderRadius: 30, border: "none", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
                letterSpacing: "0.04em",
                background: activeTab === tab.id ? theme.accent : `${theme.muted}15`,
                color: activeTab === tab.id ? "#fff" : theme.text,
                transition: "all 0.3s ease",
              }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Menu Content */}
        <div key={activeTab}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 32 }}>{data.icon}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: theme.heading, marginTop: 8 }}>
                {data.title}
              </h2>
              <p style={{ fontSize: 14, color: theme.muted, fontWeight: 300, marginTop: 8 }}>{data.subtitle}</p>
            </div>
          </FadeIn>

          {data.sections.map((section, si) => (
            <FadeIn key={section.name} delay={si * 0.1}>
              <div style={{ marginBottom: 48 }}>
                <h3 style={{
                  fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: theme.accent, marginBottom: 20, fontWeight: 600,
                  paddingBottom: 8, borderBottom: `1px solid ${theme.muted}20`,
                }}>
                  {section.name}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {section.items.map((item, ii) => (
                    <FadeIn key={item.name} delay={ii * 0.05}>
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                        padding: "16px 0",
                        borderBottom: ii < section.items.length - 1 ? `1px solid ${theme.muted}10` : "none",
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ fontSize: 16, fontWeight: 500, color: theme.heading }}>{item.name}</span>
                            {item.tags.map(t => (
                              <span key={t} className="menu-tag" style={{
                                background: t === "COMING SOON" ? `${theme.accent}20` : `${COLORS.mossGreen}15`,
                                color: t === "COMING SOON" ? theme.accent : COLORS.mossGreen,
                              }}>
                                {t}
                              </span>
                            ))}
                          </div>
                          <p style={{ fontSize: 13, color: theme.muted, fontWeight: 300, marginTop: 4, lineHeight: 1.5 }}>{item.desc}</p>
                        </div>
                        <div style={{
                          fontSize: 16, fontWeight: 500, color: theme.accent,
                          marginLeft: 20, whiteSpace: "nowrap",
                          fontFamily: "'Cormorant Garamond', serif",
                        }}>
                          {item.price === "TBA" ? "TBA" : `£${item.price}`}
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div style={{
            textAlign: "center", padding: "40px 0 80px",
            fontSize: 13, color: theme.muted, fontWeight: 300, lineHeight: 1.7,
          }}>
            <p>V = Vegetarian · VG = Vegan · GF = Gluten Free</p>
            <p style={{ marginTop: 8 }}>Please inform us of any allergies. All prices include VAT.</p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ── Social Impact Page ─────────────────────────────────────────────
// Our house coffee is roasted by Old Spike Roastery, a London social
// enterprise fighting homelessness. Figures below reflect Old Spike's
// published impact (oldspikeroastery.com/pages/impact).
const OLD_SPIKE_URL = "https://oldspikeroastery.com/pages/impact";

function SocialImpactPage({ theme }) {
  const stats = [
    { value: "350+", label: "people supported out of homelessness" },
    { value: "65%", label: "of profits reinvested into social impact" },
    { value: "8", label: "London cafés offering paid placements" },
    { value: "LLW", label: "every placement paid at London Living Wage" },
  ];

  const steps = [
    { n: "01", title: "Referral Partners", desc: "Working with charities like Crisis, St Giles Trust and Centrepoint to reach people experiencing homelessness." },
    { n: "02", title: "Taster Day", desc: "An informal day behind the bar to see if barista life is the right fit — no pressure, no experience needed." },
    { n: "03", title: "Barista Training", desc: "A hands-on training course covering coffee origins, extraction, equipment, plus CV support and work confidence." },
    { n: "04", title: "Paid Work Placement", desc: "A paid placement at London Living Wage across the Old Spike café network — real shifts, real income." },
    { n: "05", title: "Into Employment", desc: "A network of employer partners helps graduates step into long-term jobs and a life beyond the streets." },
  ];

  return (
    <div style={{ paddingTop: 120, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: theme.muted, marginBottom: 12 }}>
              Our Coffee Partner · Old Spike Roastery
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, color: theme.heading, marginBottom: 16 }}>
              Every Cup Fights Homelessness
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: theme.muted, fontWeight: 300, maxWidth: 640, margin: "0 auto" }}>
              The coffee we pour is roasted by <strong style={{ color: theme.heading, fontWeight: 500 }}>Old Spike Roastery</strong> —
              a London social enterprise and Community Interest Company that trains and employs people who have experienced
              homelessness. Choosing our coffee helps fund their journey from the street into lasting work.
            </p>
          </div>
        </FadeIn>

        {/* Hero image band */}
        <FadeIn delay={0.1}>
          <div style={{
            height: 240, borderRadius: 20, overflow: "hidden", marginBottom: 48,
            backgroundImage: "url(/day-cafe.jpg)", backgroundSize: "cover", backgroundPosition: "center",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(180deg, transparent, ${COLORS.deepMoss}CC)`,
              display: "flex", alignItems: "flex-end", padding: 24,
            }}>
              <span style={{ color: COLORS.ivory, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: "italic" }}>
                “Great coffee, poured with purpose.”
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Impact stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 64 }}>
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08}>
              <div style={{
                padding: "28px 20px", borderRadius: 16, textAlign: "center", height: "100%",
                background: theme.surfaceAlt, border: `1px solid ${theme.muted}15`,
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 500, color: theme.accent, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12.5, color: theme.muted, fontWeight: 300, marginTop: 10, lineHeight: 1.5 }}>
                  {s.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* How the model works */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: theme.heading }}>
              From the Street to a Career
            </h2>
            <p style={{ fontSize: 14, color: theme.muted, fontWeight: 300, marginTop: 8 }}>
              Old Spike's five-step programme, funded in part by every bag and every cup.
            </p>
          </div>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 72 }}>
          {steps.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.08}>
              <div className="hover-lift" style={{
                display: "flex", gap: 20, alignItems: "flex-start",
                padding: 24, borderRadius: 16, background: theme.surfaceAlt,
                border: `1px solid ${theme.muted}15`,
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500,
                  color: theme.accent, minWidth: 48,
                }}>
                  {step.n}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 500, color: theme.heading, marginBottom: 6 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: theme.muted, fontWeight: 300 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn>
          <div style={{
            padding: 40, borderRadius: 20,
            background: `linear-gradient(135deg, ${COLORS.mossGreen}, ${COLORS.deepMoss})`,
            textAlign: "center", marginBottom: 80,
          }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: COLORS.ivory, marginBottom: 12 }}>
              Read the Full Impact Story
            </h3>
            <p style={{ fontSize: 14, color: "#B8C4A0", fontWeight: 300, marginBottom: 24, maxWidth: 520, margin: "0 auto 24px" }}>
              Explore Old Spike Roastery's programmes, trainee stories, and their latest Impact Report.
            </p>
            <a href={OLD_SPIKE_URL} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block",
              padding: "12px 32px", borderRadius: 30, border: `2px solid ${COLORS.ivory}`,
              background: "transparent", color: COLORS.ivory, cursor: "pointer", textDecoration: "none",
              fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.05em",
              transition: "all 0.3s ease",
            }}
              onMouseEnter={e => { e.target.style.background = COLORS.ivory; e.target.style.color = COLORS.deepMoss; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = COLORS.ivory; }}
            >
              Visit Old Spike Roastery →
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ── About Page ─────────────────────────────────────────────────────
function AboutPage({ theme }) {
  return (
    <div style={{ paddingTop: 120, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 80px" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: theme.muted, marginBottom: 12 }}>
              Our Story
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, color: theme.heading }}>
              The Space Between
            </h1>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 22, lineHeight: 1.8,
            color: theme.heading, fontWeight: 300, marginBottom: 40,
            textAlign: "center", fontStyle: "italic",
          }}>
            "In ancient philosophy, five elements compose all of existence — 
            Earth, Water, Fire, Air, and Space. We believe there is a sixth: 
            the feeling of belonging."
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ fontSize: 15, lineHeight: 1.9, color: theme.muted, fontWeight: 300 }}>
            <p style={{ marginBottom: 20 }}>
              The Sixth Element was born from a simple observation: Richmond-upon-Thames 
              has extraordinary places to eat and drink, but few that truly transform 
              with the rhythms of the day.
            </p>
            <p style={{ marginBottom: 20 }}>
              We designed a space that breathes — bright and airy for morning coffee and 
              brunch, warm and intimate for evening wine and conversation. Not two venues 
              in one, but a single space that flows naturally from dawn to dusk.
            </p>
            <p style={{ marginBottom: 20 }}>
              Our coffee is sourced through direct-trade partnerships with farming 
              communities, because every element of what we do must carry intention. 
              Our food is simple, honest, and grounded in seasonal ingredients. Our 
              wine list celebrates natural and biodynamic producers.
            </p>
            <p>
              But the sixth element — the one that brings people back — isn't on any 
              menu. It's the feeling you get when you walk through the door. That's 
              the space we're building.
            </p>
          </div>
        </FadeIn>

        {/* Values */}
        <FadeIn delay={0.3}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24, marginTop: 60,
          }}>
            {[
              { label: "Intentional", value: "Every detail considered" },
              { label: "Seasonal", value: "Menus that follow nature" },
              { label: "Community", value: "Richmond at our heart" },
              { label: "Sustainable", value: "From farm to cup to plate" },
            ].map((v, i) => (
              <div key={v.label} style={{
                textAlign: "center", padding: 24,
                borderTop: `2px solid ${theme.accent}`,
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: theme.heading, marginBottom: 4 }}>
                  {v.label}
                </div>
                <div style={{ fontSize: 13, color: theme.muted, fontWeight: 300 }}>{v.value}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ── Contact Page ───────────────────────────────────────────────────
const VENUE_ADDRESS = "210 Upper Richmond Road West, London, SW14 8AH";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_ADDRESS)}&output=embed`;
const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE_ADDRESS)}`;

function ContactPage({ theme }) {
  return (
    <div style={{ paddingTop: 120, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: theme.muted, marginBottom: 12 }}>
              Get in Touch
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, color: theme.heading }}>
              Find Us
            </h1>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "start" }}>
          {/* Info */}
          <FadeIn delay={0.1}>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: theme.heading, marginBottom: 24 }}>
                Visit The Sixth Element
              </h3>
              {[
                { icon: "📍", label: "Address", value: "210 Upper Richmond Road West\nLondon, SW14 8AH" },
                { icon: "🕐", label: "Hours", value: "Mon–Fri: 8am – 10pm\nSat–Sun: 9am – 11pm" },
                { icon: "📞", label: "Phone", value: "+44(0)20 35188688" },
                { icon: "📧", label: "Email", value: "info@the6thelement.co.uk" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <div style={{ fontSize: 20, marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.muted, fontWeight: 600, marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 14, color: theme.text, fontWeight: 300, whiteSpace: "pre-line", lineHeight: 1.6 }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}

              <a href={MAP_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8,
                padding: "12px 24px", borderRadius: 30, textDecoration: "none",
                background: theme.accent, color: "#fff",
                fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, letterSpacing: "0.03em",
                transition: "transform 0.3s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >
                📍 Get Directions
              </a>
            </div>
          </FadeIn>

          {/* Interactive Google Map */}
          <FadeIn delay={0.2}>
            <div style={{
              borderRadius: 16, overflow: "hidden",
              border: `1px solid ${theme.muted}20`, height: 460, minHeight: 320,
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            }}>
              <iframe
                title="The Sixth Element — location map"
                src={MAP_EMBED_SRC}
                width="100%" height="100%"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

// ── Reservation Modal (Toast Tables) ──────────────────────────────
// Embeds the Toast Tables online reservation page in an iframe, with a
// graceful fallback to opening it in a new tab (some Toast pages block
// iframing via X-Frame-Options). Set the link in TOAST_CONFIG above.
function ReservationModal({ theme, onClose }) {
  const url = TOAST_CONFIG.reservationUrl;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, animation: "slideDown 0.3s ease",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 560, maxHeight: "90vh",
        display: "flex", flexDirection: "column",
        background: theme.bg, borderRadius: 20, overflow: "hidden",
        border: `1px solid ${theme.muted}20`,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 24px", borderBottom: `1px solid ${theme.muted}15`,
        }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: theme.heading }}>
            Reserve a Table
          </h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 24, color: theme.muted,
            cursor: "pointer", padding: 4, lineHeight: 1,
          }}>×</button>
        </div>

        {url ? (
          <>
            <iframe
              src={url}
              title="Book a table with Toast"
              style={{ width: "100%", height: "70vh", border: "none", background: "#fff" }}
              allow="payment"
            />
            <div style={{
              padding: "12px 24px", borderTop: `1px solid ${theme.muted}15`,
              textAlign: "center", fontSize: 12, color: theme.muted, fontWeight: 300,
            }}>
              Trouble loading?{" "}
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: theme.accent, fontWeight: 500, textDecoration: "none" }}>
                Open the booking page in a new tab →
              </a>
            </div>
          </>
        ) : (
          /* Link not configured yet — show owner-facing setup hint + call option */
          <div style={{ padding: "40px 32px", textAlign: "center" }}>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
              <Logomark size={48} color={theme.accent} />
            </div>
            <p style={{ fontSize: 15, color: theme.heading, fontWeight: 500, marginBottom: 8 }}>
              Online booking is being set up
            </p>
            <p style={{ fontSize: 13, color: theme.muted, fontWeight: 300, lineHeight: 1.6, marginBottom: 16 }}>
              To take reservations here, paste your Toast Tables online reservation
              link into <code style={{ background: `${theme.muted}15`, padding: "2px 6px", borderRadius: 4 }}>TOAST_CONFIG.reservationUrl</code>.
              In the meantime, please call us to book.
            </p>
            <a href="tel:+44(0)20 35188688" style={{
              display: "inline-block", padding: "12px 28px", borderRadius: 30,
              background: theme.accent, color: "#fff", fontSize: 14, fontWeight: 500,
              textDecoration: "none",
            }}>
              +44(0)20 35188688
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Persistent CTA ─────────────────────────────────────────────────
function PersistentCTA({ theme, setBookingOpen }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 1500,
      display: "flex", gap: 10,
      animation: "slideDown 0.3s ease",
    }}>
      <button onClick={() => setBookingOpen(true)} style={{
        padding: "12px 24px", borderRadius: 30, border: "none",
        background: theme.accent, color: "#fff", cursor: "pointer",
        fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        transition: "transform 0.3s ease",
      }}
        onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
        onMouseLeave={e => e.target.style.transform = "none"}
      >
        Book a Table
      </button>
    </div>
  );
}

// ── CTA Button Component ───────────────────────────────────────────
function CTAButton({ label, onClick, primary, theme }) {
  return (
    <button onClick={onClick} style={{
      padding: "14px 36px", borderRadius: 30, cursor: "pointer",
      fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
      letterSpacing: "0.05em", transition: "all 0.3s ease",
      background: primary ? theme.accent : "transparent",
      color: primary ? "#fff" : theme.text,
      border: primary ? "none" : `1.5px solid ${theme.accent || theme.text}60`,
    }}
      onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.target.style.transform = "none"}
    >
      {label}
    </button>
  );
}

// ── Promotions Section (public) ────────────────────────────────────
// Shows live promotions (active + within their date window). Managed in
// the admin panel; seeded with DEFAULT_PROMOTIONS so it's never empty.
function PromotionsSection({ theme }) {
  const { promotions } = usePromotions();
  const live = promotions.filter(isPromoLive);
  if (live.length === 0) return null;

  return (
    <section style={{ padding: "90px 24px", background: theme.surface, transition: "background 1.2s ease" }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: theme.muted, marginBottom: 12 }}>
            What's On
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, color: theme.heading }}>
            Current Offers
          </h2>
        </div>
      </FadeIn>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 24, maxWidth: 1000, margin: "0 auto",
      }}>
        {live.map((promo, i) => (
          <FadeIn key={promo.id} delay={i * 0.1}>
            <div className="hover-lift" style={{
              position: "relative", height: "100%",
              padding: 32, borderRadius: 20,
              background: `linear-gradient(135deg, ${theme.accent}12, ${theme.surfaceAlt})`,
              border: `1px solid ${theme.accent}25`,
            }}>
              {promo.badge_text && (
                <span style={{
                  position: "absolute", top: 20, right: 20,
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                  padding: "4px 10px", borderRadius: 20,
                  background: theme.accent, color: "#fff",
                }}>
                  {promo.badge_text}
                </span>
              )}
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, color: theme.heading, marginBottom: 10, paddingRight: 70 }}>
                {promo.title}
              </h3>
              {promo.discount_text && (
                <div style={{ fontSize: 15, fontWeight: 500, color: theme.accent, marginBottom: 10 }}>
                  {promo.discount_text}
                </div>
              )}
              {promo.description && (
                <p style={{ fontSize: 14, lineHeight: 1.7, color: theme.muted, fontWeight: 300 }}>
                  {promo.description}
                </p>
              )}
              {promo.end_date && promo.end_date < "2030-01-01" && (
                <div style={{ fontSize: 11, color: theme.muted, marginTop: 16, fontWeight: 300 }}>
                  Until {new Date(promo.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── Instagram Section ──────────────────────────────────────────────
// To connect a live feed, set your Elfsight widget ID or Curator.io feed ID
// in the INSTAGRAM_CONFIG below. Until then, styled placeholders are shown.
const INSTAGRAM_CONFIG = {
  handle: "thesixthelement.richmond",
  profileUrl: "https://www.instagram.com/the.sixth.element.210",
  // Set ONE of these to enable a live feed:
  elfsightWidgetId: null,   // e.g. "el-xxxxxxxx" — from elfsight.com (free tier)
  curatorFeedId: null,      // e.g. "xxxxxxxx"   — from curator.io (free tier)
};

function InstagramSection({ theme }) {
  const embedRef = useRef(null);

  // Load third-party embed script if configured
  useEffect(() => {
    if (INSTAGRAM_CONFIG.elfsightWidgetId) {
      const script = document.createElement("script");
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    }
    if (INSTAGRAM_CONFIG.curatorFeedId) {
      const script = document.createElement("script");
      script.src = `https://cdn.curator.io/published/${INSTAGRAM_CONFIG.curatorFeedId}.js`;
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    }
  }, []);

  return (
    <section style={{ padding: "80px 24px", background: theme.surface }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <a href={INSTAGRAM_CONFIG.profileUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: theme.muted, marginBottom: 12, display: "block", textDecoration: "none" }}>
            @{INSTAGRAM_CONFIG.handle}
          </a>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 400, color: theme.heading }}>
            A Sense of Belonging
          </h2>
        </div>
      </FadeIn>

      {/* Live feed embed area */}
      {INSTAGRAM_CONFIG.elfsightWidgetId ? (
        <div className={`elfsight-app-${INSTAGRAM_CONFIG.elfsightWidgetId}`} ref={embedRef} />
      ) : INSTAGRAM_CONFIG.curatorFeedId ? (
        <div id={`curator-feed-${INSTAGRAM_CONFIG.curatorFeedId}`} ref={embedRef} />
      ) : (
        /* Styled placeholders — replaced by live feed once connected */
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
          gap: 4, maxWidth: 1000, margin: "0 auto",
        }}>
          {[
            { emoji: "☕", bg: "#D4C5A9" }, { emoji: "🍳", bg: "#C8B896" },
            { emoji: "🌿", bg: "#8B9E6B" }, { emoji: "🍷", bg: "#8B6B4E" },
            { emoji: "✨", bg: "#BFA87A" }, { emoji: "🍺", bg: "#A08B6B" },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <a href={INSTAGRAM_CONFIG.profileUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  aspectRatio: "1", background: item.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 40, cursor: "pointer", textDecoration: "none",
                  transition: "transform 0.3s ease",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {item.emoji}
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.3s ease",
                  color: "white", fontSize: 13, fontWeight: 500,
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "0"}
                >
                  View on Instagram →
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      )}

      <FadeIn delay={0.3}>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <a href={INSTAGRAM_CONFIG.profileUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 24px", borderRadius: 30,
            border: `1px solid ${theme.muted}30`, color: theme.text,
            fontSize: 13, fontWeight: 500, textDecoration: "none",
            transition: "all 0.3s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${theme.muted}30`; e.currentTarget.style.color = theme.text; }}
          >
            Follow us on Instagram
          </a>
        </div>
      </FadeIn>
    </section>
  );
}

// ── Admin Login ────────────────────────────────────────────────────
function AdminLogin({ theme, onLogin, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError("");
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1px solid ${theme.muted}30`, background: theme.surfaceAlt,
    color: theme.text, fontFamily: "'Outfit', sans-serif", fontSize: 14,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 3000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, animation: "slideDown 0.3s ease",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 380,
        background: theme.bg, borderRadius: 20, padding: 36,
        border: `1px solid ${theme.muted}20`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        {/* Lock icon */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: `${theme.accent}15`, border: `2px solid ${theme.accent}30`,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, marginBottom: 16,
          }}>
            🔒
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 26,
            fontWeight: 400, color: theme.heading,
          }}>
            Site Admin
          </h2>
          <p style={{ fontSize: 13, color: theme.muted, fontWeight: 300, marginTop: 6 }}>
            Sign in to manage your site
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", color: theme.muted, marginBottom: 6, display: "block",
            }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="username"
              placeholder="Enter username"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", color: theme.muted, marginBottom: 6, display: "block",
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
              placeholder="Enter password"
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: 8,
              background: "#FEE2E2", color: "#991B1B", fontSize: 13,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!username || !password || loading}
            style={{
              padding: "14px", borderRadius: 30, border: "none",
              background: username && password && !loading ? theme.accent : `${theme.muted}30`,
              color: username && password && !loading ? "#fff" : theme.muted,
              cursor: username && password && !loading ? "pointer" : "not-allowed",
              fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
              letterSpacing: "0.03em", marginTop: 4,
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <div style={{
          marginTop: 20, fontSize: 11, color: theme.muted, textAlign: "center",
          lineHeight: 1.6, fontWeight: 300,
        }}>
          Session expires after 12 hours.<br />
          Credentials are set in your Vercel environment variables.
        </div>
      </div>
    </div>
  );
}

// ── Admin Panel (authenticated) ────────────────────────────────────
function AdminPanel({ theme, flags, updateFlag, resetFlags, adminUser, onLogout, onClose }) {
  const toggleStyle = (active) => ({
    position: "relative", width: 44, height: 24, borderRadius: 12, cursor: "pointer",
    background: active ? COLORS.mossGreen : `${theme.muted}30`,
    border: "none", transition: "background 0.3s ease", flexShrink: 0,
  });
  const dotStyle = (active) => ({
    position: "absolute", top: 3, left: active ? 23 : 3,
    width: 18, height: 18, borderRadius: "50%", background: "#fff",
    transition: "left 0.3s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  });

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 360, maxWidth: "90vw",
      zIndex: 3000, background: theme.bg, borderLeft: `1px solid ${theme.muted}20`,
      boxShadow: "-4px 0 30px rgba(0,0,0,0.15)", overflowY: "auto", padding: 24,
      animation: "slideDown 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: theme.heading }}>
            Site Admin
          </h2>
          <div style={{ fontSize: 11, color: theme.muted, letterSpacing: "0.1em", marginTop: 4 }}>
            Feature flags & settings
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", fontSize: 24, color: theme.muted, cursor: "pointer",
        }}>×</button>
      </div>

      {/* Authenticated user bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 14px", borderRadius: 10, marginBottom: 28,
        background: `${COLORS.mossGreen}10`, border: `1px solid ${COLORS.mossGreen}25`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: COLORS.mossGreen, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600,
          }}>
            {(adminUser || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: theme.heading }}>{adminUser}</div>
            <div style={{ fontSize: 10, color: COLORS.mossGreen, fontWeight: 500 }}>● Authenticated</div>
          </div>
        </div>
        <button onClick={onLogout} style={{
          background: "none", border: `1px solid ${theme.muted}25`,
          borderRadius: 6, padding: "4px 10px", cursor: "pointer",
          fontSize: 11, color: theme.muted, fontFamily: "'Outfit', sans-serif", fontWeight: 500,
          transition: "all 0.2s ease",
        }}
          onMouseEnter={e => { e.target.style.borderColor = "#EF4444"; e.target.style.color = "#EF4444"; }}
          onMouseLeave={e => { e.target.style.borderColor = `${theme.muted}25`; e.target.style.color = theme.muted; }}
        >
          Sign Out
        </button>
      </div>

      {/* Toggle: Cocktails */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 16 }}>
          Menu Sections
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: theme.heading }}>Cocktails Section</div>
            <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>
              {flags.cocktails_live ? "🟢 LIVE — full menu with prices" : "🟡 TEASER — \"Coming Soon\" mode"}
            </div>
          </div>
          <button onClick={() => updateFlag("cocktails_live", !flags.cocktails_live)} style={toggleStyle(flags.cocktails_live)}>
            <div style={dotStyle(flags.cocktails_live)} />
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: theme.heading }}>Instagram Feed</div>
            <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>Show feed on homepage</div>
          </div>
          <button onClick={() => updateFlag("instagram_feed", !flags.instagram_feed)} style={toggleStyle(flags.instagram_feed)}>
            <div style={dotStyle(flags.instagram_feed)} />
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: theme.heading }}>Reservations</div>
            <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>Enable booking system</div>
          </div>
          <button onClick={() => updateFlag("booking_enabled", !flags.booking_enabled)} style={toggleStyle(flags.booking_enabled)}>
            <div style={dotStyle(flags.booking_enabled)} />
          </button>
        </div>
      </div>

      {/* Seating Durations */}
      <div style={{ marginBottom: 28, paddingTop: 20, borderTop: `1px solid ${theme.muted}15` }}>
        <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 16 }}>
          Seating Durations
        </div>
        {[
          { key: "brunch_duration", label: "Brunch (minutes)" },
          { key: "evening_duration", label: "Evening (minutes)" },
        ].map(({ key, label }) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: theme.heading }}>{label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {[30, 45, 60, 90, 120].map(v => (
                <button key={v} onClick={() => updateFlag(key, v)} style={{
                  padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 500,
                  background: flags[key] === v ? theme.accent : `${theme.muted}15`,
                  color: flags[key] === v ? "#fff" : theme.text,
                  transition: "all 0.2s ease",
                }}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Display Mode — when the site switches to evening/dark */}
      <div style={{ marginBottom: 28, paddingTop: 20, borderTop: `1px solid ${theme.muted}15` }}>
        <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 8 }}>
          Display Mode
        </div>
        <div style={{ fontSize: 12, color: theme.muted, fontWeight: 300, marginBottom: 12, lineHeight: 1.5 }}>
          The site shows the light "AM" look from 8am, then switches to the dark "evening" look at the time below (UK time).
        </div>
        <div style={{ fontSize: 13, color: theme.heading, marginBottom: 8 }}>Evening mode starts at</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[11, 12, 13, 14, 15, 16, 17, 18, 19].map(h => {
            const label = h === 12 ? "12pm" : h < 12 ? `${h}am` : `${h - 12}pm`;
            return (
              <button key={h} onClick={() => updateFlag("pm_switch_hour", h)} style={{
                padding: "6px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 500,
                background: flags.pm_switch_hour === h ? theme.accent : `${theme.muted}15`,
                color: flags.pm_switch_hour === h ? "#fff" : theme.text,
                transition: "all 0.2s ease",
              }}>{label}</button>
            );
          })}
        </div>
      </div>

      {/* Reservations (Toast Tables) */}
      <div style={{ marginBottom: 28, paddingTop: 20, borderTop: `1px solid ${theme.muted}15` }}>
        <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.accent, fontWeight: 600, marginBottom: 16 }}>
          Reservations (Toast Tables)
        </div>
        <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.7, fontWeight: 300 }}>
          Table bookings are handled by Toast Tables and open inside the
          "Reserve a Table" popup. To change the booking page, update{" "}
          <code style={{ background: `${theme.muted}15`, padding: "2px 6px", borderRadius: 4 }}>TOAST_CONFIG.reservationUrl</code>{" "}
          in <code style={{ background: `${theme.muted}15`, padding: "2px 6px", borderRadius: 4 }}>src/App.jsx</code>.
          <br /><br />
          Find your link in Toast Web → <strong style={{ color: theme.heading }}>Waitlist &amp; Reservations → Settings → Reservations → Online access → "Copy online reservation link"</strong>.
          Deposits, durations, and covers are all managed in Toast.
        </div>
      </div>

      {/* Menu Manager (browser-managed) */}
      <AdminSection theme={theme} title="Menu Manager" icon="📋">
        <MenuManager theme={theme} />
      </AdminSection>

      {/* Promotions (browser-managed) */}
      <AdminSection theme={theme} title="Offers & Promotions" icon="🎁">
        <PromotionsManager theme={theme} />
      </AdminSection>

      {/* CMS: Content Editor (requires Supabase) */}
      <AdminSection theme={theme} title="Content Editor" icon="✏️">
        <ContentEditor theme={theme} />
      </AdminSection>

      {/* CMS: Gallery Manager */}
      <AdminSection theme={theme} title="Gallery Images" icon="🖼️">
        <GalleryManager theme={theme} />
      </AdminSection>

      {/* Reset */}
      <div style={{ paddingTop: 20, borderTop: `1px solid ${theme.muted}15` }}>
        <button onClick={resetFlags} style={{
          width: "100%", padding: "10px", borderRadius: 8,
          border: `1px solid #EF444440`, background: "#EF444410",
          color: "#EF4444", cursor: "pointer", fontSize: 13, fontWeight: 500,
          fontFamily: "'Outfit', sans-serif",
        }}>
          Reset All to Defaults
        </button>
        <div style={{ fontSize: 11, color: theme.muted, marginTop: 12, lineHeight: 1.6 }}>
          Access this panel at <code style={{ background: `${theme.muted}15`, padding: "2px 6px", borderRadius: 4 }}>yoursite.com?admin=true</code>
          <br />Credentials are set in Vercel environment variables.
          <br />Settings are saved in your browser.
        </div>
      </div>
    </div>
  );
}

// ── Admin Collapsible Section ──────────────────────────────────────
function AdminSection({ theme, title, icon, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8, borderTop: `1px solid ${theme.muted}12`, paddingTop: 12 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "none", border: "none", cursor: "pointer", padding: "8px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>{icon}</span>
          <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.accent, fontWeight: 600 }}>
            {title}
          </span>
        </div>
        <span style={{ fontSize: 14, color: theme.muted, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s ease" }}>›</span>
      </button>
      {open && <div style={{ paddingTop: 12, paddingBottom: 8 }}>{children}</div>}
    </div>
  );
}

// ── CMS: Content Editor ───────────────────────────────────────────
function ContentEditor({ theme }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cmsConnected, setCmsConnected] = useState(null);

  useEffect(() => {
    fetch("/api/content?resource=content")
      .then(r => r.json())
      .then(data => { setContent(data); setCmsConnected(true); })
      .catch(() => setCmsConnected(false));
  }, []);

  const saveField = async (key, value) => {
    const token = sessionStorage.getItem("tse_admin_token");
    setLoading(true);
    try {
      await fetch("/api/content?resource=content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ key, value }),
      });
      setContent(prev => ({ ...prev, [key]: value }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (cmsConnected === false) {
    return (
      <div style={{ padding: 16, borderRadius: 10, background: `${theme.accent}08`, border: `1px solid ${theme.accent}20`, fontSize: 12, color: theme.muted, lineHeight: 1.6 }}>
        <strong style={{ color: theme.heading }}>CMS not connected</strong><br/>
        Set <code style={{ background: `${theme.muted}15`, padding: "1px 4px", borderRadius: 3 }}>SUPABASE_URL</code> and <code style={{ background: `${theme.muted}15`, padding: "1px 4px", borderRadius: 3 }}>SUPABASE_SERVICE_KEY</code> in Vercel to enable content editing. See CMS_SETUP.md.
      </div>
    );
  }

  const fields = [
    { key: "hero_title", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
    { key: "hero_description", label: "Hero Description", type: "textarea" },
    { key: "about_quote", label: "About Page Quote", type: "textarea" },
    { key: "phone", label: "Phone Number", type: "text" },
    { key: "email", label: "Email Address", type: "text" },
    { key: "address", label: "Address", type: "textarea" },
    { key: "hours_weekday", label: "Weekday Hours", type: "text" },
    { key: "hours_weekend", label: "Weekend Hours", type: "text" },
  ];

  const inputStyle = {
    width: "100%", padding: "8px 10px", borderRadius: 6, marginTop: 4,
    border: `1px solid ${theme.muted}20`, background: theme.surfaceAlt,
    color: theme.text, fontFamily: "'Outfit', sans-serif", fontSize: 12,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {saved && <div style={{ padding: "6px 12px", borderRadius: 6, background: `${COLORS.mossGreen}15`, color: COLORS.mossGreen, fontSize: 12, fontWeight: 500 }}>✓ Saved</div>}
      {fields.map(f => (
        <div key={f.key}>
          <label style={{ fontSize: 10, color: theme.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>{f.label}</label>
          {f.type === "textarea" ? (
            <textarea
              value={typeof content[f.key] === "string" ? content[f.key] : JSON.stringify(content[f.key] || "")}
              onChange={e => setContent(prev => ({ ...prev, [f.key]: e.target.value }))}
              onBlur={e => saveField(f.key, e.target.value)}
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          ) : (
            <input
              type="text"
              value={typeof content[f.key] === "string" ? content[f.key] : JSON.stringify(content[f.key] || "")}
              onChange={e => setContent(prev => ({ ...prev, [f.key]: e.target.value }))}
              onBlur={e => saveField(f.key, e.target.value)}
              style={inputStyle}
            />
          )}
        </div>
      ))}
      <div style={{ fontSize: 11, color: theme.muted, lineHeight: 1.5 }}>
        Changes auto-save when you leave each field.
      </div>
    </div>
  );
}

// ── Menu Manager (browser/localStorage) ───────────────────────────
function MenuManager({ theme }) {
  const { menu, status, saveState, saveMenu, resetMenu } = useMenu();
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(menu)));
  const [cat, setCat] = useState("grounded");
  const [dirty, setDirty] = useState(false);

  // When the menu loads from Supabase (or resets), sync the editor — but
  // don't clobber unsaved edits in progress.
  useEffect(() => {
    if (!dirty) setDraft(JSON.parse(JSON.stringify(menu)));
  }, [menu]); // eslint-disable-line react-hooks/exhaustive-deps

  const catKeys = Object.keys(draft);
  const sectionsKey = draft[cat].sections ? "sections" : "sections_live";
  const sections = draft[cat][sectionsKey];

  const mutate = (fn) => {
    setDraft(prev => { const next = JSON.parse(JSON.stringify(prev)); fn(next); return next; });
    setDirty(true);
  };
  const editItem = (si, ii, field, value) => mutate(d => { d[cat][sectionsKey][si].items[ii][field] = value; });
  const editTags = (si, ii, value) => mutate(d => { d[cat][sectionsKey][si].items[ii].tags = value.split(",").map(t => t.trim()).filter(Boolean); });
  const deleteItem = (si, ii) => mutate(d => { d[cat][sectionsKey][si].items.splice(ii, 1); });
  const addItem = (si) => mutate(d => { d[cat][sectionsKey][si].items.push({ name: "New item", desc: "", price: "0.00", tags: [] }); });
  const editSection = (si, value) => mutate(d => { d[cat][sectionsKey][si].name = value; });
  const addSection = () => mutate(d => { d[cat][sectionsKey].push({ name: "New Section", items: [] }); });
  const deleteSection = (si) => mutate(d => { d[cat][sectionsKey].splice(si, 1); });

  const doSave = () => { saveMenu(draft); setDirty(false); };
  const doReset = () => { resetMenu(); setDirty(false); };

  const input = {
    padding: "6px 8px", borderRadius: 6, border: `1px solid ${theme.muted}20`,
    background: theme.surfaceAlt, color: theme.text, fontFamily: "'Outfit', sans-serif", fontSize: 12,
  };

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.muted, lineHeight: 1.6, marginBottom: 12, fontWeight: 300 }}>
        Edit items, prices and descriptions. For the Cocktails tab you're editing the live menu (shown when Cocktails is enabled above).
      </div>
      {status === "offline" && (
        <div style={{ padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 11, lineHeight: 1.5,
          background: "#F59E0B18", border: "1px solid #F59E0B40", color: theme.heading }}>
          <strong>Supabase not connected.</strong> You can preview edits, but Save won't persist until the CMS is configured (see CMS_SETUP.md).
        </div>
      )}

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {catKeys.map(k => (
          <button key={k} onClick={() => setCat(k)} style={{
            padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 500, textTransform: "capitalize",
            background: cat === k ? theme.accent : `${theme.muted}15`,
            color: cat === k ? "#fff" : theme.text, fontFamily: "'Outfit', sans-serif",
          }}>{draft[k].title || k}</button>
        ))}
      </div>

      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.muted}12` }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <input value={section.name} onChange={e => editSection(si, e.target.value)} style={{ ...input, flex: 1, fontWeight: 600 }} />
            <button onClick={() => deleteSection(si)} title="Delete section" style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 15 }}>🗑</button>
          </div>
          {section.items.map((item, ii) => (
            <div key={ii} style={{ display: "flex", flexDirection: "column", gap: 6, padding: 10, borderRadius: 8, marginBottom: 8, background: theme.bg, border: `1px solid ${theme.muted}10` }}>
              <div style={{ display: "flex", gap: 6 }}>
                <input value={item.name} placeholder="Name" onChange={e => editItem(si, ii, "name", e.target.value)} style={{ ...input, flex: 2 }} />
                <input value={item.price} placeholder="Price" onChange={e => editItem(si, ii, "price", e.target.value)} style={{ ...input, width: 70 }} />
                <button onClick={() => deleteItem(si, ii)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 15 }}>×</button>
              </div>
              <input value={item.desc} placeholder="Description" onChange={e => editItem(si, ii, "desc", e.target.value)} style={{ ...input, width: "100%" }} />
              <input value={(item.tags || []).join(", ")} placeholder="Tags (comma separated, e.g. V, GF)" onChange={e => editTags(si, ii, e.target.value)} style={{ ...input, width: "100%" }} />
            </div>
          ))}
          <button onClick={() => addItem(si)} style={{
            width: "100%", padding: "7px", borderRadius: 6, marginTop: 2,
            border: `1px dashed ${theme.muted}30`, background: "transparent",
            color: theme.accent, cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: "'Outfit', sans-serif",
          }}>+ Add item</button>
        </div>
      ))}

      <button onClick={addSection} style={{
        width: "100%", padding: "8px", borderRadius: 6, marginBottom: 12,
        border: `1px dashed ${theme.muted}30`, background: "transparent",
        color: theme.muted, cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "'Outfit', sans-serif",
      }}>+ Add section</button>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={doSave} disabled={!dirty && saveState !== "error"} style={{
          flex: 1, padding: "10px", borderRadius: 8, border: "none",
          background: dirty ? theme.accent : `${theme.muted}30`,
          color: dirty ? "#fff" : theme.muted, cursor: dirty ? "pointer" : "not-allowed",
          fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
        }}>{saveState === "saving" ? "Saving…" : saveState === "saved" && !dirty ? "Saved ✓" : saveState === "error" ? "Retry save" : "Save Menu"}</button>
        <button onClick={doReset} title="Restore default menu" style={{
          padding: "10px 12px", borderRadius: 8, border: `1px solid ${theme.muted}20`,
          background: "transparent", color: theme.muted, cursor: "pointer", fontSize: 12,
          fontFamily: "'Outfit', sans-serif",
        }}>Reset</button>
      </div>
    </div>
  );
}

// ── Promotions Manager (Supabase-backed) ──────────────────────────
function PromotionsManager({ theme }) {
  const { promotions, status, saveState, addPromotion, updatePromotion, deletePromotion, resetPromotions } = usePromotions();
  const [showForm, setShowForm] = useState(false);
  const blank = {
    title: "", description: "", discount_text: "", badge_text: "NEW",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    is_active: true,
  };
  const [draft, setDraft] = useState(blank);

  const inputStyle = {
    width: "100%", padding: "8px 10px", borderRadius: 6, marginTop: 4,
    border: `1px solid ${theme.muted}20`, background: theme.surfaceAlt,
    color: theme.text, fontFamily: "'Outfit', sans-serif", fontSize: 12,
  };

  const save = () => {
    if (!draft.title) return;
    addPromotion(draft);
    setDraft(blank);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.muted, lineHeight: 1.6, marginBottom: 12, fontWeight: 300 }}>
        Promotions show on the homepage while active and within their date window.
        {saveState === "saving" && <span style={{ color: theme.accent }}> · Saving…</span>}
        {saveState === "saved" && <span style={{ color: COLORS.mossGreen }}> · Saved ✓</span>}
        {saveState === "error" && <span style={{ color: "#EF4444" }}> · Save failed</span>}
      </div>
      {status === "offline" && (
        <div style={{ padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 11, lineHeight: 1.5,
          background: "#F59E0B18", border: "1px solid #F59E0B40", color: theme.heading }}>
          <strong>Supabase not connected.</strong> Edits won't persist until the CMS is configured (see CMS_SETUP.md).
        </div>
      )}

      {promotions.length === 0 && !showForm && (
        <div style={{ fontSize: 13, color: theme.muted, marginBottom: 12, fontWeight: 300 }}>No promotions yet.</div>
      )}

      {promotions.map(promo => {
        const live = isPromoLive(promo);
        return (
          <div key={promo.id} style={{
            padding: 12, borderRadius: 10, marginBottom: 8,
            background: theme.surfaceAlt, border: `1px solid ${theme.muted}10`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: theme.heading }}>
                  {promo.badge_text && <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                    background: `${theme.accent}20`, color: theme.accent, marginRight: 6,
                  }}>{promo.badge_text}</span>}
                  {promo.title}
                </div>
                <div style={{ fontSize: 11, color: theme.muted, marginTop: 3 }}>
                  {promo.discount_text}
                </div>
                <div style={{ fontSize: 10, color: theme.muted, marginTop: 3 }}>
                  {promo.start_date} → {promo.end_date} · {live ? "🟢 Live now" : "⚫ Not live"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button onClick={() => updatePromotion(promo.id, { is_active: !promo.is_active })} title="Toggle active" style={{
                  background: "none", border: `1px solid ${theme.muted}30`, borderRadius: 6,
                  padding: "3px 8px", fontSize: 10, cursor: "pointer", color: theme.muted,
                }}>{promo.is_active ? "Active" : "Paused"}</button>
                <button onClick={() => deletePromotion(promo.id)} style={{
                  background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 16,
                }}>×</button>
              </div>
            </div>
          </div>
        );
      })}

      {showForm ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.muted}15` }}>
          <input placeholder="Title (e.g. Happy Hour)" value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
          <input placeholder="Discount text (e.g. 20% off all wine)" value={draft.discount_text} onChange={e => setDraft(p => ({ ...p, discount_text: e.target.value }))} style={inputStyle} />
          <input placeholder="Description (optional)" value={draft.description} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))} style={inputStyle} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <label style={{ fontSize: 10, color: theme.muted }}>Start Date</label>
              <input type="date" value={draft.start_date} onChange={e => setDraft(p => ({ ...p, start_date: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: theme.muted }}>End Date</label>
              <input type="date" value={draft.end_date} onChange={e => setDraft(p => ({ ...p, end_date: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["NEW", "LIMITED", "HOT", "SEASONAL", "DAILY", "WEEKENDS"].map(b => (
              <button key={b} onClick={() => setDraft(p => ({ ...p, badge_text: p.badge_text === b ? "" : b }))} style={{
                padding: "4px 8px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600,
                background: draft.badge_text === b ? theme.accent : `${theme.muted}15`,
                color: draft.badge_text === b ? "#fff" : theme.text,
              }}>{b}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button onClick={save} disabled={!draft.title} style={{
              flex: 1, padding: "8px", borderRadius: 6, border: "none",
              background: draft.title ? theme.accent : `${theme.muted}30`,
              color: draft.title ? "#fff" : theme.muted,
              cursor: draft.title ? "pointer" : "not-allowed",
              fontSize: 12, fontWeight: 500, fontFamily: "'Outfit', sans-serif",
            }}>Save Promotion</button>
            <button onClick={() => { setShowForm(false); setDraft(blank); }} style={{
              padding: "8px 12px", borderRadius: 6, border: `1px solid ${theme.muted}20`,
              background: "transparent", color: theme.muted, cursor: "pointer", fontSize: 12,
              fontFamily: "'Outfit', sans-serif",
            }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => setShowForm(true)} style={{
            flex: 1, padding: "10px", borderRadius: 8,
            border: `1px dashed ${theme.muted}30`, background: "transparent",
            color: theme.accent, cursor: "pointer", fontSize: 12, fontWeight: 500,
            fontFamily: "'Outfit', sans-serif",
          }}>+ Add Promotion</button>
          <button onClick={resetPromotions} title="Restore default promotions" style={{
            padding: "10px 12px", borderRadius: 8,
            border: `1px solid ${theme.muted}20`, background: "transparent",
            color: theme.muted, cursor: "pointer", fontSize: 12,
            fontFamily: "'Outfit', sans-serif",
          }}>Reset</button>
        </div>
      )}
    </div>
  );
}

// ── CMS: Gallery Manager ──────────────────────────────────────────
function GalleryManager({ theme }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [cmsConnected, setCmsConnected] = useState(null);

  useEffect(() => {
    fetch("/api/content?resource=gallery")
      .then(r => r.json())
      .then(data => { setImages(Array.isArray(data) ? data : []); setCmsConnected(true); })
      .catch(() => setCmsConnected(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const token = sessionStorage.getItem("tse_admin_token");

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const uploadResp = await fetch("/api/content?resource=upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ filename: file.name, base64Data: base64, contentType: file.type, folder: "gallery" }),
      });
      const { url } = await uploadResp.json();

      const galleryResp = await fetch("/api/content?resource=gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ image_url: url, alt_text: file.name, is_visible: true, sort_order: images.length }),
      });
      const newImage = await galleryResp.json();
      setImages(prev => [...prev, newImage]);
    } catch (err) { console.error("Upload failed:", err); }
    finally { setUploading(false); }
  };

  const deleteImage = async (id) => {
    const token = sessionStorage.getItem("tse_admin_token");
    try {
      await fetch("/api/content?resource=gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) { console.error("Delete failed:", err); }
  };

  if (cmsConnected === false) {
    return (
      <div style={{ padding: 16, borderRadius: 10, background: `${theme.accent}08`, border: `1px solid ${theme.accent}20`, fontSize: 12, color: theme.muted, lineHeight: 1.6 }}>
        <strong style={{ color: theme.heading }}>CMS not connected</strong><br/>
        Connect Supabase to manage gallery images. See CMS_SETUP.md.
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12,
      }}>
        {images.map(img => (
          <div key={img.id} style={{ position: "relative", aspectRatio: "1", borderRadius: 8, overflow: "hidden", background: `${theme.muted}10` }}>
            <img src={img.image_url} alt={img.alt_text || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button onClick={() => deleteImage(img.id)} style={{
              position: "absolute", top: 4, right: 4, width: 20, height: 20,
              borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)",
              color: "#fff", fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>×</button>
          </div>
        ))}
      </div>
      <label style={{
        display: "block", width: "100%", padding: "12px", borderRadius: 8, textAlign: "center",
        border: `1px dashed ${theme.muted}30`, background: "transparent",
        color: uploading ? theme.muted : theme.accent, cursor: uploading ? "wait" : "pointer",
        fontSize: 12, fontWeight: 500, fontFamily: "'Outfit', sans-serif",
      }}>
        {uploading ? "Uploading..." : "+ Upload Image"}
        <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
      </label>
      <div style={{ fontSize: 11, color: theme.muted, marginTop: 8, lineHeight: 1.5 }}>
        Images appear in the homepage gallery grid. Max 1GB free storage on Supabase.
      </div>
    </div>
  );
}

// ── Structured Data (JSON-LD for Local SEO) ────────────────────────
function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "The Sixth Element",
    "description": "Specialty coffee by day, natural wine by night. A space designed to transform with you. Richmond-upon-Thames.",
    "url": "https://thesixthelement.co.uk",
    "telephone": "+44(0)20 35188688",
    "email": "info@the6thelement.co.uk",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "210 Upper Richmond Road West",
      "addressLocality": "London",
      "addressRegion": "London",
      "postalCode": "SW14 8AH",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.4613,
      "longitude": -0.3037
    },
    "servesCuisine": ["Coffee", "Brunch", "Wine Bar"],
    "priceRange": "££",
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "22:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday","Sunday"], "opens": "09:00", "closes": "23:00" }
    ],
    "sameAs": [
      "https://www.instagram.com/the.sixth.element.210"
    ],
    "keywords": "Specialty Coffee Richmond, Brunch near Richmond Park, Evening drinks Richmond, Natural Wine Richmond, Social Impact Coffee Richmond, Best brunch Richmond-upon-Thames",
    "hasMenu": {
      "@type": "Menu",
      "url": "https://thesixthelement.co.uk/menu"
    },
    "acceptsReservations": true
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── Footer ─────────────────────────────────────────────────────────
function Footer({ theme, navigate }) {
  return (
    <footer style={{
      padding: "60px 24px 40px",
      borderTop: `1px solid ${theme.muted}15`,
      background: theme.surface,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40, marginBottom: 40,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <Logomark size={40} color={theme.accent} />
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: theme.heading }}>
                The Sixth Element
              </div>
            </div>
            <p style={{ fontSize: 13, color: theme.muted, fontWeight: 300, lineHeight: 1.7 }}>
              Specialty coffee by day, natural wine by night. A space designed to transform with you.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.muted, fontWeight: 600, marginBottom: 16 }}>
              Navigate
            </div>
            {["home","menu","impact","about","contact"].map(p => (
              <button key={p} onClick={() => navigate(p)} style={{
                display: "block", background: "none", border: "none", cursor: "pointer",
                color: theme.text, fontSize: 13, fontWeight: 300, padding: "4px 0",
                fontFamily: "'Outfit', sans-serif", textTransform: "capitalize",
              }}>
                {p === "impact" ? "Social Impact" : p === "about" ? "Our Story" : p}
              </button>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.muted, fontWeight: 600, marginBottom: 16 }}>
              Connect
            </div>
            {["Instagram","Facebook","TikTok"].map(s => (
              <div key={s} style={{ fontSize: 13, color: theme.text, fontWeight: 300, padding: "4px 0", cursor: "pointer" }}>
                {s}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: theme.muted, fontWeight: 600, marginBottom: 16 }}>
              Hours
            </div>
            <div style={{ fontSize: 13, color: theme.text, fontWeight: 300, lineHeight: 1.7 }}>
              Mon – Fri: 8am – 10pm<br />
              Sat – Sun: 9am – 11pm
            </div>
          </div>
        </div>
        <div style={{
          borderTop: `1px solid ${theme.muted}15`, paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ fontSize: 12, color: theme.muted, fontWeight: 300 }}>
            © 2026 The Sixth Element. Richmond-upon-Thames.
          </div>
          <div style={{ fontSize: 12, color: theme.muted, fontWeight: 300, display: "flex", gap: 16 }}>
            <span style={{ cursor: "pointer" }}>Privacy</span>
            <span style={{ cursor: "pointer" }}>Terms</span>
            <span style={{ cursor: "pointer" }}>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
