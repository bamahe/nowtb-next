// =============================================================================
// Single Listing Detail Page — /properties/[id]
// Server component: fetches one listing by ListingKey from Bridge API
// =============================================================================

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Bed, Bath, Ruler, Calendar, LandPlot, Car } from "lucide-react";

import ContactForm from "@/components/ui/ContactForm";
import { getListing } from "@/lib/bridge";
import { formatPrice, formatSqFt } from "@/lib/utils";
import type { Listing } from "@/lib/types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

// -----------------------------------------------------------------------------
// Dynamic metadata — listing-specific title and description
// -----------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);

  // If the listing doesn't exist, Next.js will show the not-found page
  if (!listing) {
    return { title: "Listing Not Found" };
  }

  const title = `${listing.UnparsedAddress} | ${formatPrice(listing.ListPrice)}`;
  const description = listing.PublicRemarks
    ? listing.PublicRemarks.slice(0, 160)
    : `${listing.BedroomsTotal || 0} bed, ${listing.BathroomsTotalInteger || 0} bath home in ${listing.City}, FL listed at ${formatPrice(listing.ListPrice)}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/properties/${listing.ListingKey}`,
      images: listing.Media?.[0]?.MediaURL
        ? [{ url: listing.Media[0].MediaURL, width: 1200, height: 630 }]
        : [],
    },
  };
}

// -----------------------------------------------------------------------------
// Helper: quick stats bar items
// -----------------------------------------------------------------------------

function getQuickStats(listing: Listing) {
  return [
    {
      icon: Bed,
      label: "Beds",
      value: listing.BedroomsTotal ?? "—",
    },
    {
      icon: Bath,
      label: "Baths",
      value: listing.BathroomsTotalInteger ?? "—",
    },
    {
      icon: Ruler,
      label: "Sq Ft",
      value: listing.LivingArea ? formatSqFt(listing.LivingArea) : "—",
    },
    {
      icon: Calendar,
      label: "Year Built",
      value: listing.YearBuilt ?? "—",
    },
    {
      icon: LandPlot,
      label: "Lot Size",
      value: listing.LotSizeAcres
        ? `${listing.LotSizeAcres.toFixed(2)} acres`
        : "—",
    },
    {
      icon: Car,
      label: "Garage",
      value: listing.GarageSpaces ?? "—",
    },
  ];
}

// -----------------------------------------------------------------------------
// Page component
// -----------------------------------------------------------------------------

