// src/components/search/ListingCard.tsx
// Large listing card for Gallery view — photo, price overlay, beds/baths/sqft/acres/year,
// full address, subdivision, MLS #, and listing office.
// Includes open house date/time badge when listing has upcoming open house data.
"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Ruler, LandPlot, Calendar } from "lucide-react";
import type { Listing } from "@/lib/types";
import { formatPrice, formatSqFt, getListingUrl, getListingPhotoUrl } from "@/lib/utils";

// Maps MLS status to a colored badge class
const statusColors: Record<string, string> = {
  Active: "bg-green-600 text-white",
  Pending: "bg-yellow-600 text-white",
  "Coming Soon": "bg-blue-600 text-white",
  Closed: "bg-gray-600 text-white",
};

/**
 * Format open house date/time for the badge overlay.
 * Shows "TODAY 1-3 PM" if it's today, otherwise "SAT JUL 19 1-3 PM".
 */
function formatOpenHouseBadge(start?: string, end?: string): string {
  if (!start) return "";
  const s = new Date(start);
  const now = new Date();
  // Only show future open houses (cached data may include past ones)
  if (s <= now) return "";
  // Check if the open house is today
  const isToday =
    s.getFullYear() === now.getFullYear() &&
    s.getMonth() === now.getMonth() &&
    s.getDate() === now.getDate();

  // Format times as "1PM" or "1:30PM" (drop :00 minutes for cleanliness)
  const fmtTime = (d: Date) => {
    const h = d.getHours() % 12 || 12;
    const m = d.getMinutes();
    const ampm = d.getHours() >= 12 ? "PM" : "AM";
    return m === 0 ? `${h}${ampm}` : `${h}:${String(m).padStart(2, "0")}${ampm}`;
  };

  const startTime = fmtTime(s);
  const timeRange = end ? `${startTime}-${fmtTime(new Date(end))}` : startTime;

  if (isToday) return `TODAY ${timeRange}`;

  // "SAT JUL 19" format
  const dayStr = s
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase();
  return `${dayStr} ${timeRange}`;
}

export default function SearchListingCard({ listing }: { listing: Listing }) {
  const photoUrl = getListingPhotoUrl(listing);
  const url = getListingUrl(listing);
  // Fall back to gray badge if status isn't in our map
  const badgeClass = statusColors[listing.StandardStatus] ?? "bg-gray-600 text-white";

  // Build the open house badge text (empty string if no open house)
  const openHouseText = formatOpenHouseBadge(
    listing.OpenHouseStartTime,
    listing.OpenHouseEndTime
  );

  return (
    <Link
      href={url}
      className="block bg-white border border-border rounded-lg overflow-hidden
                 hover:shadow-lg transition-shadow group no-underline"
    >
      {/* ── Photo with price overlay, status badge, and open house badge ── */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={photoUrl}
          alt={listing.UnparsedAddress || "Property"}
          fill
          // Responsive sizes: full width on mobile, half on tablet, quarter on desktop
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Open house banner — full width across the top of the photo */}
        {openHouseText && (
          <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white px-3 py-1.5 text-center z-10">
            <p className="text-[10px] font-bold uppercase tracking-wider">
              Open House
            </p>
            <p className="text-xs font-semibold">
              {openHouseText}
            </p>
          </div>
        )}

        {/* Status badge — pushed down if open house banner is visible */}
        <span
          className={`absolute left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${badgeClass} ${
            openHouseText ? "top-12" : "top-2"
          }`}
        >
          {listing.StandardStatus === "Active" ? "New" : listing.StandardStatus}
        </span>

        {/* Price overlay — bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-3 px-3">
          <p className="font-heading font-bold text-white text-xl">
            {formatPrice(listing.ListPrice)}
          </p>
        </div>
      </div>

      {/* ── Property stats row: beds, baths, sqft, acres, year built ── */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted font-body">
          {listing.BedroomsTotal != null && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {listing.BedroomsTotal} Beds
            </span>
          )}
          {listing.BathroomsTotalInteger != null && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {listing.BathroomsTotalInteger} Baths
            </span>
          )}
          {listing.LivingArea != null && (
            <span className="flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5" />
              {formatSqFt(listing.LivingArea)}
            </span>
          )}
          {listing.LotSizeAcres != null && listing.LotSizeAcres > 0 && (
            <span className="flex items-center gap-1">
              <LandPlot className="w-3.5 h-3.5" />
              {listing.LotSizeAcres.toFixed(2)} Acres
            </span>
          )}
          {listing.YearBuilt != null && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Built {listing.YearBuilt}
            </span>
          )}
        </div>
      </div>

      {/* ── Address, subdivision, MLS #, and listing office ── */}
      <div className="px-3 pb-3">
        <p className="font-body text-sm font-semibold text-primary truncate">
          {listing.UnparsedAddress}
        </p>
        <p className="font-body text-xs text-muted">
          {listing.City}, FL {listing.PostalCode}
        </p>
        {listing.SubdivisionName && (
          <p className="font-body text-xs text-muted truncate">{listing.SubdivisionName}</p>
        )}
        {/* MLS number */}
        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted/60 font-body">
          {listing.ListingId && <span>MLS # {listing.ListingId}</span>}
        </div>
        {/* Listing office — shown at smallest size to match MLS compliance */}
        {listing.ListOfficeName && (
          <p className="text-[10px] text-muted/50 font-body mt-0.5 truncate">
            Listed by {listing.ListOfficeName}
          </p>
        )}
      </div>
    </Link>
  );
}
