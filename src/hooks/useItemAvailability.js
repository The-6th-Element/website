// src/hooks/useItemAvailability.js
// Reactive Hook & Storage for Menu Item Availability / 86ing (Feature: BK-12)
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "tse_86_items";
const EVENT_KEY = "tse_availability_updated";

/**
 * Reads list of sold-out item names from localStorage.
 */
export function getStoredSoldOutItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persists sold-out items to localStorage and dispatches a cross-tab sync event.
 */
export function saveSoldOutItems(items) {
  try {
    if (!items || items.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(new Set(items))));
    }
  } catch {}
  window.dispatchEvent(new Event(EVENT_KEY));
}

/**
 * React hook for consuming and updating sold-out (86'd) menu items.
 */
export function useItemAvailability() {
  const [soldOutList, setSoldOutList] = useState(getStoredSoldOutItems);

  // Sync state on custom event across components / tabs
  useEffect(() => {
    const handleSync = () => {
      setSoldOutList(getStoredSoldOutItems());
    };
    window.addEventListener(EVENT_KEY, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(EVENT_KEY, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const isSoldOut = useCallback(
    (itemName) => {
      if (!itemName) return false;
      return soldOutList.includes(itemName.trim());
    },
    [soldOutList]
  );

  const toggleSoldOut = useCallback(
    (itemName) => {
      if (!itemName) return;
      const cleanName = itemName.trim();
      const current = getStoredSoldOutItems();
      const next = current.includes(cleanName)
        ? current.filter((n) => n !== cleanName)
        : [...current, cleanName];
      saveSoldOutItems(next);
      setSoldOutList(next);
    },
    []
  );

  const markSoldOut = useCallback(
    (itemName) => {
      if (!itemName) return;
      const cleanName = itemName.trim();
      const current = getStoredSoldOutItems();
      if (!current.includes(cleanName)) {
        const next = [...current, cleanName];
        saveSoldOutItems(next);
        setSoldOutList(next);
      }
    },
    []
  );

  const markAvailable = useCallback(
    (itemName) => {
      if (!itemName) return;
      const cleanName = itemName.trim();
      const current = getStoredSoldOutItems();
      if (current.includes(cleanName)) {
        const next = current.filter((n) => n !== cleanName);
        saveSoldOutItems(next);
        setSoldOutList(next);
      }
    },
    []
  );

  const resetAllAvailable = useCallback(() => {
    saveSoldOutItems([]);
    setSoldOutList([]);
  }, []);

  return {
    soldOutItems: soldOutList,
    soldOutCount: soldOutList.length,
    isSoldOut,
    toggleSoldOut,
    markSoldOut,
    markAvailable,
    resetAllAvailable,
  };
}
