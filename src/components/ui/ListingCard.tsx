// =============================================================================
// ListingCard — Displays a single property listing as a clickable card
// Server component (no "use client" directive)
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
  Active: "bg-green-600 text-white",
  Pending: "bg-yellow-600 text-white",
  "Coming Soon": "bg-accent text-primary",
  Closed: "bg-muted text-white",
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
    statusColors[listing.StandardStatus] ?? "bg-muted text-white";

  return (
    <Link href={url} className="card group block overflow-hidden">
      {/* --- Photo / Placeholder --- */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-light">
        {/* Photo — getListingPhotoUrl always returns a URL (falls back to placeholder) */}
        <Image
          src={photoUrl}
          alt={displayAddress}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* --- Status Badge --- */}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold font-body uppercase tracking-wide",
            badgeClass
          )}
        >
          {listing.StandardStatus}
        </span>
      </div>

      {/* --- Card Body --- */}
      <div className="p-4">
        {/* Price */}
        <p className="price-display text-xl mb-1">
          {formatPrice(listing.ListPrice)}
        </p>

        {/* Address */}
        <p className="font-body font-medium text-dark text-sm truncate">
          {displayAddress}
        </p>
        <p className="font-body text-muted text-sm mb-3">{cityStateZip}</p>

        {/* Beds | Baths | SqFt */}
        <div className="flex items-center gap-4 text-sm text-muted font-body">
          {listing.BedroomsTotal != null && (
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {listing.BedroomsTotal} bd
            </span>
          )}
          {listing.BathroomsTotalInteger != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {listing.BathroomsTotalInteger} ba
            </span>
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
