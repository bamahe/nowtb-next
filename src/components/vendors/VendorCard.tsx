// =============================================================================
// VendorCard — Displays a single vendor with name, city, rating, bio, and links
// Reused across insurance, inspectors, and lenders sections
// =============================================================================

import { Phone, MapPin, Globe, Star } from "lucide-react";

/** Shape of a vendor entry from the JSON data files */
export interface Vendor {
  name: string;
  county: string;
  city: string;
  address: string;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  place_id: string | null;
  google_rating: number | null;
  google_review_count: number | null;
  google_maps_url: string | null;
  website: string | null;
  bio: string;
  preferred?: boolean;
  note?: string;
}

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const hasPhone = vendor.phone !== null;
  const hasRating = vendor.google_rating !== null && vendor.google_review_count !== null;

  return (
    <div className="relative rounded-xl border border-border bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col">
      {/* "Barrett Recommends" badge for preferred vendors */}
      {vendor.preferred && (
        <span className="absolute -top-3 left-4 inline-flex items-center gap-1 bg-primary text-white text-[10px] font-body font-semibold tracking-[0.15em] uppercase px-3 py-1 rounded-full">
          <Star className="w-3 h-3 fill-accent text-accent" />
          Barrett Recommends
        </span>
      )}

      {/* Vendor name */}
      <h3 className="font-heading text-lg font-bold text-primary mt-1 mb-1">
        {vendor.name}
      </h3>

      {/* City */}
      <p className="text-sm text-muted mb-2">{vendor.city}, FL</p>

      {/* Rating badge — uses text-link blue (not gold) */}
      {hasRating && (
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-4 h-4 fill-link text-link" />
          <span className="text-sm font-semibold text-link">
            {vendor.google_rating!.toFixed(1)}
          </span>
          <span className="text-xs text-muted">
            ({vendor.google_review_count!.toLocaleString()})
          </span>
        </div>
      )}

      {/* Bio */}
      <p className="text-sm text-dark/80 leading-relaxed mb-4 flex-grow">
        {vendor.bio}
      </p>

      {/* Action links row */}
      <div className="flex flex-wrap gap-3 mt-auto">
        {/* Phone link */}
        {hasPhone ? (
          <a
            href={`tel:${vendor.phone!.replace(/[^+\d]/g, "")}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-link hover:text-primary transition-colors"
            aria-label={`Call ${vendor.name}`}
          >
            <Phone className="w-4 h-4" />
            {vendor.phone}
          </a>
        ) : vendor.note ? (
          /* If no phone and there's a note, show "Contact details coming soon" */
          <span className="inline-flex items-center gap-1.5 text-sm text-muted italic">
            <Phone className="w-4 h-4" />
            Contact details coming soon
          </span>
        ) : null}

        {/* Google Maps link */}
        {vendor.google_maps_url && (
          <a
            href={vendor.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-link hover:text-primary transition-colors"
            aria-label={`View ${vendor.name} on Google Maps`}
          >
            <MapPin className="w-4 h-4" />
            Map
          </a>
        )}

        {/* Website link */}
        {vendor.website && (
          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-link hover:text-primary transition-colors"
            aria-label={`Visit ${vendor.name} website`}
          >
            <Globe className="w-4 h-4" />
            Website
          </a>
        )}
      </div>
    </div>
  );
}
