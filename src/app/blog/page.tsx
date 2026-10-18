// =============================================================================
// /blog — Blog index page
// Displays a paginated grid of blog post cards (24 per page).
// Posts come from the WordPress JSON export via src/lib/posts.ts.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import { getAllPosts, getAllPostsAsync, getPostThumbnail, categorizePost, getBlogCategories } from "@/lib/posts";

// Revalidate every hour (3600 seconds) via ISR
export const revalidate = 3600;

// --- SEO metadata ---
export const metadata: Metadata = {
  title: "Tampa Bay Real Estate Blog | Barrett Henry, REALTOR®",
  description:
    "Tampa Bay real estate insights — market updates, buying and selling tips, neighborhood guides from Barrett Henry, Broker Associate at REMAX Collective.",
  alternates: {
    canonical: "/blog/",
  },
  openGraph: {
    title: "Tampa Bay Real Estate Blog | Barrett Henry, REALTOR®",
    description:
      "Market updates, buying tips, seller strategies, and neighborhood guides for Tampa Bay real estate.",
    type: "website",
  },
};

// How many posts to show per page
const POSTS_PER_PAGE = 24;

/** Format a date string (YYYY-MM-DD or full datetime) into human-readable format */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Strip HTML tags and truncate to a max length */
function truncateExcerpt(html: string, maxLen = 150): string {
  // Strip <style> blocks (tag + contents), then HTML comments, then remaining tags
  const text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).trimEnd() + "...";
}

