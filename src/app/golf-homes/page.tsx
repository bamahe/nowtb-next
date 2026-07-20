// /golf-homes — Tampa Bay Golf Course Homes
import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tampa Bay Golf Course Homes for Sale | Barrett Henry, REALTOR®",
  description: "Golf course homes in Tampa Bay — fairway views, golf community living. Barrett Henry, REALTOR® at REMAX Collective. (813) 750-0926.",
  alternates: { canonical: "/golf-homes/" },
};
export const revalidate = 300;

export default async function GolfPage() {
  let listings: Listing[] = [];
  try {
    // Golf homes don't have a direct MLS filter — show luxury homes as proxy
    const res = await getListings({ min_price: "500000", limit: "24", exclude_rental: true, sort: "ListPrice desc" });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://nowtb.com/" }, { name: "Golf Homes", url: "https://nowtb.com/golf-homes/" }])} />
      <HeroSection label="Country Club Living" title="Golf Course Homes in Tampa Bay" subtitle="Fairway views, bundled golf memberships, and country club living across Tampa Bay."><SearchBar /></HeroSection>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">{listings.length > 0 ? `${listings.length}+ Golf Area Homes` : "Loading..."}</h2>
        <ListingGrid listings={listings} />
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Golf Communities in Tampa Bay</h2>
        <p className="text-muted mb-6 font-body leading-relaxed"><strong>Avila</strong> in north Tampa ($1M-$5M+) is the region&apos;s most exclusive. <strong>River Hills</strong> in <Link href="/valrico/" className="text-accent font-semibold hover:underline">Valrico</Link> ($600K-$1.2M) offers a par-72 course with Alafia River views. <strong>Diamond Hill</strong> ($350K-$550K) provides golf community living at a more accessible price. <strong>Westchase</strong> ($400K-$900K) combines golf with a village center and top schools.</p>
        <p className="text-muted mb-6 font-body leading-relaxed">Some communities include bundled golf (Sun City Center, Calusa Country Club). Others have optional memberships ranging from $5,000-$50,000/year.</p>
      </section>
      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Find Your Golf Community</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett Henry can help you compare golf communities, understand membership costs, and find homes with fairway views. 23+ years of real estate experience.</p>
          <a href="tel:8137500926" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 750-0926</a>
        </div>
      </section>
    </>
  );
}
