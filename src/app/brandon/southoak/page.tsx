// =============================================================================
// Southoak Neighborhood Page — /brandon/southoak/
// Custom acreage community page in Bloomingdale/Brandon, FL.
// Uses the shared NeighborhoodPage component with custom metadata and
// additional JSON-LD schema blocks (RealEstateAgent + FAQPage + Breadcrumb).
// =============================================================================

import type { Metadata } from "next";
import NeighborhoodPage from "@/components/pages/NeighborhoodPage";
import { getNeighborhoodsByCity } from "@/data/neighborhoods";
import { NEIGHBORHOOD_STATS } from "@/data/neighborhood-stats";

// --- Static metadata for SEO ---
export const metadata: Metadata = {
  title: "Southoak Homes for Sale in Bloomingdale | Barrett Henry | REMAX",
  description:
    "Explore Southoak, a hidden acreage community in Bloomingdale near Brandon, FL. Custom homes on up to 5 acres. Barrett Henry, REMAX Collective.",
  alternates: {
    canonical: "https://nowtb.com/brandon/southoak/",
  },
  openGraph: {
    title: "Southoak Homes for Sale in Bloomingdale | Barrett Henry | REMAX",
    description:
      "Explore Southoak, a hidden acreage community in Bloomingdale near Brandon, FL. Custom homes on up to 5 acres. Barrett Henry, REMAX Collective.",
    url: "https://nowtb.com/brandon/southoak/",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

// --- ISR: revalidate every 5 minutes (matches main catch-all) ---
export const revalidate = 300;

export default function SouthoakPage() {
  // Build nearby neighborhoods list from Brandon siblings (excluding Southoak itself)
  const nearbyNeighborhoods = getNeighborhoodsByCity("brandon")
    .filter((n) => n.slug !== "southoak")
    .map((n) => ({ name: n.name, slug: n.slug }));

  // Pull FAQ data from neighborhood stats for the FAQPage schema
  const stats = NEIGHBORHOOD_STATS["southoak"];
  const faqs = stats?.faqs || [];

  return (
    <>
      {/* --- RealEstateAgent JSON-LD schema --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Barrett Henry - REMAX Collective",
            telephone: "(813) 733-7907",
            email: "barrett@nowtb.com",
            url: "https://nowtb.com/brandon/southoak/",
            areaServed: {
              "@type": "Place",
              name: "Southoak, Bloomingdale, FL",
            },
          }),
        }}
      />

      {/* --- FAQPage JSON-LD schema (supplements the one in NeighborhoodStatsSection) --- */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.answer,
                },
              })),
            }),
          }}
        />
      )}

      {/* --- Render the shared NeighborhoodPage component --- */}
      <NeighborhoodPage
        name="Southoak"
        slug="southoak"
        city="Brandon"
        citySlug="brandon"
        nearbyNeighborhoods={nearbyNeighborhoods}
        h1Override="Southoak Homes for Sale - Bloomingdale, Brandon, FL"
      />
    </>
  );
}
