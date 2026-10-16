// src/data/operatingHours.js
// ⏰ FEATURE-83 (GBP-06 / TOAST-04): Omnichannel Operating Hours Single Source of Truth
// Synchronizes opening schedules across The Website, Google Business Profile, Deliveroo, and Toast POS.

export const STORAGE_KEY_OPERATING_HOURS = "t6e_operating_hours_v1";

export const DEFAULT_WEEKLY_SCHEDULE = [
  { day: "Monday", shortDay: "Mon", open: true, openTime: "08:00", closeTime: "22:00", daytime: "08:00 - 15:00", evening: "17:00 - 22:00" },
  { day: "Tuesday", shortDay: "Tue", open: true, openTime: "08:00", closeTime: "22:00", daytime: "08:00 - 15:00", evening: "17:00 - 22:00" },
  { day: "Wednesday", shortDay: "Wed", open: true, openTime: "08:00", closeTime: "22:00", daytime: "08:00 - 15:00", evening: "17:00 - 22:00" },
  { day: "Thursday", shortDay: "Thu", open: true, openTime: "08:00", closeTime: "22:00", daytime: "08:00 - 15:00", evening: "17:00 - 22:00" },
  { day: "Friday", shortDay: "Fri", open: true, openTime: "08:00", closeTime: "23:00", daytime: "08:00 - 15:00", evening: "17:00 - 23:00" },
  { day: "Saturday", shortDay: "Sat", open: true, openTime: "09:00", closeTime: "23:00", daytime: "09:00 - 16:00", evening: "17:00 - 23:00" },
  { day: "Sunday", shortDay: "Sun", open: true, openTime: "09:00", closeTime: "21:00", daytime: "09:00 - 16:00", evening: "17:00 - 21:00" },
];

export const DEFAULT_HOLIDAY_SCHEDULE = [
  { id: "xmas-eve-2026", date: "2026-12-24", name: "Christmas Eve", isClosed: false, openTime: "09:00", closeTime: "18:00", note: "Festive Daytime Brunch & Early Drinks" },
  { id: "xmas-day-2026", date: "2026-12-25", name: "Christmas Day", isClosed: true, openTime: "", closeTime: "", note: "Closed for Christmas Day celebrations" },
  { id: "boxing-day-2026", date: "2026-12-26", name: "Boxing Day", isClosed: false, openTime: "10:00", closeTime: "20:00", note: "Boxing Day Brunch & Warm Stews" },
  { id: "nye-2026", date: "2026-12-31", name: "New Year's Eve", isClosed: false, openTime: "09:00", closeTime: "01:00", note: "NYE Gala Dinner & Late Cocktails" },
  { id: "nyd-2027", date: "2027-01-01", name: "New Year's Day", isClosed: false, openTime: "10:00", closeTime: "18:00", note: "New Year Hangover Brunch & Coffee" },
];

export const DEFAULT_EMERGENCY_NOTICE = {
  enabled: false,
  badge: "Special Notice",
  message: "",
  type: "info", // "info" | "warning" | "closure"
};

/**
 * Get current configured operating hours from localStorage or defaults
 */
