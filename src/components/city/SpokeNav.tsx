// =============================================================================
// SpokeNav — grid of spoke page links for a given city
// Server component. Shows all topic pages available for this city.
// Highlights the current topic if viewing a spoke page.
// =============================================================================

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CityData } from "@/data/cities";
import { getCityTopics } from "@/data/cities";

interface SpokeNavProps {
  /** The city whose spoke links to display */
  city: CityData;
  /** Slug of the currently active topic (if on a spoke page) */
  currentTopic?: string;
}

export default function SpokeNav({ city, currentTopic }: SpokeNavProps) {
  // Get all topics that apply to this city
  const topics = getCityTopics(city);

  return (
    <section className="container-wide py-12">
      {/* Section heading */}
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
        Explore {city.name} Real Estate
      </h2>

      {/* Grid of topic links — styled as pill/card buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {topics.map((topic) => {
          const isActive = currentTopic === topic.slug;
          const href = `/${city.slug}-${topic.slug}`;
          return (
            <Link
              key={topic.slug}
              href={href}
              className={cn(
                "block rounded-lg border px-4 py-3 text-center text-sm font-semibold transition-colors",
                isActive
                  ? "bg-accent text-primary border-accent"
                  : "bg-white text-primary border-gray-200 hover:border-accent hover:bg-accent/10"
              )}
            >
              {topic.label} in {city.name}
            </Link>
          );
        })}
      </div>

      {/* Seller, valuation, and resource links */}
      <h3 className="font-heading font-bold text-lg text-primary mt-10 mb-4">
        More {city.name} Resources
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <Link
          href={`/sell-your-home-${city.slug}/`}
          className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary hover:border-accent hover:bg-accent/10 transition-colors"
        >
          Sell Your {city.name} Home
        </Link>
        <Link
          href={`/${city.slug}-home-valuation/`}
          className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary hover:border-accent hover:bg-accent/10 transition-colors"
        >
          Free {city.name} Home Valuation
        </Link>
        <Link
          href={`/${city.slug}-realtor/`}
          className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary hover:border-accent hover:bg-accent/10 transition-colors"
        >
          {city.name} REALTOR
        </Link>
        <Link
          href={`/${city.slug}-housing-market/`}
          className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary hover:border-accent hover:bg-accent/10 transition-colors"
        >
          {city.name} Housing Market
        </Link>
        <Link
          href={`/${city.slug}-neighborhood-guide/`}
          className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary hover:border-accent hover:bg-accent/10 transition-colors"
        >
          {city.name} Neighborhood Guide
        </Link>
        <Link
          href={`/${city.slug}-rentals/`}
          className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary hover:border-accent hover:bg-accent/10 transition-colors"
        >
          {city.name} Rentals
        </Link>
        <Link
          href={`/${city.slug}-property-management/`}
          className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary hover:border-accent hover:bg-accent/10 transition-colors"
        >
          {city.name} Property Management
        </Link>
        <Link
          href={`/blog/sell-home-fast-${city.slug}/`}
          className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary hover:border-accent hover:bg-accent/10 transition-colors"
        >
          Sell My {city.name} House Fast
        </Link>
      </div>
    </section>
  );
}
