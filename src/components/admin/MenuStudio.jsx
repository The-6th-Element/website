// src/components/admin/MenuStudio.jsx
import React, { useState, useEffect, useRef } from "react";
import { COLORS } from "../../theme/tokens";
import { useMenu } from "../../hooks/useContent";
import { downloadMenuCsv, csvToMenu } from "../../utils/csvMenuParser";

export function MenuStudio({ theme, onClose }) {
  const { menu, saveMenu, resetMenu, isCustom } = useMenu();
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(menu)));
  const [activeCat, setActiveCat] = useState("daytime");
  const [dirty, setDirty] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // "split" | "editor" | "preview"
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error' | 'warning', message: string, details?: string[] }
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!dirty) {
      setDraft(JSON.parse(JSON.stringify(menu)));
    }
  }, [menu, dirty]);

  const mutate = (fn) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      fn(next);
      return next;
    });
    setDirty(true);
    setFeedback(null);
  };

  // Section mutations
  const addSection = () => {
    mutate(d => {
      if (!d[activeCat]) d[activeCat] = { title: activeCat === "daytime" ? "Daytime" : "Evening", sections: [] };
      d[activeCat].sections.push({ name: "New Section", items: [] });
    });
  };

  const deleteSection = (si) => {
    mutate(d => {
      d[activeCat].sections.splice(si, 1);
    });
  };

  const updateSectionName = (si, name) => {
    mutate(d => {
      d[activeCat].sections[si].name = name;
    });
  };

  const moveSection = (si, direction) => {
    mutate(d => {
      const sections = d[activeCat].sections;
      const target = si + direction;
      if (target >= 0 && target < sections.length) {
        const temp = sections[si];
        sections[si] = sections[target];
        sections[target] = temp;
      }
    });
  };

  // Item mutations
  const addItem = (si) => {
    mutate(d => {
      d[activeCat].sections[si].items.push({
        name: "New Dish",
        desc: "Description of ingredients and preparation",
        price: "12",
        tags: ["V"],
      });
    });
  };

  const updateItem = (si, ii, field, val) => {
    mutate(d => {
      d[activeCat].sections[si].items[ii][field] = val;
    });
  };

  const deleteItem = (si, ii) => {
    mutate(d => {
      d[activeCat].sections[si].items.splice(ii, 1);
    });
  };

  const duplicateItem = (si, ii) => {
    mutate(d => {
      const orig = d[activeCat].sections[si].items[ii];
      d[activeCat].sections[si].items.splice(ii + 1, 0, { ...JSON.parse(JSON.stringify(orig)), name: `${orig.name} (Copy)` });
    });
  };

  const toggleTag = (si, ii, tag) => {
    mutate(d => {
      const item = d[activeCat].sections[si].items[ii];
      if (!Array.isArray(item.tags)) item.tags = [];
      if (item.tags.includes(tag)) {
        item.tags = item.tags.filter(t => t !== tag);
      } else {
        item.tags.push(tag);
      }
    });
  };

  // CSV Import handling
  const handleCsvText = (text) => {
    const res = csvToMenu(text, draft);
    if (!res.success) {
      setFeedback({ type: "error", message: res.error });
      return;
    }

    setDraft(res.menu);
    setDirty(true);
    setFeedback({
      type: "success",
      message: `Successfully loaded ${res.stats.itemsCount} dishes across ${res.stats.sectionsCount} sections!`,
      details: res.warnings.length > 0 ? res.warnings : undefined,
    });
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
    e.target.value = ""; // reset
  };

  const processUploadedFile = (file) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFeedback({ type: "error", message: "Please upload a valid .csv file." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      handleCsvText(text);
    };
    reader.readAsText(file);
  };

  // Actions
  const handleSave = () => {
    saveMenu(draft);
    setDirty(false);
    setFeedback({
      type: "success",
      message: "✓ Menu successfully saved and applied to the live website!",
    });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to restore the default baseline restaurant menu? All custom changes will be reset.")) {
      resetMenu();
      setDirty(false);
      setFeedback({ type: "warning", message: "Restored default restaurant menu." });
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(draft, null, 2)).then(() => {
      setFeedback({ type: "success", message: "Copied menu JSON to clipboard!" });
      setTimeout(() => setFeedback(null), 3000);
    });
  };

  const activeCategoryData = draft[activeCat] || { sections: [] };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 2500,
      background: theme.bg,
      color: theme.text,
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Outfit', sans-serif",
      overflow: "hidden",
    }}>
      {/* Studio Header Bar */}
      <header style={{
        padding: "16px 24px",
        borderBottom: `1px solid ${theme.muted}25`,
        background: theme.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `${COLORS.warmAmber}20`,
            border: `1.5px solid ${COLORS.warmAmber}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>
            📋
          </div>
          <div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              fontWeight: 500,
              color: theme.heading,
              lineHeight: 1.1,
            }}>
              Menu Studio &amp; CSV Template Manager
            </h1>
            <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>
              {isCustom ? "🟢 Custom Menu Active in Browser" : "Default Menu Loaded"}
              {dirty && <span style={{ color: COLORS.warmAmber, fontWeight: 600 }}> · (Unsaved changes)</span>}
            </div>
          </div>
        </div>

        {/* View mode & main actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* View Mode Toggle */}
          <div style={{
            display: "inline-flex",
            background: `${theme.muted}15`,
            borderRadius: 8,
            padding: 3,
            gap: 2,
          }}>
            <button
              onClick={() => setViewMode("split")}
              style={{
                padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 500,
                background: viewMode === "split" ? theme.accent : "transparent",
                color: viewMode === "split" ? "#fff" : theme.text,
              }}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode("editor")}
              style={{
                padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 500,
                background: viewMode === "editor" ? theme.accent : "transparent",
                color: viewMode === "editor" ? "#fff" : theme.text,
              }}
            >
              Editor Only
            </button>
            <button
              onClick={() => setViewMode("preview")}
              style={{
                padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 500,
                background: viewMode === "preview" ? theme.accent : "transparent",
                color: viewMode === "preview" ? "#fff" : theme.text,
              }}
            >
              Live Preview
            </button>
          </div>

          {/* Download CSV button */}
          <button
            onClick={() => downloadMenuCsv(draft)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: `1px solid ${COLORS.warmAmber}50`,
              background: `${COLORS.warmAmber}15`,
              color: theme.heading,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            title="Download current menu as spreadsheet (CSV) for Excel or Google Sheets"
          >
            📥 Download CSV
          </button>

          {/* Upload CSV button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: `1px solid ${theme.muted}30`,
              background: theme.surfaceAlt,
              color: theme.text,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            title="Upload an updated CSV file"
          >
            📤 Upload CSV
          </button>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!dirty}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: dirty ? COLORS.mossGreen : `${theme.muted}30`,
              color: dirty ? "#fff" : theme.muted,
              cursor: dirty ? "pointer" : "default",
              fontSize: 13,
              fontWeight: 600,
              boxShadow: dirty ? "0 4px 14px rgba(96,110,61,0.3)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {dirty ? "✓ Apply Changes" : "Saved ✓"}
          </button>

          {/* Close Studio */}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: theme.muted,
                cursor: "pointer",
                fontSize: 22,
                padding: "4px 8px",
              }}
              title="Close Menu Studio"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Feedback Banner */}
      {feedback && (
        <div style={{
          padding: "10px 24px",
          background: feedback.type === "success" ? "#D1FAE5" : feedback.type === "error" ? "#FEE2E2" : "#FEF3C7",
          color: feedback.type === "success" ? "#065F46" : feedback.type === "error" ? "#991B1B" : "#92400E",
          fontSize: 13,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}>
          <div>
            <strong>{feedback.message}</strong>
            {feedback.details && feedback.details.length > 0 && (
              <div style={{ fontSize: 11, marginTop: 4 }}>
                {feedback.details.slice(0, 3).map((w, idx) => (
                  <div key={idx}>• {w}</div>
                ))}
                {feedback.details.length > 3 && <div>...and {feedback.details.length - 3} more</div>}
              </div>
            )}
          </div>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "inherit" }}
          >
            ×
          </button>
        </div>
      )}

      {/* Main Studio Body: Editor + Preview */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: viewMode === "split" ? "1fr 1fr" : "1fr",
        overflow: "hidden",
      }}>
        {/* LEFT COLUMN: Screen Form Editor + CSV Dropzone */}
        {viewMode !== "preview" && (
          <div style={{
            overflowY: "auto",
            padding: 24,
            borderRight: viewMode === "split" ? `1px solid ${theme.muted}20` : "none",
            background: theme.bg,
          }}>
            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? COLORS.warmAmber : `${theme.muted}35`}`,
                background: dragOver ? `${COLORS.warmAmber}10` : theme.surfaceAlt,
                borderRadius: 12,
                padding: "20px 24px",
                textAlign: "center",
                cursor: "pointer",
                marginBottom: 24,
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>📊</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.heading }}>
                Drag &amp; drop updated <code style={{ color: COLORS.warmAmber }}>menu.csv</code> here
              </div>
              <div style={{ fontSize: 12, color: theme.muted, marginTop: 4 }}>
                Or click to browse from your computer. Validates prices &amp; dietary tags instantly.
              </div>
            </div>

            {/* Category Switcher Tabs */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 10,
            }}>
              <div style={{ display: "flex", gap: 8 }}>
                {["daytime", "evening"].map(cat => {
                  const active = activeCat === cat;
                  const isDay = cat === "daytime";
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCat(cat)}
                      style={{
                        padding: "8px 18px",
                        borderRadius: 20,
                        border: active ? `1.5px solid ${theme.accent}` : `1px solid ${theme.muted}25`,
                        background: active ? theme.accent : theme.surfaceAlt,
                        color: active ? "#fff" : theme.text,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "'Outfit', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span>{isDay ? "☀️" : "🌙"}</span>
                      <span style={{ textTransform: "capitalize" }}>{cat} Menu</span>
                      <span style={{
                        fontSize: 11,
                        opacity: 0.8,
                        padding: "2px 6px",
                        borderRadius: 10,
                        background: active ? "rgba(255,255,255,0.25)" : `${theme.muted}15`,
                      }}>
                        {draft[cat]?.sections?.reduce((sum, s) => sum + (s.items?.length || 0), 0) || 0} items
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={addSection}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.warmAmber}`,
                    background: "transparent",
                    color: COLORS.warmAmber,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  + Add Section
                </button>
              </div>
            </div>

            {/* Sections Accordion */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {activeCategoryData.sections?.map((section, si) => (
                <div
                  key={si}
                  style={{
                    background: theme.surfaceAlt,
                    border: `1px solid ${theme.muted}20`,
                    borderRadius: 12,
                    padding: 18,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Section Title Header */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                    paddingBottom: 10,
                    borderBottom: `1px solid ${theme.muted}15`,
                  }}>
                    <span style={{ color: theme.muted, fontSize: 13, fontWeight: 700 }}>#{si + 1}</span>
                    <input
                      value={section.name}
                      onChange={(e) => updateSectionName(si, e.target.value)}
                      placeholder="Section Name (e.g. Brunch, Small Plates)"
                      style={{
                        flex: 1,
                        fontSize: 15,
                        fontWeight: 600,
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: `1px solid ${theme.muted}25`,
                        background: theme.bg,
                        color: theme.heading,
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    />
                    <button
                      onClick={() => moveSection(si, -1)}
                      disabled={si === 0}
                      title="Move section up"
                      style={{
                        background: "none", border: "none", cursor: si === 0 ? "default" : "pointer",
                        color: si === 0 ? `${theme.muted}40` : theme.muted, fontSize: 14, padding: "2px 4px",
                      }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveSection(si, 1)}
                      disabled={si === activeCategoryData.sections.length - 1}
                      title="Move section down"
                      style={{
                        background: "none", border: "none", cursor: si === activeCategoryData.sections.length - 1 ? "default" : "pointer",
                        color: si === activeCategoryData.sections.length - 1 ? `${theme.muted}40` : theme.muted, fontSize: 14, padding: "2px 4px",
                      }}
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => deleteSection(si)}
                      title="Delete this section"
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#EF4444", fontSize: 16, padding: "2px 6px",
                      }}
                    >
                      🗑
                    </button>
                  </div>

                  {/* Items in Section */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {section.items?.map((item, ii) => (
                      <div
                        key={ii}
                        style={{
                          background: theme.bg,
                          border: `1px solid ${theme.muted}15`,
                          borderRadius: 8,
                          padding: 12,
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {/* Name & Price Row */}
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            value={item.name}
                            onChange={(e) => updateItem(si, ii, "name", e.target.value)}
                            placeholder="Dish or Drink Name"
                            style={{
                              flex: 1,
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: `1px solid ${theme.muted}25`,
                              background: theme.surfaceAlt,
                              color: theme.heading,
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          />
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 13, color: theme.muted, fontWeight: 600 }}>£</span>
                            <input
                              value={item.price}
                              onChange={(e) => updateItem(si, ii, "price", e.target.value)}
                              placeholder="Price"
                              style={{
                                width: 70,
                                padding: "6px 8px",
                                borderRadius: 6,
                                border: `1px solid ${theme.muted}25`,
                                background: theme.surfaceAlt,
                                color: theme.heading,
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                            />
                          </div>
                          <button
                            onClick={() => duplicateItem(si, ii)}
                            title="Duplicate this item"
                            style={{ background: "none", border: "none", cursor: "pointer", color: theme.muted, fontSize: 15 }}
                          >
                            📋
                          </button>
                          <button
                            onClick={() => deleteItem(si, ii)}
                            title="Delete item"
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", fontSize: 16 }}
                          >
                            ×
                          </button>
                        </div>

                        {/* Description */}
                        <input
                          value={item.desc}
                          onChange={(e) => updateItem(si, ii, "desc", e.target.value)}
                          placeholder="Description (ingredients, dressing, allergen notes)"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: `1px solid ${theme.muted}20`,
                            background: theme.surfaceAlt,
                            color: theme.text,
                            fontSize: 12,
                          }}
                        />

                        {/* Dietary Tags Chips */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                          <span style={{ fontSize: 10, textTransform: "uppercase", color: theme.muted, fontWeight: 600 }}>
                            Dietary:
                          </span>
                          {["V", "VE", "GF", "GF*", "DF"].map(tag => {
                            const active = Array.isArray(item.tags) && item.tags.includes(tag);
                            return (
                              <button
                                key={tag}
                                onClick={() => toggleTag(si, ii, tag)}
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: 12,
                                  border: `1px solid ${active ? COLORS.warmAmber : `${theme.muted}30`}`,
                                  background: active ? `${COLORS.warmAmber}25` : "transparent",
                                  color: active ? COLORS.warmAmber : theme.muted,
                                  cursor: "pointer",
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}
                              >
                                {active ? `✓ ${tag}` : `+ ${tag}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addItem(si)}
                      style={{
                        padding: "8px",
                        borderRadius: 6,
                        border: `1px dashed ${theme.muted}35`,
                        background: "transparent",
                        color: theme.accent,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                        marginTop: 4,
                      }}
                    >
                      + Add Dish to "{section.name}"
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Utility footer for JSON / Reset */}
            <div style={{
              marginTop: 32,
              paddingTop: 16,
              borderTop: `1px solid ${theme.muted}20`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}>
              <button
                onClick={handleCopyJson}
                style={{
                  background: "none",
                  border: `1px solid ${theme.muted}25`,
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 11,
                  color: theme.muted,
                  cursor: "pointer",
                }}
              >
                📋 Copy Menu JSON
              </button>

              <button
                onClick={handleReset}
                style={{
                  background: "none",
                  border: "1px solid #EF444440",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 11,
                  color: "#EF4444",
                  cursor: "pointer",
                }}
              >
                ↺ Restore Default Restaurant Menu
              </button>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Real-Time Customer Live Preview */}
        {viewMode !== "editor" && (
          <div style={{
            overflowY: "auto",
            padding: 32,
            background: activeCat === "evening" ? "#0F0D0A" : "#FAF8F0",
            color: activeCat === "evening" ? "#D4C5A9" : "#2C2C2C",
            transition: "all 0.4s ease",
          }}>
            {/* Live Customer Preview Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
              paddingBottom: 14,
              borderBottom: `1px solid ${activeCat === "evening" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
            }}>
              <div>
                <span style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: COLORS.warmAmber,
                }}>
                  ● Live Customer Preview
                </span>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28,
                  fontWeight: 400,
                  color: activeCat === "evening" ? "#F6F4E3" : "#4B3621",
                  marginTop: 4,
                }}>
                  {activeCategoryData.title || (activeCat === "daytime" ? "Daytime" : "Evening")}
                </h2>
                <div style={{ fontSize: 13, color: activeCat === "evening" ? "#7A7060" : "#6E6456", fontStyle: "italic" }}>
                  {activeCategoryData.subtitle}
                </div>
              </div>

              <div style={{ fontSize: 28 }}>
                {activeCat === "daytime" ? "☀️" : "🌙"}
              </div>
            </div>

            {/* Rendered Menu Cards (matches MenuPage style exactly) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {activeCategoryData.sections?.map((section, si) => (
                <div key={si}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 500,
                    color: activeCat === "evening" ? "#F6F4E3" : "#4B3621",
                    borderBottom: `1px solid ${COLORS.warmAmber}40`,
                    paddingBottom: 8,
                    marginBottom: 16,
                  }}>
                    {section.name}
                  </h3>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 16,
                  }}>
                    {section.items?.map((item, ii) => (
                      <div
                        key={ii}
                        style={{
                          padding: 14,
                          borderRadius: 8,
                          background: activeCat === "evening" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                          border: `1px solid ${activeCat === "evening" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 16,
                            fontWeight: 600,
                            color: activeCat === "evening" ? "#F6F4E3" : "#4B3621",
                          }}>
                            {item.name}
                          </span>
                          <span style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 14,
                            fontWeight: 600,
                            color: COLORS.warmAmber,
                            marginLeft: 8,
                          }}>
                            £{item.price}
                          </span>
                        </div>

                        {item.desc && (
                          <div style={{
                            fontSize: 12,
                            color: activeCat === "evening" ? "#8A8070" : "#6E6456",
                            marginTop: 4,
                            lineHeight: 1.4,
                            fontWeight: 300,
                          }}>
                            {item.desc}
                          </div>
                        )}

                        {Array.isArray(item.tags) && item.tags.length > 0 && (
                          <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                            {item.tags.map((t, ti) => (
                              <span
                                key={ti}
                                style={{
                                  fontSize: 9,
                                  fontWeight: 700,
                                  letterSpacing: "0.05em",
                                  padding: "1px 6px",
                                  borderRadius: 10,
                                  background: `${COLORS.warmAmber}20`,
                                  color: COLORS.warmAmber,
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
