// =============================================================================
// Single Listing Detail Page — /properties/[...slug]
// Handles new SEO URLs: /properties/StellarMLS/{MlsId}/{city}/{address}
// Also handles old URLs: /properties/{address-slug}-{listingKey} via redirect
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Bed, Bath, Ruler, Calendar, LandPlot, Car, Home, ChevronRight } from "lucide-react";

// ISR: cache property pages for 1 hour so cached listings survive rate limit windows.
// Without this, every visitor triggers fresh API calls (6 per page!), exhausting the quota.
export const revalidate = 300;

import BuyingPower from "@/components/ui/BuyingPower";
import FavoriteButton from "@/components/ui/FavoriteButton";
import MiniCalc from "@/components/ui/MiniCalc";
import PhotoGallery from "@/components/ui/PhotoGallery";
import RecentlyViewedTracker from "@/components/ui/RecentlyViewedTracker";
import FubListingView from "@/components/tracking/FubListingView";
import SchoolsNearby from "@/components/ui/SchoolsNearby";
import ShareButtons from "@/components/ui/ShareButtons";
import SimilarListings from "@/components/ui/SimilarListings";
import TourScheduler from "@/components/ui/TourScheduler";
import { getListing, getListingByMlsId, getJustListed, getPriceReduced, getRecentSales, getOpenHouseForListing, isRateLimited } from "@/lib/bridge";
import { formatPrice, formatSqFt, extractMlsId, extractListingKey, getListingUrl } from "@/lib/utils";
import { getCityByName } from "@/data/cities";
import type { Listing } from "@/lib/types";
import ListingCarousel from "@/components/ui/ListingCarousel";

/** All MLS open house times are Florida local. Pin the zone so server rendering
 *  (UTC on Vercel) and any client rendering agree with the listing cards. */
const OPEN_HOUSE_TZ = "America/New_York";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ListingPageProps {
  params: Promise<{ slug: string[] }>;
}

// -----------------------------------------------------------------------------
// Resolve listing from URL segments — new format or old format with redirect
// -----------------------------------------------------------------------------

async function resolveListing(segments: string[]): Promise<Listing | 'not-found' | 'rate-limited' | { redirect: string }> {
  // New format: ["StellarMLS", "TB8526478", "tampa", "5120-n-matanzas-avenue"]
  const mlsId = extractMlsId(segments);
  if (mlsId) {
    // Try MLS ID lookup first, fall back to treating it as a ListingKey prefix
    const listing = await getListingByMlsId(mlsId);
    if (listing) return listing;
    // MLS ID lookup failed — might be rate limited. Try direct key lookup as fallback.
    const byKey = await getListing(mlsId);
    if (byKey) return byKey;
    // If the API is rate limited, don't 404 — show a soft "try again" message
    if (isRateLimited()) return 'rate-limited';
    return 'not-found';
  }

  // Old format: single segment with address-slug-{listingKey}
  if (segments.length === 1) {
    const listingKey = extractListingKey(segments[0]);
    const listing = await getListing(listingKey);
    if (!listing) return 'not-found';
    // Redirect to new URL format
    return { redirect: getListingUrl(listing) };
  }

  return 'not-found';
}

// -----------------------------------------------------------------------------
// Dynamic metadata
// -----------------------------------------------------------------------------

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await resolveListing(slug);

  if (result === 'not-found' || result === 'rate-limited' || 'redirect' in result) {
    return { title: result === 'rate-limited' ? "Listing Temporarily Unavailable" : "Listing Not Found" };
  }

  const listing = result;
  const title = `${listing.UnparsedAddress}, ${listing.City} FL | ${formatPrice(listing.ListPrice)} | Barrett Henry`;
  const description = listing.PublicRemarks
    ? listing.PublicRemarks.slice(0, 160)
    : `${listing.BedroomsTotal || 0} bed, ${listing.BathroomsTotalInteger || 0} bath home in ${listing.City}, FL listed at ${formatPrice(listing.ListPrice)}.`;

  const canonicalUrl = getListingUrl(listing);

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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
    { icon: Bed, label: "Beds", value: listing.BedroomsTotal ?? "—" },
    { icon: Bath, label: "Baths", value: listing.BathroomsTotalInteger ?? "—" },
    { icon: Ruler, label: "Sq Ft", value: listing.LivingArea ? formatSqFt(listing.LivingArea) : "—" },
    { icon: Calendar, label: "Year Built", value: listing.YearBuilt ?? "—" },
    { icon: LandPlot, label: "Lot Size", value: listing.LotSizeAcres ? `${listing.LotSizeAcres.toFixed(2)} acres` : "—" },
    { icon: Car, label: "Garage", value: listing.GarageSpaces ?? "—" },
  ];
}

