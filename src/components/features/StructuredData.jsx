// src/components/features/StructuredData.jsx
import React from "react";
import { TOAST_CONFIG } from "../../data/config.js";

export function StructuredData() {
  const reservationUrl =
    TOAST_CONFIG?.reservationUrl ||
    "https://tables.toasttab.com/restaurants/5503e03f-b188-421c-aa8f-5a2c8e27fd59/findTime";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "CafeOrCoffeeShop", "BarOrPub"],
    name: "The Sixth Element",
    alternateName: ["The 6th Element", "The Sixth Element Richmond"],
    description:
      "Specialty coffee & brunch by day, modern Indian sharing plates & natural wine by night. 2 minutes from Richmond Park. 210 Upper Richmond Road West, London SW14 8AH.",
    url: "https://the6thelement.co.uk",
    image: [
      "https://the6thelement.co.uk/day-cafe.jpg",
      "https://the6thelement.co.uk/evening-lounge.jpg",
      "https://the6thelement.co.uk/hero-cocktail.jpg",
      "https://the6thelement.co.uk/cocktails-trio.jpg",
    ],
    telephone: "+44 20 8878 1234",
    email: "info@the6thelement.co.uk",
    address: {
      "@type": "PostalAddress",
      streetAddress: "210 Upper Richmond Road West",
      addressLocality: "East Sheen",
      addressRegion: "Richmond-upon-Thames, London",
      postalCode: "SW14 8AH",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.4643,
      longitude: -0.2707,
    },
    servesCuisine: [
      "Modern Indian",
      "Specialty Coffee",
      "Brunch",
      "Natural Wine",
      "Small Plates",
      "Craft Beer",
      "Cocktails",
    ],
    priceRange: "££",
    currenciesAccepted: "GBP",
    paymentAccepted: "Cash, Credit Card, Contactless, Apple Pay, Google Pay",
    acceptsReservations: true,
    hasMenu: {
      "@type": "Menu",
      name: "The Sixth Element Day & Evening Menu",
      url: "https://the6thelement.co.uk/#menu",
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: reservationUrl,
        inLanguage: "en-GB",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
          "http://schema.org/IOSPlatform",
          "http://schema.org/AndroidPlatform",
        ],
      },
      result: {
        "@type": "FoodEstablishmentReservation",
        name: "Table Reservation at The Sixth Element",
      },
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Dog Friendly / Richmond Park Walkers",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Outdoor Heated Terrace",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Free High-Speed Wi-Fi",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Social Impact Coffee Partner (Old Spike)",
        value: true,
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday"],
        opens: "08:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/the.sixth.element.210",
      "https://tables.toasttab.com/restaurants/5503e03f-b188-421c-aa8f-5a2c8e27fd59/findTime",
    ],
    keywords:
      "Specialty Coffee Richmond, Modern Indian East Sheen, Brunch near Richmond Park, Natural Wine Upper Richmond Road, Restaurants SW14 London, Best brunch East Sheen, Toast Tables Richmond",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
