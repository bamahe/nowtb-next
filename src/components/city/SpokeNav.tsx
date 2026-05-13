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
          // Is this topic the one currently being viewed?
          const isActive = currentTopic === topic.slug;
          // Build the URL: /{city-slug}-{topic-slug}
          const href = `/${city.slug}-${topic.slug}`;

          return (
            <Link
              key={topic.slug}
              href={href}
              className={cn(
                // Base styles — rounded card with border
                "block rounded-lg border px-4 py-3 text-center text-sm font-semibold transition-colors",
                // Active state — filled accent background
                isActive
                  ? "bg-accent text-primary border-accent"
                  : "bg-white text-primary border-gray-200 hover:border-accent hover:bg-accent/10"
              )}
            >
              {/* e.g. "Pool Homes in Valrico" */}
              {topic.label} in {city.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
