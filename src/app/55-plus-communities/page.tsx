// /55-plus-communities — Tampa Bay 55+ Active Adult Homes

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tampa Bay 55+ Communities & Active Adult Homes | Barrett Henry",
  description:
    "55+ communities and active adult homes in Tampa Bay. Sun City Center, Del Webb, Esplanade, Valencia Lakes. Barrett Henry, REALTOR® at REMAX Collective.",
  alternates: { canonical: "/55-plus-communities/" },
};

export const revalidate = 300;

export default async function SeniorPage() {
  let listings: Listing[] = [];
  try {
    const res = await getListings({ senior: true, limit: "24", exclude_rental: true, sort: "ListPrice asc" });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://nowtb.com/" },
        { name: "55+ Communities", url: "https://nowtb.com/55-plus-communities/" },
      ])} />

      <HeroSection label="Active Adult Living" title="55+ Communities in Tampa Bay" subtitle="Golf, resort amenities, maintenance-free living. From $200K to $800K+.">
        <SearchBar />
      </HeroSection>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-6">
          {listings.length > 0 ? `${listings.length}+ Active Adult Homes` : "Loading 55+ listings..."}
        </h2>
        <ListingGrid listings={listings} />
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Top 55+ Communities in Tampa Bay</h2>
        <p className="text-muted mb-6 font-body leading-relaxed"><strong>Sun City Center</strong> ($200K-$400K) is the largest retirement community in the region with 16,000+ homes and multiple golf courses. <strong>Del Webb</strong> communities in <Link href="/riverview/" className="text-accent font-semibold hover:underline">Riverview</Link> and Lakewood Ranch offer $300K-$600K homes. <strong>Esplanade</strong> by Taylor Morrison provides premium 55+ living ($400K-$800K). <strong>Valencia Lakes</strong> in Wimauma by GL Homes ($400K-$700K) offers resort-style amenities.</p>
        <p className="text-muted mb-6 font-body leading-relaxed">HOA fees in 55+ communities range from $200-$700/month depending on amenities. Many include golf, fitness, pool, and social programming.</p>
      </section>

      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Find Your Active Adult Community</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett Henry helps retirees and active adults compare communities based on lifestyle, monthly costs, and location. 23+ years of real estate experience.</p>
          <a href="tel:8137337907" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 733-7907</a>
        </div>
      </section>
    </>
  );
}
