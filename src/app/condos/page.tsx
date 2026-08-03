// /condos — Tampa Bay Condos for Sale

import type { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tampa Bay Condos for Sale | Barrett Henry, REALTOR®",
  description:
    "Condos for sale in Tampa Bay — downtown Tampa, Clearwater Beach, St. Pete, and more. Barrett Henry, REALTOR® at REMAX Collective. (813) 733-7907.",
  alternates: { canonical: "/condos/" },
};

export const revalidate = 300;

export default async function CondosPage() {
  let listings: Listing[] = [];
  try {
    const res = await getListings({ property_type: "Condominium", limit: "24", exclude_rental: true, sort: "ListPrice desc" });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://nowtb.com/" },
        { name: "Condos", url: "https://nowtb.com/condos/" },
      ])} />

      <HeroSection label="Tampa Bay Real Estate" title="Condos for Sale" subtitle="Condominiums across Tampa Bay — downtown high-rises, beach condos, and suburban complexes. From $150K to $2M+.">
        <SearchBar />
      </HeroSection>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">
          {listings.length > 0 ? `${listings.length}+ Condos` : "Loading condos..."}
        </h2>
        <ListingGrid listings={listings} />
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Buying a Condo in Tampa Bay</h2>
        <p className="text-muted mb-6 font-body leading-relaxed">Before buying any condo, review the HOA financials, reserve study, and check for pending special assessments. Florida now requires milestone structural inspections for buildings 3+ stories and 30+ years old. HOA fees range from $200-$1,500/month depending on amenities. Always calculate total monthly cost before comparing condos to single-family homes.</p>
      </section>

      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Need Help Evaluating a Condo?</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett Henry reviews HOA financials, reserve studies, and special assessments before you commit. 23+ years of real estate experience.</p>
          <a href="tel:8137337907" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 733-7907</a>
        </div>
      </section>
    </>
  );
}
