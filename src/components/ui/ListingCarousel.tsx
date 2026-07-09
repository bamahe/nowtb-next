// =============================================================================
// ListingCarousel — horizontal scroll carousel of listing cards
// Used for Just Listed, Price Reduced, Recently Sold sections
// =============================================================================

"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Listing } from "@/lib/types";
import { formatPrice, getListingUrl, getListingPhotoUrl } from "@/lib/utils";

interface ListingCarouselProps {
  title: string;
  listings: Listing[];
  /** Optional badge text on each card (e.g. "JUST LISTED", "PRICE REDUCED", "SOLD") */
  badge?: string;
  /** Badge color classes */
  badgeClass?: string;
}

export default function ListingCarousel({ title, listings, badge, badgeClass = "bg-accent text-white" }: ListingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll left/right by one card width
  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const cardWidth = 280 + 16; // card width + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }

  if (listings.length === 0) return null;

  return (
    <section className="container-wide py-8">
      {/* Header with title and arrow buttons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-section text-xl text-primary">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Scrollable card row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {listings.map((listing) => {
          const photoUrl = getListingPhotoUrl(listing);
          const url = getListingUrl(listing);
          const priceChange = listing.OriginalListPrice && listing.OriginalListPrice > listing.ListPrice
            ? listing.OriginalListPrice - listing.ListPrice
            : null;

          return (
            <Link
              key={listing.ListingKey}
              href={url}
              className="flex-shrink-0 w-[280px] snap-start rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow no-underline group"
            >
              {/* Photo */}
              <div className="relative h-[180px] bg-gray-100">
                <Image
                  src={photoUrl}
                  alt={listing.UnparsedAddress}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
                {/* Price overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-8">
                  <p className="font-heading font-bold text-white text-lg">
                    {formatPrice(listing.ListPrice)}
                  </p>
                </div>
                {/* Badge */}
                {badge && (
                  <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${badgeClass}`}>
                    {badge}
                  </span>
                )}
                {/* Price reduction badge */}
                {priceChange && !badge && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-red-600 text-white">
                    -{formatPrice(priceChange)} ({((priceChange / listing.OriginalListPrice!) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>

              {/* Card body */}
              <div className="p-3">
                <p className="font-body text-sm font-semibold text-primary group-hover:text-accent transition-colors truncate">
                  {listing.UnparsedAddress}
                </p>
                <p className="font-body text-xs text-muted mt-0.5">
                  {listing.City}, FL {listing.PostalCode}
                </p>
                <div className="flex items-center gap-3 mt-2 font-body text-xs text-muted">
                  {listing.BedroomsTotal && <span>{listing.BedroomsTotal} Beds</span>}
                  {listing.BathroomsTotalInteger && <span>{listing.BathroomsTotalInteger} Baths</span>}
                  {listing.LivingArea && <span>{listing.LivingArea.toLocaleString()} Sq.Ft.</span>}
                </div>
                {listing.ListOfficeName && (
                  <p className="font-body text-[10px] text-muted/60 mt-2 truncate">
                    Listed by {listing.ListOfficeName}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
