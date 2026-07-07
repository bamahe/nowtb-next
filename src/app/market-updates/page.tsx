// =============================================================================
// /market-updates — Housing Market Updates index page
// Lists all market update posts grouped by quarter
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { getAllMarketUpdates, getMarketUpdateThumbnail } from "@/lib/market-updates";
import HeroSection from "@/components/ui/HeroSection";

export const metadata: Metadata = {
  title: "Tampa Bay Housing Market Updates | Barrett Henry, REALTOR®",
  description:
    "Latest housing market data for Tampa Bay cities. Quarterly price trends, inventory levels, and forecasts from Barrett Henry at REMAX Collective.",
  alternates: { canonical: "/market-updates" },
};

export default function MarketUpdatesPage() {
  const updates = getAllMarketUpdates();

  // Group by quarter
  const q2 = updates.filter((u) => u.slug.includes("q2-2026"));
  const q1 = updates.filter(
    (u) => u.slug.includes("q1-2026") || (!u.slug.includes("q2-") && !u.slug.includes("q1-"))
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
              {q2.map((update) => {
                const thumb = getMarketUpdateThumbnail(update);
                const city = update.title.split(" Housing Market")[0].split(" Real Estate")[0];
                return (
                  <Link
                    key={update.slug}
                    href={`/market-updates/${update.slug}`}
                    className="group block border border-gray-200 rounded-lg overflow-hidden hover:border-accent transition-colors"
                  >
                    {thumb && (
                      <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumb}
                          alt={`${city} housing market update`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-body text-xs text-accent font-semibold mb-1">Q2 2026</p>
                      <h3 className="font-heading font-bold text-sm text-primary group-hover:text-accent transition-colors">
                        {city}
                      </h3>
                    </div>
                  </Link>
                );
              })}
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
              {q1.map((update) => {
                const thumb = getMarketUpdateThumbnail(update);
                const city = update.title.split(" Housing Market")[0].split(" Real Estate")[0];
                return (
                  <Link
                    key={update.slug}
                    href={`/market-updates/${update.slug}`}
                    className="group block border border-gray-200 rounded-lg overflow-hidden hover:border-accent transition-colors"
                  >
                    {thumb && (
                      <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumb}
                          alt={`${city} housing market update`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-body text-xs text-muted font-semibold mb-1">
                        {update.slug.includes("q1-2026") ? "Q1 2026" : "Market Update"}
                      </p>
                      <h3 className="font-heading font-bold text-sm text-primary group-hover:text-accent transition-colors">
                        {city}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
