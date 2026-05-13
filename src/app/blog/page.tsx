// =============================================================================
// /blog — Blog index page
// Displays a paginated grid of blog post cards (24 per page).
// Posts come from the WordPress JSON export via src/lib/posts.ts.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import { getAllPosts } from "@/lib/posts";

// Force dynamic so the JSON is read at runtime, not cached at build
export const dynamic = "force-dynamic";

// --- SEO metadata ---
export const metadata: Metadata = {
  title: "Tampa Bay Real Estate Blog | Barrett Henry, REALTOR®",
  description:
    "Expert insights on Tampa Bay real estate — market updates, buying & selling tips, neighborhood guides, and more from Barrett Henry, Broker Associate at REMAX Collective.",
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
  // Remove HTML tags, then trim to maxLen characters
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
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
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const allPosts = getAllPosts();

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
      {/* === Hero section === */}
      <HeroSection
        title="Tampa Bay Real Estate Blog"
        subtitle="Market updates, buying and selling tips, neighborhood guides, and expert insights from Barrett Henry."
      />

      {/* === Post count + page info === */}
      <section className="container-wide pt-8 pb-2">
        <p className="font-body text-muted text-sm text-center">
          Showing {startIdx + 1}–{Math.min(startIdx + POSTS_PER_PAGE, allPosts.length)} of{" "}
          {allPosts.length} posts
        </p>
      </section>

      {/* === Blog post grid === */}
      <section className="container-wide py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Placeholder image area */}
              <div className="h-48 bg-primary/10 flex items-center justify-center">
                <span className="font-body text-muted text-sm">
                  Featured Image
                </span>
              </div>

              <div className="p-5">
                {/* Title */}
                <h2 className="font-heading font-bold text-lg text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
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
          ))}
        </div>
      </section>

      {/* === Pagination === */}
      <section className="container-wide pb-12">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Previous button */}
          {safePage > 1 ? (
            <Link
              href={`/blog?page=${safePage - 1}`}
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
                  href={`/blog?page=${item}`}
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
              href={`/blog?page=${safePage + 1}`}
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
    </>
  );
}
