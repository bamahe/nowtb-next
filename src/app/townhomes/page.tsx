// /townhomes — Tampa Bay Townhomes for Sale

import type { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tampa Bay Townhomes for Sale | Barrett Henry, REALTOR®",
  description:
    "Townhomes for sale in Tampa Bay. Low-maintenance living, private entrances, community amenities. Barrett Henry, REALTOR® at REMAX Collective.",
  alternates: { canonical: "/townhomes/" },
};

export const revalidate = 300;

export default async function TownhomesPage() {
  let listings: Listing[] = [];
  try {
    const res = await getListings({ property_type: "Townhouse", limit: "24", exclude_rental: true, sort: "ListPrice asc" });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://nowtb.com/" },
        { name: "Townhomes", url: "https://nowtb.com/townhomes/" },
      ])} />

      <HeroSection label="Tampa Bay Real Estate" title="Townhomes for Sale" subtitle="The middle ground between condos and single-family — private entrance, small yard, lower maintenance.">
        <SearchBar />
      </HeroSection>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">
          {listings.length > 0 ? `${listings.length}+ Townhomes` : "Loading townhomes..."}
        </h2>
        <ListingGrid listings={listings} />
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Townhome Communities in Tampa Bay</h2>
        <p className="text-muted mb-6 font-body leading-relaxed">Townhomes in Tampa Bay range from $220K for older resale to $450K+ for new construction. HOA fees typically run $150-$400/month — less than condos because you own the structure. Popular for first-time buyers, downsizers, and investors seeking lower entry price with strong rental demand.</p>
      </section>

      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Find Your Townhome</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett Henry helps buyers compare townhomes, condos, and single-family to find the right fit. 23+ years of real estate experience.</p>
          <a href="tel:8137337907" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 733-7907</a>
        </div>
      </section>
    </>
  );
}