export function getOperatingHoursConfig() {
  if (typeof window === "undefined") {
    return {
      weekly: DEFAULT_WEEKLY_SCHEDULE,
      holidays: DEFAULT_HOLIDAY_SCHEDULE,
      emergencyNotice: DEFAULT_EMERGENCY_NOTICE,
      lastSyncedAt: null,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_OPERATING_HOURS);
    if (!raw) {
      return {
        weekly: DEFAULT_WEEKLY_SCHEDULE,
        holidays: DEFAULT_HOLIDAY_SCHEDULE,
        emergencyNotice: DEFAULT_EMERGENCY_NOTICE,
        lastSyncedAt: null,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      weekly: parsed.weekly || DEFAULT_WEEKLY_SCHEDULE,
      holidays: parsed.holidays || DEFAULT_HOLIDAY_SCHEDULE,
      emergencyNotice: parsed.emergencyNotice || DEFAULT_EMERGENCY_NOTICE,
      lastSyncedAt: parsed.lastSyncedAt || null,
    };
  } catch (e) {
    console.warn("Failed to parse stored operating hours:", e);
    return {
      weekly: DEFAULT_WEEKLY_SCHEDULE,
      holidays: DEFAULT_HOLIDAY_SCHEDULE,
      emergencyNotice: DEFAULT_EMERGENCY_NOTICE,
      lastSyncedAt: null,
    };
  }
}

/**
 * Save updated operating schedule and broadcast changes across the app
 */
export function saveOperatingHoursConfig(newConfig) {
  if (typeof window === "undefined") return newConfig;
  const toSave = {
    ...newConfig,
    lastSyncedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY_OPERATING_HOURS, JSON.stringify(toSave));
  window.dispatchEvent(new CustomEvent("tse_operating_hours_updated", { detail: toSave }));
  return toSave;
}

/**
 * Format "08:00" to "8am", "22:00" to "10pm"
 */
export function formatTime12h(time24) {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  if (m === 0) return `${h12}${suffix}`;
  return `${h12}:${mStr.padStart(2, "0")}${suffix}`;
}

/**
 * Get human-readable summary for Footer and compact displays.
 * Dynamically groups consecutive days sharing identical schedules and respects closed days.
 */
export function getFormattedHoursSummary(weekly = DEFAULT_WEEKLY_SCHEDULE) {
  if (!weekly || weekly.length === 0) {
    return { line1: "All Days: Closed", line2: "", line3: "", lines: ["All Days: Closed"], fullText: "Closed" };
  }

  // Group consecutive days that share the exact same schedule
  const groups = [];
  let currentGroup = null;

  for (const item of weekly) {
    const scheduleKey = item.open
      ? `OPEN_${item.openTime}_${item.closeTime}`
      : "CLOSED";

    if (!currentGroup) {
      currentGroup = {
        days: [item],
        scheduleKey,
        open: item.open,
        openTime: item.openTime,
        closeTime: item.closeTime,
      };
    } else if (currentGroup.scheduleKey === scheduleKey) {
      currentGroup.days.push(item);
    } else {
      groups.push(currentGroup);
      currentGroup = {
        days: [item],
        scheduleKey,
        open: item.open,
        openTime: item.openTime,
        closeTime: item.closeTime,
      };
    }
  }
  if (currentGroup) {
    groups.push(currentGroup);
  }

  // Format each group into a line
  const lines = groups.map((g) => {
    let dayLabel = "";
    const firstDay = g.days[0].shortDay || g.days[0].day.slice(0, 3);
    const lastDay = g.days[g.days.length - 1].shortDay || g.days[g.days.length - 1].day.slice(0, 3);

    if (g.days.length === 1) {
      dayLabel = g.days[0].day === "Friday" ? "Friday" : firstDay;
    } else if (g.days.length === 2) {
      dayLabel = `${firstDay} – ${lastDay}`;
    } else {
      dayLabel = `${firstDay} – ${lastDay}`;
    }

    if (!g.open) {
      return `${dayLabel}: Closed`;
    }

    const timeStr = `${formatTime12h(g.openTime)} – ${formatTime12h(g.closeTime)}`;
    return `${dayLabel}: ${timeStr}`;
  });

  return {
    line1: lines[0] || "",
    line2: lines[1] || "",
    line3: lines.slice(2).join(" · ") || "",
    lines,
    fullText: lines.join(" | "),
  };
}

/**
 * Determine real-time open/closed status for current London time
 */
export function getLiveOperatingStatus(config = getOperatingHoursConfig(), testDate = null) {
  const now = testDate ? new Date(testDate) : new Date();

  // Emergency Closure Check
  if (config.emergencyNotice?.enabled && config.emergencyNotice?.type === "closure") {
    return {
      isOpen: false,
      status: "emergency-closed",
      badge: "Temporarily Closed",
      color: "#D9534F",
      detail: config.emergencyNotice.message || "Temporarily closed for a private event",
    };
  }

  // Get current date string (YYYY-MM-DD) in London time
  const londonDateStr = now.toLocaleDateString("en-CA", { timeZone: "Europe/London" }); // YYYY-MM-DD
  const londonDayName = now.toLocaleDateString("en-GB", { timeZone: "Europe/London", weekday: "long" });
  
  // Current minutes from midnight in London
  const londonTimeParts = now.toLocaleTimeString("en-GB", { timeZone: "Europe/London", hour12: false }).split(":");
  const currentMinutes = parseInt(londonTimeParts[0], 10) * 60 + parseInt(londonTimeParts[1], 10);

  // 1. Check for Holiday Override today
  const holidayToday = (config.holidays || []).find((h) => h.date === londonDateStr);
  if (holidayToday) {
    if (holidayToday.isClosed) {
      return {
        isOpen: false,
        status: "holiday-closed",
        badge: "Closed Today",
        color: "#999999",
        detail: `${holidayToday.name} · ${holidayToday.note || "Closed for holiday"}`,
        isHoliday: true,
      };
    }

    const [oh, om] = (holidayToday.openTime || "09:00").split(":").map(Number);
    const [ch, cm] = (holidayToday.closeTime || "18:00").split(":").map(Number);
    const openMins = oh * 60 + om;
    const closeMins = ch * 60 + cm;

    if (currentMinutes >= openMins && currentMinutes < closeMins) {
      const closingSoon = closeMins - currentMinutes <= 30;
      return {
        isOpen: true,
        status: closingSoon ? "closing-soon" : "holiday-open",
        badge: closingSoon ? "Closing Soon" : "Open Today",
        color: closingSoon ? "#E67E22" : "#2ECC71",
        detail: `${holidayToday.name} Special Hours: Until ${formatTime12h(holidayToday.closeTime)}`,
        isHoliday: true,
      };
    } else if (currentMinutes < openMins) {
      return {
        isOpen: false,
        status: "closed",
        badge: "Closed",
        color: "#999999",
        detail: `${holidayToday.name} · Opens at ${formatTime12h(holidayToday.openTime)}`,
        isHoliday: true,
      };
    } else {
      return {
        isOpen: false,
        status: "closed",
        badge: "Closed",
        color: "#999999",
        detail: `Closed for ${holidayToday.name}. Reopens tomorrow`,
        isHoliday: true,
      };
    }
  }

  // 2. Regular Weekly Schedule Check
  const daySchedule = (config.weekly || DEFAULT_WEEKLY_SCHEDULE).find((w) => w.day === londonDayName) || config.weekly?.[0];
  if (!daySchedule || !daySchedule.open) {
    return {
      isOpen: false,
      status: "closed",
      badge: "Closed Today",
      color: "#999999",
      detail: "Closed today",
    };
  }

  const [oh, om] = daySchedule.openTime.split(":").map(Number);
  const [ch, cm] = daySchedule.closeTime.split(":").map(Number);
  const openMins = oh * 60 + om;
  let closeMins = ch * 60 + cm;
  // Handle past-midnight closes (e.g. 01:00 = 25:00)
  if (closeMins < openMins) closeMins += 24 * 60;

  if (currentMinutes >= openMins && currentMinutes < closeMins) {
    const isClosingSoon = closeMins - currentMinutes <= 45;
    
    // Check daytime vs evening service transition
    let serviceLabel = "Open Now";
    if (daySchedule.daytime && currentMinutes < 15 * 60) {
      serviceLabel = "Daytime Brunch & Coffee";
    } else if (daySchedule.evening && currentMinutes >= 17 * 60) {
      serviceLabel = "Evening Drinks & Dining";
    }

    return {
      isOpen: true,
      status: isClosingSoon ? "closing-soon" : "open",
      badge: isClosingSoon ? "Closing Soon" : "Open Now",
      color: isClosingSoon ? "#E67E22" : "#2ECC71",
      detail: isClosingSoon
        ? `Closing at ${formatTime12h(daySchedule.closeTime)}`
        : `${serviceLabel} until ${formatTime12h(daySchedule.closeTime)}`,
    };
  }

  if (currentMinutes < openMins) {
    return {
      isOpen: false,
      status: "closed",
      badge: "Closed",
      color: "#999999",
      detail: `Opens today at ${formatTime12h(daySchedule.openTime)}`,
    };
  }

  // After closing: find next day's open time
  const dayIndex = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(londonDayName);
  const nextDayName = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][(dayIndex + 1) % 7];
  const nextDaySchedule = (config.weekly || DEFAULT_WEEKLY_SCHEDULE).find((w) => w.day === nextDayName);

  return {
    isOpen: false,
    status: "closed",
    badge: "Closed",
    color: "#999999",
    detail: `Opens tomorrow (${nextDayName.slice(0, 3)}) at ${formatTime12h(nextDaySchedule?.openTime || "08:00")}`,
  };
}

