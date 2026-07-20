// /pool-homes — Tampa Bay Pool Homes for Sale

import type { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tampa Bay Pool Homes for Sale | Barrett Henry, REALTOR®",
  description:
    "Pool homes for sale in Tampa Bay. Private pools, heated pools, screened enclosures. Barrett Henry, REALTOR® at REMAX Collective. (813) 750-0926.",
  alternates: { canonical: "/pool-homes/" },
};

export const revalidate = 300;

export default async function PoolHomesPage() {
  let listings: Listing[] = [];
  try {
    const res = await getListings({ pool: true, limit: "24", exclude_rental: true, sort: "ListPrice desc" });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://nowtb.com/" },
        { name: "Pool Homes", url: "https://nowtb.com/pool-homes/" },
      ])} />

      <HeroSection label="Tampa Bay Real Estate" title="Pool Homes for Sale" subtitle="Homes with private pools across Tampa Bay. Screened enclosures, heated pools, and resort-style outdoor living.">
        <SearchBar />
      </HeroSection>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">
          {listings.length > 0 ? `${listings.length}+ Pool Homes` : "Loading pool homes..."}
        </h2>
        <ListingGrid listings={listings} />
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Pool Homes in Tampa Bay</h2>
        <p className="text-muted mb-6 font-body leading-relaxed">A private pool adds $15,000-$40,000 to a Tampa Bay home&apos;s value depending on the neighborhood. Most pools in the region are screened (enclosed in a pool cage) to keep out bugs and debris. Heated pools extend your swimming season through the cooler months. Budget $100-$200/month for pool maintenance and $50-$100/month for pump electricity.</p>
      </section>

      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Find Your Pool Home</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett Henry can filter for pool homes in any Tampa Bay neighborhood. 23+ years of real estate experience.</p>
          <a href="tel:8137500926" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 750-0926</a>
        </div>
      </section>
    </>
  );
}
