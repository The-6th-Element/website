// src/hooks/useFeatureFlags.js
import { useState } from "react";

// Feature Flags (persisted in localStorage)
const DEFAULT_FLAGS = {
  instagram_feed: true,     // show/hide Instagram grid
  booking_enabled: true,    // enable/disable reservations
  pm_switch_hour: 14,       // UK hour (24h) when the site switches to evening/dark mode
  menu_evening_hour: 17,    // UK hour when the Menu page defaults to the Evening menu
};

export function useFeatureFlags() {
  const [flags, setFlags] = useState(() => {
    try {
      const saved = localStorage.getItem("tse_flags");
      return saved ? { ...DEFAULT_FLAGS, ...JSON.parse(saved) } : DEFAULT_FLAGS;
    } catch {
      return DEFAULT_FLAGS;
    }
  });

  const updateFlag = (key, value) => {
    setFlags((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem("tse_flags", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const resetFlags = () => {
    try {
      localStorage.removeItem("tse_flags");
    } catch {}
    setFlags(DEFAULT_FLAGS);
  };

  return { flags, updateFlag, resetFlags };
}
