// =============================================================================
// NeighborhoodGuidePage — Scrollable neighborhood guide for a city
// Rendered as the spoke page for the "neighborhood-guide" topic.
//
// Layout:
//   Hero → Table of Contents → [Neighborhood sections] → SpokeNav → CTA bar
//
// Each neighborhood section contains:
//   • H2 heading (linked to /{slug}/)
//   • 300-500 word description (from NEIGHBORHOOD_DESCRIPTIONS or fallback)
//   • Mini 4-listing grid (client-side, filtered by subdivision name)
//   • "View all homes" link
//
// After every 5 neighborhoods a mid-guide CTA box is inserted.
// =============================================================================

import Link from "next/link";
import SpokeNav from "@/components/city/SpokeNav";
import QuickAnswer from "@/components/ui/QuickAnswer";
import {
  JsonLd,
  breadcrumbSchema,
  webPageSchema,
  localBusinessSchema,
} from "@/lib/schema";
import { getNeighborhoodsByCity } from "@/data/neighborhoods";
import { NEIGHBORHOOD_DESCRIPTIONS } from "@/data/neighborhood-descriptions";
import type { CityData } from "@/data/cities";
import NeighborhoodListingPreview from "@/components/ui/NeighborhoodListingPreview";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface NeighborhoodGuidePageProps {
  /** Full city object — provides name, slug, county, zip_codes, etc. */
  city: CityData;
}

// =============================================================================
// SERVER COMPONENT — static content renders at build/request time.
// The listing mini-grids are delegated to the NeighborhoodListingPreview
// client component to keep Bridge API calls out of SSR.
// =============================================================================

