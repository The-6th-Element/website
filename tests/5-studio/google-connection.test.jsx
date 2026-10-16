// tests/5-studio/google-connection.test.jsx
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GOOGLE_CONFIG } from "../../src/data/config";
import { GoogleConnectionCard } from "../../src/components/admin/GoogleConnectionCard";
import { ContactPage } from "../../src/pages/ContactPage";

const testTheme = {
  bg: "#0D1117",
  surface: "#161B22",
  surfaceAlt: "#21262D",
  text: "#E6EDF3",
  heading: "#FFFFFF",
  muted: "#8B949E",
  accent: "#C8A96E",
};

describe("FEATURE-78: Google Business Profile & Places API Connection (GBP-01)", () => {
  it("exports valid, verified Google Place ID and configuration", () => {
    expect(GOOGLE_CONFIG.placeId).toBe("ChIJGQQLEQAPdkgRd3Et9bb_R3M");
    expect(GOOGLE_CONFIG.cid).toBe("8306889198970696055");
    expect(GOOGLE_CONFIG.storeCode).toBe("06233181898163879843");
    expect(GOOGLE_CONFIG.apiKey).toBeDefined();
    expect(GOOGLE_CONFIG.reviewUri).toContain("ChIJGQQLEQAPdkgRd3Et9bb_R3M");
    expect(GOOGLE_CONFIG.mapsUri).toContain("8306889198970696055");
  });

  it("renders GoogleConnectionCard with verified status, IDs, and rating", () => {
    render(<GoogleConnectionCard theme={testTheme} />);

    expect(screen.getByText(/Google Business Profile & Places/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified & Connected/i)).toBeInTheDocument();
    expect(screen.getByText(GOOGLE_CONFIG.placeId)).toBeInTheDocument();
    expect(screen.getByText(GOOGLE_CONFIG.storeCode)).toBeInTheDocument();
    expect(screen.getByText(/4\.8 ★/i)).toBeInTheDocument();
  });

  it("handles live API handshake test execution", async () => {
    const originalKey = GOOGLE_CONFIG.apiKey;
    GOOGLE_CONFIG.apiKey = "mock-api-key-for-test-handshake";

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        displayName: { text: "The Sixth Element" },
        rating: 4.8,
        userRatingCount: 30,
        formattedAddress: "210 Upper Richmond Rd W, London SW14 8AH, UK",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    try {
      render(<GoogleConnectionCard theme={testTheme} />);

      const testBtn = screen.getByRole("button", { name: /Test API Handshake/i });
      expect(testBtn).toBeInTheDocument();

      fireEvent.click(testBtn);

      await waitFor(() => {
        expect(screen.getByText(/API Handshake Live & Verified/i)).toBeInTheDocument();
      });
    } finally {
      GOOGLE_CONFIG.apiKey = originalKey;
      vi.unstubAllGlobals();
    }
  });

  it("renders Review Us on Google link on ContactPage", () => {
    render(<ContactPage theme={testTheme} setBookingOpen={() => {}} />);

    const reviewLink = screen.getByRole("link", { name: /Review Us on Google/i });
    expect(reviewLink).toBeInTheDocument();
    expect(reviewLink).toHaveAttribute("href", GOOGLE_CONFIG.reviewUri);
    expect(reviewLink).toHaveAttribute("target", "_blank");
  });
});
