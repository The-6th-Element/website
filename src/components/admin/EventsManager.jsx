// src/components/admin/EventsManager.jsx
import React, { useState } from "react";
import { COLORS } from "../../theme/tokens";
import { useEvents } from "../../hooks/useContent";

export function EventsManager({ theme }) {
  const { events, saveState, addEvent, updateEvent, deleteEvent, resetEvents } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const blankOffer = {
    name: "",
    guests: "For 2 – 8 guests",
    price: "",
    unit: "pp",
    description: "",
    extra: "",
  };

  const blankEvent = {
    title: "",
    subtitle: "",
    badge: "SEASONAL",
    badgeColor: COLORS.warmAmber,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    dateDisplay: "",
    timing: "Daily Lunch & Evening Dining",
    tagline: "",
    description: "",
    earlyBird: "",
    terms: "Advance reservations recommended. Full vegetarian, vegan, and allergen menus always available.",
    hasGroupEnquiry: true,
    offers: [
      {
        name: "Standard Experience",
        guests: "For 2 – 8 guests",
        price: "£35.00",
        unit: "pp",
        description: "Three courses featuring seasonal dishes and subcontinental spices.",
        extra: "",
      },
    ],
  };

  const [draft, setDraft] = useState(blankEvent);

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    marginTop: 4,
    border: `1px solid ${theme.muted}25`,
    background: theme.surfaceAlt || "#FAFAF9",
    color: theme.text,
    fontFamily: "'Outfit', sans-serif",
    fontSize: 12.5,
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 10.5,
    fontWeight: 600,
    color: theme.muted,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
  };

  const startEdit = (event) => {
    setEditingId(event.id);
    setDraft({
      id: event.id,
      title: event.title || "",
      subtitle: event.subtitle || "",
      badge: event.badge || "",
      badgeColor: event.badgeColor || COLORS.warmAmber,
      startDate: event.startDate || "",
      endDate: event.endDate || "",
      dateDisplay: event.dateDisplay || "",
      timing: event.timing || "",
      tagline: event.tagline || "",
      description: event.description || "",
      earlyBird: event.earlyBird || "",
      terms: event.terms || "",
      hasGroupEnquiry: event.hasGroupEnquiry !== undefined ? event.hasGroupEnquiry : true,
      offers:
        event.offers && event.offers.length > 0
          ? JSON.parse(JSON.stringify(event.offers))
          : [{ ...blankOffer }],
    });
    setShowForm(true);
  };

  const save = () => {
    if (!draft.title.trim()) return;

    // Auto-generate dateDisplay if left blank
    const formattedDateDisplay =
      draft.dateDisplay.trim() ||
      (draft.startDate && draft.endDate
        ? `${draft.startDate} – ${draft.endDate}`
        : draft.startDate || "");

    const cleanedDraft = {
      ...draft,
      dateDisplay: formattedDateDisplay,
    };

    if (editingId) {
      updateEvent(editingId, cleanedDraft);
      setEditingId(null);
    } else {
      const generatedSlug =
        draft.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || `event-${Date.now()}`;
      addEvent({
        ...cleanedDraft,
        id: generatedSlug,
      });
    }

    setDraft(blankEvent);
    setShowForm(false);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setDraft(blankEvent);
  };

  // Offer row manipulation inside draft
  const handleOfferChange = (idx, field, value) => {
    const updated = [...draft.offers];
    updated[idx] = { ...updated[idx], [field]: value };
    setDraft((prev) => ({ ...prev, offers: updated }));
  };

  const addOfferRow = () => {
    setDraft((prev) => ({
      ...prev,
      offers: [...prev.offers, { ...blankOffer }],
    }));
  };

  const removeOfferRow = (idx) => {
    if (draft.offers.length <= 1) return;
    setDraft((prev) => ({
      ...prev,
      offers: prev.offers.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div>
      {/* Intro & Real-time Status */}
      <div
        style={{
          fontSize: 11.5,
          color: theme.muted,
          lineHeight: 1.6,
          marginBottom: 16,
          fontWeight: 300,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div>
          Configure upcoming master events, festive celebrations, dining packages, and ticket tiers. Changes reflect instantly on the public{" "}
          <a
            href="/events"
            target="_blank"
            rel="noreferrer"
            style={{ color: theme.accent, textDecoration: "underline" }}
          >
            /events
          </a>{" "}
          hub.
        </div>
        <div>
          {saveState === "saving" && (
            <span style={{ color: theme.accent, fontWeight: 500 }}>
              ● Saving changes…
            </span>
          )}
          {saveState === "saved" && (
            <span style={{ color: COLORS.mossGreen, fontWeight: 600 }}>
              ✓ Saved to Live System
            </span>
          )}
          {saveState === "error" && (
            <span style={{ color: "#EF4444", fontWeight: 600 }}>
              ⚠️ Save failed
            </span>
          )}
        </div>
      </div>

      {/* Events List */}
      {events.length === 0 && !showForm && (
        <div
          style={{
            fontSize: 13,
            color: theme.muted,
            padding: "24px 0",
            textAlign: "center",
            fontWeight: 300,
          }}
        >
          No events registered yet. Click &quot;+ Add Event &amp; Gathering&quot; below to create one.
        </div>
      )}

      {events.map((event) => {
        const isEditingThis = editingId === event.id;
        const offerCount = event.offers?.length || 0;

        return (
          <div
            key={event.id}
            style={{
              padding: "16px 18px",
              borderRadius: 12,
              marginBottom: 12,
              background: theme.surfaceAlt || "#FAFAF9",
              border: isEditingThis
                ? `1.5px solid ${theme.accent}`
                : `1px solid ${theme.muted}20`,
              boxShadow: isEditingThis
                ? `0 4px 14px ${theme.accent}30`
                : "0 2px 8px rgba(0,0,0,0.03)",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 380px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {event.badge && (
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        padding: "2.5px 8px",
                        borderRadius: 6,
                        background: `${event.badgeColor || COLORS.warmAmber}22`,
                        color: event.badgeColor || COLORS.warmAmber,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {event.badge}
                    </span>
                  )}
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 600,
                      color: theme.heading,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {event.title}
                  </h4>
                  <span style={{ fontSize: 11, color: theme.muted }}>
                    (#{event.id})
                  </span>
                </div>

                {event.subtitle && (
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.muted,
                      marginTop: 4,
                      lineHeight: 1.4,
                    }}
                  >
                    {event.subtitle}
                  </div>
                )}

                <div
                  style={{
                    fontSize: 11,
                    color: theme.muted,
                    marginTop: 6,
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <span>
                    📅 <strong>Dates:</strong> {event.dateDisplay || `${event.startDate} → ${event.endDate}`}
                  </span>
                  {event.timing && (
                    <span>
                      ⏰ <strong>Timing:</strong> {event.timing}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: theme.accent,
                    marginTop: 6,
                    fontWeight: 500,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <span>
                    🎁 {offerCount} {offerCount === 1 ? "Package Tier" : "Package Tiers"}
                  </span>
                  {event.offers && event.offers.length > 0 && (
                    <span style={{ color: theme.muted, fontWeight: 400, fontSize: 10.5 }}>
                      ({event.offers.map((o) => o.name).filter(Boolean).join(", ")})
                    </span>
                  )}
                  {event.hasGroupEnquiry && (
                    <span
                      style={{
                        fontSize: 10,
                        background: `${COLORS.mossGreen}20`,
                        color: COLORS.mossGreen,
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      Group Enquiry Active
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => startEdit(event)}
                  title="Edit event details"
                  style={{
                    background: isEditingThis ? theme.accent : `${theme.accent}15`,
                    border: `1px solid ${theme.accent}50`,
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    color: isEditingThis ? "#fff" : theme.accent,
                    fontFamily: "'Outfit', sans-serif",
                    transition: "all 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  Edit ✎
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete event "${event.title}"?`
                      )
                    ) {
                      deleteEvent(event.id);
                    }
                  }}
                  title="Delete event"
                  style={{
                    background: "none",
                    border: `1px solid #EF444430`,
                    borderRadius: 8,
                    padding: "6px 10px",
                    color: "#EF4444",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                  }}
                >
                  Delete ×
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add / Edit Form Modal or Card */}
      {showForm ? (
        <div
          style={{
            marginTop: 20,
            padding: 22,
            borderRadius: 14,
            background: theme.surfaceAlt || "#FAFAF9",
            border: `1.5px solid ${editingId ? theme.accent : COLORS.warmAmber}`,
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: `1px solid ${theme.muted}20`,
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 600,
                  color: theme.heading,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {editingId ? "Edit Event & Gathering" : "Add New Event & Gathering"}
              </h3>
              <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>
                {editingId
                  ? `Modifying registered event #${editingId}`
                  : "Fill in the details below to publish a new event experience"}
              </div>
            </div>

            <button
              type="button"
              onClick={cancel}
              style={{
                background: "none",
                border: "none",
                fontSize: 18,
                color: theme.muted,
                cursor: "pointer",
                padding: 4,
              }}
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {/* Row 1: Title & Subtitle */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              <div>
                <label style={labelStyle}>Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Make It a Christmas to Remember"
                  value={draft.title}
                  onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Subtitle / Highlight</label>
                <input
                  type="text"
                  placeholder="e.g. Festive Dinners, Sharing Feasts & Bottomless Celebrations"
                  value={draft.subtitle}
                  onChange={(e) => setDraft((p) => ({ ...p, subtitle: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Row 2: Badge & Tagline */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              <div>
                <label style={labelStyle}>Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. CHRISTMAS 2026, FESTIVAL OF LIGHTS, SPECIAL"
                  value={draft.badge}
                  onChange={(e) => setDraft((p) => ({ ...p, badge: e.target.value }))}
                  style={inputStyle}
                />
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                  {["CHRISTMAS 2026", "FESTIVAL OF LIGHTS", "NEW YEAR'S EVE", "LIMITED SEATS", "LIVE MUSIC", "SEASONAL"].map(
                    (b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setDraft((p) => ({ ...p, badge: b }))}
                        style={{
                          fontSize: 9.5,
                          padding: "2px 7px",
                          borderRadius: 4,
                          border: "none",
                          cursor: "pointer",
                          background: draft.badge === b ? theme.accent : `${theme.muted}15`,
                          color: draft.badge === b ? "#fff" : theme.text,
                        }}
                      >
                        {b}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Tagline / Header Hook</label>
                <input
                  type="text"
                  placeholder="e.g. 'Tis the Season to Celebrate"
                  value={draft.tagline}
                  onChange={(e) => setDraft((p) => ({ ...p, tagline: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Row 3: Dates & Timing */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => setDraft((p) => ({ ...p, startDate: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input
                  type="date"
                  value={draft.endDate}
                  onChange={(e) => setDraft((p) => ({ ...p, endDate: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Date Display (Friendly String)</label>
                <input
                  type="text"
                  placeholder="e.g. 20 Nov 2026 – 31 Dec 2026"
                  value={draft.dateDisplay}
                  onChange={(e) => setDraft((p) => ({ ...p, dateDisplay: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Timing / Sitting Hours</label>
                <input
                  type="text"
                  placeholder="e.g. Daily Lunch & Evening Dining"
                  value={draft.timing}
                  onChange={(e) => setDraft((p) => ({ ...p, timing: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Full Event Description</label>
              <textarea
                rows={3}
                placeholder="Describe the occasion, atmosphere, spice blends, and experience..."
                value={draft.description}
                onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  lineHeight: 1.5,
                }}
              />
            </div>

            {/* Early Bird Perk & Terms */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              <div>
                <label style={labelStyle}>Early Bird Perk / Incentive (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Book by 31st October for a complimentary glass of Prosecco"
                  value={draft.earlyBird}
                  onChange={(e) => setDraft((p) => ({ ...p, earlyBird: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Booking Terms &amp; Deposit Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 50% deposit required for 9+ guests. Dietary menus available."
                  value={draft.terms}
                  onChange={(e) => setDraft((p) => ({ ...p, terms: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Group Enquiry Checkbox */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <input
                type="checkbox"
                id="event-group-enquiry-toggle"
                checked={draft.hasGroupEnquiry}
                onChange={(e) => setDraft((p) => ({ ...p, hasGroupEnquiry: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: theme.accent, cursor: "pointer" }}
              />
              <label
                htmlFor="event-group-enquiry-toggle"
                style={{ fontSize: 12, color: theme.heading, cursor: "pointer", fontWeight: 500 }}
              >
                Enable &quot;Group &amp; Office Enquiry&quot; Button &amp; Modal on this event
              </label>
            </div>

            {/* Offers / Package Tiers Section */}
            <div
              style={{
                marginTop: 8,
                padding: 16,
                borderRadius: 12,
                background: `${theme.muted}10`,
                border: `1px solid ${theme.muted}20`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: theme.heading,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    🎁 Dining Packages &amp; Pricing Tiers
                  </h4>
                  <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>
                    Each package displays as a distinct option with pricing and description.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addOfferRow}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.warmAmber}`,
                    background: `${COLORS.warmAmber}18`,
                    color: theme.heading,
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  + Add Package Tier
                </button>
              </div>

              {draft.offers.map((offer, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: theme.surface,
                    border: `1px solid ${theme.muted}20`,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: theme.accent }}>
                      Tier #{idx + 1}
                    </span>
                    {draft.offers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOfferRow(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#EF4444",
                          fontSize: 11,
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        Remove Tier ×
                      </button>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <div>
                      <label style={labelStyle}>Package Name</label>
                      <input
                        placeholder="e.g. Festive Dinner"
                        value={offer.name}
                        onChange={(e) => handleOfferChange(idx, "name", e.target.value)}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Guest Specification</label>
                      <input
                        placeholder="e.g. For 2 – 8 guests"
                        value={offer.guests}
                        onChange={(e) => handleOfferChange(idx, "guests", e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Price</label>
                      <input
                        placeholder="e.g. £35.95"
                        value={offer.price}
                        onChange={(e) => handleOfferChange(idx, "price", e.target.value)}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Unit</label>
                      <input
                        placeholder="e.g. pp, per table"
                        value={offer.unit}
                        onChange={(e) => handleOfferChange(idx, "unit", e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 8 }}>
                    <div>
                      <label style={labelStyle}>Description</label>
                      <input
                        placeholder="Three courses across festive starters, signature mains..."
                        value={offer.description}
                        onChange={(e) => handleOfferChange(idx, "description", e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Upgrade Note / Extra</label>
                      <input
                        placeholder="e.g. ✦ 12-hour Slow-Cooked Lamb Shank +£10"
                        value={offer.extra}
                        onChange={(e) => handleOfferChange(idx, "extra", e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
                type="submit"
                disabled={!draft.title.trim()}
                style={{
                  flex: 1,
                  padding: "11px 18px",
                  borderRadius: 8,
                  border: "none",
                  background: draft.title.trim() ? theme.accent : `${theme.muted}30`,
                  color: draft.title.trim() ? "#fff" : theme.muted,
                  cursor: draft.title.trim() ? "pointer" : "not-allowed",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif",
                  boxShadow: draft.title.trim() ? "0 2px 8px rgba(191,138,47,0.3)" : "none",
                }}
              >
                {editingId ? "Update Event" : "Save & Publish Event"}
              </button>

              <button
                type="button"
                onClick={cancel}
                style={{
                  padding: "11px 18px",
                  borderRadius: 8,
                  border: `1px solid ${theme.muted}25`,
                  background: "transparent",
                  color: theme.muted,
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Action buttons below the event list */
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setDraft(blankEvent);
              setShowForm(true);
            }}
            style={{
              flex: 1,
              minWidth: 200,
              padding: "12px 18px",
              borderRadius: 10,
              border: `1.5px dashed ${theme.accent}`,
              background: `${theme.accent}0C`,
              color: theme.accent,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              transition: "all 0.2s ease",
            }}
          >
            + Add Event &amp; Gathering
          </button>

          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Restore default calendar of events (Christmas 2026, Diwali, NYE Gala, Wine Masterclass, Jazz Brunch)? This will overwrite custom event edits."
                )
              ) {
                resetEvents();
              }
            }}
            title="Restore default events catalog"
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              border: `1px solid ${theme.muted}25`,
              background: "transparent",
              color: theme.muted,
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Restore Default Events
          </button>
        </div>
      )}
    </div>
  );
}
