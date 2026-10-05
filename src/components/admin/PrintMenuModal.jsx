// src/components/admin/PrintMenuModal.jsx
import React, { useState, useMemo } from "react";
import { COLORS } from "../../theme/tokens";
import {
  generatePrintableMenuHtml,
  triggerPrintMenu,
  downloadPrintableMenuHtml,
  PRINT_PRESETS,
} from "../../utils/menuPrintGenerator";

export function PrintMenuModal({ theme, menuData, initialCategory = "all", onClose }) {
  const [category, setCategory] = useState(initialCategory);
  const [paperSize, setPaperSize] = useState("a4");
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [showPrices, setShowPrices] = useState(true);
  const [showDietary, setShowDietary] = useState(true);
  const [includeDateStamp, setIncludeDateStamp] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  // Generate live preview HTML for the iframe
  const previewHtml = useMemo(() => {
    return generatePrintableMenuHtml({
      menuData,
      category,
      paperSize,
      showDescriptions,
      showPrices,
      showDietary,
      includeDateStamp,
    });
  }, [menuData, category, paperSize, showDescriptions, showPrices, showDietary, includeDateStamp]);

  const handlePrintClick = () => {
    setIsPrinting(true);
    triggerPrintMenu({
      menuData,
      category,
      paperSize,
      showDescriptions,
      showPrices,
      showDietary,
      includeDateStamp,
    });
    setTimeout(() => setIsPrinting(false), 1200);
  };

  const handleDownloadHtml = () => {
    downloadPrintableMenuHtml({
      menuData,
      category,
      paperSize,
      showDescriptions,
      showPrices,
      showDietary,
      includeDateStamp,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10, 10, 12, 0.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Outfit', sans-serif",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1040,
          maxHeight: "92vh",
          background: theme.surface,
          borderRadius: 20,
          border: `1.5px solid ${COLORS.warmAmber}40`,
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${theme.muted}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: theme.surfaceAlt,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `${COLORS.warmAmber}20`,
                border: `1.5px solid ${COLORS.warmAmber}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🖨️
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: theme.heading,
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                1-Click Print-Ready PDF Menu Generator
              </h2>
              <div style={{ fontSize: 12, color: theme.muted, marginTop: 3 }}>
                Physical dining room menus formatted with brand typography for daily lunch &amp; dinner service
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: `1px solid ${theme.muted}30`,
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.muted,
              cursor: "pointer",
              fontSize: 16,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.heading;
              e.currentTarget.style.borderColor = theme.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.muted;
              e.currentTarget.style.borderColor = `${theme.muted}30`;
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Controls on Left, Scaled Preview on Right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "340px 1fr",
            flex: 1,
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Controls Column */}
          <div
            style={{
              padding: "20px 24px",
              borderRight: `1px solid ${theme.muted}20`,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              background: theme.surface,
            }}
          >
            {/* 1. Meal Period / Category */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: theme.muted,
                  marginBottom: 8,
                }}
              >
                1. Service Period
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { id: "daytime", label: "☀️ Daytime Service", sub: "Brunch & larger plates (8am – 2pm)" },
                  { id: "evening", label: "🌙 Evening Dining", sub: "Small plates & signatures (from 5pm)" },
                  { id: "all", label: "✨ Complete Master Menu", sub: "All categories & sections combined" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      textAlign: "left",
                      padding: "9px 12px",
                      borderRadius: 10,
                      border: `1.5px solid ${category === cat.id ? theme.accent : `${theme.muted}30`}`,
                      background: category === cat.id ? `${theme.accent}15` : "transparent",
                      color: category === cat.id ? theme.heading : theme.text,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{cat.label}</div>
                    <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>{cat.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Paper Format & Layout */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: theme.muted,
                  marginBottom: 8,
                }}
              >
                2. Paper Size &amp; Layout
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { id: "a4", label: "📄 A4 Dining", sub: "2-Column Editorial" },
                  { id: "a5", label: "📋 A5 Card", sub: "Single Column Tabletop" },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setPaperSize(fmt.id)}
                    style={{
                      padding: "10px",
                      borderRadius: 10,
                      border: `1.5px solid ${paperSize === fmt.id ? theme.accent : `${theme.muted}30`}`,
                      background: paperSize === fmt.id ? `${theme.accent}15` : "transparent",
                      color: paperSize === fmt.id ? theme.heading : theme.text,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{fmt.label}</div>
                    <div style={{ fontSize: 10, color: theme.muted, marginTop: 2 }}>{fmt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Formatting Toggles */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: theme.muted,
                  marginBottom: 10,
                }}
              >
                3. Display Elements
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Show Dish Descriptions", val: showDescriptions, set: setShowDescriptions },
                  { label: "Show Prices (£)", val: showPrices, set: setShowPrices },
                  { label: "Show Dietary Tags (V, VE, GF)", val: showDietary, set: setShowDietary },
                  { label: "Include Today's Date Stamp", val: includeDateStamp, set: setIncludeDateStamp },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 12,
                      cursor: "pointer",
                      color: theme.text,
                      userSelect: "none",
                    }}
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={item.val}
                      onChange={(e) => item.set(e.target.checked)}
                      style={{
                        accentColor: theme.accent,
                        cursor: "pointer",
                        width: 16,
                        height: 16,
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Print Tips */}
            <div
              style={{
                marginTop: "auto",
                padding: "10px 12px",
                borderRadius: 10,
                background: `${theme.muted}12`,
                border: `1px solid ${theme.muted}20`,
                fontSize: 11,
                color: theme.muted,
                lineHeight: 1.5,
              }}
            >
              💡 <strong>Print Tip:</strong> In your browser print dialog, set <strong>Margins: None/Default</strong> and ensure <strong>Background Graphics</strong> is checked for crisp vector styling.
            </div>
          </div>

          {/* Live Scaled Preview Column */}
          <div
            style={{
              padding: 20,
              background: "#121214",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#A09A8E",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>👁️ Live Scaled Preview ({paperSize.toUpperCase()} · {PRINT_PRESETS[paperSize].dimensions})</span>
            </div>

            <div
              style={{
                width: "100%",
                maxWidth: paperSize === "a5" ? 420 : 540,
                height: "100%",
                maxHeight: "68vh",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                border: "1px solid #333",
                background: "#fff",
              }}
            >
              <iframe
                title="Menu Print Preview"
                srcDoc={previewHtml}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background: "#fff",
                }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: `1px solid ${theme.muted}25`,
            background: theme.surfaceAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 12, color: theme.muted }}>
            Pressing <strong>Print to PDF</strong> opens your printer dialog directly. Choose <em>"Save as PDF"</em> to create an offline file.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handleDownloadHtml}
              style={{
                padding: "9px 16px",
                borderRadius: 8,
                border: `1px solid ${theme.muted}35`,
                background: "transparent",
                color: theme.text,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              title="Save printable HTML file to disk"
            >
              📥 Save HTML File
            </button>

            <button
              onClick={handlePrintClick}
              disabled={isPrinting}
              style={{
                padding: "9px 24px",
                borderRadius: 8,
                border: "none",
                background: theme.accent,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: isPrinting ? "wait" : "pointer",
                boxShadow: "0 2px 10px rgba(191,138,47,0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s ease",
              }}
            >
              {isPrinting ? "⏳ Preparing..." : "🖨️ Print / Save as PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
