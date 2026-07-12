// =============================================================================
// /blog/[slug] — Blog post page (renders same content as /[slug])
// Both URLs serve the same post. Canonical points to root /[slug].
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPrimaryAgent } from "@/data/agents";
import { cities } from "@/data/cities";
import { getAllPosts, getPostBySlug, getPostThumbnail, getRelatedPosts } from "@/lib/posts";
import { cleanWpContent } from "@/lib/utils";

/**
 * Find the city that matches a blog post slug.
 * Checks if any city slug appears as a segment in the post slug.
 * Returns the matched CityData or null.
 */
function getCityFromSlug(postSlug: string) {
  // Sort cities by slug length descending so longer slugs match first
  // (e.g., "apollo-beach" matches before "beach")
  const sorted = [...cities].sort((a, b) => b.slug.length - a.slug.length);
  for (const city of sorted) {
    // Check the city slug appears in the post slug as a whole segment
    // e.g., "sell-home-fast-valrico" contains "valrico",
    // "best-neighborhoods-brandon-fl" contains "brandon"
    if (postSlug.includes(city.slug)) {
      return city;
    }
  }
  return null;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  const description = post.excerpt || `${post.title} — Barrett Henry, REALTOR® at REMAX Collective.`;
  const ogTitle = `${post.title} | Barrett Henry, REALTOR®`;
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      title: ogTitle,
      description,
      url: `/blog/${slug}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const agent = getPrimaryAgent();
  const thumbnail = getPostThumbnail(post);
  const related = getRelatedPosts(slug, 3);

  // Find city-related posts for the "More About {City}" section
  const matchedCity = getCityFromSlug(slug);
  const cityRelatedPosts = matchedCity
    ? getAllPosts()
        .filter((p) => p.slug !== slug && p.slug.includes(matchedCity.slug))
        .slice(0, 6)
    : [];

  // Strip HTML tags from excerpt for schema description
  const plainExcerpt = (post.excerpt || "").replace(/<[^>]*>/g, "").trim();
  const canonicalUrl = `https://nowtb.com/blog/${slug}/`;

  return (
    <>
      {/* === JSON-LD: BlogPosting structured data === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.date,
            description: plainExcerpt || `${post.title} — Barrett Henry, REALTOR® at REMAX Collective.`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
            author: {
              "@type": "Person",
              name: "Barrett Henry",
              jobTitle: "Broker Associate",
              url: "https://nowtb.com/about/",
            },
            publisher: {
              "@type": "RealEstateAgent",
              name: "Barrett Henry, REALTOR®",
            },
            ...(thumbnail ? { image: thumbnail } : {}),
          }),
        }}
      />

      <section className="bg-primary pt-32 pb-16">
        <div className="container-wide max-w-3xl text-center">
          <h1 className="heading-display text-display md:text-display-lg text-white mb-4">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm font-body text-link">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </section>

      {/* Seller lead capture — shows on sell-home-fast posts */}
      {slug.startsWith("sell-home-fast") && (
        <section className="container-wide py-8">
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="font-heading font-bold text-xl md:text-2xl text-primary mb-2">
                  What&apos;s Your Home Worth?
                </h2>
                <p className="font-body text-muted text-sm mb-4">
                  Get two valuations — see what your home could sell for on the open market
                  AND what cash buyers would offer. No obligation, no pressure.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/free-home-valuation/"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    Get Market Value
                  </Link>
                  <a
                    href="tel:+18137337907"
                    className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold px-6 py-3 rounded-lg text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    Get Cash Offer — (813) 733-7907
                  </a>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="font-heading font-bold text-3xl text-primary mb-1">2 Offers</p>
                <p className="font-body text-muted text-sm">Market value vs. cash offer</p>
                <p className="font-body text-muted text-xs mt-2">Barrett Henry — 23+ years experience</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="card p-5 bg-primary/5">
                <h3 className="font-heading font-bold text-sm text-primary mb-2">
                  About the Author
                </h3>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden">
                    <Image
                      src="/images/barrett-headshot.png"
                      alt={agent.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs text-primary">{agent.name}</p>
                    <p className="font-body text-muted text-[10px]">{agent.title}</p>
                  </div>
                </div>
                <a
                  href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
                  className="btn-primary inline-block px-4 py-2 text-xs text-center w-full"
                >
                  {agent.phone}
                </a>
              </div>

              {related.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-heading font-bold text-sm text-primary mb-3">
                    Related Posts
                  </h3>
                  <ul className="space-y-2">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/blog/${r.slug}`}
                          className="font-body text-xs text-link hover:underline"
                        >
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Loan & financing guides — helps readers explore mortgage options */}
              <div className="card p-5">
                <h3 className="font-heading font-bold text-sm text-primary mb-3">
                  Financing Guides
                </h3>
                <ul className="space-y-2">
                  {[
                    { href: "/guides/mortgage-pre-approval-guide-florida", label: "Mortgage Pre-Approval" },
                    { href: "/guides/fha-loan-guide", label: "FHA Loans" },
                    { href: "/guides/va-home-loan-guide", label: "VA Home Loans" },
                    { href: "/guides/usda-loan-guide", label: "USDA Loans" },
                    { href: "/guides/conventional-loan-guide", label: "Conventional Loans" },
                    { href: "/guides/jumbo-loan-guide", label: "Jumbo Loans" },
                    { href: "/guides/dscr-loan-guide", label: "DSCR Loans" },
                    { href: "/guides/mortgage-rate-lock-guide", label: "Mortgage Rate Locks" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-body text-xs text-link hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/guides/"
                  className="inline-block mt-3 font-body text-xs font-semibold text-primary hover:text-accent transition-colors"
                >
                  Browse All Guides &rarr;
                </Link>
              </div>

              {/* Home valuation CTA — drives leads from blog readers */}
              <div className="card p-5 bg-accent/10 border-accent/20">
                <h3 className="font-heading font-bold text-sm text-primary mb-2">
                  What&apos;s Your Home Worth?
                </h3>
                <p className="font-body text-muted text-xs mb-3">
                  Get a free, no-obligation market analysis from Barrett Henry.
                </p>
                <Link
                  href="/free-home-valuation/"
                  className="btn-primary inline-block px-4 py-2 text-xs text-center w-full"
                >
                  Get Your Free Home Valuation
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <article className="lg:col-span-3 order-1 lg:order-2">
            {thumbnail && (
              <div className="mb-8 rounded-lg overflow-hidden relative">
                <Image
                  src={thumbnail}
                  alt={post.title}
                  width={900}
                  height={500}
                  className="w-full h-auto"
                  priority
                  sizes="(max-width: 768px) 100vw, 75vw"
                />
              </div>
            )}
            <div
              className="blog-content prose prose-lg font-body text-dark max-w-none
                prose-headings:font-heading prose-headings:text-primary
                prose-a:text-link prose-a:no-underline hover:prose-a:underline
                prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cleanWpContent(post.content) }}
            />
          </article>
        </div>
      </section>

      {/* === Related Articles from same city === */}
      {cityRelatedPosts.length > 0 && matchedCity && (
        <section className="bg-gray-50 py-12">
          <div className="container-wide">
            <h2 className="heading-display text-2xl text-primary mb-8">
              More About {matchedCity.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityRelatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}/`}
                  className="group block border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-accent hover:shadow-lg transition-all"
                >
                  <div className="p-5">
                    {/* Post title */}
                    <h3 className="font-heading font-bold text-sm text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {rp.title}
                    </h3>
                    {/* Excerpt truncated to ~100 chars */}
                    {rp.excerpt && (
                      <p className="font-body text-muted text-xs mb-3 line-clamp-3">
                        {rp.excerpt.replace(/<[^>]*>/g, "").slice(0, 100)}
                        {rp.excerpt.replace(/<[^>]*>/g, "").length > 100 ? "…" : ""}
                      </p>
                    )}
                    {/* Date */}
                    <time
                      dateTime={rp.date}
                      className="font-body text-muted text-[11px]"
                    >
                      {new Date(rp.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
