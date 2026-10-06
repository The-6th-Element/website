// src/pages/MenuPage.jsx
import React, { useState, useEffect } from "react";
import { COLORS } from "../theme/tokens";
import { defaultMenuTab } from "../utils/time";
import { useMenu } from "../hooks/useContent";
import { FadeIn } from "../components/ui/FadeIn";
import { PrintMenuModal } from "../components/admin/PrintMenuModal";
import { trackMenuTab } from "../utils/analytics";

export function MenuPage({ theme, flags, onOpenStudio }) {
  const { menu } = useMenu();
  const tabs = Object.keys(menu).map((id) => ({ id, label: menu[id].title || id, icon: menu[id].icon || "" }));
  const [activeTab, setActiveTab] = useState(() => defaultMenuTab(flags));
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    setActiveTab(defaultMenuTab(flags));
  }, [flags?.menu_evening_hour]);
  const current = tabs.some((t) => t.id === activeTab) && menu[activeTab] ? activeTab : tabs[0]?.id || "";
  const data = menu[current] || { title: "", subtitle: "", icon: "", sections: [] };
  const sections = data.sections || [];

  return (
    <div style={{ paddingTop: 120, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: theme.muted,
                marginBottom: 12,
              }}
            >
              Our Menu
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 400,
                color: theme.heading,
              }}
            >
              Day to Night
            </h1>
          </div>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={0.1}>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginBottom: 48,
              flexWrap: "wrap",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  trackMenuTab(tab.id);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 44,
                  padding: "10px 20px",
                  borderRadius: 30,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  background: current === tab.id ? theme.accent : `${theme.muted}15`,
                  color: current === tab.id ? "#fff" : theme.text,
                  transition: "all 0.3s ease",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}

            {/* 1-Click Print / PDF Menu button (BK-23) */}
            <button
              onClick={() => setShowPrintModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                padding: "10px 18px",
                borderRadius: 30,
                border: `1.5px solid ${theme.accent}50`,
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.02em",
                background: `${theme.accent}16`,
                color: theme.heading,
                transition: "all 0.3s ease",
                gap: 6,
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
              title="Generate print-ready physical A4/A5 PDF menu for table service"
            >
              🖨️ Print / PDF Menu
            </button>
          </div>
        </FadeIn>

        {/* Menu Content */}
        <div key={current}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 32 }}>{data.icon}</div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 32,
                  fontWeight: 400,
                  color: theme.heading,
                  marginTop: 8,
                }}
              >
                {data.title}
              </h2>
              <p style={{ fontSize: 14, color: theme.muted, fontWeight: 300, marginTop: 8 }}>{data.subtitle}</p>
            </div>
          </FadeIn>

          {sections.map((section, si) => (
            <FadeIn key={section.name} delay={si * 0.1}>
              <div style={{ marginBottom: 48 }}>
                <h3
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: theme.accent,
                    marginBottom: 20,
                    fontWeight: 600,
                    paddingBottom: 8,
                    borderBottom: `1px solid ${theme.muted}20`,
                  }}
                >
                  {section.name}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {section.items.map((item, ii) => (
                    <FadeIn key={item.name} delay={ii * 0.05}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          padding: "16px 0",
                          borderBottom: ii < section.items.length - 1 ? `1px solid ${theme.muted}10` : "none",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ fontSize: 16, fontWeight: 500, color: theme.heading }}>{item.name}</span>
                            {item.tags.map((t) => (
                              <span
                                key={t}
                                className="menu-tag"
                                style={{
                                  background: t === "COMING SOON" ? `${theme.accent}20` : `${COLORS.mossGreen}15`,
                                  color: t === "COMING SOON" ? theme.accent : COLORS.mossGreen,
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          {item.desc && (
                            <p
                              style={{
                                fontSize: 13,
                                color: theme.muted,
                                fontWeight: 300,
                                marginTop: 4,
                                lineHeight: 1.5,
                              }}
                            >
                              {item.desc}
                            </p>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            color: theme.accent,
                            marginLeft: 20,
                            whiteSpace: "nowrap",
                            fontFamily: "'Cormorant Garamond', serif",
                          }}
                        >
                          {item.price === "TBA" ? "TBA" : `£${item.price}`}
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}

          {sections.length === 0 && (
            <FadeIn>
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  borderRadius: 16,
                  background: theme.surfaceAlt,
                  border: `1px solid ${theme.muted}15`,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{data.icon}</div>
                <div style={{ fontSize: 15, color: theme.heading, fontWeight: 500 }}>Coming soon</div>
                <div style={{ fontSize: 13, color: theme.muted, fontWeight: 300, marginTop: 6 }}>
                  This menu is being finalised — check back shortly.
                </div>
              </div>
            </FadeIn>
          )}
        </div>

        <FadeIn>
          <div
            style={{
              textAlign: "center",
              padding: "40px 0 80px",
              fontSize: 13,
              color: theme.muted,
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            <p>(V) Vegetarian · (VE) Vegan · (GF) Gluten Free · (*) available on request</p>
            <p style={{ marginTop: 8 }}>Please inform our team of any allergies or dietary requirements. All prices include VAT.</p>
            {onOpenStudio && (
              <div style={{ marginTop: 24 }}>
                <button
                  onClick={onOpenStudio}
                  style={{
                    background: "none",
                    border: `1px dashed ${theme.muted}40`,
                    borderRadius: 20,
                    padding: "8px 18px",
                    fontSize: 12,
                    color: theme.muted,
                    cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.warmAmber;
                    e.currentTarget.style.color = COLORS.warmAmber;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${theme.muted}40`;
                    e.currentTarget.style.color = theme.muted;
                  }}
                >
                  <span>📊</span>
                  <span>Open Menu Studio (Edit on Screen or CSV Spreadsheet)</span>
                </button>
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      {/* 1-Click Print Menu Modal (BK-23) */}
      {showPrintModal && (
        <PrintMenuModal
          theme={theme}
          menuData={menu}
          initialCategory={current}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
