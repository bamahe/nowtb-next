"use client";

// =============================================================================
// ChromeGate — hides the site header, footer and mobile bottom bar on kiosk
// routes and on private client packets.
//
// Client packets under /clients/ are a private link sent to one buyer. They
// draw their own header and footer, and the site nav would only invite the
// client to wander off into public pages mid comparison.
//
// Open house kiosks run unattended on an iPad at a front door. The normal site
// chrome is actively harmful there: a guest halfway through signing in can tap
// "Communities" in the nav, or the Call/Chat buttons in the bottom bar, and the
// sign-in is lost with nobody watching. The kiosks draw their own header, so
// the site one is redundant as well as risky.
//
// Children are passed through from the server layout, so Header and Footer stay
// server components — this only decides whether to render them.
// =============================================================================

import { usePathname } from "next/navigation";

// Any single-property page's /sign-in/ or /feedback/ child route.
const KIOSK_ROUTE = /\/(sign-in|feedback)\/?$/;

// Private per-client comparison packets.
const CLIENT_PACKET_ROUTE = /^\/clients\//;

export function isKioskPath(pathname: string | null): boolean {
  return KIOSK_ROUTE.test(pathname || "");
}

export function isClientPacketPath(pathname: string | null): boolean {
  return CLIENT_PACKET_ROUTE.test(pathname || "");
}

export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isKioskPath(pathname) || isClientPacketPath(pathname)) return null;
  return <>{children}</>;
}
