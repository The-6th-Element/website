// src/utils/menuPrintGenerator.js
// 1-Click Print-Ready PDF & Physical Menu Generator for The Sixth Element (BK-23)

export const PRINT_PRESETS = {
  a4: {
    name: "A4 Standard Dining Menu",
    pageSize: "A4",
    columns: 2,
    dimensions: "210mm × 297mm",
    fontSizeScale: 1.0,
  },
  a5: {
    name: "A5 Compact / Tabletop Card",
    pageSize: "A5",
    columns: 1,
    dimensions: "148mm × 210mm",
    fontSizeScale: 0.88,
  },
};

/**
 * Format price cleanly with £ symbol and 2 decimal places if needed.
 */
function formatPrintPrice(price) {
  if (price === undefined || price === null || price === "") return "";
  const num = typeof price === "number" ? price : parseFloat(String(price).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return String(price);
  return num % 1 === 0 ? `£${num}` : `£${num.toFixed(2)}`;
}

/**
 * Generate full self-contained HTML for print/PDF export
 */
export function generatePrintableMenuHtml({
  menuData,
  category = "all", // "daytime" | "evening" | "all"
  paperSize = "a4", // "a4" | "a5"
  showDescriptions = true,
  showPrices = true,
  showDietary = true,
  includeDateStamp = true,
  customTitle = "",
  customSubtitle = "",
}) {
  const preset = PRINT_PRESETS[paperSize] || PRINT_PRESETS.a4;
  const isA5 = paperSize === "a5";

  // Determine sections to print
  let categoriesToPrint = [];
  if (category === "daytime" && menuData.daytime) {
    categoriesToPrint.push({ key: "daytime", data: menuData.daytime });
  } else if (category === "evening" && menuData.evening) {
    categoriesToPrint.push({ key: "evening", data: menuData.evening });
  } else {
    if (menuData.daytime) categoriesToPrint.push({ key: "daytime", data: menuData.daytime });
    if (menuData.evening) categoriesToPrint.push({ key: "evening", data: menuData.evening });
    // Also include any custom top-level categories
    Object.keys(menuData).forEach((k) => {
      if (k !== "daytime" && k !== "evening" && menuData[k]?.sections) {
        categoriesToPrint.push({ key: k, data: menuData[k] });
      }
    });
  }

  // Format today's service date in London time
  const todayFormatted = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date());

  // Determine main header title and service hours
  let headerServiceTitle = customTitle;
  let headerServiceSubtitle = customSubtitle;
  if (!headerServiceTitle) {
    if (category === "daytime") {
      headerServiceTitle = "Daytime Service Menu";
      headerServiceSubtitle = "Served Daily 8:00 AM – 2:00 PM · Inspired by the Five Elements";
    } else if (category === "evening") {
      headerServiceTitle = "Evening Dining &amp; Signatures";
      headerServiceSubtitle = "Modern Indian Gastronomy · Served from 5:00 PM";
    } else {
      headerServiceTitle = "Daily Restaurant &amp; Bar Menu";
      headerServiceSubtitle = "Day to Night Dining · The Sixth Element Richmond";
    }
  }

  // Render categories and sections
  const contentHtml = categoriesToPrint
    .map(({ key, data }) => {
      const catTitle = data.title || key;
      const catSubtitle = data.subtitle || "";
      const sections = data.sections || [];

      return `
      <div class="category-block category-${key}">
        ${
          categoriesToPrint.length > 1
            ? `<div class="category-banner">
                <div class="category-title">${catTitle}</div>
                ${catSubtitle ? `<div class="category-subtitle">${catSubtitle}</div>` : ""}
              </div>`
            : ""
        }

        <div class="sections-container ${isA5 ? "single-column" : "multi-column"}">
          ${sections
            .map((section) => {
              const secName = section.name || "Untitled Section";
              const items = section.items || [];

              return `
              <div class="menu-section">
                <div class="section-header">
                  <h3 class="section-title">${secName}</h3>
                  <div class="section-rule"></div>
                </div>

                <div class="items-list">
                  ${items
                    .map((item) => {
                      const name = item.name || "Item";
                      const desc = item.desc || "";
                      const priceFormatted = formatPrintPrice(item.price);
                      const tags = Array.isArray(item.tags) ? item.tags : [];

                      return `
                      <div class="menu-item">
                        <div class="item-head">
                          <span class="item-name">${name}</span>
                          ${
                            showDietary && tags.length > 0
                              ? `<span class="dietary-tags">${tags
                                  .map((t) => `<span class="tag tag-${t.toLowerCase().replace(/[^a-z]/g, "")}">${t}</span>`)
                                  .join("")}</span>`
                              : ""
                          }
                          <span class="leader-dots"></span>
                          ${showPrices && priceFormatted ? `<span class="item-price">${priceFormatted}</span>` : ""}
                        </div>
                        ${
                          showDescriptions && desc
                            ? `<div class="item-desc">${desc}</div>`
                            : ""
                        }
                      </div>
                      `;
                    })
                    .join("")}
                </div>
              </div>
              `;
            })
            .join("")}
        </div>
      </div>
      `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${headerServiceTitle} — The Sixth Element</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');

    @page {
      size: ${preset.pageSize} portrait;
      margin: ${isA5 ? "6mm 8mm" : "8mm 10mm"};
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      margin: 0;
      padding: 0;
      background: #FFFFFF;
      color: #1A1A1A;
      font-family: 'Outfit', -apple-system, sans-serif;
      font-size: ${isA5 ? "8pt" : "8.8pt"};
      line-height: 1.35;
      -webkit-font-smoothing: antialiased;
    }

    .menu-sheet {
      width: 100%;
      max-width: ${isA5 ? "148mm" : "210mm"};
      margin: 0 auto;
      padding: 0;
      background: #FFFFFF;
      position: relative;
    }

    /* Top Brand & Header */
    .brand-header {
      text-align: center;
      margin-bottom: ${isA5 ? "8px" : "12px"};
      padding-bottom: ${isA5 ? "8px" : "10px"};
      border-bottom: 1.5px solid #C4A265;
      position: relative;
    }

    .brand-eyebrow {
      font-size: ${isA5 ? "6pt" : "7pt"};
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #7A6F5D;
      font-weight: 500;
      margin-bottom: 2px;
    }

    .brand-logo-text {
      font-family: 'Cormorant Garamond', serif;
      font-size: ${isA5 ? "20pt" : "24pt"};
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #111111;
      line-height: 1.05;
      margin: 1px 0 3px;
    }

    .brand-address {
      font-size: ${isA5 ? "6.8pt" : "7.5pt"};
      color: #555555;
      font-weight: 400;
      letter-spacing: 0.04em;
    }

    .header-service-info {
      margin-top: ${isA5 ? "4px" : "6px"};
      display: inline-block;
      padding: 2px 12px;
      background: #F9F6F0;
      border: 1px solid #E2D9C5;
      border-radius: 20px;
    }

    .service-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: ${isA5 ? "10pt" : "11.5pt"};
      font-weight: 600;
      color: #8C6A2E;
      letter-spacing: 0.03em;
    }

    .service-subtitle {
      font-size: ${isA5 ? "6pt" : "7pt"};
      color: #666666;
      margin-top: 1px;
    }

    .date-stamp {
      font-size: ${isA5 ? "5.8pt" : "6.5pt"};
      color: #888888;
      margin-top: 3px;
      font-style: italic;
    }

    /* Category Banners when multiple */
    .category-banner {
      text-align: center;
      margin: 12px 0 8px;
      padding: 3px 0;
      border-top: 1px dashed #D4AF37;
      border-bottom: 1px dashed #D4AF37;
      page-break-after: avoid;
      break-after: avoid;
    }

    .category-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 13pt;
      font-weight: 600;
      color: #111;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .category-subtitle {
      font-size: 7pt;
      color: #777;
      font-style: italic;
    }

    /* Multi-Column Layout */
    .sections-container.multi-column {
      column-count: 2;
      column-gap: 16px;
      column-fill: balance;
    }

    .sections-container.single-column {
      column-count: 1;
    }

    /* Section Styling */
    .menu-section {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: ${isA5 ? "8px" : "11px"};
      display: inline-block;
      width: 100%;
    }

    .section-header {
      margin-bottom: 4px;
      page-break-after: avoid;
      break-after: avoid;
    }

    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: ${isA5 ? "10pt" : "11.5pt"};
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #8C6A2E;
      margin: 0 0 2px 0;
    }

    .section-rule {
      height: 1px;
      background: linear-gradient(to right, #C4A265, #EAE0CE, transparent);
      margin-bottom: 4px;
    }

    /* Items */
    .items-list {
      display: flex;
      flex-direction: column;
      gap: ${isA5 ? "4px" : "5px"};
    }

    .menu-item {
      break-inside: avoid;
      page-break-inside: avoid;
      padding-bottom: 1px;
    }

    .item-head {
      display: flex;
      align-items: baseline;
      width: 100%;
      font-size: ${isA5 ? "7.5pt" : "8.8pt"};
    }

    .item-name {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 700;
      font-size: ${isA5 ? "8.8pt" : "10pt"};
      color: #111111;
      letter-spacing: 0.01em;
      white-space: nowrap;
    }

    .dietary-tags {
      display: inline-flex;
      gap: 2.5px;
      margin-left: 5px;
      align-self: center;
    }

    .tag {
      font-family: 'Outfit', sans-serif;
      font-size: 5pt;
      font-weight: 700;
      color: #555555;
      padding: 1px 2.5px;
      border-radius: 2px;
      border: 0.6px solid #B8B0A0;
      letter-spacing: 0.02em;
      line-height: 1;
      text-transform: uppercase;
    }

    .tag-v { color: #2E7D32; border-color: #81C784; background: #F1F8E9; }
    .tag-ve { color: #1B5E20; border-color: #66BB6A; background: #E8F5E9; }
    .tag-gf { color: #8D6E63; border-color: #BCAAA4; background: #EFEBE9; }

    .leader-dots {
      flex: 1;
      border-bottom: 1px dotted #CCCCCC;
      margin: 0 5px 2px 5px;
      min-width: 10px;
    }

    .item-price {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 700;
      font-size: ${isA5 ? "8.8pt" : "10pt"};
      color: #111111;
      white-space: nowrap;
    }

    .item-desc {
      font-size: ${isA5 ? "6.2pt" : "7.2pt"};
      color: #555555;
      font-weight: 300;
      line-height: 1.3;
      margin-top: 1px;
      padding-right: 8px;
    }

    /* Footer / Allergen Policy */
    .menu-footer {
      margin-top: ${isA5 ? "8px" : "12px"};
      padding-top: 6px;
      border-top: 1px solid #E2D9C5;
      text-align: center;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .allergen-statement {
      font-size: ${isA5 ? "5.5pt" : "6.2pt"};
      color: #666666;
      line-height: 1.4;
      font-style: italic;
      max-width: 92%;
      margin: 0 auto;
    }

    .footer-metadata {
      font-size: ${isA5 ? "5.2pt" : "6pt"};
      color: #999999;
      margin-top: 3px;
      letter-spacing: 0.05em;
    }

    /* Screen-only Preview Wrapper Styling */
    @media screen {
      body {
        background: #202022;
        padding: 20px;
        display: flex;
        justify-content: center;
      }

      .menu-sheet {
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        border-radius: 4px;
        min-height: ${isA5 ? "210mm" : "297mm"};
      }
    }
  </style>
</head>
<body>
  <div class="menu-sheet">
    <div class="brand-header">
      <div class="brand-eyebrow">Restaurant · Bar · Social Impact</div>
      <div class="brand-logo-text">The Sixth Element</div>
      <div class="brand-address">210 Upper Richmond Road West · London SW14 8AH · 020 8878 1234</div>

      <div class="header-service-info">
        <div class="service-title">${headerServiceTitle}</div>
        ${headerServiceSubtitle ? `<div class="service-subtitle">${headerServiceSubtitle}</div>` : ""}
      </div>

      ${includeDateStamp ? `<div class="date-stamp">Daily Service Edition · ${todayFormatted}</div>` : ""}
    </div>

    ${contentHtml}

    <div class="menu-footer">
      <div class="allergen-statement">
        <strong>Dietary Information:</strong> [V] Vegetarian · [VE] Vegan · [GF] Gluten-Free · [GF*] Gluten-Free Option Available.<br>
        Please inform your server of any severe food allergies or intolerances prior to ordering. All prices are in GBP and inclusive of VAT. An optional discretionary 12.5% service charge is added to your final bill.
      </div>
      <div class="footer-metadata">
        the6thelement.co.uk · @the.sixth.element.210 · Richmond, London
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Triggers the browser's native print engine with 1 click, rendering the menu
 * into a hidden high-fidelity iframe so the user's active page remains undisturbed.
 */
export function triggerPrintMenu(options) {
  const html = generatePrintableMenuHtml(options);

  // Remove any preexisting print frame
  const existingFrame = document.getElementById("the-sixth-element-print-frame");
  if (existingFrame) {
    existingFrame.remove();
  }

  // Create isolated hidden iframe
  const iframe = document.createElement("iframe");
  iframe.id = "the-sixth-element-print-frame";
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    throw new Error("Unable to create print frame context.");
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Wait for fonts and content to be fully rendered before printing
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error("Print trigger failed, opening in popup window fallback:", e);
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.write(html);
        printWin.document.close();
        printWin.focus();
        printWin.print();
      }
    }
  }, 350);
}

/**
 * Download raw printable HTML file for offline archive or email distribution
 */
export function downloadPrintableMenuHtml(options) {
  const html = generatePrintableMenuHtml(options);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const filename = `The_Sixth_Element_Menu_${options.category || "All"}_${options.paperSize || "A4"}.html`;
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
