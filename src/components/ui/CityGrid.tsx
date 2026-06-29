// =============================================================================
// CityGrid — Grid of luxury city tiles linking to city hub pages
// Server component (no "use client" directive)
// Tall aspect ratio tiles, minimal borders, light heading font
// =============================================================================

import Link from "next/link";
import { cities } from "@/data/cities";

// Pull featured cities from each county for a representative spread across Tampa Bay
// Prioritizes Tier 1, then Tier 2, picks top cities per county
const FEATURED_CITIES = (() => {
  // Get unique counties in order
  const countyOrder = Array.from(new Set(cities.map((c) => c.county)));
  const picked: typeof cities = [];
  // First pass: grab Tier 1 cities from each county
  for (const county of countyOrder) {
    const tier1 = cities.filter((c) => c.county === county && c.tier === 1);
    picked.push(...tier1);
  }
  // Second pass: fill in Tier 2 cities if county has no Tier 1
  for (const county of countyOrder) {
    if (picked.some((c) => c.county === county)) continue;
    const tier2 = cities.filter((c) => c.county === county && c.tier === 2);
    if (tier2.length > 0) picked.push(tier2[0]);
  }
  // Third pass: fill remaining counties with Tier 3
  for (const county of countyOrder) {
    if (picked.some((c) => c.county === county)) continue;
    const tier3 = cities.filter((c) => c.county === county && c.tier === 3);
    if (tier3.length > 0) picked.push(tier3[0]);
  }
  return picked;
})();

interface CityGridProps {
  /** Override the outer section className (default: "section-dark") */
  className?: string;
  /** Hide the built-in heading so a parent can provide its own */
  hideHeading?: boolean;
  /** When true, skip the outer <section> + container-wide wrapper
   *  (useful when parent already provides those layers) */
  bare?: boolean;
}

export default function CityGrid({
  className,
  hideHeading,
  bare,
}: CityGridProps = {}) {
  // --- The grid itself (shared between bare and wrapped modes) ---
  const grid = (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {FEATURED_CITIES.map((city) => (
        <Link
          key={city.slug}
          href={`/${city.slug}`}
          className="group relative flex flex-col items-center justify-center aspect-[3/4]
                     bg-gradient-to-br from-[#0f2847] to-primary
                     border border-white/10
                     overflow-hidden
                     transition-all duration-500
                     hover:border-accent/30"
        >
          {/* City name */}
          <span className="font-heading font-extralight text-xl md:text-2xl tracking-[0.15em] uppercase text-white
                           transition-colors duration-500 group-hover:text-accent">
            {city.name}
          </span>
          {/* County label */}
          <span className="font-body text-[10px] tracking-[0.15em] uppercase text-white/30 mt-2">
            {city.county} County
          </span>
        </Link>
      ))}
    </div>
  );

  // Bare mode — return just the grid, no section/container wrapper
  if (bare) return grid;

  // Default mode — full section with optional heading
  return (
    <section className={className ?? "section-dark"}>
      <div className="container-wide">
        {/* Section heading — can be hidden when parent provides its own */}
        {!hideHeading && (
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Communities</p>
            <h2 className="heading-section text-3xl md:text-4xl text-white">
              Explore Tampa Bay
            </h2>
            <div className="section-divider" />
          </div>
        )}
        {grid}
      </div>
    </section>
  );
}
