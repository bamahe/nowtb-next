// =============================================================================
// /properties/search layout, exports metadata for the client component page
//
// WHY THE METADATA LIVES HERE AND NOT IN page.tsx:
// src/app/properties/search/page.tsx starts with "use client" because it uses
// useSearchParams/useState to drive the filter bar. Next.js refuses to read an
// `export const metadata` (or generateMetadata) out of a client component, the
// build fails with "You are attempting to export \"metadata\" from a component
// marked with \"use client\"". A co-located layout.tsx is a server component by
// default, so this is the standard place to put metadata for a client page.
// Same pattern as src/app/card/layout.tsx, src/app/login/layout.tsx and
// src/app/mortgage-calculator/layout.tsx.
//
// If it breaks, check:
//  - Title/description not showing in the SERP or in view-source? Confirm this
//    file still exists and still default-exports a component. Deleting the
//    component export while keeping the metadata export silently breaks the
//    route segment.
//  - Moved the metadata into page.tsx "to tidy up"? That will fail the build.
//    Put it back here.
// =============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  // 51 characters. Primary keyword ("Tampa Bay Homes for Sale") leads, because
  // Google weights the front of the title and truncates past ~60. The previous
  // title was "Search Homes for Sale in Tampa Bay | Barrett Henry | REMAX
  // Collective", 69 characters, so the brand got cut off in the SERP anyway
  // and the keyword was buried behind the word "Search".
  title: "Tampa Bay Homes for Sale | Search Live MLS Listings",

  // 146 characters, inside the 120-155 window. Answers "what is this page"
  // first, then the CTA + phone. The previous description was 175 characters,
  // which Google truncates mid-sentence.
  description:
    "Search every Tampa Bay home for sale with live Stellar MLS data, map view, and price, bed, bath, and type filters. Questions? Call (813) 733-7907.",

  alternates: {
    // Deliberately a static string with no query parameters.
    //
    // WHY: this page reads filters out of the URL (?minPrice=300000&beds=3&...),
    // so a crawler following filter links can discover a near-infinite number of
    // URLs that all render the same template over a different slice of the same
    // MLS feed. That is textbook duplicate content and it burns crawl budget on
    // a site that already has ~3,400 real pages competing for attention.
    //
    // Because `canonical` is hardcoded to the bare path rather than built from
    // searchParams, EVERY parameterized variant emits
    // <link rel="canonical" href="https://nowtb.com/properties/search/" />
    // and consolidates its ranking signals onto the one base URL. That is the
    // behaviour we want: the filtered views exist for humans, not for Google.
    //
    // The trailing slash is required, next.config.mjs sets trailingSlash: true,
    // so /properties/search (no slash) 308-redirects to /properties/search/.
    // A canonical pointing at the redirecting form makes every crawl a hop.
    //
    // If a specific filtered view ever deserves to rank on its own (e.g.
    // waterfront under $500k), the right fix is a real static route with its own
    // content, there are already pages like /waterfront/ and /condos/ doing
    // exactly that. Do not start generating per-parameter canonicals here.
    canonical: "/properties/search/",
  },

  openGraph: {
    title: "Tampa Bay Homes for Sale | Search Live MLS Listings",
    description:
      "Browse active listings across Tampa Bay. Filter by price, beds, baths, property type, and more. Updated daily from Stellar MLS.",
    url: "/properties/search/",
    type: "website",
    // /og-default.png is the site's existing 1200x630 share card, declared in
    // src/app/layout.tsx and reused by src/app/page.tsx. Repeating it here is
    // belt-and-braces: a page that overrides `openGraph` can otherwise drop the
    // inherited image depending on how the object merges.
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function PropertySearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
