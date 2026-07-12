// =============================================================================
// ListingGrid — Clean responsive grid of ListingCard components
// Server component (no "use client" directive)
// Minimal heading treatment, generous gaps, let the cards breathe
// =============================================================================

import { Fragment } from "react";
import type { Listing } from "@/lib/types";
import ListingCard from "@/components/ui/ListingCard";
import Link from "next/link";

interface ListingGridProps {
  /** Array of listing objects to display */
  listings: Listing[];
  /** Optional section heading above the grid */
  title?: string;
  /** Optional subtitle / description below the heading */
  subtitle?: string;
  /** Optional className override for the outer wrapper (e.g. remove padding when nested) */
  className?: string;
  /** Heading level for the section title — h2 (default) or h3 for secondary sections */
  headingLevel?: "h2" | "h3";
  /** Optional area name for contextual CTA ("Want to see what your {areaName} property is worth?") */
  areaName?: string;
}

export default function ListingGrid({
  listings,
  title,
  subtitle,
  className,
  headingLevel = "h2",
  areaName,
}: ListingGridProps) {
  // Show a helpful message when no listings are available
  if (!listings || listings.length === 0) {
    return (
      <section className={className ?? "container-wide py-24 md:py-32"}>
        {title && (
          <div className="text-center mb-16">
            {headingLevel === "h3" ? (
              <h3 className="heading-section text-2xl md:text-3xl text-primary">{title}</h3>
            ) : (
              <h2 className="heading-section text-3xl md:text-4xl text-primary">{title}</h2>
            )}
            <div className="section-divider" />
          </div>
        )}
        <div className="text-center max-w-lg mx-auto">
          <p className="font-body text-muted text-base leading-relaxed">
            No listings currently available. New listings hit the MLS daily — call
            Barrett at{" "}
            <a href="tel:+18137337907" className="text-accent font-semibold hover:underline">
              (813) 733-7907
            </a>{" "}
            for the latest.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={className ?? "container-wide py-24 md:py-32"}>
      {/* --- Section Heading — clean, minimal --- */}
      {title && (
        <div className="text-center mb-16">
          {headingLevel === "h3" ? (
            <h3 className="heading-section text-2xl md:text-3xl text-primary">{title}</h3>
          ) : (
            <h2 className="heading-section text-3xl md:text-4xl text-primary">{title}</h2>
          )}
          <div className="section-divider" />
          {subtitle && (
            <p className="font-body text-muted text-base font-light max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* --- Responsive Grid — generous gaps for breathing room ---
           1 col on mobile, 2 on sm, 3 on lg, 4 on xl */}
      <div className="grid grid-cols-1 gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing, index) => (
          <Fragment key={listing.ListingKey}>
            <ListingCard listing={listing} />

            {/* --- Inline CTA card — injected after the 8th listing --- */}
            {/* Buyer CTA after 8th listing */}
            {index === 7 && listings.length >= 8 && (
              <div
                key="cta-buyer"
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-accent bg-accent/10 p-6 text-center"
              >
                <p className="font-heading text-lg font-bold text-primary leading-snug">
                  {areaName ? `Looking for homes in ${areaName}?` : "Looking for the right home?"}
                </p>
                <p className="font-body text-muted text-sm">Barrett Henry can help. 23+ years of experience.</p>
                <a
                  href="tel:+18137337907"
                  className="inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
                >
                  Call (813) 733-7907
                </a>
              </div>
            )}
            {/* Seller CTA after 16th listing */}
            {index === 15 && listings.length >= 16 && (
              <div
                key="cta-seller"
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-primary bg-primary/5 p-6 text-center"
              >
                <p className="font-heading text-lg font-bold text-primary leading-snug">
                  {areaName ? `What's your ${areaName} property worth?` : "What's your home worth?"}
                </p>
                <p className="font-body text-muted text-sm">Get a free, no-obligation market analysis.</p>
                <Link
                  href="/free-home-valuation/"
                  className="inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
                >
                  Get Your Free CMA
                </Link>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
