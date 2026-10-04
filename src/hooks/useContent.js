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

export async function saveContentKey(key, value) {
  const token = sessionStorage.getItem("tse_admin_token");
  const resp = await fetch("/api/content?resource=content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ key, value }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || "Save failed");
  }
  return resp.json();
}

// Loads one site_content key. status: "loading" | "connected" | "offline".
export function useContentKey(key, fallback) {
  const [value, setValue] = useState(fallback);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;
    fetch("/api/content?resource=content")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("cms"))))
      .then((map) => {
        if (!alive) return;
        if (map && map[key] != null) setValue(map[key]);
        setStatus("connected");
      })
      .catch(() => {
        if (alive) setStatus("offline");
      });
    return () => {
      alive = false;
    };
  }, [key]);

  return [value, setValue, status];
}

export function usePromotions() {
  const [promotions, setPromotions, status] = useContentKey("promotions", DEFAULT_PROMOTIONS);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error

  const persist = (next) => {
    setPromotions(next);
    setSaveState("saving");
    saveContentKey("promotions", next)
      .then(() => setSaveState("saved"))
      .catch(() => setSaveState("error"));
  };

  const addPromotion = (promo) => persist([...promotions, { ...promo, id: `promo-${Date.now()}` }]);
  const updatePromotion = (id, patch) => persist(promotions.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const deletePromotion = (id) => persist(promotions.filter((p) => p.id !== id));
  const resetPromotions = () => persist(DEFAULT_PROMOTIONS);

  return { promotions, status, saveState, addPromotion, updatePromotion, deletePromotion, resetPromotions };
}

// Normalizes menu categories into a consistent { title, subtitle, icon, sections } shape
export function normalizeMenu(menu) {
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

  const [raw, setMenu, status] = useContentKey("menu_data", localCustom || MENU_DATA);
  const activeRaw = localCustom || raw || MENU_DATA;
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
    try {
      if (next) {
        localStorage.setItem("tse_custom_menu", JSON.stringify(next));
      } else {
        localStorage.removeItem("tse_custom_menu");
      }
    } catch {}
    window.dispatchEvent(new Event("tse_menu_updated"));

    setMenu(next || MENU_DATA);
    setSaveState("saving");
    saveContentKey("menu_data", next || MENU_DATA)
      .then(() => setSaveState("saved"))
      .catch(() => setSaveState("saved"));
  };

  const saveMenu = (next) => persist(next);
  const resetMenu = () => persist(null);

  return { menu, status, saveState, saveMenu, resetMenu, isCustom: Boolean(localCustom) };
}
