// =============================================================================
// ListingCard — Luxury property card with glass-morphism overlay
// Server component (no "use client" directive)
// Info overlaid on the image bottom with backdrop-blur, no separate white section
// =============================================================================

import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import {
  cn,
  formatPrice,
  formatSqFt,
  getListingUrl,
  getListingPhotoUrl,
} from "@/lib/utils";
import FavoriteButton from "@/components/ui/FavoriteButton";

interface ListingCardProps {
  listing: Listing;
}

/** Format open house date/time for display: "Sat, Jul 12 · 1:00–4:00 PM" */
function formatOpenHouse(start?: string, end?: string): string {
  if (!start) return '';
  const s = new Date(start);
  const dayStr = s.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const startTime = s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(' ', '');
  if (end) {
    const e = new Date(end);
    const endTime = e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(' ', '');
    return `${dayStr} · ${startTime}–${endTime}`;
  }
  return `${dayStr} · ${startTime}`;
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
    <Link href={url} className="group block overflow-hidden relative">
      {/* --- Photo with tall aspect ratio and hover scale --- */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-primary/10">
        <Image
          src={photoUrl}
          alt={displayAddress}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        {/* --- Gradient overlay on image — dark at bottom for text --- */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
          aria-hidden="true"
        />

        {/* --- Open House Banner — across the top of the photo --- */}
        {listing.OpenHouseStartTime && (
          <div className="absolute top-0 left-0 right-0 bg-accent/95 text-primary px-4 py-2 text-center z-10">
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.12em]">
              Open House
            </p>
            <p className="font-body text-xs font-semibold">
              {formatOpenHouse(listing.OpenHouseStartTime, listing.OpenHouseEndTime)}
            </p>
          </div>
        )}

        {/* --- Status Badge — glass-morphism effect over photo --- */}
        <span
          className={cn(
            "absolute left-4 px-3 py-1.5 text-[10px] font-medium font-body uppercase tracking-[0.15em] backdrop-blur-sm",
            listing.OpenHouseStartTime ? "top-14" : "top-4",
            badgeClass
          )}
        >
          {listing.StandardStatus}
        </span>

        {/* --- Favorite heart button — top right corner --- */}
        <FavoriteButton
          listingKey={listing.ListingKey}
          listingData={{
            address: displayAddress,
            city: listing.City,
            price: listing.ListPrice,
            beds: listing.BedroomsTotal,
            baths: listing.BathroomsTotalInteger,
            sqft: listing.LivingArea,
            photo: photoUrl,
          }}
          size="sm"
        />

        {/* --- Info overlay at bottom with backdrop-blur glass effect --- */}
        <div className="absolute bottom-0 left-0 right-0 p-5 backdrop-blur-[2px]">
          {/* Price — light weight heading font */}
          <p className="font-heading font-light text-xl tracking-wide text-white mb-1">
            {formatPrice(listing.ListPrice)}
          </p>

          {/* Address — slightly transparent white */}
          <p className="font-body text-sm text-white/80 font-light truncate">
            {displayAddress}
          </p>
          <p className="font-body text-xs text-white/60 mb-3">{cityStateZip}</p>

          {/* Beds / Baths / SqFt — tiny uppercase stats */}
          <div className="flex items-center gap-3 text-[10px] text-white/60 font-body tracking-widest uppercase">
            {listing.BedroomsTotal != null && (
              <span>{listing.BedroomsTotal} Bed</span>
            )}
            {listing.BathroomsTotalInteger != null && (
              <span>{listing.BathroomsTotalInteger} Bath</span>
            )}
            {listing.LivingArea != null && (
              <span>{formatSqFt(listing.LivingArea)} Sqft</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
