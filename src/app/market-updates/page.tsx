// =============================================================================
// /market-updates — Housing Market Updates index page
// Data cards with stats instead of photos
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { getAllMarketUpdates, type MarketUpdate } from "@/lib/market-updates";
import HeroSection from "@/components/ui/HeroSection";

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
      href={`/market-updates/${update.slug}`}
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
    </>
  );
}
