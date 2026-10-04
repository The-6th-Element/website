// src/components/features/ReservationModal.jsx
import React from "react";
import { TOAST_CONFIG } from "../../data/config";
import { Logomark } from "../ui/Logomark";

export function ReservationModal({ theme, onClose }) {
  const url = TOAST_CONFIG.reservationUrl;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "slideDown 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "min(980px, 95vw)",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          background: theme.bg,
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${theme.muted}25`,
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 28px",
            borderBottom: `1px solid ${theme.muted}15`,
            background: theme.surface,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26,
                fontWeight: 500,
                color: theme.heading,
                lineHeight: 1.1,
              }}
            >
              Reserve a Table
            </h2>
            <div style={{ fontSize: 12, color: theme.muted, marginTop: 2, fontWeight: 300 }}>
              The Sixth Element &middot; Richmond-upon-Thames &middot; Powered by Toast Tables
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 26,
              color: theme.muted,
              cursor: "pointer",
              padding: 4,
              lineHeight: 1,
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.heading;
              e.currentTarget.style.background = `${theme.muted}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.muted;
              e.currentTarget.style.background = "none";
            }}
            title="Close"
          >
            ×
          </button>
        </div>

        {url ? (
          <>
            <iframe
              src={url}
              title="Book a table with Toast"
              style={{
                width: "100%",
                height: "72vh",
                minHeight: 540,
                border: "none",
                background: "#fff",
              }}
              allow="payment"
            />
            <div
              style={{
                padding: "12px 28px",
                borderTop: `1px solid ${theme.muted}15`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
                fontSize: 12,
                color: theme.muted,
                fontWeight: 300,
                background: theme.surface,
              }}
            >
              <span>Walk-ins are always warmly welcomed during all daytime and evening hours.</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: theme.accent,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>Open booking page in full tab</span>
                <span>↗</span>
              </a>
            </div>
          </>
        ) : (
          <div style={{ padding: "40px 32px", textAlign: "center" }}>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
              <Logomark size={48} color={theme.accent} />
            </div>
            <p style={{ fontSize: 15, color: theme.heading, fontWeight: 500, marginBottom: 8 }}>
              Online booking is being set up
            </p>
            <p style={{ fontSize: 13, color: theme.muted, fontWeight: 300, lineHeight: 1.6, marginBottom: 16 }}>
              To take reservations here, paste your Toast Tables online reservation link into{" "}
              <code style={{ background: `${theme.muted}15`, padding: "2px 6px", borderRadius: 4 }}>
                TOAST_CONFIG.reservationUrl
              </code>
              . In the meantime, please call us to book.
            </p>
            <a
              href="tel:+44(0)20 35188688"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                borderRadius: 30,
                background: theme.accent,
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              +44(0)20 35188688
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
