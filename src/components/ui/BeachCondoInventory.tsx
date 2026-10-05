// =============================================================================
// BeachCondoInventory: live Gulf beach condo inventory plus recent closed sales
// Server component wrapper around ClientListings, which fetches client-side so
// these pages do not burn the Bridge rate limit at build time. Matches the
// listings-then-sold pattern used on the city hub pages.
// =============================================================================

import ClientListings from "@/components/ui/ClientListings";

/**
 * Pinellas Gulf beach ZIPs covering Indian Rocks Beach, Indian Shores,
 * Redington Shores, North Redington Beach, Redington Beach, Belleair Beach,
 * and Madeira Beach. Same three ZIPs the market report numbers are drawn from.
 */
export const GULF_BEACH_ZIPS = ["33785", "33708", "33786"];

interface BeachCondoInventoryProps {
  /** Heading for the active listings grid */
  title?: string;
  /** Supporting line under the active listings heading */
  subtitle?: string;
  /** Show the recently closed sales grid below the active listings */
  showSold?: boolean;
}

export default function BeachCondoInventory({
  title = "Gulf Beach Condos for Sale",
  subtitle = "Active condo listings from Indian Rocks Beach to Madeira Beach, updated from Stellar MLS.",
  showSold = true,
}: BeachCondoInventoryProps) {
  return (
    <>
      {/* === Active condo inventory === */}
      <div id="for-sale" />
      <ClientListings
        zipCodes={GULF_BEACH_ZIPS}
        title={title}
        subtitle={subtitle}
        limit={24}
        filters={{ property_type: "Condominium" }}
        areaName="the Pinellas Gulf beaches"
      />

      {/* === Recent closed sales, the comps behind the per-foot numbers === */}
      {showSold && (
        <>
          <div id="sold" />
          <ClientListings
            zipCodes={GULF_BEACH_ZIPS}
            title="Recently Sold Gulf Beach Condos"
            subtitle="Recent closed condo sales on the Pinellas Gulf beaches. These are the comps behind the price per square foot numbers on this page."
            limit={8}
            filters={{
              property_type: "Condominium",
              status: "Closed",
              sort: "ClosePrice desc",
            }}
            showFilters={false}
          />
        </>
      )}

      {/* === MLS disclaimer, required wherever listings are displayed === */}
      <section className="container-wide pb-4">
        <p className="font-body text-xs text-muted/60 leading-relaxed max-w-4xl">
          Listing information provided by Stellar MLS. IDX information is for
          personal, non-commercial use only. Data is deemed reliable but not
          guaranteed. All properties are subject to prior sale, change, or
          withdrawal.
        </p>
      </section>
    </>
  );
}