/** Estimate reading time from HTML content */
function readingTime(html: string): string {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 250));
  return `${minutes} min read`;
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page: pageParam, category: categoryParam } = await searchParams;

  // Get all posts from JSON + Supabase, and available categories for filter buttons
  const everyPost = await getAllPostsAsync();
  const availableCategories = getBlogCategories();

  // Filter by category if one is selected (URL param like ?category=Buying)
  const activeCategory = categoryParam || "All";
  const allPosts = activeCategory === "All"
    ? everyPost
    : everyPost.filter((p) => categorizePost(p.slug) === activeCategory);

  // Parse current page from searchParams (default to 1)
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  // Clamp page number to valid range
  const safePage = Math.min(currentPage, totalPages);

  // Slice posts for current page
  const startIdx = (safePage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  // ------------------------------------------------------------------
  // A-Z ARCHIVE INDEX — the fix for 204 orphaned blog posts.
  //
  // THE PROBLEM: this page paginates with query strings (?page=2, ?page=3 …).
  // Google largely does not crawl query-string pagination, so of 1,760 posts
  // only the 24 cards on page 1 ever received an index link. The audit measured
  // 204 fully orphaned posts, 329 unreachable pages, and 1,027 posts sitting at
  // crawl depth 4 or worse.
  //
  // WHY THIS APPROACH and not the obvious alternative: path-based pagination
  // (/blog/page/2/) is the textbook fix, and it is IMPOSSIBLE here —
  // next.config.mjs line ~423 already 301s "/blog/page/:num" straight back to
  // "/blog/". Shipping /blog/page/2/ would just redirect to page 1 and change
  // nothing. That config file belongs to another owner, so the fix has to work
  // inside this route. A category index was the other option, but
  // categorizePost() buckets 1,760 posts into a handful of categories, which
  // leaves the same problem one level down.
  //
  // So: render a plain-text link to EVERY post, grouped A-Z by title, right on
  // /blog/. Every post then has at least one crawlable inbound link and sits at
  // depth 2 (home -> /blog/ -> post). The query-string pagination above stays
  // exactly as it is, because it works fine for humans.
  //
  // Trade-off, stated honestly: ~1,760 links on one page dilutes how much
  // signal each individual link carries. That is still strictly better than the
  // zero links these posts have today, and it is the standard HTML-sitemap
  // pattern for a large archive.
  //
  // If it breaks, check:
  //   - Posts missing from the index => they are missing from getAllPostsAsync()
  //     (JSON export + Supabase merge), not from this component.
  //   - The index is built from `everyPost`, deliberately NOT the category-
  //     filtered `allPosts`. Filtering it would re-orphan every post outside the
  //     selected category whenever a crawler hits a ?category= URL.
  const archiveGroups = (() => {
    const groups = new Map<string, typeof everyPost>();
    for (const post of [...everyPost].sort((a, b) => a.title.localeCompare(b.title))) {
      // First letter of the title; anything that is not A-Z (numbers,
      // quotes, symbols) is bucketed under "#".
      const first = post.title.trim().charAt(0).toUpperCase();
      const key = /[A-Z]/.test(first) ? first : "#";
      const bucket = groups.get(key);
      if (bucket) bucket.push(post);
      else groups.set(key, [post]);
    }
    // Sort so "#" comes last rather than first.
    //
    // Array.from(groups) instead of [...groups.entries()] on purpose: this repo
    // compiles with an ES5-era `target` in tsconfig.json, and spreading a Map
    // iterator needs --downlevelIteration. Array.from works at any target.
    return Array.from(groups).sort(([a], [b]) => {
      if (a === "#") return 1;
      if (b === "#") return -1;
      return a.localeCompare(b);
    });
  })();

  return (
    <>
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://nowtb.com/blog" },
            ],
          }),
        }}
      />

      {/* === Hero section === */}
      <HeroSection
        title="Tampa Bay Real Estate Blog"
        subtitle="Market updates, buying and selling tips, neighborhood guides, and expert insights from Barrett Henry."
      />

      {/* === Breadcrumb trail — Home > Blog === */}
      <div className="w-full border-b border-gray-200 bg-white">
        <nav
          aria-label="Breadcrumb"
          className="container-wide flex items-center gap-2 text-xs font-body text-muted py-3 tracking-wide uppercase"
        >
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-primary" aria-current="page">Blog</span>
        </nav>
      </div>

      {/* === Category filter buttons === */}
      <section className="container-wide pt-8 pb-2">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {/* "All" button — resets category filter */}
          <Link
            href="/blog/"
            className={`px-4 py-2 rounded-full text-xs font-body font-semibold tracking-wide uppercase transition-colors ${
              activeCategory === "All"
                ? "bg-primary text-white"
                : "bg-gray-100 text-muted hover:bg-accent/10 hover:text-primary"
            }`}
          >
            All ({everyPost.length})
          </Link>

          {/* One button per category — links to /blog?category=CategoryName */}
          {availableCategories.map((cat) => {
            const count = everyPost.filter((p) => categorizePost(p.slug) === cat).length;
            return (
              <Link
                key={cat}
                href={`/blog/?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-xs font-body font-semibold tracking-wide uppercase transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-muted hover:bg-accent/10 hover:text-primary"
                }`}
              >
                {cat} ({count})
              </Link>
            );
          })}
        </div>

        {/* Post count + page info */}
        <p className="font-body text-muted text-sm text-center">
          Showing {startIdx + 1}–{Math.min(startIdx + POSTS_PER_PAGE, allPosts.length)} of{" "}
          {allPosts.length} {activeCategory !== "All" ? `${activeCategory} ` : ""}posts
        </p>
      </section>

      {/* === Blog post grid === */}
      <section className="container-wide py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const thumbnail = getPostThumbnail(post);
            return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="group card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Post thumbnail — extracted from content, or gradient fallback */}
              {thumbnail ? (
                <div className="h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="font-heading text-primary/30 text-4xl font-bold">
                    {post.title.charAt(0)}
                  </span>
                </div>
              )}

              <div className="p-5">
                {/* Title */}
                <h2 className="font-heading font-light text-lg text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt — strip HTML and truncate to 150 chars */}
                <p className="font-body text-muted text-sm mb-3 line-clamp-3">
                  {truncateExcerpt(post.excerpt || post.content, 150)}
                </p>

                {/* Date + reading time */}
                <div className="flex items-center gap-3 text-xs font-body text-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{readingTime(post.content)}</span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      {/* === Pagination === */}
      {(() => {
        // Build query string suffix to preserve category filter across pages
        const catQuery = activeCategory !== "All" ? `&category=${encodeURIComponent(activeCategory)}` : "";
        return (
      <section className="container-wide pb-12">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Previous button */}
          {safePage > 1 ? (
            <Link
              href={`/blog/?page=${safePage - 1}${catQuery}`}
              className="px-4 py-2 rounded-lg text-sm font-body font-medium bg-gray-100 text-muted hover:bg-accent/10 hover:text-primary transition-colors"
            >
              Previous
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-lg text-sm font-body font-medium bg-gray-100 text-muted cursor-not-allowed">
              Previous
            </span>
          )}

          {/* Page numbers — show up to 7 pages around current */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              // Always show first, last, and pages near current
              if (p === 1 || p === totalPages) return true;
              if (Math.abs(p - safePage) <= 2) return true;
              return false;
            })
            .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
              // Insert ellipsis markers between non-consecutive pages
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                acc.push("ellipsis");
              }
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-2 text-sm font-body text-muted"
                >
                  ...
                </span>
              ) : (
                <Link
                  key={item}
                  href={`/blog/?page=${item}${catQuery}`}
                  className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors ${
                    item === safePage
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-muted hover:bg-accent/10 hover:text-primary"
                  }`}
                >
                  {item}
                </Link>
              )
            )}

          {/* Next button */}
          {safePage < totalPages ? (
            <Link
              href={`/blog/?page=${safePage + 1}${catQuery}`}
              className="px-4 py-2 rounded-lg text-sm font-body font-medium bg-gray-100 text-muted hover:bg-accent/10 hover:text-primary transition-colors"
            >
              Next
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-lg text-sm font-body font-medium bg-gray-100 text-muted cursor-not-allowed">
              Next
            </span>
          )}
        </div>

        {/* Escape hatch out of the query-string pagination. Google largely
            ignores ?page= URLs, so this fragment link is how both a reader on
            page 1 and a crawler reach the complete A-Z index below. */}
        <p className="font-body text-sm text-center mt-6">
          <a
            href="#browse-all-articles"
            className="font-semibold text-accent hover:text-primary transition-colors"
          >
            Browse all {allPosts.length} articles A&ndash;Z
          </a>
        </p>
      </section>
        );
      })()}

      {/* === A-Z archive index — every post, crawlable ===
           See the long comment next to `archiveGroups` above for why this
           exists and why path-based pagination was not an option.

           Rendered inside <details> elements so the page stays readable: the
           markup (and therefore every link) is present in the HTML on first
           load whether or not a group is expanded, which is what crawlers read.
           Collapsed <details> content is still indexed and its links are still
           followed — this is the normal HTML-sitemap pattern, not cloaking. */}
      <section id="browse-all-articles" className="container-wide pb-16 border-t border-gray-200 pt-12">
        <h2 className="font-heading font-bold text-2xl text-primary mb-2">
          Browse Every Article A&ndash;Z
        </h2>
        <p className="font-body text-muted text-sm mb-6 max-w-2xl">
          All {everyPost.length} Tampa Bay real estate articles, grouped by
          title. Open a letter to see the full list.
        </p>

        <div className="space-y-2">
          {archiveGroups.map(([letter, groupPosts]) => (
            <details
              key={letter}
              className="border border-gray-200 rounded-lg bg-white"
            >
              <summary className="cursor-pointer px-4 py-3 font-heading font-bold text-sm text-primary hover:text-accent transition-colors">
                {letter}{" "}
                <span className="font-body font-normal text-muted">
                  ({groupPosts.length})
                </span>
              </summary>
              <ul className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
                {groupPosts.map((post) => (
                  <li key={post.slug}>
                    {/* Blog posts live at /blog/<slug>/. The trailing slash is
                        required — next.config.mjs sets `trailingSlash: true`, so
                        "/blog/<slug>" is answered with a 308 redirect and is
                        never served directly. The anchor text is the post title,
                        which is the descriptive keyword phrase we want; never
                        "read more". */}
                    <Link
                      href={`/blog/${post.slug}/`}
                      className="font-body text-xs text-muted hover:text-accent transition-colors"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Need Expert Advice on Tampa Bay Real Estate?</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett Henry, REALTOR® and Broker Associate at REMAX Collective, brings 23+ years of real estate experience. Call or text for a free consultation.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="tel:8137337907" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 733-7907</a>
            <Link href="/contact/" className="inline-block border-2 border-white/40 text-white font-bold py-3 px-8 rounded-lg hover:border-white transition-colors">Contact Barrett</Link>
          </div>
        </div>
      </section>
    </>
  );
}
