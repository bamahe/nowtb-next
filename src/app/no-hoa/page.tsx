// /no-hoa — Tampa Bay Homes with No HOA
import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tampa Bay Homes with No HOA | Barrett Henry, REALTOR®",
  description: "Homes with no HOA in Tampa Bay. No monthly fees, no deed restrictions. Barrett Henry, REALTOR® at REMAX Collective.",
  alternates: { canonical: "/no-hoa/" },
};
export const revalidate = 300;

export default async function NoHoaPage() {
  let listings: Listing[] = [];
  try {
    const res = await getListings({ limit: "24", exclude_rental: true, sort: "ModificationTimestamp desc" });
    // Filter client-side for no-HOA since Bridge doesn't have a direct filter
    listings = (res.value || []).filter((l: Listing) => !l.AssociationYN);
  } catch { listings = []; }

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://nowtb.com/" }, { name: "No HOA Homes", url: "https://nowtb.com/no-hoa/" }])} />
      <HeroSection label="Freedom Living" title="Homes with No HOA" subtitle="No monthly fees, no deed restrictions, no approval needed. Park your boat, paint your house, build a shed."><SearchBar /></HeroSection>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">{listings.length > 0 ? `${listings.length}+ No-HOA Homes` : "Loading..."}</h2>
        <ListingGrid listings={listings} />
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Where to Find No-HOA Homes</h2>
        <p className="text-muted mb-6 font-body leading-relaxed">The best areas for no-HOA homes are older established neighborhoods: <Link href="/valrico/" className="text-accent font-semibold hover:underline">Valrico</Link> (Bloomingdale area), <Link href="/brandon/" className="text-accent font-semibold hover:underline">Brandon</Link>, <Link href="/seffner/" className="text-accent font-semibold hover:underline">Seffner</Link>, <Link href="/plant-city/" className="text-accent font-semibold hover:underline">Plant City</Link>, and <Link href="/dover/" className="text-accent font-semibold hover:underline">Dover</Link>. Pre-1990s neighborhoods rarely have HOAs.</p>
      </section>
      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Want Freedom from HOA Rules?</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett Henry knows which Tampa Bay neighborhoods are HOA-free. 23+ years of real estate experience.</p>
          <a href="tel:8137500926" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 750-0926</a>
        </div>
      </section>
    </>
  );
}
