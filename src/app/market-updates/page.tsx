// =============================================================================
// /market-updates — Housing Market Updates index page
// Data cards with stats instead of photos
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { getAllMarketUpdates, type MarketUpdate } from "@/lib/market-updates";
import HeroSection from "@/components/ui/HeroSection";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Tampa Bay Housing Market Updates | Barrett Henry, REALTOR®",
  description:
    "Latest housing market data for Tampa Bay cities. Quarterly price trends, inventory levels, and forecasts from Barrett Henry at REMAX Collective.",
  alternates: { canonical: "/market-updates/" },
};

// Extract key stats from post content for the card display
function extractStats(update: MarketUpdate) {
  const content = update.content;
  const city = update.title.split(" Housing Market")[0].split(" Real Estate")[0];

  // Try to pull median price from stat grid or content
  const priceMatch = content.match(/\$(\d{2,3}(?:,\d{3})+)/);
  const medianPrice = priceMatch ? `$${priceMatch[1]}` : null;

  // Try to pull days on market
  const domMatch = content.match(/(\d{2,3})\s*(?:days? on market|DOM|avg\s*days)/i);
  const dom = domMatch ? domMatch[1] : null;

  // Try to pull change percentage
  const changeMatch = content.match(/([+-]?\d+\.?\d*)%\s*(?:change|from|increase|decrease|appreciation)/i);
  const change = changeMatch ? `${changeMatch[1]}%` : null;

  return { city, medianPrice, dom, change };
}

function MarketCard({ update, quarter }: { update: MarketUpdate; quarter: string }) {
  const { city, medianPrice, dom, change } = extractStats(update);

  return (
    <Link
      key={update.slug}
      href={`/market-updates/${update.slug}/`}
      className="group block border border-gray-200 rounded-lg overflow-hidden hover:border-accent hover:shadow-lg transition-all"
    >
      {/* Stats header — dark navy like the site's design */}
      <div className="bg-primary p-5">
        <div className="grid grid-cols-2 gap-3">
          {medianPrice && (
            <div>
              <p className="font-body text-[10px] text-white/40 uppercase tracking-wider">Median Price</p>
              <p className="font-heading font-bold text-lg text-white">{medianPrice}</p>
              {change && (
                <p className="font-body text-[10px] text-accent font-semibold">{change.startsWith('-') ? '' : '+'}{change}</p>
              )}
            </div>
          )}
          {dom && (
            <div>
              <p className="font-body text-[10px] text-white/40 uppercase tracking-wider">Days on Market</p>
              <p className="font-heading font-bold text-lg text-white">{dom}</p>
            </div>
          )}
          {!medianPrice && !dom && (
            <div className="col-span-2">
              <p className="font-body text-[10px] text-white/40 uppercase tracking-wider">Market Report</p>
              <p className="font-heading font-bold text-lg text-white">View Data</p>
            </div>
          )}
        </div>
      </div>

      {/* City name + quarter label */}
      <div className="p-4 bg-white">
        <p className="font-body text-[10px] text-accent font-semibold uppercase tracking-wider mb-1">{quarter}</p>
        <h3 className="font-heading font-bold text-base text-primary group-hover:text-accent transition-colors">
          {city}
        </h3>
      </div>
    </Link>
  );
}

export default function MarketUpdatesPage() {
  const updates = getAllMarketUpdates();

  // Group by quarter
  const q2 = updates.filter((u) => u.slug.includes("q2-2026"));
  const q1 = updates.filter(
    (u) => !u.slug.includes("q2-2026")
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://nowtb.com/" },
        { name: "Market Updates", url: "https://nowtb.com/market-updates/" },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Tampa Bay Housing Market Updates",
        description: "Quarterly housing market data for every city in Tampa Bay.",
        url: "https://nowtb.com/market-updates/",
        author: { "@type": "RealEstateAgent", name: "Barrett Henry", telephone: "(813) 750-0926" },
      }} />

      <HeroSection
        title="Market Updates"
        label="TAMPA BAY HOUSING DATA"
        subtitle="Quarterly housing market reports for every city in the Tampa Bay region. Real data, real analysis."
      />

      {/* Q2 2026 */}
      {q2.length > 0 && (
        <section className="section-white">
          <div className="container-wide">
            <div className="text-center mb-12">
              <p className="heading-label mb-4">Latest Reports</p>
              <h2 className="heading-section text-display-sm text-primary">
                Q2 2026 Market Updates
              </h2>
              <div className="section-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {q2.map((update) => (
                <MarketCard key={update.slug} update={update} quarter="Q2 2026" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Q1 2026 + older */}
      {q1.length > 0 && (
        <section className="section-light">
          <div className="container-wide">
            <div className="text-center mb-12">
              <p className="heading-label mb-4">Previous Reports</p>
              <h2 className="heading-section text-display-sm text-primary">
                Q1 2026 &amp; Earlier
              </h2>
              <div className="section-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {q1.map((update) => (
                <MarketCard
                  key={update.slug}
                  update={update}
                  quarter={update.slug.includes("q1-2026") ? "Q1 2026" : "Market Update"}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === CTA — lead capture for market updates === */}
      <section className="bg-primary py-16">
        <div className="container-wide text-center max-w-2xl">
          <h2 className="font-heading font-extralight text-3xl tracking-[0.1em] uppercase text-white mb-4">
            Get Market Updates Delivered
          </h2>
          <div className="w-12 h-px bg-accent mx-auto mb-6" />
          <p className="font-body text-white/70 font-light text-lg leading-relaxed mb-8">
            Stay ahead of the Tampa Bay housing market. Barrett Henry sends quarterly
            market reports with pricing trends, inventory data, and forecasts — straight
            to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-8 py-3 text-sm hover:bg-accent/90 transition-colors"
            >
              Sign Up for Updates
            </Link>
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-3 text-sm hover:bg-white/10 transition-colors"
            >
              (813) 733-7907
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
