import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomBar from "@/components/ui/MobileBottomBar";
import BackToTop from "@/components/ui/BackToTop";
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
    default: "Barrett Henry, REALTOR® | Tampa Bay Homes for Sale | REMAX Collective",
    template: "%s | Barrett Henry, REALTOR®",
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
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
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
        {/* FUB tracking pixel — tracks page views across the site
            so you can see which listings leads browsed in Follow Up Boss */}
        <FubPixel />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
