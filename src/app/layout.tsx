import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomBar from "@/components/ui/MobileBottomBar";
import BackToTop from "@/components/ui/BackToTop";
import ClientChatWidget from "@/components/ui/ClientChatWidget";
import ClientExitIntent from "@/components/ui/ClientExitIntent";
import CookieConsent from "@/components/ui/CookieConsent";
import FubPixel from "@/components/tracking/FubPixel";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Heading font — Playfair Display 800 (editorial, elegant)
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

// Body font — DM Sans 400/500/600 (clean, modern)
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Barrett Henry, REALTOR® | Tampa Bay Homes for Sale",
    template: "%s | Barrett Henry, REALTOR®",
  },
  icons: {
    icon: [
      { url: "/remax-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/remax-favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/remax-favicon.png", sizes: "180x180" },
    shortcut: "/remax-favicon-32.png",
  },
  description:
    "Barrett Henry is a licensed real estate Broker Associate with REMAX Collective serving Tampa Bay. 23+ years of real estate experience. Search homes, get market data, and connect with a trusted local expert.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nowtb.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Barrett Henry, REALTOR® — REMAX Collective",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Barrett Henry, REALTOR® — Tampa Bay Homes for Sale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: "./",
  },
  // robots: index,follow is the default — omitting to avoid redundant meta tag
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        {/* SiteNavigationElement schema — helps search engines and AI understand main nav */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              name: [
                "Home",
                "Communities",
                "Buyers",
                "Sellers",
                "Guides",
                "About",
                "Contact",
                "Properties",
                "Blog",
              ],
              url: [
                "https://nowtb.com/",
                "https://nowtb.com/communities/",
                "https://nowtb.com/buyers/",
                "https://nowtb.com/sellers/",
                "https://nowtb.com/guides/",
                "https://nowtb.com/about/",
                "https://nowtb.com/contact/",
                "https://nowtb.com/properties/",
                "https://nowtb.com/blog/",
              ],
            }),
          }}
        />
      </head>
      <body className="font-body antialiased bg-light text-dark">
        {/* Skip link for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-4 focus:left-4 focus:bg-accent focus:text-primary focus:px-4 focus:py-2 focus:rounded focus:font-semibold"
        >
          Skip to main content
        </a>
        <Header />
        {/* pb-16 md:pb-0 adds bottom padding on mobile so sticky MobileBottomBar doesn't cover content */}
        <main id="main-content" className="min-h-screen pb-16 md:pb-0">{children}</main>
        <Footer />
        {/* Mobile sticky bottom bar — Call + Contact buttons, iPhone safe-area aware */}
        <MobileBottomBar />
        {/* Floating back-to-top button — appears after scrolling 400px */}
        <BackToTop />
        {/* AI chat assistant — lazy-loaded, client-only (no SSR) */}
        <ClientChatWidget />
        {/* Exit-intent popup — offers free CMA when user is about to leave.
            Desktop: mouse leaves viewport. Mobile: after 45 seconds.
            Once per session via sessionStorage. */}
        <ClientExitIntent />
        {/* FUB tracking pixel — tracks page views across the site
            so you can see which listings leads browsed in Follow Up Boss */}
        <FubPixel />
        <Analytics />
        <SpeedInsights />
        {/* Cookie consent banner — shows on first visit, dismissible */}
        <CookieConsent />
      </body>
    </html>
  );
}
