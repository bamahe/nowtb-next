// /builders/[slug] — Individual builder detail page
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HeroSection from "@/components/ui/HeroSection";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { builders, getBuilderBySlug } from "@/data/builders";
import type { Listing } from "@/lib/types";

// Pre-render all builder slugs at build time
export function generateStaticParams() {
  return builders.map((b) => ({ slug: b.slug }));
}

// Dynamic SEO metadata per builder
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const builder = getBuilderBySlug(slug);
  if (!builder) return { title: "Builder Not Found" };

  return {
    title: `${builder.name} Homes in Tampa Bay | Barrett Henry, REALTOR®`,
    description: `${builder.name} new construction homes in Tampa Bay. ${builder.priceRange || ""} — communities, floor plans, and current incentives. Free buyer representation from Barrett Henry at REMAX Collective.`,
    alternates: { canonical: `/builders/${slug}/` },
  };
}

export const revalidate = 300;

export default async function BuilderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const builder = getBuilderBySlug(slug);
  if (!builder) notFound();

  // Fetch new construction listings — use builder name as keyword proxy
  let listings: Listing[] = [];
  try {
    const res = await getListings({
      new_construction: true,
      limit: "24",
      exclude_rental: true,
      sort: "ListPrice asc",
    });
    // Filter client-side for listings that mention the builder name
    const nameWords = builder.name.toLowerCase().split(/\s+/);
    listings = (res.value || []).filter((l: Listing) => {
      const remarks = (l.PublicRemarks || "").toLowerCase();
      const office = (l.ListOfficeName || "").toLowerCase();
      return nameWords.some((w) => remarks.includes(w) || office.includes(w));
    });
  } catch {
    listings = [];
  }

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com/" },
          { name: "Builders", url: "https://nowtb.com/builders/" },
          { name: builder.name, url: `https://nowtb.com/builders/${slug}/` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          name: builder.name,
          description: builder.desc,
          url: `https://nowtb.com/builders/${slug}/`,
          ...(builder.founded ? { foundingDate: builder.founded } : {}),
          areaServed: { "@type": "Place", name: "Tampa Bay, FL" },
        }}
      />

      <HeroSection
        label={builder.tagline}
        title={`${builder.name} Homes in Tampa Bay`}
        subtitle={builder.desc}
      />

      {/* Builder details */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          {builder.founded && (
            <div>
              <p className="text-xs font-body uppercase tracking-wider text-muted mb-1">Founded</p>
              <p className="text-lg font-heading font-bold text-primary">{builder.founded}</p>
            </div>
          )}
          {builder.hq && (
            <div>
              <p className="text-xs font-body uppercase tracking-wider text-muted mb-1">Headquarters</p>
              <p className="text-lg font-heading font-bold text-primary">{builder.hq}</p>
            </div>
          )}
          {builder.priceRange && (
            <div>
              <p className="text-xs font-body uppercase tracking-wider text-muted mb-1">Price Range</p>
              <p className="text-lg font-heading font-bold text-primary">{builder.priceRange}</p>
            </div>
          )}
          {builder.series && (
            <div>
              <p className="text-xs font-body uppercase tracking-wider text-muted mb-1">Product Lines</p>
              <p className="text-lg font-heading font-bold text-primary">{builder.series.length}</p>
            </div>
          )}
        </div>

        {/* Communities */}
        {builder.communities && (
          <div className="mb-10">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">
              {builder.name} Communities in Tampa Bay
            </h2>
            <p className="text-muted font-body leading-relaxed">{builder.communities}</p>
          </div>
        )}

        {/* Product lines */}
        {builder.series && builder.series.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">Product Lines</h2>
            <div className="flex flex-wrap gap-3">
              {builder.series.map((s) => (
                <span
                  key={s}
                  className="bg-gray-100 text-primary font-body text-sm font-medium px-4 py-2 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Why choose */}
        {builder.whyChoose && (
          <div className="mb-10">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">
              Why Choose {builder.name}?
            </h2>
            <p className="text-muted font-body leading-relaxed">{builder.whyChoose}</p>
          </div>
        )}
      </section>

      {/* Listings */}
      {listings.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold text-primary mb-6">
            {builder.name} Homes for Sale
          </h2>
          <ListingGrid listings={listings} />
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Interested in {builder.name}?
          </h2>
          <p className="text-blue-100 mb-6 font-body">
            Barrett Henry provides free buyer representation on all {builder.name}{" "}
            homes. The builder pays the agent commission — you get an expert
            negotiator at no cost. 23+ years of real estate experience.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="tel:8137500926"
              className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors"
            >
              (813) 750-0926
            </a>
            <Link
              href="/contact/"
              className="inline-block border-2 border-white/40 text-white font-bold py-3 px-8 rounded-lg hover:border-white transition-colors"
            >
              Contact Barrett
            </Link>
          </div>
        </div>
      </section>

      {/* Other builders */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-heading font-bold text-primary mb-4">
          Other Tampa Bay Builders
        </h2>
        <div className="flex flex-wrap gap-3">
          {builders
            .filter((b) => b.slug !== slug)
            .map((b) => (
              <Link
                key={b.slug}
                href={`/builders/${b.slug}/`}
                className="text-sm font-body text-accent hover:underline"
              >
                {b.name}
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
