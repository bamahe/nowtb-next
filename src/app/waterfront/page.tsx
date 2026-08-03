// /waterfront — Tampa Bay Waterfront Homes for Sale

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tampa Bay Waterfront Homes for Sale | Barrett Henry, REALTOR®",
  description:
    "Waterfront homes for sale in Tampa Bay — lakefront, bayfront, canal-access, and Gulf-front properties. Barrett Henry, REALTOR® at REMAX Collective. (813) 733-7907.",
  alternates: { canonical: "/waterfront/" },
};

export const revalidate = 300;

export default async function WaterfrontPage() {
  let listings: Listing[] = [];
  try {
    const res = await getListings({ waterfront: true, limit: "24", exclude_rental: true, sort: "ListPrice desc" });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://nowtb.com/" },
        { name: "Waterfront Homes", url: "https://nowtb.com/waterfront/" },
      ])} />

      <HeroSection
        label="Tampa Bay Real Estate"
        title="Waterfront Homes for Sale"
        subtitle="Lakefront, bayfront, canal-access, and Gulf-front properties across Tampa Bay."
      >
        <SearchBar />
      </HeroSection>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">
          {listings.length > 0 ? `${listings.length}+ Waterfront Homes` : "Loading waterfront listings..."}
        </h2>
        <ListingGrid listings={listings} />
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Types of Waterfront in Tampa Bay</h2>
        <p className="text-muted mb-6 font-body leading-relaxed">Waterfront in Tampa Bay ranges from Gulf-front condos in Clearwater to lakefront homes in <Link href="/valrico/" className="text-accent font-semibold hover:underline">Valrico</Link>, canal-access properties in <Link href="/apollo-beach/" className="text-accent font-semibold hover:underline">Apollo Beach</Link> with direct bay access, and riverfront estates along the Alafia River in <Link href="/lithia/" className="text-accent font-semibold hover:underline">Lithia</Link>. Prices range from $375K for pond-view lots to $2M+ for Gulf-front estates.</p>
        <p className="text-muted mb-6 font-body leading-relaxed">Before buying waterfront, check the FEMA flood zone. Properties in Zone X (minimal risk) have lower insurance costs. Properties in zones A or AE require flood insurance, which adds $800-$5,000+/year. Barrett verifies flood zone status on every waterfront property.</p>
      </section>

      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Find Your Waterfront Home</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett Henry knows every lake, canal, and water-view lot in Tampa Bay. 23+ years of real estate experience. Free buyer representation.</p>
          <a href="tel:8137337907" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 733-7907</a>
        </div>
      </section>
    </>
  );
}
