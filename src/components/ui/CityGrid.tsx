// =============================================================================
// CityGrid — Grid of city cards linking to city hub pages
// Server component (no "use client" directive)
// Enhanced: taller cards, gradient overlays, accent border on hover, "Explore" text
// =============================================================================

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
          className="group relative flex flex-col items-center justify-center rounded-xl
                     bg-gradient-to-br from-[#0f2847] to-primary border border-white/10
                     px-4 py-12 text-center overflow-hidden
                     transition-all duration-300 hover:shadow-xl hover:shadow-accent/10
                     hover:-translate-y-1 hover:border-accent/50"
        >
          {/* City name — large, white, bold */}
          <span className="font-heading font-bold text-white text-xl group-hover:text-accent transition-colors duration-300">
            {city}
          </span>

          {/* "Explore" text + arrow — appears on hover */}
          <span className="flex items-center gap-1 mt-2 text-sm font-body text-white/0 group-hover:text-accent/80 transition-all duration-300">
            Explore <ArrowRight className="h-3.5 w-3.5" />
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
          <div className="text-center">
            <h2 className="heading-section text-3xl md:text-4xl text-white">
              Explore Tampa Bay Communities
            </h2>
            <div className="section-divider" />
            <p className="font-body text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Browse homes for sale in the most sought-after neighborhoods across
              Tampa Bay.
            </p>
          </div>
        )}
        {grid}
      </div>
    </section>
  );
}
