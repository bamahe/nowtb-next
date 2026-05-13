// =============================================================================
// CityGrid — Grid of luxury city tiles linking to city hub pages
// Server component (no "use client" directive)
// Tall aspect ratio tiles, minimal borders, light heading font
// =============================================================================

import Link from "next/link";
import { slugify } from "@/lib/utils";

/** Tier 1 cities — the core Tampa Bay service areas */
const TIER_1_CITIES = [
  "Valrico",
  "Brandon",
  "Riverview",
  "Tampa",
  "Lithia",
  "FishHawk",
  "Apollo Beach",
  "Plant City",
  "Seffner",
  "Dover",
] as const;

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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {TIER_1_CITIES.map((city) => (
        <Link
          key={city}
          href={`/${slugify(city)}`}
          className="group relative flex items-center justify-center aspect-[3/4]
                     bg-gradient-to-br from-[#0f2847] to-primary
                     border border-white/10
                     overflow-hidden
                     transition-all duration-500
                     hover:border-accent/30"
        >
          {/* City name — ultra-light, wide tracking, centered */}
          <span className="font-heading font-extralight text-2xl tracking-[0.15em] uppercase text-white
                           transition-colors duration-500 group-hover:text-accent">
            {city}
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
