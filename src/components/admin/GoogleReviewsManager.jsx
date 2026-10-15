// src/components/admin/GoogleReviewsManager.jsx
import React, { useState, useEffect } from "react";
import { COLORS } from "../../theme/tokens";
import { GOOGLE_CONFIG } from "../../data/config";
import { getGoogleReviews, recordReviewReply, generateAiReviewReplies } from "../../utils/reviewsManager";

export function GoogleReviewsManager({ theme }) {
  const [data, setData] = useState(() => getGoogleReviews());
  const [selectedReview, setSelectedReview] = useState(null);
  const [aiDrafts, setAiDrafts] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [filter, setFilter] = useState("ALL"); // ALL | PENDING | REPLIED
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const handleUpdate = () => setData(getGoogleReviews());
    window.addEventListener("tse_reviews_updated", handleUpdate);
    return () => window.removeEventListener("tse_reviews_updated", handleUpdate);
  }, []);

  const handleOpenAiDraft = (review) => {
    setSelectedReview(review);
    const drafts = generateAiReviewReplies(review);
    setAiDrafts(drafts);
  };

  const handleCopy = (draftText, draftId) => {
    navigator.clipboard.writeText(draftText);
    setCopiedId(draftId);
    setFeedback("Copied AI reply to clipboard! Paste directly into Google Business Profile.");
    setTimeout(() => {
      setCopiedId(null);
      setFeedback(null);
    }, 4000);
  };

  const handleMarkReplied = (reviewId, replyText) => {
    recordReviewReply(reviewId, replyText);
    setData(getGoogleReviews());
    setSelectedReview(null);
    setFeedback("Marked review as replied in local tracking registry.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const pendingCount = data.reviews.filter((r) => r.status === "pending").length;
  const repliedCount = data.reviews.filter((r) => r.status === "replied").length;

  const filteredReviews = data.reviews.filter((r) => {
    if (filter === "PENDING") return r.status === "pending";
    if (filter === "REPLIED") return r.status === "replied";
    return true;
  });

  return (
    <div
      style={{
        background: theme.surfaceAlt || "#FAF8F3",
        border: `1px solid ${theme.muted}20`,
        borderRadius: 16,
        padding: "24px 26px",
        marginBottom: 28,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>⭐</span>
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: COLORS.warmAmber,
                fontWeight: 700,
              }}
            >
              Google Reputation Manager (FEATURE-80)
            </span>
          </div>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              color: theme.heading,
              margin: "4px 0 0",
              fontWeight: 600,
            }}
          >
            Google Reviews &amp; AI Response Hub
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: theme.muted, fontWeight: 300 }}>
            Sync verified 5-star diner reviews to your website, and draft personalized, on-brand responses in seconds.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a
            href={GOOGLE_CONFIG.businessProfileManagerUri}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              background: COLORS.earthBrown,
              color: "#FAF8F0",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(75,54,33,0.2)",
            }}
          >
            Open GBP Manager ↗
          </a>
        </div>
      </div>

      {feedback && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 12,
            background: `${COLORS.mossGreen}18`,
            color: COLORS.mossGreen,
            border: `1px solid ${COLORS.mossGreen}35`,
          }}
        >
          {feedback}
        </div>
      )}

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ background: theme.surface, padding: "14px 16px", borderRadius: 10, border: `1px solid ${theme.muted}15` }}>
          <div style={{ fontSize: 11, color: theme.muted, textTransform: "uppercase", fontWeight: 600 }}>Venue Rating</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.warmAmber, marginTop: 4 }}>4.8 ★</div>
          <div style={{ fontSize: 11, color: theme.muted }}>Based on Google Maps</div>
        </div>
        <div style={{ background: theme.surface, padding: "14px 16px", borderRadius: 10, border: `1px solid ${theme.muted}15` }}>
          <div style={{ fontSize: 11, color: theme.muted, textTransform: "uppercase", fontWeight: 600 }}>Total Reviews</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: theme.heading, marginTop: 4 }}>{data.reviews.length}</div>
          <div style={{ fontSize: 11, color: theme.muted }}>Verified Diners</div>
        </div>
        <div style={{ background: theme.surface, padding: "14px 16px", borderRadius: 10, border: `1px solid ${theme.muted}15` }}>
          <div style={{ fontSize: 11, color: theme.muted, textTransform: "uppercase", fontWeight: 600 }}>Awaiting Reply</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: pendingCount > 0 ? "#D97706" : COLORS.mossGreen, marginTop: 4 }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: 11, color: theme.muted }}>Needs manager reply</div>
        </div>
        <div style={{ background: theme.surface, padding: "14px 16px", borderRadius: 10, border: `1px solid ${theme.muted}15` }}>
          <div style={{ fontSize: 11, color: theme.muted, textTransform: "uppercase", fontWeight: 600 }}>Replied</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.mossGreen, marginTop: 4 }}>{repliedCount}</div>
          <div style={{ fontSize: 11, color: theme.muted }}>Published on Google</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setFilter("ALL")}
          style={{
            padding: "5px 12px",
            borderRadius: 16,
            border: filter === "ALL" ? `1px solid ${COLORS.warmAmber}` : `1px solid ${theme.muted}25`,
            background: filter === "ALL" ? `${COLORS.warmAmber}15` : "transparent",
            color: filter === "ALL" ? COLORS.warmAmber : theme.muted,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          All Reviews ({data.reviews.length})
        </button>
        <button
          onClick={() => setFilter("PENDING")}
          style={{
            padding: "5px 12px",
            borderRadius: 16,
            border: filter === "PENDING" ? `1px solid #D97706` : `1px solid ${theme.muted}25`,
            background: filter === "PENDING" ? "#D9770615" : "transparent",
            color: filter === "PENDING" ? "#D97706" : theme.muted,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Pending Reply ({pendingCount})
        </button>
        <button
          onClick={() => setFilter("REPLIED")}
          style={{
            padding: "5px 12px",
            borderRadius: 16,
            border: filter === "REPLIED" ? `1px solid ${COLORS.mossGreen}` : `1px solid ${theme.muted}25`,
            background: filter === "REPLIED" ? `${COLORS.mossGreen}15` : "transparent",
            color: filter === "REPLIED" ? COLORS.mossGreen : theme.muted,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Replied ({repliedCount})
        </button>
      </div>

      {/* Review Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filteredReviews.map((rev) => {
          const isPending = rev.status === "pending";
          const isSelected = selectedReview?.id === rev.id;

          return (
            <div
              key={rev.id}
              style={{
                background: theme.surface,
                borderRadius: 12,
                border: isSelected ? `1.5px solid ${COLORS.warmAmber}` : `1px solid ${theme.muted}18`,
                padding: "16px 18px",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: theme.heading }}>
                      {rev.authorName}
                    </span>
                    <span style={{ fontSize: 11, color: COLORS.warmAmber }}>{"★".repeat(rev.rating)}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 7px",
                        borderRadius: 10,
                        background: isPending ? "#FEF3C7" : "#D1FAE5",
                        color: isPending ? "#92400E" : "#065F46",
                      }}
                    >
                      {isPending ? "Pending Response" : "Replied"}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>
                    {rev.relativeTimeDescription} · Google Maps Review
                  </div>
                </div>

                {isPending && (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <a
                      href={GOOGLE_CONFIG.getReviewReplyUri ? GOOGLE_CONFIG.getReviewReplyUri(rev.authorName) : `https://www.google.com/search?q=The+Sixth+Element+East+Sheen+reviews+${encodeURIComponent(rev.authorName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${rev.authorName}'s review on Google to reply`}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 16,
                        background: "transparent",
                        color: theme.muted,
                        border: `1px solid ${theme.muted}30`,
                        fontSize: 11,
                        fontWeight: 500,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      ↗ View on Google
                    </a>
                    <button
                      onClick={() => handleOpenAiDraft(rev)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 16,
                        background: isSelected ? COLORS.warmAmber : `${COLORS.warmAmber}15`,
                        color: isSelected ? "#FAF8F0" : COLORS.warmAmber,
                        border: `1px solid ${COLORS.warmAmber}50`,
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      ✨ Draft AI Reply
                    </button>
                  </div>
                )}
              </div>

              <p style={{ fontSize: 12.5, lineHeight: 1.5, color: theme.text, margin: "10px 0 8px", fontWeight: 300 }}>
                &ldquo;{rev.text}&rdquo;
              </p>

              {rev.tags && rev.tags.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {rev.tags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: `${theme.muted}10`,
                        color: theme.muted,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Already Replied Box */}
              {rev.reply && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: `${COLORS.mossGreen}08`,
                    borderLeft: `3px solid ${COLORS.mossGreen}`,
                    fontSize: 12,
                    color: theme.text,
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ fontWeight: 600, color: COLORS.mossGreen }}>Published Reply: </span>
                  {rev.reply}
                </div>
              )}

              {/* Interactive AI Draft Drawer */}
              {isSelected && isPending && (
                <div
                  style={{
                    marginTop: 16,
                    padding: "16px 18px",
                    borderRadius: 10,
                    background: theme.surfaceAlt || "#FAF8F3",
                    border: `1px solid ${COLORS.warmAmber}30`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.warmAmber }}>
                      ✨ AI-Drafted Response Options (Personalized for {rev.authorName.split(" ")[0]})
                    </div>
                    <button
                      onClick={() => setSelectedReview(null)}
                      style={{ background: "none", border: "none", color: theme.muted, fontSize: 12, cursor: "pointer" }}
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {aiDrafts.map((draft) => (
                      <div
                        key={draft.id}
                        style={{
                          background: theme.surface,
                          padding: "12px 14px",
                          borderRadius: 8,
                          border: `1px solid ${theme.muted}15`,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: theme.heading }}>
                              {draft.title}
                            </span>
                            <span
                              style={{
                                fontSize: 9.5,
                                padding: "2px 6px",
                                borderRadius: 10,
                                background: `${COLORS.warmAmber}15`,
                                color: COLORS.warmAmber,
                                fontWeight: 600,
                              }}
                            >
                              {draft.badge}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={() => handleCopy(draft.text, draft.id)}
                              style={{
                                padding: "4px 10px",
                                borderRadius: 6,
                                border: `1px solid ${theme.muted}25`,
                                background: copiedId === draft.id ? COLORS.mossGreen : "transparent",
                                color: copiedId === draft.id ? "#ffffff" : theme.text,
                                fontSize: 11,
                                fontWeight: 500,
                                cursor: "pointer",
                              }}
                            >
                              {copiedId === draft.id ? "✓ Copied" : "📋 Copy"}
                            </button>
                            <button
                              onClick={() => handleMarkReplied(rev.id, draft.text)}
                              style={{
                                padding: "4px 10px",
                                borderRadius: 6,
                                border: "none",
                                background: COLORS.mossGreen,
                                color: "#ffffff",
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              ✓ Use &amp; Mark Replied
                            </button>
                          </div>
                        </div>
                        <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.5, color: theme.muted, fontStyle: "italic" }}>
                          &ldquo;{draft.text}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${theme.muted}15`, flexWrap: "wrap", gap: 10 }}>
                    <span style={{ fontSize: 11, color: theme.muted }}>
                      Tip: Copy a response above, then jump straight to {rev.authorName}'s review to paste and reply on Google.
                    </span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <a
                        href={GOOGLE_CONFIG.getReviewReplyUri ? GOOGLE_CONFIG.getReviewReplyUri(rev.authorName) : `https://www.google.com/search?q=The+Sixth+Element+East+Sheen+reviews+${encodeURIComponent(rev.authorName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 11.5,
                          color: COLORS.earthBrown,
                          background: `${COLORS.warmAmber}25`,
                          padding: "6px 14px",
                          borderRadius: 16,
                          fontWeight: 600,
                          textDecoration: "none",
                          border: `1px solid ${COLORS.warmAmber}60`,
                        }}
                      >
                        🎯 Jump to {rev.authorName}'s Review on Google ↗
                      </a>
                      <a
                        href={GOOGLE_CONFIG.businessProfileManagerUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 11,
                          color: theme.accent,
                          fontWeight: 500,
                          textDecoration: "none",
                        }}
                      >
                        GBP Reviews Dashboard ↗
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
