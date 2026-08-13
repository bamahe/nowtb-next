// /single-story — Tampa Bay Single-Story Homes
import type { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tampa Bay Single-Story Homes for Sale | Barrett Henry, REALTOR®",
  description: "Single-story homes for sale in Tampa Bay. One-level living, no stairs. Barrett Henry, REALTOR® at REMAX Collective. (813) 733-7907.",
  alternates: { canonical: "/single-story/" },
  openGraph: {
    title: "Tampa Bay Single-Story Homes for Sale | Barrett Henry, REALTOR®",
    description: "Single-story homes for sale in Tampa Bay. One-level living, no stairs. Barrett Henry, REALTOR® at REMAX Collective. (813) 733-7907.",
    type: "website",
  },
};
export const revalidate = 300;

export default async function SingleStoryPage() {
  let listings: Listing[] = [];
  try {
    const res = await getListings({ single_story: true, limit: "24", exclude_rental: true, sort: "ModificationTimestamp desc" });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://nowtb.com/" }, { name: "Single-Story Homes", url: "https://nowtb.com/single-story/" }])} />
      <HeroSection label="Tampa Bay Real Estate" title="Single-Story Homes" subtitle="One-level living — no stairs, accessible design. Popular with downsizers, retirees, and families."><SearchBar /></HeroSection>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">{listings.length > 0 ? `${listings.length}+ Single-Story Homes` : "Loading..."}</h2>
        <ListingGrid listings={listings} />
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Why Single-Story Homes Are in Demand</h2>
        <p className="text-muted mb-6 font-body leading-relaxed">Single-story homes command a 5-10% premium in Tampa Bay. The demand comes from retirees, downsizers, and buyers who want aging-in-place accessibility. In new construction, single-story plans are often the first to sell out.</p>
      </section>
      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Find a Single-Story Home</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett Henry can filter for single-story homes in any Tampa Bay neighborhood. 23+ years of real estate experience.</p>
          <a href="tel:8137337907" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 733-7907</a>
        </div>
      </section>
    </>
  );
}
