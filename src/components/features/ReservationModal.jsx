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
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "slideDown 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          background: theme.bg,
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${theme.muted}20`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: `1px solid ${theme.muted}15`,
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26,
              fontWeight: 400,
              color: theme.heading,
            }}
          >
            Reserve a Table
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              color: theme.muted,
              cursor: "pointer",
              padding: 4,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {url ? (
          <>
            <iframe
              src={url}
              title="Book a table with Toast"
              style={{ width: "100%", height: "70vh", border: "none", background: "#fff" }}
              allow="payment"
            />
            <div
              style={{
                padding: "12px 24px",
                borderTop: `1px solid ${theme.muted}15`,
                textAlign: "center",
                fontSize: 12,
                color: theme.muted,
                fontWeight: 300,
              }}
            >
              Trouble loading?{" "}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: theme.accent, fontWeight: 500, textDecoration: "none" }}
              >
                Open the booking page in a new tab →
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
