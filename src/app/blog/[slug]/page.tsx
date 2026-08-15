// =============================================================================
// /blog/[slug] — Blog post page (canonical URL for all blog posts)
// The root /{slug} route 308-redirects here via [citySlug] catch-all.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPrimaryAgent } from "@/data/agents";
import { getAllPosts, getPostBySlug, getPostBySlugAsync, getPostThumbnail, getRelatedPosts } from "@/lib/posts";
import { findRelatedPosts, getRelatedPostsTitle } from "@/lib/related-posts";
import { cleanWpContent, metaDescription } from "@/lib/utils";
import PhotoCredit from "@/components/ui/PhotoCredit";
import SearchCategoryListings from "@/components/ui/SearchCategoryListings";

export const dynamicParams = true;

// Pre-render the 200 most recent posts at build time.
// Older posts render on-demand via ISR (dynamicParams = true above).
// This keeps us under Vercel's 2048 route limit.
export function generateStaticParams() {
  return getAllPosts().slice(0, 100).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugAsync(slug);
  if (!post) return { title: "Not Found" };
  const description = metaDescription(post.excerpt, post.title);
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
  const post = await getPostBySlugAsync(slug);
  if (!post) notFound();

  const agent = getPrimaryAgent();
  const thumbnail = getPostThumbnail(post);
  const related = getRelatedPosts(slug, 3);

  // Intelligent related posts — uses city + topic + county scoring (6-8 posts)
  const allPosts = getAllPosts();
  const smartRelated = findRelatedPosts(slug, allPosts, 8);
  const smartRelatedTitle = getRelatedPostsTitle(slug, smartRelated);

  // Strip HTML tags from excerpt for schema description
  const plainExcerpt = (post.excerpt || "").replace(/<[^>]*>/g, "").trim();
  const canonicalUrl = `https://nowtb.com/blog/${slug}/`;

  return (
    <>
      {/* === JSON-LD: BreadcrumbList structured data === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://nowtb.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://nowtb.com/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: canonicalUrl,
              },
            ],
          }),
        }}
      />

      {/* === JSON-LD: BlogPosting structured data === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.date,
            dateModified: post.date,
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
              image: "https://nowtb.com/images/barrett-henry-headshot.jpg",
              sameAs: [
                "https://nowtb.com",
                "https://www.instagram.com/nowtampa/",
                "https://www.facebook.com/NOWTampaBay",
              ],
              hasCredential: [
                { "@type": "EducationalOccupationalCredential", credentialCategory: "Designation", name: "e-PRO" },
                { "@type": "EducationalOccupationalCredential", credentialCategory: "Designation", name: "MRP (Military Relocation Professional)" },
                { "@type": "EducationalOccupationalCredential", credentialCategory: "Designation", name: "SRS (Seller Representative Specialist)" },
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
            // Speakable schema — tells AI assistants & voice search which parts to read aloud
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: [".quick-answer", "article h1", "article h2 + p"],
            },
          }),
        }}
      />

      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background image with dark overlay (solid navy fallback if no thumbnail) */}
        {thumbnail && (
          <Image
            src={thumbnail}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className={`absolute inset-0 ${thumbnail ? 'bg-primary/85' : 'bg-primary'}`} />
        <div className="container-wide max-w-3xl text-center relative z-10">
          {/* Breadcrumb trail — Home > Blog > Post Title */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 text-xs font-body text-white/80 mb-6 tracking-wide uppercase"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog/" className="hover:text-white transition-colors">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-accent" aria-current="page">{post.title}</span>
          </nav>

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
            {/* Photo credit — shows for Wikimedia Commons and attributed images */}
            {thumbnail && <PhotoCredit src={thumbnail} />}
            <div
              className="blog-content prose prose-lg font-body text-dark max-w-none
                prose-headings:font-heading prose-headings:text-primary
                prose-a:text-link prose-a:no-underline hover:prose-a:underline
                prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cleanWpContent(post.content) }}
            />

            {/* === Bottom CTA — appears on every blog post for lead capture === */}
            <div className="mt-10 rounded-xl border-2 border-primary/20 bg-primary/5 p-6 md:p-8">
              <h2 className="font-heading font-bold text-xl md:text-2xl text-primary mb-2">
                Thinking About Selling?
              </h2>
              <p className="font-body text-muted text-sm mb-5">
                Find out what your home is worth in today&apos;s market — no obligation, no pressure.
                Barrett Henry has 23+ years of real estate experience and can help you make a
                confident decision.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/free-home-valuation/"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                >
                  Get Your Free Home Valuation
                </Link>
                <a
                  href="tel:+18137337907"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold px-6 py-3 rounded-lg text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  Call (813) 733-7907
                </a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs font-body text-muted">
                <Link href="/guides/" className="text-link hover:underline">
                  Browse All Guides &rarr;
                </Link>
                <Link href="/about/" className="text-link hover:underline">
                  Meet Barrett Henry &rarr;
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* === Live listings for search category blog posts === */}
      <SearchCategoryListings slug={slug} />

      {/* === Intelligent Related Posts — scored by city + topic + county matching === */}
      {smartRelated.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container-wide">
            <h2 className="heading-display text-2xl text-primary mb-8">
              {smartRelatedTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {smartRelated.map((rp) => {
                const rpThumb = getPostThumbnail(rp);
                return (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}/`}
                    className="group block border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-accent hover:shadow-lg transition-all"
                  >
                    {rpThumb && (
                      <div className="h-40 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rpThumb}
                          alt={rp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-sm text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      {rp.excerpt && (
                        <p className="font-body text-muted text-xs mb-3 line-clamp-3">
                          {rp.excerpt.replace(/<[^>]*>/g, "").slice(0, 100)}
                          {rp.excerpt.replace(/<[^>]*>/g, "").length > 100 ? "…" : ""}
                        </p>
                      )}
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
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
