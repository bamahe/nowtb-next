// =============================================================================
// /properties/search layout — exports metadata for the client component page
// The page itself is "use client" so metadata must live here.
// =============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Search Homes for Sale in Tampa Bay | Barrett Henry | REMAX Collective",
  description:
    "Search Tampa Bay homes for sale — filter by price, beds, baths, and property type. Updated daily from Stellar MLS. Barrett Henry, REALTOR® at REMAX Collective. (813) 733-7907.",
  alternates: {
    canonical: "/properties/search/",
  },
  openGraph: {
    title: "Search Homes for Sale in Tampa Bay | Barrett Henry",
    description:
      "Browse active listings across Tampa Bay. Filter by price, beds, baths, property type, and more. Updated daily from Stellar MLS.",
    url: "/properties/search/",
    type: "website",
  },
};

export default function PropertySearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
