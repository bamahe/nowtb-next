// =============================================================================
// SellYourHomeCityPage — City-specific seller landing page
// Rendered inside the [citySlug] route for slugs like /sell-your-home-valrico
// (17 city pages)
// =============================================================================

import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ValuationForm from "@/components/ui/ValuationForm";
import { getPrimaryAgent } from "@/data/agents";
import { getListings } from "@/lib/bridge";
import { formatPrice } from "@/lib/utils";

interface SellYourHomeCityPageProps {
  /** Display name of the city (e.g. "Valrico") */
  cityName: string;
  /** URL slug for the city (e.g. "valrico") */
  citySlug: string;
  /** ZIP codes for the city — used to query Bridge API for live stats */
  zipCodes: string[];
}

// This component is async so it can fetch live MLS data from Bridge API
export default async function SellYourHomeCityPage({
  cityName,
  citySlug,
  zipCodes,
}: SellYourHomeCityPageProps) {
  const agent = getPrimaryAgent();

  // ------------------------------------------------------------------
  // Fetch live market stats from Bridge API using the city's ZIP codes.
  // We pull active listings (exclude rentals) to compute the snapshot.
  // Falls back to "--" gracefully if the API is unavailable.
  // ------------------------------------------------------------------
  let medianPrice = "--";
  let avgDom = "--";
  let activeCount = "--";
  let avgPricePerSqft = "--";

  try {
    const res = await getListings({
      zip_codes: zipCodes,
      exclude_rental: true,
      limit: "200", // grab enough for meaningful stats
    });
    const listings = res.value || [];
    const total = res.total || listings.length;

    if (listings.length > 0) {
      // Active listing count (use API's total count if available, else sample size)
      activeCount = String(total);

      // Median list price — sort prices, pick the middle value
      const prices = listings
        .map((l) => l.ListPrice)
        .filter((p): p is number => typeof p === "number" && p > 0)
        .sort((a, b) => a - b);
      if (prices.length > 0) {
        const mid = Math.floor(prices.length / 2);
        const median =
          prices.length % 2 === 0
            ? Math.round((prices[mid - 1] + prices[mid]) / 2)
            : prices[mid];
        medianPrice = formatPrice(median);
      }

      // Average days on market (only for listings that have DOM data)
      const domValues = listings
        .map((l) => l.DaysOnMarket)
        .filter((d): d is number => typeof d === "number" && d >= 0);
      if (domValues.length > 0) {
        const avg = Math.round(
          domValues.reduce((sum, d) => sum + d, 0) / domValues.length
        );
        avgDom = String(avg);
      }

      // Average price per sq ft (only for listings with both price and living area)
      const ppsf = listings
        .filter(
          (l) =>
            typeof l.ListPrice === "number" &&
            l.ListPrice > 0 &&
            typeof l.LivingArea === "number" &&
            l.LivingArea > 0
        )
        .map((l) => l.ListPrice / l.LivingArea!);
      if (ppsf.length > 0) {
        const avgPpsf = Math.round(
          ppsf.reduce((sum, v) => sum + v, 0) / ppsf.length
        );
        avgPricePerSqft = `$${avgPpsf}`;
      }
    }
  } catch {
    // API error — stats stay at "--", page still renders fine
  }

  return (
    <>
      {/* --- JSON-LD BreadcrumbList for SEO --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://nowtb.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Sell Your Home",
                item: "https://nowtb.com/sell-your-home",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `Sell Your ${cityName} Home`,
                item: `https://nowtb.com/sell-your-home-${citySlug}`,
              },
            ],
          }),
        }}
      />

      {/* === Hero section === */}
      <HeroSection
        title={`Sell Your ${cityName} Home for Top Dollar`}
        subtitle={`Barrett Henry's proven strategy helps ${cityName} sellers maximize their sale price and close faster.`}
      >
        {/* Back link to main sell page */}
        <Link
          href="/sell-your-home/"
          className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors mt-4 text-sm font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Sell Your Home Overview
        </Link>
      </HeroSection>

      {/* === Barrett's 4 selling pillars === */}
      <section className="container-wide py-12">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
          Barrett&apos;s {cityName} Selling Strategy
        </h2>
        <p className="font-body text-muted text-center mb-8 max-w-2xl mx-auto">
          Four pillars that consistently get {cityName} sellers above-market
          results.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1 — Pricing */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="font-heading font-bold text-accent text-lg">1</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  Strategic Pricing
                </h3>
                <p className="font-body text-muted text-sm">
                  Barrett analyzes recent {cityName} comps, active competition,
                  and market trends to price your home where it attracts maximum
                  buyer interest without leaving money on the table.
                </p>
              </div>
            </div>
          </div>

          {/* Pillar 2 — Preparation */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="font-heading font-bold text-accent text-lg">2</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  Home Preparation
                </h3>
                <p className="font-body text-muted text-sm">
                  From staging recommendations to repair priorities, Barrett
                  identifies the upgrades that deliver the best ROI for{" "}
                  {cityName} buyers. No wasted effort.
                </p>
              </div>
            </div>
          </div>

          {/* Pillar 3 — Marketing */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="font-heading font-bold text-accent text-lg">3</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  Maximum Exposure Marketing
                </h3>
                <p className="font-body text-muted text-sm">
                  Professional photos, 3D tours, targeted digital ads, and
                  syndication to 100+ real estate sites ensure your {cityName}{" "}
                  home reaches every potential buyer.
                </p>
              </div>
            </div>
          </div>

          {/* Pillar 4 — Negotiation */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="font-heading font-bold text-accent text-lg">4</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  Relentless Negotiation
                </h3>
                <p className="font-body text-muted text-sm">
                  Barrett&apos;s 23+ years of real estate experience mean he
                  knows how to handle multiple offers, navigate inspections, and
                  protect your bottom line through closing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Local market data placeholder === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            {cityName} Market Snapshot
          </h2>
          <p className="font-body text-muted text-center mb-8 max-w-2xl mx-auto">
            Current market conditions in {cityName}, FL.
          </p>

          {/* Live MLS stats fetched from Bridge API at request time */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-5 text-center">
              <div className="font-heading font-bold text-2xl text-accent mb-1">
                {medianPrice}
              </div>
              <div className="font-body text-xs text-muted">
                Median List Price
              </div>
            </div>
            <div className="card p-5 text-center">
              <div className="font-heading font-bold text-2xl text-accent mb-1">
                {avgDom}
              </div>
              <div className="font-body text-xs text-muted">
                Avg. Days on Market
              </div>
            </div>
            <div className="card p-5 text-center">
              <div className="font-heading font-bold text-2xl text-accent mb-1">
                {activeCount}
              </div>
              <div className="font-body text-xs text-muted">
                Active Listings
              </div>
            </div>
            <div className="card p-5 text-center">
              <div className="font-heading font-bold text-2xl text-accent mb-1">
                {avgPricePerSqft}
              </div>
              <div className="font-body text-xs text-muted">
                Avg. Price per Sq Ft
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Home valuation form === */}
      <section className="container-wide py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            What&apos;s Your {cityName} Home Worth?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Get a free, no-obligation home valuation from Barrett Henry.
          </p>
          <ValuationForm />
        </div>
      </section>

      {/* === Why Barrett for selling === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4">
            Why Sellers in {cityName} Choose Barrett Henry
          </h2>
          <p className="font-body text-muted mb-4">
            Professional photography, strategic pricing, MLS syndication to Zillow, Realtor.com, and Redfin,
            targeted social media marketing, and aggressive negotiation — Barrett&apos;s 23+ years of real estate
            experience means your {cityName} home gets maximum exposure and top dollar.
          </p>
          <a href={`tel:${agent.phone.replace(/[^\d]/g, "")}`} className="text-accent font-bold hover:underline">
            {agent.phone}
          </a>
        </div>
      </section>

      {/* === Phone CTA bar === */}
      <section className="bg-primary py-8">
        <div className="container-wide text-center">
          <p className="font-heading font-bold text-lg text-white mb-2">
            Ready to sell your {cityName} home?
          </p>
          <a
            href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
            className="inline-block px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-accent/10 transition-colors"
          >
            Call {agent.phone}
          </a>
        </div>
      </section>
    </>
  );
}
