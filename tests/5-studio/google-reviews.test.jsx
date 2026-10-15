// tests/5-studio/google-reviews.test.jsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import {
  getGoogleReviews,
  recordReviewReply,
  generateAiReviewReplies,
} from "../../src/utils/reviewsManager";
import { GoogleReviewsModal } from "../../src/components/features/GoogleReviewsModal";
import { GoogleReviewsManager } from "../../src/components/admin/GoogleReviewsManager";
import { HomePage } from "../../src/pages/HomePage";
import { AM_THEME } from "../../src/theme/tokens";

describe("FEATURE-80: Google Reviews Ingestion & AI Reputation Manager (GBP-03)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("1. Ingestion: retrieves verified Google reviews with 4.8 rating and place ID", () => {
    const data = getGoogleReviews();
    expect(data.placeId).toBe("ChIJGQQLEQAPdkgRd3Et9bb_R3M");
    expect(data.rating).toBe(4.8);
    expect(data.reviews.length).toBeGreaterThanOrEqual(5);

    const charlotte = data.reviews.find((r) => r.authorName.includes("Charlotte"));
    expect(charlotte).toBeDefined();
    expect(charlotte.rating).toBe(5);
    expect(charlotte.tags).toContain("Cardamom French Toast");
  });

  it("2. AI Reputation Engine: generates 3 brand-tailored response options referencing diner details", () => {
    const mockReview = {
      id: "rev_test",
      authorName: "Marcus Sterling",
      rating: 5,
      tags: ["Heated Terrace", "Cocktails"],
    };

    const drafts = generateAiReviewReplies(mockReview);
    expect(drafts.length).toBe(3);

    // Warm & Gracious
    expect(drafts[0].title).toBe("Warm & Gracious");
    expect(drafts[0].text).toContain("Marcus");
    expect(drafts[0].text).toContain("Heated Terrace and Cocktails");

    // Founder-Led
    expect(drafts[1].title).toBe("Founder-Led");
    expect(drafts[1].text).toContain("Pooja, Deepak");

    // Crisp & Professional
    expect(drafts[2].title).toBe("Crisp & Professional");
    expect(drafts[2].text).toContain("5-star review");
  });

  it("3. Reply Persistence: records reply and updates review status to replied", () => {
    const before = getGoogleReviews();
    const target = before.reviews.find((r) => r.status === "pending");
    expect(target).toBeDefined();

    recordReviewReply(target.id, "Thank you so much from Pooja and Deepak!");

    const after = getGoogleReviews();
    const updated = after.reviews.find((r) => r.id === target.id);
    expect(updated.status).toBe("replied");
    expect(updated.reply).toContain("Pooja and Deepak");
  });

  it("4. Front-End: renders Google Social Proof badge in Hero and opens GoogleReviewsModal on click", () => {
    render(
      <HomePage
        theme={AM_THEME}
        isAM={true}
        navigate={vi.fn()}
        setBookingOpen={vi.fn()}
        flags={{ booking_enabled: true, instagram_feed: false }}
      />
    );

    // Verify Hero badge
    const badge = screen.getByTitle(/Read verified Google reviews/i);
    expect(badge).toBeInTheDocument();
    expect(screen.getByText(/4.8 on Google/i)).toBeInTheDocument();

    // Click badge to open modal
    fireEvent.click(badge);

    expect(screen.getByRole("dialog", { name: /Google Customer Reviews/i })).toBeInTheDocument();
    expect(screen.getByText(/Guest Stories & Experiences/i)).toBeInTheDocument();
    expect(screen.getByText(/Charlotte Davies/i)).toBeInTheDocument();

    // Verify filter chips
    const brunchFilter = screen.getByRole("button", { name: /Brunch & Coffee/i });
    fireEvent.click(brunchFilter);
    expect(screen.getAllByText(/Cardamom French Toast/i).length).toBeGreaterThanOrEqual(1);

    // Verify close action
    const closeBtn = screen.getByRole("button", { name: /Close modal/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("5. Staff Portal: renders GoogleReviewsManager with KPI metrics and AI reply drawer", () => {
    render(<GoogleReviewsManager theme={AM_THEME} />);

    // Check KPIs
    expect(screen.getByText(/Google Reviews & AI Response Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/4.8 ★/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified Diners/i)).toBeInTheDocument();

    // Find a pending review with Draft AI Reply button
    const draftBtns = screen.getAllByRole("button", { name: /Draft AI Reply/i });
    expect(draftBtns.length).toBeGreaterThanOrEqual(1);

    // Click first Draft AI Reply button
    fireEvent.click(draftBtns[0]);

    // Verify AI drawer opens with 3 options
    expect(screen.getByText(/AI-Drafted Response Options/i)).toBeInTheDocument();
    expect(screen.getByText(/Warm & Gracious/i)).toBeInTheDocument();
    expect(screen.getByText(/Founder-Led/i)).toBeInTheDocument();
    expect(screen.getByText(/Crisp & Professional/i)).toBeInTheDocument();

    // Check Copy button exists
    const copyBtns = screen.getAllByRole("button", { name: /Copy/i });
    expect(copyBtns.length).toBeGreaterThanOrEqual(1);
  });
});
