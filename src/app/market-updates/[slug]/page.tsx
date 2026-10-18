// =============================================================================
// /market-updates/[slug] — Individual market update page
// =============================================================================

import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ContactForm from "@/components/ui/ContactForm";
import { getPrimaryAgent } from "@/data/agents";
import { cleanWpContent } from "@/lib/utils";
import {
  JsonLd,
  breadcrumbSchema,
  articleSchema,
  faqSchema,
  extractFaqsFromHtml,
  speakableSelectorsForContent,
} from "@/lib/schema";
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

/**
 * Confirm a site-root image path really exists in /public before we publish it
 * in structured data.
 *
 * WHY THIS IS HERE: getMarketUpdateThumbnail() returns `/images/blog/<slug>.jpg`
 * for EVERY update, but 36 of the 232 files are missing from public/images/blog.
 * Putting a 404 URL in an Article's `image` is the same class of bug as the
 * phantom `barrett-henry-headshot.jpg` we just removed: it quietly weakens the
 * page in exactly the systems we are trying to win. So the schema below only
 * claims an image when the bytes are on disk.
 *
 * Safe to call during the build because this is a server component.
 *
 * If it breaks, check: this resolves against process.cwd()/public, which is the
 * repo root during `next build`. The 36 missing files are also rendering a
 * broken <img> in the hero — that is a separate fix in src/lib/market-updates.ts.
 */
function publicFileExists(sitePath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", sitePath));
  } catch {
    // Never let an image check break a page render
    return false;
  }
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
  const description =
    update.excerpt ||
    `${update.title} — latest housing market data from Barrett Henry, REALTOR® at REMAX Collective.`;

  // ---------------------------------------------------------------------------
  // Clean the WordPress HTML ONCE, then use that exact string for BOTH the
  // visible article body and the FAQPage schema below.
  //
  // WHY: FAQPage structured data has to describe FAQs the visitor can actually
  // see. Deriving the schema from the same string we render makes a mismatch
  // impossible — if the content ever loses its FAQ section, extractFaqsFromHtml
  // returns [] and we emit no FAQ schema instead of lying about it.
  // ---------------------------------------------------------------------------
  const contentHtml = cleanWpContent(update.content);

  // 229 of the 232 market updates ship a visible FAQ section. The other 3 have
  // none, and correctly get no FAQPage node.
  const faqs = extractFaqsFromHtml(contentHtml);

  // Speakable selectors that actually match something on THIS page.
  // The old value was [".quick-answer", "article h1", "article h2 + p"] and all
  // three matched nothing: this template never renders <QuickAnswer>, the <h1>
  // lives in the hero <section> OUTSIDE <article>, and the exported content puts
  // its answer block in `.bbs-quick-answer-text` (which `.quick-answer` does NOT
  // match — class selectors match whole tokens, not substrings).
  const speakableSelectors = speakableSelectorsForContent(contentHtml);

  // Only publish the lead image in schema if the file is actually there.
  const schemaImage =
    thumbnail && publicFileExists(thumbnail)
      ? `https://nowtb.com${thumbnail}`
      : undefined;

  return (
    <>
      {/* === JSON-LD: BreadcrumbList === */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com" },
          { name: "Market Updates", url: "https://nowtb.com/market-updates/" },
          { name: update.title, url: canonicalUrl },
        ])}
      />

      {/* === JSON-LD: Article schema ===
           Uses the shared helper so the author Person node (headshot, job title,
           sameAs, designations) is identical to every other article on the site.
           This template used to inline its own author with a 404 headshot path
           and a second, conflicting pair of social handles. */}
      <JsonLd
        data={articleSchema({
          headline: update.title,
          description,
          url: canonicalUrl,
          datePublished: update.date,
          dateModified: update.date,
          // Verified-to-exist absolute URL, or omitted entirely
          ...(schemaImage ? { image: schemaImage } : {}),
          speakableSelectors,
        })}
      />

      {/* === JSON-LD: FAQPage ===
           Only emitted when the page really does display 3+ questions. */}
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}

      {/* === Header — the market update photo is the hero background ===
           The image sits behind the title with a navy scrim over it so the
           white headline stays readable on light photos. */}
      <section className="relative bg-primary pt-32 pb-16 overflow-hidden">
        {thumbnail && (
          <>
            <img
              src={thumbnail}
              alt={`${city} housing market`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              // eslint-disable-next-line @next/next/no-img-element
            />
            {/* Scrim — dark enough that the headline passes contrast on any photo */}
            <div className="absolute inset-0 bg-primary/80" aria-hidden="true" />
          </>
        )}
        <div className="relative container-wide max-w-3xl text-center">
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
            {/* The photo now lives in the page header above — it was here in the
                body, which pushed it below the fold on the article. */}
            <div
              className="blog-content prose prose-lg font-body text-dark max-w-none
                prose-headings:font-heading prose-headings:text-primary
                prose-a:text-link prose-a:no-underline hover:prose-a:underline
                prose-p:leading-relaxed"
              // Same string the FAQ schema above was derived from, so the
              // visible FAQs and the FAQPage JSON-LD can never disagree.
              dangerouslySetInnerHTML={{ __html: contentHtml }}
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