export default async function ListingDetailPage({
  params,
}: ListingPageProps) {
  const { id } = await params;
  const listing = await getListing(id);

  // If Bridge API returned null (not found or error), show 404
  if (!listing) {
    notFound();
  }

  // Sort photos by Order so the primary photo comes first
  const photos = listing.Media
    ? [...listing.Media].sort((a, b) => a.Order - b.Order)
    : [];

  // Quick stats for the horizontal bar
  const quickStats = getQuickStats(listing);

  // Status badge color based on MLS status
  const statusColor =
    listing.StandardStatus === "Active"
      ? "bg-green-100 text-green-800"
      : listing.StandardStatus === "Pending"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-700";

  return (
    <>
      {/* === JSON-LD: RealEstateListing structured data === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: listing.UnparsedAddress,
            description: listing.PublicRemarks || "",
            url: `https://nowtb.com/properties/${listing.ListingKey}`,
            datePosted: listing.OriginalEntryTimestamp,
            dateModified: listing.ModificationTimestamp,
            image: photos.map((p) => p.MediaURL),
            offers: {
              "@type": "Offer",
              price: listing.ListPrice,
              priceCurrency: "USD",
              availability:
                listing.StandardStatus === "Active"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/SoldOut",
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: listing.UnparsedAddress,
              addressLocality: listing.City,
              addressRegion: listing.StateOrProvince,
              postalCode: listing.PostalCode,
              addressCountry: "US",
            },
            geo: listing.Latitude && listing.Longitude
              ? {
                  "@type": "GeoCoordinates",
                  latitude: listing.Latitude,
                  longitude: listing.Longitude,
                }
              : undefined,
            numberOfRooms: listing.BedroomsTotal,
            floorSize: listing.LivingArea
              ? {
                  "@type": "QuantitativeValue",
                  value: listing.LivingArea,
                  unitCode: "FTK",
                }
              : undefined,
          }),
        }}
      />

      {/* =================================================================
          SECTION 1: Photo Gallery
          First photo large on top, remaining in a 2x2 grid below
          ================================================================= */}
      <section className="container-wide py-8">
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {/* Primary photo — spans full width on mobile, left column on desktop */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl md:row-span-2">
              <Image
                src={photos[0].MediaURL}
                alt={`${listing.UnparsedAddress} — primary photo`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Secondary photos — 2x2 grid in the right column */}
            {photos.slice(1, 5).map((photo, index) => (
              <div
                key={photo.MediaURL}
                className="relative aspect-[4/3] overflow-hidden rounded-xl"
              >
                <Image
                  src={photo.MediaURL}
                  alt={
                    photo.ShortDescription ||
                    `${listing.UnparsedAddress} — photo ${index + 2}`
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          /* Placeholder when there are no photos */
          <div className="flex items-center justify-center aspect-[16/9] rounded-xl bg-gray-100">
            <p className="font-body text-muted">No photos available</p>
          </div>
        )}
      </section>

      {/* =================================================================
          SECTION 2: Listing Header — price, address, status, DOM
          ================================================================= */}
      <section className="container-wide pb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            {/* Price */}
            <p className="font-heading font-bold text-3xl md:text-4xl text-primary">
              {formatPrice(listing.ListPrice)}
            </p>

            {/* Full address */}
            <h1 className="font-body text-lg text-dark mt-1">
              {listing.UnparsedAddress}, {listing.City},{" "}
              {listing.StateOrProvince} {listing.PostalCode}
            </h1>
          </div>

          {/* Status badge + days on market */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${statusColor}`}
            >
              {listing.StandardStatus}
            </span>
            {listing.DaysOnMarket !== undefined && (
              <span className="font-body text-sm text-muted">
                {listing.DaysOnMarket} days on market
              </span>
            )}
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 3: Quick Stats — horizontal bar with icons
          ================================================================= */}
      <section className="container-wide pb-8">
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6 rounded-xl bg-white shadow-sm p-6">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className="mx-auto h-5 w-5 text-accent mb-1" />
                <p className="font-body text-xs text-muted uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="font-heading font-bold text-lg text-primary">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================
          SECTION 4 & 5: Description + Property Details (two-column layout)
          ================================================================= */}
      <section className="container-wide pb-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column: Description (takes 2/3 on desktop) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Public Remarks */}
            {listing.PublicRemarks && (
              <div>
                <h2 className="heading-section text-xl text-primary mb-4">
                  About This Property
                </h2>
                <p className="font-body text-dark leading-relaxed whitespace-pre-line">
                  {listing.PublicRemarks}
                </p>
              </div>
            )}

            {/* Property Details — two-column key/value grid */}
            <div>
              <h2 className="heading-section text-xl text-primary mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                <DetailRow label="Property Type" value={listing.PropertyType} />
                <DetailRow
                  label="Sub Type"
                  value={listing.PropertySubType}
                />
                <DetailRow label="MLS #" value={listing.ListingId} />
                <DetailRow
                  label="HOA Fee"
                  value={
                    listing.AssociationFee
                      ? `${formatPrice(listing.AssociationFee)} / ${listing.AssociationFeeFrequency || "Monthly"}`
                      : "None"
                  }
                />
                <DetailRow
                  label="Pool"
                  value={listing.PoolPrivateYN ? "Yes" : "No"}
                />
                <DetailRow
                  label="Waterfront"
                  value={listing.WaterfrontYN ? "Yes" : "No"}
                />
                <DetailRow
                  label="Year Built"
                  value={listing.YearBuilt?.toString()}
                />
                <DetailRow
                  label="Lot Size"
                  value={
                    listing.LotSizeAcres
                      ? `${listing.LotSizeAcres.toFixed(2)} acres`
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Listing Agent / Office info from MLS data */}
            {(listing.ListAgentFullName || listing.ListOfficeName) && (
              <div>
                <h2 className="heading-section text-xl text-primary mb-4">
                  Listing Information
                </h2>
                <div className="rounded-xl bg-white shadow-sm p-6">
                  {listing.ListAgentFullName && (
                    <p className="font-body text-dark">
                      <span className="font-semibold">Agent:</span>{" "}
                      {listing.ListAgentFullName}
                    </p>
                  )}
                  {listing.ListOfficeName && (
                    <p className="font-body text-dark mt-1">
                      <span className="font-semibold">Office:</span>{" "}
                      {listing.ListOfficeName}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Request Showing CTA form */}
          <div>
            <ContactForm
              webhookUrl={
                process.env.NEXT_PUBLIC_CONTACT_WEBHOOK || "/api/contact"
              }
              source={`showing-request:${listing.ListingId}`}
              title="Schedule a Showing"
              submitLabel="Request Showing"
            />
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 6: MLS Disclaimer — required Stellar MLS compliance
          ================================================================= */}
      <section className="container-wide pb-12">
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
          <p className="font-body text-xs text-muted leading-relaxed">
            Listing information is deemed reliable but not guaranteed. All
            measurements and data should be independently verified. This
            information is provided by the Stellar MLS. The listing broker&apos;s
            offer of compensation is made only to participants of the MLS where
            the listing is filed. IDX information is provided exclusively for
            consumers&apos; personal, non-commercial use, and may not be used for
            any purpose other than to identify prospective properties consumers
            may be interested in purchasing. Data last updated:{" "}
            {new Date(listing.ModificationTimestamp).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            .
          </p>
        </div>
      </section>
    </>
  );
}

// -----------------------------------------------------------------------------
// DetailRow — small helper component for the property details grid
// -----------------------------------------------------------------------------

/** Renders a label/value pair; skips rendering if value is missing */
function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;

  return (
    <div className="flex justify-between border-b border-gray-100 py-2">
      <span className="font-body text-sm text-muted">{label}</span>
      <span className="font-body text-sm text-dark font-medium">{value}</span>
    </div>
  );
}
