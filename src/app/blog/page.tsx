// =============================================================================
// /blog — Blog index page
// Displays a paginated grid of blog post cards (24 per page).
// Posts come from the WordPress JSON export via src/lib/posts.ts.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import { getAllPosts, getPostThumbnail, categorizePost, getBlogCategories } from "@/lib/posts";

// Revalidate every hour (3600 seconds) via ISR
export const revalidate = 3600;

// --- SEO metadata ---
export const metadata: Metadata = {
  title: "Tampa Bay Real Estate Blog | Barrett Henry, REALTOR®",
  description:
    "Expert insights on Tampa Bay real estate — market updates, buying and selling tips, neighborhood guides, and more from Barrett Henry, Broker Associate at REMAX Collective.",
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

  // Get all posts and available categories for filter buttons
  const everyPost = getAllPosts();
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
      </section>
        );
      })()}
    </>
  );
}
