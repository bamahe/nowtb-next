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
    canonical: "https://nowtb.com/",
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
        {/* WebSite schema — tells Google the site name to display in search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              // Single canonical WebSite entity for the whole site. The homepage
              // used to emit a second one under a different name, which gave
              // Google two competing definitions of what this site is called.
              "@id": "https://nowtb.com/#website",
              "name": "Barrett Henry, REALTOR\u00ae",
              "alternateName": "The NOW Team Tampa Bay",
              "url": "https://nowtb.com",
              // Sitelinks search box \u2014 moved here from the homepage during the merge
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://nowtb.com/properties?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Person schema — Barrett Henry identity anchor for Google Knowledge Graph.
            This ties all digital properties together via sameAs and gives Google
            the structured signals it needs to build a Knowledge Panel. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://nowtb.com/#barrett-henry",
              "name": "Barrett Henry",
              "jobTitle": "Broker Associate",
              "description":
                "Licensed REALTOR\u00ae and Broker Associate with REMAX Collective, serving Tampa Bay with 23+ years of real estate experience.",
              "image": "https://nowtb.com/images/barrett-henry-headshot.jpg",
              "url": "https://nowtb.com/about/",
              "telephone": "+1-813-733-7907",
              "email": "barrett@nowtb.com",
              "hasCredential": [
                {
                  "@type": "EducationalOccupationalCredential",
                  "credentialCategory": "Real Estate License",
                  "name": "Florida Broker Associate",
                  "recognizedBy": {
                    "@type": "Organization",
                    "name": "Florida DBPR",
                  },
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  "credentialCategory": "Designation",
                  "name": "e-PRO",
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  "credentialCategory": "Designation",
                  "name": "MRP (Military Relocation Professional)",
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  "credentialCategory": "Designation",
                  "name": "SRS (Seller Representative Specialist)",
                },
              ],
              "award": [
                "REMAX Hall of Fame 2024",
                "REMAX 10-Year Anniversary Award",
              ],
              "worksFor": {
                "@type": "RealEstateAgent",
                "name": "REMAX Collective",
                "url": "https://nowtb.com",
              },
              "knowsAbout": [
                "Tampa Bay Real Estate",
                "Florida Housing Market",
                "Property Management",
                "First-Time Home Buyers",
                "Investment Properties",
              ],
              "sameAs": [
                "https://nowtb.com",
                "https://barretthenry.remax.com",
                "https://www.instagram.com/nowtampa/",
                "https://www.facebook.com/NOWTampaBay",
                "https://www.linkedin.com/in/barretthenry/",
                "https://bestbayservices.com",
                "https://vyrabyte.com",
                "https://vivipm.com",
                "https://fastselleasy.com",
                "https://flforeclosurehelp.com",
                "https://hencre.com",
                "https://valrico.blog",
                "https://buildtb.com",
                "https://flpermithelp.com",
              ],
            }),
          }}
        />
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
        {/* Skip link for keyboard/screen reader users.
            Uses focus-visible, not focus: a plain :focus fires when a phone
            browser or the address bar hands focus to the first link on load,
            which painted a stray light box behind the REMAX logo on mobile.
            focus-visible only triggers for real keyboard navigation. */}
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:z-[9999] focus-visible:top-4 focus-visible:left-4 focus-visible:bg-accent focus-visible:text-primary focus-visible:px-4 focus-visible:py-2 focus-visible:rounded focus-visible:font-semibold"
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
        {/* Exit-intent popup — DISABLED per Barrett's request
        <ClientExitIntent />
        */}
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
