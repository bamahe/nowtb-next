// =============================================================================
// ListingCard — Displays a single property listing as a clickable card
// Server component (no "use client" directive)
// Enhanced: hover zoom on photo, glass-morphism badge, better typography
// =============================================================================

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Ruler } from "lucide-react";
import type { Listing } from "@/lib/types";
import {
  cn,
  formatPrice,
  formatSqFt,
  getListingUrl,
  getListingPhotoUrl,
} from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
}

/** Color map for listing status badges */
const statusColors: Record<string, string> = {
  Active: "bg-green-600/80 text-white",
  Pending: "bg-yellow-600/80 text-white",
  "Coming Soon": "bg-accent/80 text-primary",
  Closed: "bg-muted/80 text-white",
};

export default function ListingCard({ listing }: ListingCardProps) {
  const photoUrl = getListingPhotoUrl(listing);
  const url = getListingUrl(listing);

  // Build a readable street address line from parsed parts
  const streetLine = [
    listing.StreetNumber,
    listing.StreetName,
    listing.StreetSuffix,
  ]
    .filter(Boolean)
    .join(" ");

  // Fall back to UnparsedAddress if individual parts are missing
  const displayAddress = streetLine || listing.UnparsedAddress;

  // City, State Zip line
  const cityStateZip = `${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}`;

  // Badge style for the current status
  const badgeClass =
    statusColors[listing.StandardStatus] ?? "bg-muted/80 text-white";

  return (
    <Link href={url} className="card group block overflow-hidden">
      {/* --- Photo with hover zoom effect --- */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-light">
        <Image
          src={photoUrl}
          alt={displayAddress}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* --- Status Badge — glass-morphism effect over photo --- */}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold font-body uppercase tracking-wide backdrop-blur-sm",
            badgeClass
          )}
        >
          {listing.StandardStatus}
        </span>
      </div>

      {/* --- Card Body --- */}
      <div className="p-5">
        {/* Price — larger and bolder */}
        <p className="price-display text-xl font-extrabold mb-1">
          {formatPrice(listing.ListPrice)}
        </p>

        {/* Address — street address bold, city/state/zip smaller and muted */}
        <p className="font-body font-semibold text-dark text-sm truncate">
          {displayAddress}
        </p>
        <p className="font-body text-muted text-xs mb-3">{cityStateZip}</p>

        {/* Beds / Baths / SqFt — with dot separators */}
        <div className="flex items-center gap-1 text-sm text-muted font-body">
          {listing.BedroomsTotal != null && (
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {listing.BedroomsTotal} bd
            </span>
          )}
          {listing.BedroomsTotal != null && listing.BathroomsTotalInteger != null && (
            <span className="text-border" aria-hidden="true">&middot;</span>
          )}
          {listing.BathroomsTotalInteger != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {listing.BathroomsTotalInteger} ba
            </span>
          )}
          {listing.BathroomsTotalInteger != null && listing.LivingArea != null && (
            <span className="text-border" aria-hidden="true">&middot;</span>
          )}
          {listing.LivingArea != null && (
            <span className="flex items-center gap-1">
              <Ruler className="h-4 w-4" />
              {formatSqFt(listing.LivingArea)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
