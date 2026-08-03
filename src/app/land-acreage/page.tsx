// /land-acreage — Tampa Bay Land & Acreage for Sale
import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tampa Bay Land & Acreage for Sale | Barrett Henry, REALTOR®",
  description: "Land and acreage for sale in Tampa Bay. Farm properties, build-your-own lots, and rural estates. Barrett Henry, REALTOR® at REMAX Collective.",
  alternates: { canonical: "/land-acreage/" },
};
export const revalidate = 300;

export default async function LandPage() {
  let listings: Listing[] = [];
  try {
    const res = await getListings({ property_type: "Land", min_acreage: "0.5", limit: "24", exclude_rental: true, sort: "LotSizeAcres desc" });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://nowtb.com/" }, { name: "Land & Acreage", url: "https://nowtb.com/land-acreage/" }])} />
      <HeroSection label="Tampa Bay Real Estate" title="Land & Acreage for Sale" subtitle="Vacant land, acreage, and build-your-own lots across Tampa Bay."><SearchBar /></HeroSection>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">{listings.length > 0 ? `${listings.length}+ Land Listings` : "Loading..."}</h2>
        <ListingGrid listings={listings} />
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Buying Land in Tampa Bay</h2>
        <p className="text-muted mb-6 font-body leading-relaxed">Land is available in <Link href="/plant-city/" className="text-accent font-semibold hover:underline">Plant City</Link>, <Link href="/dover/" className="text-accent font-semibold hover:underline">Dover</Link>, <Link href="/thonotosassa/" className="text-accent font-semibold hover:underline">Thonotosassa</Link>, and Hernando County. Residential lots start at $50K-$100K. Agricultural parcels (5+ acres) range from $100K-$500K+. Verify zoning, utility access, wetland delineation, and development restrictions before buying.</p>
      </section>
      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Looking for Land?</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett Henry helps buyers navigate zoning, utilities, and development restrictions. 23+ years of real estate experience.</p>
          <a href="tel:8137337907" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 733-7907</a>
        </div>
      </section>
    </>
  );
}
