// =============================================================================
// /card layout — strips the site header/footer so the digital business card
// renders full-screen with no site chrome, and exports the route's metadata.
//
// The page itself is "use client" (vCard download + Web Share API both need
// browser APIs), and Next.js will not read an `export const metadata` out of a
// client component — the build fails. A co-located layout.tsx is a server
// component by default, so metadata for the route goes here. Same pattern as
// src/app/login/layout.tsx and src/app/properties/search/layout.tsx.
// =============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  // 57 characters. /card/ is a utility page Barrett hands out via QR code and
  // text message, so the title's real job is to look right in a link preview
  // and a browser tab. "Digital Card" is included so the tab is
  // self-explanatory when several nowtb.com tabs are open at once.
  title: "Barrett Henry, REALTOR® | Digital Card | REMAX Collective",

  // 147 characters, inside the 120-155 window. The previous description was 89
  // characters — under the window, and it was a tagline plus a phone number
  // rather than a description of the page. This version leads with what the
  // page does for you (the direct answer), then the credential, then the phone.
  description:
    "Save Barrett Henry's contact details in one tap — call, text, email, or download his vCard. Tampa Bay REALTOR® at REMAX Collective. (813) 733-7907.",

  // Trailing slash required: next.config.mjs sets trailingSlash: true.
  alternates: { canonical: "/card/" },

  // index: false — a business card has no search intent behind it, and leaving
  //                it indexable means it competes with /about/ and
  //                /the-now-team/ for "Barrett Henry" queries, which are pages
  //                that actually convert.
  // follow: true — the card links out to /home-valuation/ and other site pages;
  //                there is no reason to discard those signals.
  //
  // IMPORTANT — two things to know before changing this:
  //  1. This tag is probably never read by Google. src/app/robots.ts disallows
  //     /card/ for user-agent *, so the URL is never fetched and the noindex in
  //     this HTML is never seen. robots.txt is doing the real work; this is a
  //     safety net for crawlers that ignore robots.txt and for the day /card/
  //     comes off that disallow list.
  //  2. /card/ is NOT covered by the X-Robots-Tag headers in vercel.json. Those
  //     rules match the sources "/c/(.*)" and "/clients/(.*)" — both require a
  //     literal /c/ or /clients/ path segment, and "/card/" matches neither
  //     ("/c/" is not a prefix of "/card/"; the segment is "card", not "c").
  //     So there is no existing header behaviour here to contradict. If you want
  //     a header on this route too, it needs its own entry in vercel.json —
  //     which this engineer does not own, so it was reported rather than added.
  robots: {
    index: false,
    follow: true,
  },

  openGraph: {
    title: "Barrett Henry, REALTOR® | REMAX Collective",
    description:
      "Tampa Bay real estate — straight talk, smart strategy. Save Barrett's contact details or call (813) 733-7907.",
    // Was "/card" with no trailing slash, which points at the URL that
    // 308-redirects to "/card/" under trailingSlash: true. Shared links hit a
    // needless redirect hop and some scrapers do not follow it.
    url: "/card/",
    type: "website",
    // /og-default.png is the site's existing 1200x630 card from
    // src/app/layout.tsx. Named explicitly so overriding `openGraph` here does
    // not drop the inherited image.
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Barrett Henry, REALTOR® | REMAX Collective",
    description:
      "Tampa Bay real estate — straight talk, smart strategy. Save Barrett's contact details or call (813) 733-7907.",
    images: ["/og-default.png"],
  },
};

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Render children directly — no Header, Footer, or MobileBottomBar
  return <>{children}</>;
}