/**
 * Generate Schema.org JSON-LD OpeningHoursSpecification array
 */
export function getStructuredDataOpeningHours(weekly = DEFAULT_WEEKLY_SCHEDULE) {
  return weekly
    .filter((w) => w.open)
    .map((w) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [w.day],
      opens: w.openTime,
      closes: w.closeTime,
    }));
}

/**
 * Generate Google Business Profile (GBP) API Payload for locations.patch
 */
export function getGoogleBusinessProfilePayload(config = getOperatingHoursConfig()) {
  const dayMap = {
    Monday: "MONDAY",
    Tuesday: "TUESDAY",
    Wednesday: "WEDNESDAY",
    Thursday: "THURSDAY",
    Friday: "FRIDAY",
    Saturday: "SATURDAY",
    Sunday: "SUNDAY",
  };

  const periods = (config.weekly || DEFAULT_WEEKLY_SCHEDULE)
    .filter((w) => w.open)
    .map((w) => ({
      openDay: dayMap[w.day] || w.day.toUpperCase(),
      openTime: w.openTime,
      closeDay: dayMap[w.day] || w.day.toUpperCase(),
      closeTime: w.closeTime,
    }));

  const specialHourPeriods = (config.holidays || []).map((h) => {
    const [y, m, d] = h.date.split("-").map(Number);
    if (h.isClosed) {
      return {
        startDate: { year: y, month: m, day: d },
        closed: true,
      };
    }
    return {
      startDate: { year: y, month: m, day: d },
      openTime: h.openTime,
      endDate: { year: y, month: m, day: d },
      closeTime: h.closeTime,
    };
  });

  return {
    regularHours: {
      periods,
    },
    specialHours: {
      specialHourPeriods,
    },
  };
}

