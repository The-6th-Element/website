// src/hooks/useContent.js
import { useState, useEffect } from "react";
import { MENU_DATA } from "../data/menuData";
import { DEFAULT_PROMOTIONS } from "../data/config";

export function isPromoLive(p) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    p.is_active &&
    (!p.start_date || p.start_date <= today) &&
    (!p.end_date || p.end_date >= today)
  );
}



// ── Promotions Hook (browser-persisted with instant real-time sync) ──
export function usePromotions() {
  const [promotions, setPromotions] = useState(() => {
    try {
      const saved = localStorage.getItem("tse_promotions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If christmas-2026 is missing from user's cached storage, prepend it
          const hasXmas = parsed.some((p) => p.id === "christmas-2026");
          if (!hasXmas) {
            const xmas = DEFAULT_PROMOTIONS.find((p) => p.id === "christmas-2026");
            if (xmas) return [xmas, ...parsed];
          }
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_PROMOTIONS;
  });
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem("tse_promotions");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const hasXmas = parsed.some((p) => p.id === "christmas-2026");
            if (!hasXmas) {
              const xmas = DEFAULT_PROMOTIONS.find((p) => p.id === "christmas-2026");
              if (xmas) return setPromotions([xmas, ...parsed]);
            }
            setPromotions(parsed);
            return;
          }
        }
        setPromotions(DEFAULT_PROMOTIONS);
      } catch {}
    };
    window.addEventListener("tse_promotions_updated", handleSync);
    return () => window.removeEventListener("tse_promotions_updated", handleSync);
  }, []);

  const persist = (next) => {
    setPromotions(next);
    setSaveState("saving");
    try {
      localStorage.setItem("tse_promotions", JSON.stringify(next));
      window.dispatchEvent(new Event("tse_promotions_updated"));
      setSaveState("saved");
      if (typeof window !== "undefined") {
        setTimeout(() => {
          try {
            if (typeof window !== "undefined") setSaveState("idle");
          } catch {}
        }, 2500);
      }
    } catch {
      setSaveState("error");
    }
  };

  const addPromotion = (promo) => persist([...promotions, { ...promo, id: `promo-${Date.now()}` }]);
  const updatePromotion = (id, patch) => persist(promotions.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const deletePromotion = (id) => persist(promotions.filter((p) => p.id !== id));
  const resetPromotions = () => {
    try {
      localStorage.removeItem("tse_promotions");
    } catch {}
    window.dispatchEvent(new Event("tse_promotions_updated"));
    persist(DEFAULT_PROMOTIONS);
  };

  return { promotions, status: "connected", saveState, addPromotion, updatePromotion, deletePromotion, resetPromotions };
}

// Normalizes menu categories into a consistent { title, subtitle, icon, sections } shape
function normalizeMenu(menu) {
  const out = {};
  for (const [key, cat] of Object.entries(menu || {})) {
    const { sections, sections_live, sections_teaser, subtitle, subtitle_live, subtitle_teaser, ...rest } = cat || {};
    out[key] = {
      ...rest,
      subtitle: subtitle ?? subtitle_live ?? subtitle_teaser ?? "",
      sections: sections ?? sections_live ?? sections_teaser ?? [],
    };
  }
  return out;
}

export function useMenu() {
  const [localCustom, setLocalCustom] = useState(() => {
    try {
      const saved = localStorage.getItem("tse_custom_menu");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const activeRaw = localCustom || MENU_DATA;
  const menu = normalizeMenu(activeRaw);
  const [saveState, setSaveState] = useState("idle");

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem("tse_custom_menu");
        setLocalCustom(saved ? JSON.parse(saved) : null);
      } catch {}
    };
    window.addEventListener("tse_menu_updated", handleSync);
    return () => window.removeEventListener("tse_menu_updated", handleSync);
  }, []);

  const persist = (next) => {
    setLocalCustom(next);
    setSaveState("saving");
    try {
      if (next) {
        localStorage.setItem("tse_custom_menu", JSON.stringify(next));
      } else {
        localStorage.removeItem("tse_custom_menu");
      }
      window.dispatchEvent(new Event("tse_menu_updated"));
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
    }
  };

  const saveMenu = (next) => persist(next);
  const resetMenu = () => persist(null);

  return { menu, status: "connected", saveState, saveMenu, resetMenu, isCustom: Boolean(localCustom) };
}
