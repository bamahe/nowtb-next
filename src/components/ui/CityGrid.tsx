// =============================================================================
// CityGrid — Grid of city cards linking to city hub pages
// Server component (no "use client" directive)
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

export default function CityGrid() {
  return (
    <section className="container-wide py-12">
      {/* Section heading */}
      <div className="mb-8 text-center">
        <h2 className="heading-section text-display-sm text-primary">
          Explore Tampa Bay Communities
        </h2>
        <p className="mt-2 font-body text-muted text-lg max-w-2xl mx-auto">
          Browse homes for sale in the most sought-after neighborhoods across
          Tampa Bay.
        </p>
      </div>

      {/* --- Grid: 2 col mobile, 3 col tablet, 5 col desktop --- */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {TIER_1_CITIES.map((city) => (
          <Link
            key={city}
            href={`/${slugify(city)}`}
            className="group flex items-center justify-center rounded-xl bg-primary px-4 py-8 text-center
                       transition-all duration-200 hover:bg-primary/85 hover:shadow-lg hover:-translate-y-0.5"
          >
            <span className="font-heading font-bold text-white text-lg group-hover:text-accent transition-colors duration-200">
              {city}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
