// src/components/features/GroupEnquiryModal.jsx
import React, { useState, useEffect } from "react";
import { COLORS } from "../../theme/tokens";

const PACKAGE_OPTIONS = [
  "Festive Dinner (£35.95 pp · 2–8 guests)",
  "Christmas Feast (£37.95 pp · 9+ guests)",
  "Festive Bottomless (£45 pp · Fri–Sun 11am–2pm)",
  "Drinks & Nibbles (from £20 pp · Office & parties)",
  "Custom / Not sure yet",
];

const TIME_OPTIONS = [
  "12:00 PM (Lunch)",
  "12:30 PM (Lunch)",
  "1:00 PM (Lunch)",
  "1:30 PM (Lunch)",
  "5:00 PM (Early Dinner)",
  "5:30 PM (Early Dinner)",
  "6:00 PM (Evening)",
  "6:30 PM (Evening)",
  "7:00 PM (Evening)",
  "7:30 PM (Evening)",
  "8:00 PM (Late Dinner)",
  "8:30 PM (Late Dinner)",
];

export function GroupEnquiryModal({ isOpen, onClose, theme, defaultPackage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [groupSize, setGroupSize] = useState("10");
  const [date, setDate] = useState("2026-11-28");
  const [time, setTime] = useState("7:00 PM (Evening)");
  const [packageChoice, setPackageChoice] = useState(defaultPackage || PACKAGE_OPTIONS[1]);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Lock body scroll and close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !groupSize || !date || !time) {
      setError("Please fill in your name, email, phone number, group size, date, and preferred time.");
      return;
    }
    setError("");

    const subject = `Christmas Group Booking Enquiry - ${name} (${groupSize} guests, ${date})`;
    const body = [
      `Dear The Sixth Element Team,`,
      ``,
      `I would like to enquire about a Christmas group booking at 210 Upper Richmond Road West:`,
      ``,
      `• Contact Name: ${name}`,
      `• Email: ${email}`,
      `• Phone: ${phone}`,
      `• Group Size: ${groupSize} guests`,
      `• Preferred Date: ${date}`,
      `• Preferred Time: ${time}`,
      `• Package / Offer Choice: ${packageChoice}`,
      `• Dietary Requirements / Notes: ${dietaryNotes.trim() || "None specified"}`,
      ``,
      `Please let me know availability and booking deposit details.`,
      ``,
      `Kind regards,`,
      `${name}`,
    ].join("\n");

    const mailtoUrl = `mailto:info@the6thelement.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Persist enquiry locally for staff reference
    try {
      const saved = JSON.parse(localStorage.getItem("tse_group_enquiries") || "[]");
      saved.unshift({
        id: `enquiry-${Date.now()}`,
        created_at: new Date().toISOString(),
        name,
        email,
        phone,
        group_size: groupSize,
        date,
        time,
        package: packageChoice,
        dietary_notes: dietaryNotes,
      });
      localStorage.setItem("tse_group_enquiries", JSON.stringify(saved));
      window.dispatchEvent(new Event("tse_group_enquiries_updated"));
    } catch {}

    // Trigger mail client to info@the6thelement.co.uk
    try {
      window.location.href = mailtoUrl;
    } catch {}

    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: 8,
    border: `1px solid ${COLORS.warmAmber}40`,
    background: theme.surfaceAlt || "#FFF",
    color: theme.text || "#2C2C2C",
    fontFamily: "'Outfit', sans-serif",
    fontSize: 12.5,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: theme.heading || "#4B3621",
    marginBottom: 3,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="group-enquiry-modal-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2200,
        background: "rgba(12, 10, 8, 0.82)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 540,
          maxHeight: "94vh",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          background: theme.surfaceAlt || "#FFFFFF",
          border: `1px solid ${COLORS.warmAmber}80`,
          borderRadius: 20,
          padding: "22px 24px 18px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45)",
          color: theme.text,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close group enquiry"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "rgba(0,0,0,0.06)",
            border: "none",
            borderRadius: "50%",
            width: 30,
            height: 30,
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            color: theme.heading,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "16px 8px 10px" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🥂</div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", fontWeight: 700, color: COLORS.warmAmber, textTransform: "uppercase", marginBottom: 4 }}>
              Christmas Enquiry Submitted
            </div>
            <h3
              id="group-enquiry-modal-title"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26,
                fontWeight: 600,
                color: theme.heading,
                margin: "0 0 8px",
              }}
            >
              Thank You, {name}!
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: theme.muted, maxWidth: 440, margin: "0 auto 16px" }}>
              Your Christmas group enquiry for <strong>{groupSize} guests</strong> on <strong>{date}</strong> at <strong>{time}</strong> has been routed to <strong>info@the6thelement.co.uk</strong>.
            </p>

            <div style={{ background: "rgba(96, 110, 61, 0.08)", border: `1px solid ${COLORS.mossGreen}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 12, color: theme.text }}>
              Our festive coordinator will review table arrangements and get back to you within 24 hours to secure your booking.
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: `linear-gradient(135deg, ${COLORS.mossGreen}, #4B5A2C)`,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 10,
                padding: "10px 24px",
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: COLORS.warmAmber, letterSpacing: "0.22em", marginBottom: 2 }}>
                ✦ ✧ ✦
              </div>
              <div style={{ fontSize: 9.5, letterSpacing: "0.18em", fontWeight: 700, color: COLORS.warmAmber, textTransform: "uppercase" }}>
                The Sixth Element · East Sheen
              </div>
              <h3
                id="group-enquiry-modal-title"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24,
                  fontWeight: 600,
                  color: theme.heading,
                  margin: "2px 0 0",
                }}
              >
                Christmas Group & Office Enquiry
              </h3>
            </div>

            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF444450", color: "#B91C1C", fontSize: 11.5, padding: "6px 10px", borderRadius: 8, marginBottom: 10 }}>
                {error}
              </div>
            )}

            {/* Inputs Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {/* Name & Email Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label htmlFor="group-name" style={labelStyle}>Your Name *</label>
                  <input
                    id="group-name"
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="group-email" style={labelStyle}>Email Address *</label>
                  <input
                    id="group-email"
                    type="email"
                    placeholder="e.g. sarah@company.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* Phone & Group Size */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label htmlFor="group-phone" style={labelStyle}>Phone Number *</label>
                  <input
                    id="group-phone"
                    type="tel"
                    placeholder="e.g. +44 7123 456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="group-size" style={labelStyle}>Group Size (Guests) *</label>
                  <input
                    id="group-size"
                    type="number"
                    min="2"
                    max="100"
                    placeholder="e.g. 12"
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label htmlFor="group-date" style={labelStyle}>Preferred Date *</label>
                  <input
                    id="group-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="group-time" style={labelStyle}>Preferred Time *</label>
                  <select
                    id="group-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={inputStyle}
                    required
                  >
                    {TIME_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Offer Package */}
              <div>
                <label htmlFor="group-package" style={labelStyle}>Selected Offer / Package</label>
                <select
                  id="group-package"
                  value={packageChoice}
                  onChange={(e) => setPackageChoice(e.target.value)}
                  style={inputStyle}
                >
                  {PACKAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes / Dietary */}
              <div>
                <label htmlFor="group-notes" style={labelStyle}>Dietary Requirements or Notes (optional)</label>
                <textarea
                  id="group-notes"
                  rows={2}
                  placeholder="e.g. 2 vegetarians, 1 gluten-free, quiet table corner preferred"
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${COLORS.mossGreen}, #4B5A2C)`,
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 16px",
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(96, 110, 61, 0.35)",
                }}
              >
                Submit Enquiry
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: `1px solid ${COLORS.warmAmber}50`,
                  background: "transparent",
                  color: theme.heading,
                  fontSize: 12.5,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