export default function NeighborhoodGuidePage({ city }: NeighborhoodGuidePageProps) {
  // Pull every neighborhood that belongs to this city, sorted A-Z by name
  const cityNeighborhoods = getNeighborhoodsByCity(city.slug).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const neighborhoodCount = cityNeighborhoods.length;

  // ---------------------------------------------------------------------------
  // STRUCTURED DATA
  // This template previously emitted only a BreadcrumbList. It is an area page,
  // so it also needs a WebPage entity and the local business that serves the
  // area. The city's lat/lng in src/data/cities.ts gives us real coordinates.
  //
  // No FAQPage here: this template renders no question-and-answer section, and
  // inventing one in markup only would be a structured-data violation.
  // ---------------------------------------------------------------------------
  const canonicalUrl = `https://nowtb.com/${city.slug}-neighborhood-guide/`;

  // The first few neighborhood names, used in the visible quick answer below.
  const sampleNames = cityNeighborhoods.slice(0, 4).map((n) => n.name);

  const pageDescription = `Guide to ${neighborhoodCount} ${
    neighborhoodCount === 1 ? "neighborhood" : "neighborhoods"
  } in ${city.name}, ${city.county} County, Florida, with an overview and active listings for each area.`;

  return (
    <>
      {/* --- JSON-LD: BreadcrumbList --- */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com" },
          { name: `${city.name} Homes for Sale`, url: `https://nowtb.com/${city.slug}/` },
          { name: `${city.name} Neighborhood Guide`, url: canonicalUrl },
        ])}
      />

      {/* --- JSON-LD: WebPage ---
           `about` passed explicitly; the helper's default topic is condos. */}
      <JsonLd
        data={webPageSchema({
          name: `Neighborhood Guide — ${city.name}, FL`,
          description: pageDescription,
          url: canonicalUrl,
          about: `${city.name}, Florida neighborhoods`,
          // The <QuickAnswer> block below is what makes `.quick-answer` resolve
          // — and it only renders when the city actually has neighborhoods on
          // file, so the selector is only claimed in that same case. "h1"
          // always resolves. Never advertise a selector the page might not render.
          speakableSelectors:
            neighborhoodCount > 0 ? [".quick-answer", "h1"] : ["h1"],
        })}
      />

      {/* --- JSON-LD: LocalBusiness ---
           geo rides on `areaServed` (the city), not on the business node: we
           have verified coordinates for the CITY in src/data/cities.ts, but not
           for the brokerage street address, and we do not invent coordinates. */}
      <JsonLd
        data={localBusinessSchema({
          name: `Barrett Henry, REALTOR® — ${city.name}, FL`,
          description: `Neighborhood-level real estate guidance in ${city.name}, ${city.county} County, Florida from Barrett Henry, Broker Associate at REMAX Collective.`,
          url: canonicalUrl,
          areaServed: {
            "@type": "City",
            name: `${city.name}, Florida`,
            geo: {
              "@type": "GeoCoordinates",
              latitude: city.lat,
              longitude: city.lng,
            },
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: `${city.county} County, Florida`,
            },
          },
        })}
      />

      {/* ======================================================================
          HERO — navy background, breadcrumb, H1, subtitle, CTA row
      ====================================================================== */}
      <section className="bg-primary pt-36 pb-16">
        <div className="container-wide">

          {/* Breadcrumb trail */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-body text-white/80 mb-6 tracking-wide uppercase"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${city.slug}/`} className="hover:text-white transition-colors">
              {city.name}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-accent" aria-current="page">
              Neighborhood Guide
            </span>
          </nav>

          {/* Page title */}
          <h1 className="heading-display text-display md:text-display-lg text-white mb-3">
            Neighborhood Guide — {city.name}, FL
          </h1>

          {/* Subtitle */}
          <p className="font-body text-white/70 text-lg max-w-2xl mb-6">
            Explore {neighborhoodCount} neighborhood{neighborhoodCount !== 1 ? "s" : ""} in{" "}
            {city.name}, {city.county} County. Each section includes an overview and active
            listings so you can compare areas before you tour.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors"
            >
              (813) 733-7907
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================================
          QUICK ANSWER — direct answer to "what neighborhoods are in {city}?"

          This is the block AI answer engines lift, and it is the element the
          `.quick-answer` speakable selector in the WebPage schema above points
          at. The two must stay together: if you delete this section, also
          remove `.quick-answer` from those selectors, otherwise the schema
          points at an element that does not exist.

          Everything stated here is derived from real data — the neighborhood
          count and names come straight from src/data/neighborhoods.ts.
      ====================================================================== */}
      {neighborhoodCount > 0 && (
        <section className="container-wide pt-12">
          <QuickAnswer heading={`What neighborhoods are in ${city.name}?`}>
            <p>
              {city.name}, Florida has {neighborhoodCount}{" "}
              {neighborhoodCount === 1 ? "neighborhood" : "neighborhoods"}{" "}
              covered in this guide
              {sampleNames.length > 0 ? (
                <>
                  , including {sampleNames.slice(0, -1).join(", ")}
                  {sampleNames.length > 1 ? " and " : ""}
                  {sampleNames[sampleNames.length - 1]}
                </>
              ) : null}
              . Each section below gives an overview of the area plus the homes
              currently for sale there, so you can compare neighborhoods before
              you book a single showing.
            </p>
            <p>
              Not sure which area fits? Barrett Henry, Broker Associate at REMAX
              Collective, has 23+ years of real estate experience. Call{" "}
              <a href="tel:+18137337907" className="text-link font-semibold">
                (813) 733-7907
              </a>{" "}
              for an honest rundown of the trade-offs between {city.name}{" "}
              neighborhoods.
            </p>
          </QuickAnswer>
        </section>
      )}

      {/* ======================================================================
          TABLE OF CONTENTS — compact jump-link grid so users can skip to any
          neighborhood without scrolling the entire page.
      ====================================================================== */}
      {neighborhoodCount > 0 && (
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="container-wide py-8">
            <p className="font-body text-xs text-muted uppercase tracking-widest mb-4 font-semibold">
              Jump to a Neighborhood
            </p>
            {/* Responsive grid — more columns on wider screens */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {cityNeighborhoods.map((neighborhood) => (
                <a
                  key={neighborhood.slug}
                  href={`#${neighborhood.slug}`}
                  className="block rounded border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-primary text-center hover:border-accent hover:text-accent hover:bg-accent/5 transition-colors"
                >
                  {neighborhood.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================================
          NEIGHBORHOOD SECTIONS — one per neighborhood in the city
      ====================================================================== */}
      <div className="container-wide py-12 space-y-0">
        {neighborhoodCount === 0 ? (
          /* Edge case: no neighborhoods on file yet for this city */
          <div className="py-16 text-center">
            <p className="font-body text-muted text-base">
              Neighborhood data for {city.name} is being added. Call Barrett at{" "}
              <a
                href="tel:+18137337907"
                className="text-link font-semibold hover:underline"
              >
                (813) 733-7907
              </a>{" "}
              for current listings and neighborhood info.
            </p>
          </div>
        ) : (
          cityNeighborhoods.map((neighborhood, index) => {
            // Pull a curated description if one exists for this neighborhood slug
            const description = NEIGHBORHOOD_DESCRIPTIONS[neighborhood.slug];

            // Determine whether to insert a mid-guide CTA after this section.
            // Insert after every 5th neighborhood (1-based: positions 5, 10, 15…)
            // but not after the very last section (we have a bottom CTA for that).
            const insertCtaAfter =
              (index + 1) % 5 === 0 && index + 1 < neighborhoodCount;

            return (
              <div key={neighborhood.slug}>

                {/* -------------------------------------------------------
                    Individual neighborhood section
                    id={slug} enables the TOC anchor links above
                ------------------------------------------------------- */}
                <section
                  id={neighborhood.slug}
                  className="py-12 border-b border-gray-100 scroll-mt-24"
                  // scroll-mt-24 offsets the sticky header so the anchor
                  // doesn't land behind the nav when jumped to
                >
                  {/* H2 heading — linked to the neighborhood's own page */}
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-1">
                    <Link
                      href={`/${neighborhood.slug}/`}
                      className="hover:text-accent transition-colors"
                    >
                      {neighborhood.name}
                    </Link>
                  </h2>

                  {/* City/county tag line */}
                  <p className="font-body text-xs text-muted uppercase tracking-widest mb-5">
                    {city.name} &bull; {city.county} County, FL
                  </p>

                  {/* -------------------------------------------------------
                      Neighborhood description
                      Priority: curated contentHtml → generic 2-paragraph fallback
                  ------------------------------------------------------- */}
                  {description ? (
                    // Curated description — real, useful content about this neighborhood
                    <div
                      className="prose prose-lg max-w-none font-body text-dark mb-8"
                      dangerouslySetInnerHTML={{ __html: description.contentHtml }}
                    />
                  ) : (
                    // Generic fallback — honest, non-fluffy placeholder
                    <div className="prose prose-lg max-w-none font-body text-dark mb-8">
                      <p>
                        {neighborhood.name} is a residential community in {city.name},{" "}
                        {city.county} County, Florida. Like most established neighborhoods
                        in the area, it offers a mix of single-family homes, convenient
                        access to major roads, and proximity to schools, parks, and local
                        shopping.
                      </p>
                      <p>
                        Barrett Henry, Broker Associate at REMAX Collective, knows the{" "}
                        {city.name} market well and can walk you through everything
                        currently available in {neighborhood.name} — active listings,
                        recent sales, and what comparable homes are fetching right now.
                        Call{" "}
                        <a href="tel:+18137337907" className="text-link">
                          (813) 733-7907
                        </a>{" "}
                        for a free neighborhood rundown.
                      </p>
                    </div>
                  )}

                  {/* -------------------------------------------------------
                      Mini listing grid — CLIENT-SIDE fetch, 4 listings max
                      Rendered by NeighborhoodListingPreview to avoid SSR
                      API calls. Falls back gracefully when no listings found.
                  ------------------------------------------------------- */}
                  <NeighborhoodListingPreview
                    zipCodes={city.zip_codes}
                    subdivisionName={neighborhood.name}
                    neighborhoodSlug={neighborhood.slug}
                    neighborhoodName={neighborhood.name}
                  />
                </section>

                {/* -------------------------------------------------------
                    Mid-guide CTA — appears after every 5th neighborhood.
                    Navy box with phone + contact link.
                ------------------------------------------------------- */}
                {insertCtaAfter && (
                  <div className="my-10 rounded-2xl bg-primary px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="font-heading font-bold text-xl text-white leading-snug mb-1">
                        Need help finding the right neighborhood?
                      </p>
                      <p className="font-body text-white/70 text-sm">
                        Barrett Henry, REALTOR® — 23+ years of real estate experience.
                        Local knowledge, no pressure.
                      </p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <a
                        href="tel:+18137337907"
                        className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors"
                      >
                        (813) 733-7907
                      </a>
                      <Link
                        href="/contact/"
                        className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
                      >
                        Send a Message
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================================
          SPOKE NAV — explore more {City} pages
      ====================================================================== */}
      <SpokeNav city={city} currentTopic="neighborhood-guide" />

      {/* ======================================================================
          BOTTOM CTA BAR — dark bar, matches SpokePage / NeighborhoodPage pattern
      ====================================================================== */}
      <section className="bg-primary py-12">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-white mb-1">
              Ready to explore {city.name} neighborhoods in person?
            </h2>
            <p className="font-body text-white/70 text-sm">
              Barrett Henry, REALTOR® at REMAX Collective — 23+ years of real estate experience
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors"
            >
              Call Now
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
