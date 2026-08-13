// /new-construction — Tampa Bay New Construction Homes

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tampa Bay New Construction Homes | Barrett Henry, REALTOR®",
  description:
    "New construction homes in Tampa Bay from Lennar, D.R. Horton, Taylor Morrison, and more. Builder incentives available. Barrett Henry, REALTOR® at REMAX Collective.",
  alternates: { canonical: "/new-construction/" },
  openGraph: {
    title: "Tampa Bay New Construction Homes | Barrett Henry, REALTOR®",
    description: "New construction homes in Tampa Bay from Lennar, D.R. Horton, Taylor Morrison, and more. Builder incentives available. Barrett Henry, REALTOR® at REMAX Collective.",
    type: "website",
  },
};

export const revalidate = 300;

export default async function NewConstructionPage() {
  let listings: Listing[] = [];
  try {
    const res = await getListings({ new_construction: true, limit: "24", exclude_rental: true, sort: "ListPrice asc" });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://nowtb.com/" },
        { name: "New Construction", url: "https://nowtb.com/new-construction/" },
      ])} />

      <HeroSection label="Tampa Bay Real Estate" title="New Construction Homes" subtitle="Brand new homes from national and regional builders. Rate buydowns, closing cost credits, and free upgrades available now.">
        <SearchBar />
      </HeroSection>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">
          {listings.length > 0 ? `${listings.length}+ New Homes` : "Loading new construction..."}
        </h2>
        <ListingGrid listings={listings} />
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Buying New Construction in Tampa Bay</h2>
        <p className="text-muted mb-6 font-body leading-relaxed">Tampa Bay has 300+ active new construction communities from Lennar, D.R. Horton, Taylor Morrison, Pulte, Meritage, and Homes by WestBay. Prices start in the low $300Ks in <Link href="/wimauma/" className="text-accent font-semibold hover:underline">Wimauma</Link> and <Link href="/parrish/" className="text-accent font-semibold hover:underline">Parrish</Link>.</p>
        <p className="text-muted mb-6 font-body leading-relaxed">Builder incentives can save $15K-$50K — rate buydowns, closing cost credits, and free upgrade packages. These typically require using the builder&apos;s preferred lender. Barrett reviews every builder offer to make sure the math works in your favor. Representation costs you nothing — the builder pays.</p>
      </section>

      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Need Help with New Construction?</h2>
          <p className="text-blue-100 mb-6 font-body">The builder&apos;s sales agent works for the builder. Barrett Henry works for you — at no cost. 23+ years of real estate experience.</p>
          <a href="tel:8137337907" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 733-7907</a>
        </div>
      </section>
    </>
  );
}
