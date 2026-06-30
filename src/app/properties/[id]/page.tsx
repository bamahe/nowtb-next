// =============================================================================
// Single Listing Detail Page — /properties/[id]
// Server component: fetches one listing by ListingKey from Bridge API
// =============================================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bed, Bath, Ruler, Calendar, LandPlot, Car } from "lucide-react";

import ContactForm from "@/components/ui/ContactForm";
import FavoriteButton from "@/components/ui/FavoriteButton";
import MiniCalc from "@/components/ui/MiniCalc";
import PhotoGallery from "@/components/ui/PhotoGallery";
import RecentlyViewedTracker from "@/components/ui/RecentlyViewedTracker";
import ShareButtons from "@/components/ui/ShareButtons";
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
    alternates: {
      canonical: `/properties/${listing.ListingKey}`,
    },
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
      {/* === Recently Viewed Tracker — saves this listing to localStorage === */}
      <RecentlyViewedTracker
        listingKey={listing.ListingKey}
        address={listing.UnparsedAddress}
        city={listing.City}
        price={listing.ListPrice}
        beds={listing.BedroomsTotal}
        baths={listing.BathroomsTotalInteger}
        sqft={listing.LivingArea}
        photo={listing.Media?.[0]?.MediaURL}
      />

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
          Big hero photo on top, clickable thumbnails below,
          click main photo for fullscreen lightbox with arrow navigation
          ================================================================= */}
      <section className="container-wide pt-24 pb-8">
        <PhotoGallery photos={photos} address={listing.UnparsedAddress} autoScroll />
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

          {/* Status badge + favorite + share + days on market */}
          <div className="flex items-center gap-3">
            <ShareButtons
              title={`${listing.UnparsedAddress} — ${formatPrice(listing.ListPrice)}`}
              description={`${listing.BedroomsTotal || 0} bed, ${listing.BathroomsTotalInteger || 0} bath home in ${listing.City}, FL`}
            />
            <FavoriteButton
              listingKey={listing.ListingKey}
              listingData={{
                address: listing.UnparsedAddress,
                city: listing.City,
                price: listing.ListPrice,
                beds: listing.BedroomsTotal,
                baths: listing.BathroomsTotalInteger,
                sqft: listing.LivingArea,
                photo: listing.Media?.[0]?.MediaURL,
              }}
              size="lg"
            />
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
            {/* Virtual Tour — prominent placement right at the top */}
            {listing.VirtualTourURLUnbranded && (
              <div>
                <a
                  href={listing.VirtualTourURLUnbranded}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block"
                >
                  View Virtual Tour
                </a>
              </div>
            )}

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

            {/* ---- Property Overview ---- */}
            <DetailSection title="Property Overview">
              <DetailRow label="Property Type" value={listing.PropertyType} />
              <DetailRow label="Sub Type" value={listing.PropertySubType} />
              <DetailRow label="MLS #" value={listing.ListingId} />
              <DetailRow label="Status" value={listing.StandardStatus} />
              <DetailRow label="Year Built" value={listing.YearBuilt?.toString()} />
              <DetailRow label="Stories" value={listing.StoriesTotal?.toString()} />
              <DetailRow label="Total Rooms" value={listing.RoomsTotal?.toString()} />
              <DetailRow label="Construction" value={listing.ConstructionMaterials?.join(", ")} />
              <DetailRow label="Roof" value={listing.Roof?.join(", ")} />
              <DetailRow label="Foundation" value={listing.FoundationDetails?.join(", ")} />
              <DetailRow label="Faces" value={listing.DirectionFaces} />
              <DetailRow label="Subdivision" value={listing.SubdivisionName} />
              <DetailRow label="County" value={listing.CountyOrParish} />
              <DetailRow label="Ownership" value={listing.Ownership} />
              <DetailRow label="New Construction" value={listing.NewConstructionYN ? "Yes" : undefined} />
              <DetailRow label="Furnished" value={listing.Furnished !== "Unfurnished" ? listing.Furnished : undefined} />
            </DetailSection>

            {/* ---- Interior Features ---- */}
            <DetailSection title="Interior Features">
              <DetailRow label="Interior" value={listing.InteriorFeatures?.join(", ")} />
              <DetailRow label="Flooring" value={listing.Flooring?.join(", ")} />
              <DetailRow label="Appliances" value={listing.Appliances?.join(", ")} />
              <DetailRow label="Laundry" value={listing.LaundryFeatures?.join(", ")} />
              <DetailRow label="Windows" value={listing.WindowFeatures?.join(", ")} />
              <DetailRow label="Cooling" value={listing.Cooling?.join(", ")} />
              <DetailRow label="Heating" value={listing.Heating?.join(", ")} />
              <DetailRow label="Fireplace" value={listing.FireplaceYN ? `Yes (${listing.FireplacesTotal || ""})` : undefined} />
              <DetailRow label="Security" value={listing.SecurityFeatures?.join(", ")} />
            </DetailSection>

            {/* ---- Exterior & Lot ---- */}
            <DetailSection title="Exterior & Lot">
              <DetailRow label="Exterior" value={listing.ExteriorFeatures?.join(", ")} />
              <DetailRow label="Fencing" value={listing.Fencing?.join(", ")} />
              <DetailRow label="Other Structures" value={listing.OtherStructures?.join(", ")} />
              <DetailRow label="Lot Size" value={
                listing.LotSizeAcres
                  ? `${listing.LotSizeAcres.toFixed(2)} acres (${listing.LotSizeSquareFeet?.toLocaleString() || ""} sq ft)`
                  : undefined
              } />
              <DetailRow label="Lot Dimensions" value={listing.LotSizeDimensions} />
              <DetailRow label="Lot Features" value={listing.LotFeatures?.join(", ")} />
              <DetailRow label="Road Surface" value={listing.RoadSurfaceType?.join(", ")} />
              <DetailRow label="View" value={listing.View?.join(", ")} />
            </DetailSection>

            {/* ---- Pool & Spa ---- */}
            {(listing.PoolPrivateYN || listing.SpaFeatures?.length) && (
              <DetailSection title="Pool & Spa">
                <DetailRow label="Private Pool" value={listing.PoolPrivateYN ? "Yes" : "No"} />
                <DetailRow label="Pool Features" value={listing.PoolFeatures?.join(", ")} />
                <DetailRow label="Spa" value={listing.SpaFeatures?.join(", ")} />
              </DetailSection>
            )}

            {/* ---- Waterfront ---- */}
            {listing.WaterfrontYN && (
              <DetailSection title="Waterfront">
                <DetailRow label="Waterfront" value="Yes" />
                <DetailRow label="Features" value={listing.WaterfrontFeatures?.join(", ")} />
              </DetailSection>
            )}

            {/* ---- Utilities ---- */}
            <DetailSection title="Utilities">
              <DetailRow label="Water" value={listing.WaterSource?.join(", ")} />
              <DetailRow label="Sewer" value={listing.Sewer?.join(", ")} />
              <DetailRow label="Utilities" value={listing.Utilities?.join(", ")} />
            </DetailSection>

            {/* ---- Parking ---- */}
            <DetailSection title="Parking">
              <DetailRow label="Garage" value={
                listing.GarageYN
                  ? `Yes${listing.GarageSpaces ? ` (${listing.GarageSpaces} spaces)` : ""}`
                  : "No"
              } />
              <DetailRow label="Carport" value={listing.CarportYN ? "Yes" : undefined} />
            </DetailSection>

            {/* ---- HOA & Community ---- */}
            <DetailSection title="HOA & Community">
              <DetailRow label="HOA" value={listing.AssociationYN ? "Yes" : "No"} />
              <DetailRow label="HOA Fee" value={
                listing.AssociationFee
                  ? `${formatPrice(listing.AssociationFee)} / ${listing.AssociationFeeFrequency || "Monthly"}`
                  : undefined
              } />
              <DetailRow label="Senior Community" value={listing.SeniorCommunityYN ? "Yes" : "No"} />
            </DetailSection>

            {/* ---- Financial ---- */}
            <DetailSection title="Financial Details">
              <DetailRow label="List Price" value={formatPrice(listing.ListPrice)} />
              <DetailRow label="Original Price" value={
                listing.OriginalListPrice && listing.OriginalListPrice !== listing.ListPrice
                  ? formatPrice(listing.OriginalListPrice)
                  : undefined
              } />
              <DetailRow label="Annual Taxes" value={
                listing.TaxAnnualAmount
                  ? `${formatPrice(listing.TaxAnnualAmount)} (${listing.TaxYear || ""})`
                  : undefined
              } />
              <DetailRow label="Financing" value={listing.ListingTerms?.join(", ")} />
              <DetailRow label="Zoning" value={listing.Zoning} />
              <DetailRow label="Parcel #" value={listing.ParcelNumber} />
            </DetailSection>

            {/* ---- Schools ---- */}
            {(listing.ElementarySchool || listing.MiddleOrJuniorSchool || listing.HighSchool) && (
              <DetailSection title="Schools">
                <DetailRow label="Elementary" value={listing.ElementarySchool} />
                <DetailRow label="Middle" value={listing.MiddleOrJuniorSchool} />
                <DetailRow label="High" value={listing.HighSchool} />
              </DetailSection>
            )}

            {/* ---- Directions ---- */}
            {listing.Directions && (
              <div>
                <h2 className="heading-section text-xl text-primary mb-4">Directions</h2>
                <p className="font-body text-dark leading-relaxed">{listing.Directions}</p>
              </div>
            )}

            {/* ---- Map — Google Maps embed using listing coordinates ---- */}
            {listing.Latitude && listing.Longitude && (
              <div>
                <h2 className="heading-section text-xl text-primary mb-4">Location</h2>
                <div className="w-full aspect-[16/9] bg-gray-100">
                  <iframe
                    title={`Map of ${listing.UnparsedAddress}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${listing.Latitude},${listing.Longitude}&z=15&output=embed`}
                  />
                  <p className="font-body text-xs text-muted mt-2">
                    {listing.UnparsedAddress}, {listing.City}, {listing.StateOrProvince} {listing.PostalCode}
                  </p>
                </div>
              </div>
            )}

            {/* ---- Listing Office / Date ---- */}
            {listing.ListOfficeName && (
              <DetailSection title="Listing Information">
                <DetailRow label="Office" value={listing.ListOfficeName} />
                <DetailRow label="Listed" value={
                  listing.OnMarketDate
                    ? new Date(listing.OnMarketDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                    : undefined
                } />
              </DetailSection>
            )}
          </div>

          {/* Right column: Request Showing CTA form */}
          <div>
            <ContactForm
              webhookUrl="/api/contact"
              source={`showing-request:${listing.ListingId}`}
              type="showing"
              property={{
                address: listing.UnparsedAddress,
                city: listing.City,
                state: listing.StateOrProvince,
                price: listing.ListPrice,
                mlsNumber: listing.ListingId,
                url: `https://nowtb.com/properties/${listing.ListingKey}`,
                beds: listing.BedroomsTotal,
                baths: listing.BathroomsTotalInteger,
                sqft: listing.LivingArea,
              }}
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

      {/* === Floating mortgage calculator — pre-filled with listing price === */}
      <MiniCalc listingPrice={listing.ListPrice} />
    </>
  );
}

// -----------------------------------------------------------------------------
// DetailSection — groups related property details under a heading
// -----------------------------------------------------------------------------

/** Wraps a group of DetailRows with a section heading */
function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="heading-section text-xl text-primary mb-4">{title}</h2>
      <div className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
        {children}
      </div>
    </div>
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
      <span className="font-body text-sm text-dark font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}