/**
 * Generate Deliveroo / Toast operational guidance export
 */
export function getOmnichannelSyncPayload(config = getOperatingHoursConfig()) {
  return {
    venue: "The Sixth Element (Richmond)",
    storeCode: "06233181898163879843",
    timestamp: new Date().toISOString(),
    googleBusinessProfile: getGoogleBusinessProfilePayload(config),
    deliveroo: {
      url: "https://deliveroo.co.uk/menu/london/sheen/the-sixth-element-210-upper-richmond-road-west",
      serviceWindows: (config.weekly || DEFAULT_WEEKLY_SCHEDULE).map((w) => ({
        day: w.day,
        active: w.open,
        deliveryWindow: `${w.openTime} - ${w.closeTime}`,
        brunchMenuCutoff: w.daytime ? w.daytime.split("-")[1].trim() : "15:00",
      })),
    },
    toast: {
      restaurantGuid: "5503e03f-b188-421c-aa8f-5a2c8e27fd59",
      diningOptionsSchedules: (config.weekly || DEFAULT_WEEKLY_SCHEDULE).map((w) => ({
        day: w.day,
        dineIn: `${w.openTime} - ${w.closeTime}`,
        takeout: `${w.openTime} - ${w.closeTime}`,
      })),
    },
  };
}
