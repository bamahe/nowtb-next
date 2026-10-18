import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChromeGate from "@/components/layout/ChromeGate";
import MobileBottomBar from "@/components/ui/MobileBottomBar";
import BackToTop from "@/components/ui/BackToTop";
import ClientChatWidget from "@/components/ui/ClientChatWidget";
import ClientExitIntent from "@/components/ui/ClientExitIntent";
import CookieConsent from "@/components/ui/CookieConsent";
import FubPixel from "@/components/tracking/FubPixel";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GA_MEASUREMENT_ID, isGaConfigured } from "@/lib/analytics";

// =============================================================================
// THE SITE-WIDE Z-INDEX SCALE — read this before adding any fixed/sticky thing
// =============================================================================
// "z-index" is just stacking order: when two things overlap on screen, the
// higher number wins and sits on top. The numbers mean nothing on their own —
// only their order relative to each other matters.
//
// This site had three different people pick numbers independently, and the
// result was the cookie banner (z-90) sitting on top of the chat bubble (z-50)
// and the back-to-top button (z-40) for every single first-time mobile
// visitor — burying the exact buttons we want them to press.
//
// ONE SCALE. If you add a floating element, pick a tier from this list; do not
// invent a number:
//
//   10–30  In-page sticky bars (property search filters, table headers, etc.)
//          MUST stay at or below 30 so they slide UNDER the fixed site header.
//   40     BackToTop ................... src/components/ui/BackToTop.tsx
//   45     Chat bubble + its tooltip ... src/components/ui/ChatWidget.tsx
//   50     MobileBottomBar ............. src/components/ui/MobileBottomBar.tsx
//          (above the chat bubble on purpose — the Call button is the single
//           most valuable thing on a phone screen and must never be covered)
//   60     Header bar .................. src/components/layout/Header.tsx
//   65     Header mega-menu panels ..... src/components/layout/Header.tsx
//   70     CookieConsent banner ........ src/components/ui/CookieConsent.tsx
//   80     Open chat panel (dialog) .... src/components/ui/ChatWidget.tsx
//          (a dialog the visitor deliberately opened outranks the banner)
//   9999   Skip-to-content link (below, keyboard users only)
//   10000  MobileNav full-screen overlay / its hamburger button
//          ... src/components/layout/MobileNav.tsx — it covers the whole
//          viewport by design, so it legitimately sits above everything.
//
// SEPARATE FROM Z-INDEX — the cookie banner also physically MOVES the floating
// buttons rather than just sitting behind them. CookieConsent measures itself
// and publishes its height as the CSS variable `--cookie-banner-lift` on
// <html>; BackToTop and the chat bubble add that value to their bottom margin
// so they float clear of the banner while it is on screen, then settle back
// down once the visitor dismisses it. Grep for `--cookie-banner-lift`.
//
// If it breaks, check: two overlapping elements with the SAME z-index fall back
// to DOM order (later in the HTML wins), which is the silent-ambiguity trap
// this list exists to prevent. Give every tier its own number.
// =============================================================================

/**
 * The brand suffix that `metadata.title.template` below appends to every page
 * title, exported so nothing has to hardcode its length.
 *
 * WHY THIS IS EXPORTED: pages that budget their own title against the 60-char
 * search-result limit need to know how many characters the suffix will eat.
 * src/app/[citySlug]/page.tsx did that by hardcoding the old 26-character
 * string. When the suffix was shortened to 16, that copy went stale and the
 * page kept reserving 10 characters that no longer existed — silently dropping
 * the "| Relocation" modifier from 23 city pages where it now fits fine.
 *
 * If it breaks, check: change the suffix HERE and in `template` together, and
 * every page that imports this constant stays correct automatically.
 */
export const TITLE_SUFFIX = " | Barrett Henry";

