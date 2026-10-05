// src/utils/csvMenuParser.js
// Robust CSV generation, parsing, linting, and export for The Sixth Element menus

import { MENU_DATA } from "../data/menuData.js";

/**
 * Escapes a field for CSV according to RFC 4180 rules.
 */
function escapeCsv(val) {
  if (val == null) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts a structured menu object into a standard CSV string.
 * @param {Object} menuData - Structured menu object
 * @returns {string} Standard CSV format
 */
export function menuToCsv(menuData = MENU_DATA) {
  const headers = ["Category", "Section", "Name", "Price", "Description", "DietaryTags"];
  const rows = [headers.join(",")];

  for (const [catKey, cat] of Object.entries(menuData || {})) {
    const sections = cat.sections || [];
    for (const section of sections) {
      const items = section.items || [];
      for (const item of items) {
        const tags = Array.isArray(item.tags) ? item.tags.join("; ") : (item.tags || "");
        const row = [
          escapeCsv(catKey),
          escapeCsv(section.name || "General"),
          escapeCsv(item.name || ""),
          escapeCsv(item.price || ""),
          escapeCsv(item.desc || ""),
          escapeCsv(tags),
        ];
        rows.push(row.join(","));
      }
    }
  }

  return rows.join("\r\n");
}

/**
 * Triggers a browser download of the menu as a .csv file.
 * @param {Object} menuData - Structured menu object
 * @param {string} [filename] - Desired filename
 */
export function downloadMenuCsv(menuData = MENU_DATA, filename = "the_sixth_element_menu.csv") {
  const csvContent = menuToCsv(menuData);
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Low-level RFC 4180 CSV tokenizer that correctly handles commas, quotes, and newlines.
 * @param {string} text - Raw CSV string
 * @returns {Array<Array<string>>} 2D array of parsed rows
 */
function parseRawCsv(text) {
  const rows = [];
  let currentRow = [];
  let currentVal = "";
  let insideQuotes = false;
  let i = 0;

  // Strip UTF-8 BOM if present
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote ("")
          currentVal += '"';
          i += 2;
          continue;
        } else {
          // Closing quote
          insideQuotes = false;
          i++;
          continue;
        }
      } else {
        currentVal += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
        i++;
        continue;
      } else if (char === ",") {
        currentRow.push(currentVal.trim());
        currentVal = "";
        i++;
        continue;
      } else if (char === "\r") {
        if (nextChar === "\n") i++;
        currentRow.push(currentVal.trim());
        rows.push(currentRow);
        currentRow = [];
        currentVal = "";
        i++;
        continue;
      } else if (char === "\n") {
        currentRow.push(currentVal.trim());
        rows.push(currentRow);
        currentRow = [];
        currentVal = "";
        i++;
        continue;
      } else {
        currentVal += char;
        i++;
        continue;
      }
    }
  }

  // Push last value and row if remaining
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    rows.push(currentRow);
  }

  // Filter out any completely blank rows
  return rows.filter(r => r.length > 0 && r.some(c => c !== ""));
}

/**
 * Parses and validates an uploaded CSV file into the structured menu format.
 * Returns { success, menu, stats, warnings, error }
 */
export function csvToMenu(csvText, baseMenu = MENU_DATA) {
  if (!csvText || typeof csvText !== "string" || !csvText.trim()) {
    return { success: false, error: "The CSV file appears to be empty." };
  }

  const rawRows = parseRawCsv(csvText);
  if (rawRows.length < 2) {
    return { success: false, error: "The CSV file must contain a header row and at least one item row." };
  }

  const headerRow = rawRows[0].map(h => h.toLowerCase().replace(/[^a-z]/g, ""));
  
  // Find column indices with flexible name matching
  const catIdx = headerRow.findIndex(h => h.includes("cat"));
  const secIdx = headerRow.findIndex(h => h.includes("sec"));
  const nameIdx = headerRow.findIndex(h => h.includes("name") || h.includes("item") || h.includes("dish"));
  const priceIdx = headerRow.findIndex(h => h.includes("price") || h.includes("cost"));
  const descIdx = headerRow.findIndex(h => h.includes("desc"));
  const tagsIdx = headerRow.findIndex(h => h.includes("tag") || h.includes("diet"));

  if (nameIdx === -1) {
    return { success: false, error: "Required column 'Name' (or 'Item') was not found in the CSV header." };
  }

  const warnings = [];
  let itemCount = 0;

  // Build cloned base structure
  const resultMenu = {
    daytime: {
      title: "Daytime",
      subtitle: baseMenu.daytime?.subtitle || "Served 8am – 2pm · Inspired by the five elements",
      icon: "☀️",
      sections: [],
    },
    evening: {
      title: "Evening",
      subtitle: baseMenu.evening?.subtitle || "Modern Indian · Served from 5pm",
      icon: "🌙",
      sections: [],
    },
  };

  // Process rows
  for (let r = 1; r < rawRows.length; r++) {
    const row = rawRows[r];
    const rowNum = r + 1;

    let catRaw = (catIdx !== -1 && row[catIdx] ? row[catIdx] : "daytime").toLowerCase();
    const catKey = catRaw.includes("even") || catRaw.includes("night") || catRaw.includes("pm") ? "evening" : "daytime";

    const sectionName = (secIdx !== -1 && row[secIdx] ? row[secIdx] : "General").trim();
    const itemName = (row[nameIdx] || "").trim();

    if (!itemName) {
      warnings.push(`Row ${rowNum}: Skipped row with missing item name.`);
      continue;
    }

    let price = priceIdx !== -1 && row[priceIdx] ? row[priceIdx].trim() : "0";
    // Strip leading currency symbols if user typed £12 or $12
    price = price.replace(/^[£$€]/, "").trim();
    if (!price || isNaN(Number(price))) {
      warnings.push(`Row ${rowNum} ("${itemName}"): Price '${price}' is non-numeric, keeping as string.`);
    }

    const desc = descIdx !== -1 && row[descIdx] ? row[descIdx].trim() : "";
    
    // Parse tags: allow comma or semicolon separated tags like "V, GF*" or "V; GF"
    let tags = [];
    if (tagsIdx !== -1 && row[tagsIdx]) {
      tags = row[tagsIdx]
        .split(/[;,]/)
        .map(t => t.trim().toUpperCase())
        .filter(Boolean);
    }

    // Locate or create section in the appropriate category
    let targetCategory = resultMenu[catKey];
    let section = targetCategory.sections.find(s => s.name.toLowerCase() === sectionName.toLowerCase());
    if (!section) {
      section = { name: sectionName, items: [] };
      targetCategory.sections.push(section);
    }

    section.items.push({
      name: itemName,
      desc,
      price,
      tags,
    });

    itemCount++;
  }

  if (itemCount === 0) {
    return { success: false, error: "No valid menu items could be read from this CSV file." };
  }

  const sectionsCount = resultMenu.daytime.sections.length + resultMenu.evening.sections.length;

  return {
    success: true,
    menu: resultMenu,
    stats: {
      itemsCount: itemCount,
      sectionsCount,
      daytimeSections: resultMenu.daytime.sections.length,
      eveningSections: resultMenu.evening.sections.length,
    },
    warnings,
  };
}
