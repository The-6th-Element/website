// src/components/features/StructuredData.jsx
import React from "react";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "The Sixth Element",
    description:
      "Specialty coffee by day, natural wine by night. A space designed to transform with you. Richmond-upon-Thames.",
    url: "https://thesixthelement.co.uk",
    telephone: "+44(0)20 35188688",
    email: "info@the6thelement.co.uk",
    address: {
      "@type": "PostalAddress",
      streetAddress: "210 Upper Richmond Road West",
      addressLocality: "London",
      addressRegion: "London",
      postalCode: "SW14 8AH",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.4613,
      longitude: -0.3037,
    },
    servesCuisine: ["Coffee", "Brunch", "Wine Bar"],
    priceRange: "££",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "09:00",
        closes: "23:00",
      },
    ],
    sameAs: ["https://www.instagram.com/the.sixth.element.210"],
    keywords:
      "Specialty Coffee Richmond, Brunch near Richmond Park, Evening drinks Richmond, Natural Wine Richmond, Social Impact Coffee Richmond, Best brunch Richmond-upon-Thames",
    hasMenu: {
      "@type": "Menu",
      url: "https://thesixthelement.co.uk/menu",
    },
    acceptsReservations: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