/** Characters a page title may use before the suffix pushes it past 60. */
export const TITLE_BUDGET = 60 - TITLE_SUFFIX.length;

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
    // `default` is the title used when a page sets no title of its own. It is a
    // complete title already, so the template below is NOT applied to it.
    default: "Barrett Henry, REALTOR® | Tampa Bay Homes for Sale",

    // ─── THE TITLE SUFFIX — the single highest-leverage string on the site ───
    // `template` wraps the title of EVERY page that sets a plain string title.
    // Google truncates search-result titles at roughly 60 characters, so this
    // suffix is spent out of the same 60-character budget as the page's actual
    // keyword phrase.
    //
    // It used to be " | Barrett Henry, REALTOR®" — 26 characters of brand on
    // every one of ~3,400 pages. Measured across the sitemap that pushed about
    // 75% of all pages past 60 characters (91% of blog posts, 94% of
    // neighborhood pages) and Google was cutting their keywords off mid-phrase.
    // Critically, ZERO city pages exceeded 60 characters without the suffix —
    // the suffix alone was the entire cause.
    //
    // Now " | Barrett Henry" — 16 characters, a 10-character saving per page.
    // "REALTOR®" was dropped from the suffix on purpose: repeating it 3,400
    // times earns no ranking, and the credential is already stated properly in
    // the Person schema below (jobTitle + hasCredential), which is where search
    // engines and AI answer engines actually read it from.
    //
    // Barrett's personal name stays — personal brand outranks team brand, and
    // a recognisable name in the result is what earns the click.
    //
    // If it breaks, check: a page that needs to bypass this suffix entirely
    // sets `title: { absolute: "..." }` instead of a plain string. Eleven pages
    // do that today and are unaffected by this change. Pages that budget their
    // own titles around the old 26-character suffix (notably
    // src/app/[citySlug]/page.tsx) now have 10 characters of headroom back.
    template: "%s | Barrett Henry",
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
  // NO `alternates.canonical` HERE — ON PURPOSE. DO NOT ADD IT BACK.
  //
  // A canonical in the ROOT layout is inherited by every page that does not set
  // its own. This file used to declare `canonical: "https://nowtb.com/"`, which
  // meant every such page was telling Google "the real version of me is the
  // homepage" — the strongest possible instruction to drop that page from the
  // index and fold it into the homepage.
  //
  // The worst case was 404s: src/app/not-found.tsx sets no metadata, so every
  // missing URL on the site declared itself to be the homepage.
  //
  // It was also redundant for the only page it was correct for — src/app/page.tsx
  // already sets `canonical: "https://nowtb.com/"` itself.
  //
  // If it breaks, check: a canonical belongs on the individual page (or its
  // generateMetadata), never in the shared root layout.
  //
  // robots: index,follow is the default — omitting to avoid a redundant meta tag
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
              "image": "https://nowtb.com/images/barrett-headshot.png",
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
                "https://www.fastexpert.com/agents/barrett-henry-135533/",
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
        {/* ChromeGate strips header/footer/bottom-bar on open house kiosk routes
            so a guest mid-sign-in cannot tap into site nav and lose the form. */}
        <ChromeGate><Header /></ChromeGate>
        {/* pb-16 md:pb-0 adds bottom padding on mobile so sticky MobileBottomBar doesn't cover content */}
        <main id="main-content" className="min-h-screen pb-16 md:pb-0">{children}</main>
        <ChromeGate><Footer /></ChromeGate>
        {/* Mobile sticky bottom bar — Call + Contact buttons, iPhone safe-area aware */}
        <ChromeGate><MobileBottomBar /></ChromeGate>
        {/* Floating back-to-top button — appears after scrolling 400px */}
        <ChromeGate><BackToTop /></ChromeGate>
        {/* AI chat assistant — lazy-loaded, client-only (no SSR).
            Gated off the kiosks: a floating chat bubble over a sign-in form is
            something a guest taps by accident, and nobody is watching it. */}
        <ChromeGate><ClientChatWidget /></ChromeGate>
        {/* Exit-intent popup — RE-ENABLED Oct 2026 at Barrett's direction.
            It was switched off earlier, but the component was fully built and
            working the whole time: ClientExitIntent reads the current path and
            picks a buyer, seller or general variant, so someone leaving a
            valuation page sees a seller offer rather than a generic plea.
            Lazy-loaded with ssr:false, so it costs nothing until it fires.
            If it breaks, check: ClientExitIntent.tsx's BUYER_PATTERNS /
            SELLER_PATTERNS path lists — a new route that matches neither
            silently falls back to the "general" variant. */}
        <ChromeGate><ClientExitIntent /></ChromeGate>
        {/* FUB tracking pixel — tracks page views across the site
            so you can see which listings leads browsed in Follow Up Boss */}
        <FubPixel />
        <Analytics />
        <SpeedInsights />
        {/* Cookie consent banner — shows on first visit, dismissible */}
        <CookieConsent />

        {/* ──────────────────────────────────────────────────────────────────
            Google Analytics 4 — CONVERSION tracking (phone taps, chat leads)
            Vercel Analytics above gives pageviews; it cannot tell you that
            someone tapped the phone number, which is the number that matters.

            MANUAL STEP STILL REQUIRED: none of this reports anything until
            NEXT_PUBLIC_GA_ID is added in the Vercel dashboard (Settings →
            Environment Variables) with the GA4 Measurement ID, e.g.
            "G-ABC1234XYZ". It is NOT set today, which is fine — isGaConfigured()
            returns false, both <Script> tags below are skipped entirely, and
            every trackEvent() call in the app quietly does nothing. No crash,
            no console error, no network request.

            strategy="afterInteractive" loads it after the page is usable, so
            analytics can never delay the content a visitor came for.

            If it breaks, check: an inline <Script> MUST have a unique `id` or
            Next.js can inject it twice on client-side navigation. See also the
            troubleshooting list at the top of src/lib/analytics.ts.
            ────────────────────────────────────────────────────────────────── */}
        {isGaConfigured() && (
          <>
            <Script
              id="ga4-loader"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