// -----------------------------------------------------------------------------
// Carousel data loaders — wrapped in async components for Suspense streaming
// -----------------------------------------------------------------------------

async function JustListedSection({ zipCodes, city, excludeKey }: { zipCodes: string[]; city: string; excludeKey: string }) {
  const listings = await getJustListed(zipCodes, excludeKey);
  if (listings.length === 0) return null;
  return <ListingCarousel title={`Just Listed near ${city}`} listings={listings} />;
}

async function PriceReducedSection({ zipCodes, city, excludeKey }: { zipCodes: string[]; city: string; excludeKey: string }) {
  const listings = await getPriceReduced(zipCodes, excludeKey);
  if (listings.length === 0) return null;
  return <ListingCarousel title={`Price Reduced near ${city}`} listings={listings} />;
}

async function RecentSalesSection({ zipCodes, city, excludeKey }: { zipCodes: string[]; city: string; excludeKey: string }) {
  const listings = await getRecentSales(zipCodes, excludeKey);
  if (listings.length === 0) return null;
  return <ListingCarousel title={`Recently Sold near ${city}`} listings={listings} />;
}

// -----------------------------------------------------------------------------
// Page component
// -----------------------------------------------------------------------------

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const result = await resolveListing(slug);

  // 404 if listing genuinely doesn't exist
  if (result === 'not-found') notFound();

  // Soft error if the Bridge API is rate limited — don't 404, show a retry page
  // If rate limited, redirect to search instead of showing ugly error page
  if (result === 'rate-limited') {
    const city = slug[2] || 'tampa-bay';
    redirect(`/properties/search/?q=${encodeURIComponent(city.replace(/-/g, ' '))}`);
  }

  // 301 redirect for old URL format
  if ('redirect' in result) redirect(result.redirect);

  const listing = result;

  // Check if this listing has an upcoming open house
  // (Bridge Property endpoint doesn't include open house data — separate endpoint)
  // Always refetch: a listing arriving from a cached list may carry a stale or
  // non-soonest slot. getOpenHouseForListing sorts ascending, so oh.start is the
  // next upcoming open house — the same one the listing card shows.
  {
    const oh = await getOpenHouseForListing(listing.ListingKey);
    if (oh) {
      listing.OpenHouseStartTime = oh.start;
      listing.OpenHouseEndTime = oh.end;
      listing.OpenHouses = oh.all;
    }
  }

  // Match the listing's city to our city data for backlinks
  const cityData = getCityByName(listing.City);
  // Determine if this is a commercial/land listing for breadcrumb text
  const isCommercial = listing.PropertyType === 'Commercial Sale' || listing.PropertyType === 'Business Opportunity';
  const isLand = listing.PropertyType === 'Land';
  const isRental = listing.PropertyType === 'Residential Lease';
  const breadcrumbLabel = isCommercial ? 'Commercial Properties'
    : isLand ? 'Land for Sale'
    : isRental ? 'Rentals'
    : 'Homes for Sale';
  // Build the correct city breadcrumb link based on property type
  const cityHref = isCommercial
    ? `/properties/search/?property_type=Commercial+Sale&q=${encodeURIComponent(cityData?.name || listing.City || '')}`
    : isRental && cityData ? `/${cityData.slug}-rentals/`
    : isLand && cityData ? `/${cityData.slug}-land-for-sale/`
    : cityData ? `/${cityData.slug}-homes-for-sale/` : null;
  const zipCodes = cityData?.zip_codes || [listing.PostalCode];

  // Sort photos by Order
  const photos = listing.Media
    ? [...listing.Media].sort((a, b) => a.Order - b.Order)
    : [];

  const quickStats = getQuickStats(listing);

  const statusColor =
    listing.StandardStatus === "Active"
      ? "bg-green-100 text-green-800"
      : listing.StandardStatus === "Pending"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-700";

  const canonicalUrl = `https://nowtb.com${getListingUrl(listing)}`;

  return (
    <>
      {/* === Recently Viewed Tracker === */}
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

      {/* === FUB Listing View Tracker (logged-in users only) === */}
      {/* Pushes "PropertyViewed" to FUB so Barrett sees which listings leads browse */}
      <FubListingView
        listingKey={listing.ListingKey}
        address={listing.UnparsedAddress}
        city={listing.City}
        price={listing.ListPrice}
        mlsNumber={listing.ListingId || listing.ListingKey}
        state={listing.StateOrProvince || "FL"}
      />

      {/* === JSON-LD: RealEstateListing + BreadcrumbList === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              name: listing.UnparsedAddress,
              description: listing.PublicRemarks || "",
              url: canonicalUrl,
              datePosted: listing.OriginalEntryTimestamp,
              dateModified: listing.ModificationTimestamp,
              image: photos.map((p) => p.MediaURL),
              offers: {
                "@type": "Offer",
                price: listing.ListPrice,
                priceCurrency: "USD",
                availability: listing.StandardStatus === "Active"
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
                ? { "@type": "GeoCoordinates", latitude: listing.Latitude, longitude: listing.Longitude }
                : undefined,
              numberOfRooms: listing.BedroomsTotal,
              floorSize: listing.LivingArea
                ? { "@type": "QuantitativeValue", value: listing.LivingArea, unitCode: "FTK" }
                : undefined,
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
                ...(cityData ? [{
                  "@type": "ListItem",
                  position: 2,
                  name: `${cityData.name} ${breadcrumbLabel}`,
                  item: cityHref ? `https://nowtb.com${cityHref}` : `https://nowtb.com/${cityData.slug}-homes-for-sale/`,
                }] : []),
                {
                  "@type": "ListItem",
                  position: cityData ? 3 : 2,
                  name: listing.UnparsedAddress,
                  item: canonicalUrl,
                },
              ],
            },
          ]),
        }}
      />

      {/* === BREADCRUMBS — city backlink for SEO/AEO/GEO === */}
      <nav aria-label="Breadcrumb" className="container-wide pt-24 pb-2">
        <ol className="flex items-center gap-1.5 text-sm font-body text-muted">
          <li>
            <Link href={isCommercial ? "/commercial/" : "/"} className="hover:text-accent transition-colors" aria-label="Home">
              <Home className="w-4 h-4" />
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <li>
            <Link href={isCommercial ? "/commercial/" : "/properties/"} className="hover:text-accent transition-colors">
              {isCommercial ? "Commercial" : "Properties"}
            </Link>
          </li>
          {cityHref && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <li>
                <Link href={cityHref} className="hover:text-accent transition-colors">
                  {cityData?.name || listing.City} {breadcrumbLabel}
                </Link>
              </li>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <li aria-current="page" className="text-dark font-medium truncate max-w-[200px]">
            {listing.UnparsedAddress}
          </li>
        </ol>
      </nav>

      {/* === OPEN HOUSE BANNER === */}
      {listing.OpenHouseStartTime && (
        <section className="container-wide pb-2">
          <div className="bg-accent text-primary rounded-lg px-6 py-4 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="font-heading font-bold text-sm">Open House</p>
                <p className="font-body text-sm">
                  {/* MLS open house times are UTC. Without an explicit timeZone
                      these render in the server's zone (UTC on Vercel), printing
                      raw UTC digits — a 12:00PM ET open house showed as 4:00PM.
                      The listing cards already pin America/New_York; this banner
                      did not, which is why the two disagreed. */}
                  {new Date(listing.OpenHouseStartTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: OPEN_HOUSE_TZ })}
                  {' · '}
                  {new Date(listing.OpenHouseStartTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: OPEN_HOUSE_TZ })}
                  {listing.OpenHouseEndTime && (
                    <>–{new Date(listing.OpenHouseEndTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: OPEN_HOUSE_TZ })}</>
                  )}
                </p>
              </div>
            </div>
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 bg-primary text-white font-body text-sm font-semibold px-5 py-2.5 rounded hover:bg-primary/90 transition-colors"
            >
              Schedule a Visit
            </a>
          </div>
        </section>
      )}

      {/* === PHOTO GALLERY === */}
      <section className="container-wide pb-8">
        <PhotoGallery photos={photos} address={listing.UnparsedAddress} autoScroll />
      </section>

      {/* === LISTING HEADER — price, address, status === */}
      <section className="container-wide pb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-heading font-bold text-3xl md:text-4xl text-primary">
              {formatPrice(listing.ListPrice)}
            </p>
            <h1 className="font-body text-lg text-dark mt-1">
              {listing.UnparsedAddress}, {listing.City},{" "}
              {listing.StateOrProvince} {listing.PostalCode}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {listing.VirtualTourURLUnbranded && (
              <a href={listing.VirtualTourURLUnbranded} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-gray-50 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                3D Tour
              </a>
            )}
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
            <span className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${statusColor}`}>
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

      {/* === QUICK STATS === */}
      <section className="container-wide pb-8">
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6 rounded-xl bg-white shadow-sm p-6">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className="mx-auto h-5 w-5 text-accent mb-1" />
                <p className="font-body text-xs text-muted uppercase tracking-wide">{stat.label}</p>
                <p className="font-heading font-bold text-lg text-primary">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* === DESCRIPTION + PROPERTY DETAILS (two-column) === */}
      <section className="container-wide pb-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {listing.PublicRemarks && (
              <div>
                <h2 className="heading-section text-xl text-primary mb-4">About This Property</h2>
                <p className="font-body text-dark leading-relaxed whitespace-pre-line">{listing.PublicRemarks}</p>
              </div>
            )}

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

            {(listing.PoolPrivateYN || listing.SpaFeatures?.length) && (
              <DetailSection title="Pool & Spa">
                <DetailRow label="Private Pool" value={listing.PoolPrivateYN ? "Yes" : "No"} />
                <DetailRow label="Pool Features" value={listing.PoolFeatures?.join(", ")} />
                <DetailRow label="Spa" value={listing.SpaFeatures?.join(", ")} />
              </DetailSection>
            )}

            {listing.WaterfrontYN && (
              <DetailSection title="Waterfront">
                <DetailRow label="Waterfront" value="Yes" />
                <DetailRow label="Features" value={listing.WaterfrontFeatures?.join(", ")} />
              </DetailSection>
            )}

            <DetailSection title="Utilities">
              <DetailRow label="Water" value={listing.WaterSource?.join(", ")} />
              <DetailRow label="Sewer" value={listing.Sewer?.join(", ")} />
              <DetailRow label="Utilities" value={listing.Utilities?.join(", ")} />
            </DetailSection>

            <DetailSection title="Parking">
              <DetailRow label="Garage" value={
                listing.GarageYN
                  ? `Yes${listing.GarageSpaces ? ` (${listing.GarageSpaces} spaces)` : ""}`
                  : "No"
              } />
              <DetailRow label="Carport" value={listing.CarportYN ? "Yes" : undefined} />
            </DetailSection>

            <DetailSection title="HOA & Community">
              <DetailRow label="HOA" value={listing.AssociationYN ? "Yes" : "No"} />
              <DetailRow label="HOA Fee" value={
                listing.AssociationFee
                  ? `${formatPrice(listing.AssociationFee)} / ${listing.AssociationFeeFrequency || "Monthly"}`
                  : undefined
              } />
              <DetailRow label="Senior Community" value={listing.SeniorCommunityYN ? "Yes" : "No"} />
            </DetailSection>

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

            {(listing.ElementarySchool || listing.MiddleOrJuniorSchool || listing.HighSchool) && (
              <DetailSection title="Schools">
                <DetailRow label="Elementary" value={listing.ElementarySchool} />
                <DetailRow label="Middle" value={listing.MiddleOrJuniorSchool} />
                <DetailRow label="High" value={listing.HighSchool} />
              </DetailSection>
            )}

            {listing.Directions && (
              <div>
                <h2 className="heading-section text-xl text-primary mb-4">Directions</h2>
                <p className="font-body text-dark leading-relaxed">{listing.Directions}</p>
              </div>
            )}

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

          {/* Right column */}
          <div>
            <TourScheduler
              listingAddress={`${listing.UnparsedAddress}, ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}`}
              listingId={listing.ListingId}
              listingPrice={listing.ListPrice}
            />
            {listing.PropertyType !== 'Residential Lease' && (
              <MiniCalc listingPrice={listing.ListPrice} />
            )}
          </div>
        </div>
      </section>

      {/* === SCHOOLS NEARBY === */}
      <SchoolsNearby
        elementary={listing.ElementarySchool}
        middle={listing.MiddleOrJuniorSchool}
        high={listing.HighSchool}
        city={listing.City}
      />

      {/* === BUYING POWER — residential only === */}
      {!isCommercial && !isLand && listing.PropertyType !== 'Residential Lease' && (
        <BuyingPower listingPrice={listing.ListPrice} city={listing.City} county={listing.CountyOrParish} listingTerms={listing.ListingTerms} />
      )}

      {/* === SIMILAR LISTINGS — removed server-side carousels to save API calls
           SimilarListings, JustListed, PriceReduced, RecentSales were making
           4 additional API calls per property page. Replaced with a simple
           link to the city's listings page. === */}
      {cityData && (
        <section className="container-wide py-12">
          <h2 className="heading-section text-2xl text-primary mb-6">
            More Homes in {cityData.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href={`/${cityData.slug}-homes-for-sale/`} className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">All Homes</p>
              <p className="font-body text-xs text-muted mt-1">Browse listings</p>
            </Link>
            <Link href={`/${cityData.slug}-new-construction/`} className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">New Construction</p>
              <p className="font-body text-xs text-muted mt-1">{cityData.name}</p>
            </Link>
            <Link href={`/${cityData.slug}-homes-with-pool/`} className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">Pool Homes</p>
              <p className="font-body text-xs text-muted mt-1">{cityData.name}</p>
            </Link>
            <Link href={`/${cityData.slug}-open-houses/`} className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">Open Houses</p>
              <p className="font-body text-xs text-muted mt-1">{cityData.name}</p>
            </Link>
          </div>
        </section>
      )}

      {/* === BOTTOM LINKS — different for commercial vs residential === */}
      {isCommercial ? (
        <section className="container-wide py-12">
          <h2 className="heading-section text-2xl text-primary mb-6">
            More Commercial Properties {listing.City ? `in ${listing.City}` : 'in Tampa Bay'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/commercial/" className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">All Commercial</p>
              <p className="font-body text-xs text-muted mt-1">Tampa Bay</p>
            </Link>
            <Link href={`/properties/search/?property_type=Commercial+Sale&q=${encodeURIComponent(listing.City || 'Tampa')}`} className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">{listing.City || 'Tampa'} Commercial</p>
              <p className="font-body text-xs text-muted mt-1">Search listings</p>
            </Link>
            <Link href="/properties/search/?property_type=Land" className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">Land &amp; Lots</p>
              <p className="font-body text-xs text-muted mt-1">Tampa Bay</p>
            </Link>
            <Link href="/investing/" className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">Investment Guide</p>
              <p className="font-body text-xs text-muted mt-1">Strategies &amp; tips</p>
            </Link>
          </div>
        </section>
      ) : cityData && (
        <section className="container-wide py-12">
          <h2 className="heading-section text-2xl text-primary mb-6">
            More Homes in {cityData.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href={`/${cityData.slug}-homes-for-sale/`} className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">All Homes</p>
              <p className="font-body text-xs text-muted mt-1">Browse listings</p>
            </Link>
            <Link href={`/${cityData.slug}-homes-with-pool/`} className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">Pool Homes</p>
              <p className="font-body text-xs text-muted mt-1">{cityData.name}</p>
            </Link>
            <Link href={`/${cityData.slug}-new-construction/`} className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">New Construction</p>
              <p className="font-body text-xs text-muted mt-1">{cityData.name}</p>
            </Link>
            <Link href={`/${cityData.slug}-open-houses/`} className="rounded-lg bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-accent/30 transition-all text-center no-underline">
              <p className="font-heading font-bold text-primary text-sm">Open Houses</p>
              <p className="font-body text-xs text-muted mt-1">{cityData.name}</p>
            </Link>
          </div>
        </section>
      )}

      {/* === MLS DISCLAIMER === */}
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
// DetailSection & DetailRow helpers
// -----------------------------------------------------------------------------

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="heading-section text-xl text-primary mb-4">{title}</h2>
      <div className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-gray-100 py-2">
      <span className="font-body text-sm text-muted">{label}</span>
      <span className="font-body text-sm text-dark font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}
