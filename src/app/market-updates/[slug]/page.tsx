// =============================================================================
// /market-updates/[slug] — Individual market update page
// =============================================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ContactForm from "@/components/ui/ContactForm";
import { getPrimaryAgent } from "@/data/agents";
import { cleanWpContent } from "@/lib/utils";
import {
  getAllMarketUpdateSlugs,
  getMarketUpdateBySlug,
  getMarketUpdateThumbnail,
  getRelatedMarketUpdates,
} from "@/lib/market-updates";

// --- Static params for SSG ---
export function generateStaticParams() {
  return getAllMarketUpdateSlugs().map((slug) => ({ slug }));
}

// --- Dynamic metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const update = getMarketUpdateBySlug(slug);
  if (!update) return { title: "Market Update Not Found" };

  const ogImage = slug === "florida-housing-market-2026"
    ? "/images/florida-housing-market-2026-og.png"
    : "/og-default.png";
  return {
    title: update.title,
    description: update.excerpt || `${update.title} — latest housing market data from Barrett Henry, REALTOR® at REMAX Collective.`,
    alternates: { canonical: `/market-updates/${slug}/` },
    openGraph: {
      title: update.title,
      description: update.excerpt,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: update.title,
      images: [ogImage],
    },
  };
}

// --- Helper: format dates ---
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// --- Page component ---
export default async function MarketUpdatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const update = getMarketUpdateBySlug(slug);
  if (!update) return notFound();

  const agent = getPrimaryAgent();
  const thumbnail = getMarketUpdateThumbnail(update);
  const related = getRelatedMarketUpdates(slug, 4);

  // Extract city name from title
  const city = update.title.split(" Housing Market")[0].split(" Real Estate")[0];

  // Build JSON-LD structured data for this market update
  const canonicalUrl = `https://nowtb.com/market-updates/${slug}/`;

  return (
    <>
      {/* === JSON-LD: BreadcrumbList === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Market Updates", item: "https://nowtb.com/market-updates/" },
              { "@type": "ListItem", position: 3, name: update.title, item: canonicalUrl },
            ],
          }),
        }}
      />

      {/* === JSON-LD: Article schema === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: update.title,
            datePublished: update.date,
            dateModified: update.date,
            description: update.excerpt || `${update.title} — latest housing market data from Barrett Henry, REALTOR® at REMAX Collective.`,
            mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
            author: {
              "@type": "Person",
              name: "Barrett Henry",
              jobTitle: "Broker Associate",
              url: "https://nowtb.com/about/",
              image: "https://nowtb.com/images/barrett-henry-headshot.jpg",
              sameAs: [
                "https://nowtb.com",
                "https://www.instagram.com/nowtampa/",
                "https://www.facebook.com/NOWTampaBay",
              ],
            },
            publisher: {
              "@type": "RealEstateAgent",
              name: "Barrett Henry, REALTOR\u00ae",
              url: "https://nowtb.com",
              logo: {
                "@type": "ImageObject",
                url: "https://nowtb.com/images/remax-logo-white.png",
              },
            },
            ...(thumbnail ? { image: thumbnail } : {}),
          }),
        }}
      />

      {/* === Header === */}
      <section className="bg-primary pt-32 pb-16">
        <div className="container-wide max-w-3xl text-center">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-body font-semibold bg-accent/20 text-accent mb-4">
            Market Update
          </span>
          <h1 className="heading-display text-display md:text-display-lg text-white mb-4">
            {update.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm font-body text-accent mb-8">
            <time dateTime={update.date}>{formatDate(update.date)}</time>
          </div>
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold text-sm rounded-lg hover:bg-accent/10 transition-colors"
            >
              Call {agent.phone}
            </a>
            <Link
              href="/home-valuation/"
              className="inline-block px-6 py-3 border-2 border-white/40 text-white font-bold text-sm rounded-lg hover:border-white/70 transition-colors"
            >
              Free Home Valuation
            </Link>
            <Link
              href={`/${city.toLowerCase().replace(/['\s]+/g, "-").replace(/\./g, "")}/`}
              className="inline-block px-6 py-3 border-2 border-white/40 text-white font-bold text-sm rounded-lg hover:border-white/70 transition-colors"
            >
              {city} Homes for Sale
            </Link>
          </div>
        </div>
      </section>

      {/* === Content === */}
      <section className="container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="card p-5 bg-primary/5">
                <h3 className="font-heading font-bold text-sm text-primary mb-2">
                  Questions About {city}?
                </h3>
                <p className="font-body text-muted text-xs mb-3">
                  Barrett Henry has 23+ years of real estate experience. Call or text anytime.
                </p>
                <a
                  href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
                  className="btn-primary inline-block px-4 py-2 text-xs text-center w-full"
                >
                  {agent.phone}
                </a>
              </div>

              {/* Related market updates */}
              {related.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-heading font-bold text-sm text-primary mb-3">
                    Related Markets
                  </h3>
                  <ul className="space-y-2">
                    {related.map((r) => {
                      const rCity = r.title.split(" Housing Market")[0].split(" Real Estate")[0];
                      return (
                        <li key={r.slug}>
                          <Link
                            href={`/market-updates/${r.slug}/`}
                            className="font-body text-xs text-link hover:underline"
                          >
                            {rCity}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <article className="lg:col-span-3 order-1 lg:order-2">
            {thumbnail && (
              <div className="mb-8 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnail}
                  alt={`${city} housing market update`}
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>
            )}
            <div
              className="blog-content prose prose-lg font-body text-dark max-w-none
                prose-headings:font-heading prose-headings:text-primary
                prose-a:text-link prose-a:no-underline hover:prose-a:underline
                prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cleanWpContent(update.content) }}
            />
          </article>
        </div>
      </section>

      {/* === Back to all updates === */}
      <section className="container-wide pb-12 text-center">
        <Link
          href="/market-updates/"
          className="btn-secondary inline-block px-8 py-3"
        >
          View All Market Updates
        </Link>
      </section>

      {/* === Contact form === */}
      <section className="section-light">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source={`market-update-${slug}`}
            title={`Questions About ${city}?`}
            submitLabel="Send Message"
          />
        </div>
      </section>
    </>
  );
}
