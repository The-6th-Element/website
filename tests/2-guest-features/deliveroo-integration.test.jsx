// tests/2-guest-features/deliveroo-integration.test.jsx
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DELIVEROO_CONFIG, DELIVEROO_URL } from "../../src/data/config";
import { MenuPage } from "../../src/pages/MenuPage";
import { ContactPage } from "../../src/pages/ContactPage";
import { Navbar } from "../../src/components/layout/Navbar";
import { Footer } from "../../src/components/layout/Footer";

const testTheme = {
  bg: "#0D1117",
  surface: "#161B22",
  text: "#E6EDF3",
  heading: "#FFFFFF",
  muted: "#8B949E",
  accent: "#C8A96E",
  navBg: "rgba(13,17,23,0.95)",
};

describe("FEATURE-79: Deliveroo Ordering & Delivery Integration", () => {
  it("provides valid canonical Deliveroo store URL configuration", () => {
    expect(DELIVEROO_CONFIG.url).toBe(
      "https://deliveroo.co.uk/menu/london/sheen/the-sixth-element-210-upper-richmond-road-west"
    );
    expect(DELIVEROO_URL).toBe(DELIVEROO_CONFIG.url);
  });

  it("renders Deliveroo local delivery banner on MenuPage", () => {
    render(
      <MenuPage
        theme={testTheme}
        flags={{}}
        setBookingOpen={() => {}}
        navigate={() => {}}
      />
    );

    const bannerText = screen.getByText(/Enjoy The Sixth Element at Home/i);
    expect(bannerText).toBeInTheDocument();

    const orderLinks = screen.getAllByRole("link", { name: /Order on Deliveroo/i });
    expect(orderLinks.length).toBeGreaterThan(0);
    const link = orderLinks[0];
    expect(link).toHaveAttribute("href", DELIVEROO_CONFIG.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders Deliveroo delivery order link in Navbar mobile navigation drawer", () => {
    render(
      <Navbar
        theme={testTheme}
        menuOpen={true}
        setMenuOpen={() => {}}
        navigate={() => {}}
        currentPage="home"
        setBookingOpen={() => {}}
      />
    );

    const drawer = screen.getByRole("region", { name: "Mobile Navigation" });
    expect(drawer).toBeInTheDocument();

    const mobileLink = screen.getByRole("link", { name: /Order for Delivery \(Deliveroo\)/i });
    expect(mobileLink).toBeInTheDocument();
    expect(mobileLink).toHaveAttribute("href", DELIVEROO_CONFIG.url);
    expect(mobileLink).toHaveAttribute("target", "_blank");
  });

  it("renders Local Delivery card on ContactPage", () => {
    render(
      <ContactPage
        theme={testTheme}
        setBookingOpen={() => {}}
      />
    );

    const cardHeader = screen.getByText(/Local Delivery/i);
    expect(cardHeader).toBeInTheDocument();

    const deliverooBtn = screen.getByRole("link", { name: /Order on Deliveroo/i });
    expect(deliverooBtn).toHaveAttribute("href", DELIVEROO_CONFIG.url);
  });

  it("renders Deliveroo link in Footer", () => {
    render(
      <Footer
        theme={testTheme}
        navigate={() => {}}
        onOpenAdmin={() => {}}
      />
    );

    const footerLink = screen.getByRole("link", { name: /Deliveroo \(Delivery\)/i });
    expect(footerLink).toBeInTheDocument();
    expect(footerLink).toHaveAttribute("href", DELIVEROO_CONFIG.url);
  });
});
