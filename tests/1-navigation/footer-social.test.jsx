// tests/1-navigation/footer-social.test.jsx
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../../src/components/layout/Footer";
import { INSTAGRAM_CONFIG, FACEBOOK_CONFIG } from "../../src/data/config";
import { AM_THEME } from "../../src/theme/tokens";

describe("Footer Social & Connect Links", () => {
  it("enables Instagram link pointing to the official profile", () => {
    render(
      <Footer
        theme={AM_THEME}
        navigate={() => {}}
        onOpenAdmin={() => {}}
      />
    );

    const igLink = screen.getByRole("link", { name: /Instagram/i });
    expect(igLink).toBeInTheDocument();
    expect(igLink).toHaveAttribute("href", INSTAGRAM_CONFIG.profileUrl);
    expect(igLink).toHaveAttribute("target", "_blank");
    expect(igLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("enables Facebook link pointing to official restaurant page and excludes TikTok", () => {
    render(
      <Footer
        theme={AM_THEME}
        navigate={() => {}}
        onOpenAdmin={() => {}}
      />
    );

    // Facebook is now an active link
    const fbLink = screen.getByRole("link", { name: /Facebook/i });
    expect(fbLink).toBeInTheDocument();
    expect(fbLink).toHaveAttribute("href", FACEBOOK_CONFIG.profileUrl);
    expect(fbLink).toHaveAttribute("target", "_blank");
    expect(fbLink).toHaveAttribute("rel", "noopener noreferrer");

    // TikTok has been removed altogether
    expect(screen.queryByText(/TikTok/i)).not.toBeInTheDocument();
  });
});
