// =============================================================================
// CityGrid — Grid of luxury city tiles linking to city hub pages
// Server component (no "use client" directive)
// Tall aspect ratio tiles, minimal borders, light heading font
// =============================================================================

import Link from "next/link";
import { cities } from "@/data/cities";

// Curated featured cities — major cities from every county for homepage display
// Hand-picked for name recognition and geographic spread across Tampa Bay
const FEATURED_SLUGS = [
  // Hillsborough
  "tampa", "brandon", "riverview", "valrico", "apollo-beach", "westchase",
  // Pinellas
  "st-petersburg", "clearwater", "largo", "dunedin", "safety-harbor", "seminole",
  // Pasco
  "wesley-chapel", "trinity", "new-port-richey", "land-o-lakes",
  // Manatee
  "bradenton", "lakewood-ranch", "palmetto", "anna-maria",
  // Polk
  "lakeland", "winter-haven",
  // Sarasota
  "sarasota",
  // Hernando
  "spring-hill", "brooksville",
  // Citrus
  "crystal-river", "inverness",
];

const FEATURED_CITIES = FEATURED_SLUGS
  .map((slug) => cities.find((c) => c.slug === slug))
  .filter((c): c is (typeof cities)[number] => c !== undefined);

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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {FEATURED_CITIES.map((city) => (
        <Link
          key={city.slug}
          href={`/${city.slug}`}
          className="group relative flex flex-col items-center justify-center py-8 px-3
                     bg-gradient-to-br from-[#0f2847] to-primary
                     border border-white/10
                     overflow-hidden
                     transition-all duration-500
                     hover:border-accent/30"
        >
          {/* City name — smaller text, centered, no overflow */}
          <span className="font-heading font-extralight text-sm md:text-base tracking-[0.12em] uppercase text-white
                           text-center leading-tight
                           transition-colors duration-500 group-hover:text-accent">
            {city.name}
          </span>
          {/* County label */}
          <span className="font-body text-[9px] tracking-[0.12em] uppercase text-white/30 mt-1.5">
            {city.county}
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
