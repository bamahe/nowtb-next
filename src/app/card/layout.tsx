// =============================================================================
// /card layout — strips the site header/footer so the digital business card
// renders full-screen with no site chrome
// =============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barrett Henry | Broker Associate | REMAX Collective",
  description:
    "Tampa Bay Real Estate — Straight talk. Smart strategy. (813) 733-7907 · barrett@nowtb.com",
  openGraph: {
    title: "Barrett Henry | Broker Associate | REMAX Collective",
    description:
      "Tampa Bay Real Estate — Straight talk. Smart strategy.",
    url: "/card",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barrett Henry | Broker Associate | REMAX Collective",
    description:
      "Tampa Bay Real Estate — Straight talk. Smart strategy.",
  },
  alternates: { canonical: "/card/" },
};

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Render children directly — no Header, Footer, or MobileBottomBar
  return <>{children}</>;
}
