// =============================================================================
// /blog — Blog index page
// Displays a grid of blog post cards with category filtering and pagination.
// Posts will eventually come from a CMS or markdown files; for now uses
// placeholder data so the template is ready.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";

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

// --- Blog post type (placeholder until CMS integration) ---
interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
}

// --- Category list for filter tabs ---
const CATEGORIES = [
  "All",
  "Market Updates",
  "Buying Tips",
  "Selling Tips",
  "Neighborhood Guides",
  "Investment",
  "Mortgage & Finance",
] as const;

// --- Placeholder blog posts (replaced by CMS data later) ---
const PLACEHOLDER_POSTS: BlogPostSummary[] = [
  {
    slug: "tampa-bay-housing-market-2026",
    title: "Tampa Bay Housing Market 2026: What Buyers and Sellers Need to Know",
    excerpt:
      "A deep dive into current median prices, inventory levels, and days-on-market trends across Hillsborough, Pinellas, and Pasco counties.",
    date: "2026-05-01",
    category: "Market Updates",
    readingTime: "6 min read",
  },
  {
    slug: "first-time-homebuyer-guide-florida",
    title: "First-Time Homebuyer Guide: 7 Steps to Your Florida Home",
    excerpt:
      "From pre-approval to closing day, here is exactly what first-time buyers in Florida need to do — and what to avoid.",
    date: "2026-04-22",
    category: "Buying Tips",
    readingTime: "8 min read",
  },
  {
    slug: "sell-your-home-fast-tampa-bay",
    title: "How to Sell Your Home Fast in Tampa Bay Without Leaving Money on the Table",
    excerpt:
      "Pricing strategy, staging, and marketing tactics that get Tampa Bay homes sold quickly and for top dollar.",
    date: "2026-04-15",
    category: "Selling Tips",
    readingTime: "5 min read",
  },
  {
    slug: "valrico-neighborhood-guide",
    title: "Valrico Neighborhood Guide: Schools, Parks, and Home Values",
    excerpt:
      "Everything you need to know about living in Valrico — from Bloomingdale to FishHawk and everywhere in between.",
    date: "2026-04-08",
    category: "Neighborhood Guides",
    readingTime: "7 min read",
  },
  {
    slug: "investment-property-tampa-bay",
    title: "Is Tampa Bay Still a Good Market for Investment Properties?",
    excerpt:
      "Cap rates, rental demand, and appreciation trends that make Tampa Bay a compelling market for real estate investors.",
    date: "2026-03-30",
    category: "Investment",
    readingTime: "6 min read",
  },
  {
    slug: "fha-vs-conventional-loan-florida",
    title: "FHA vs. Conventional Loan in Florida: Which Is Right for You?",
    excerpt:
      "Comparing down payments, credit requirements, and long-term costs to help you choose the right mortgage.",
    date: "2026-03-20",
    category: "Mortgage & Finance",
    readingTime: "5 min read",
  },
];

/** Format a date string (YYYY-MM-DD) into a human-readable format */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  // TODO: Replace with CMS data fetching and server-side category filtering
  const posts = PLACEHOLDER_POSTS;

  return (
    <>
      {/* === Hero section === */}
      <HeroSection
        title="Tampa Bay Real Estate Blog"
        subtitle="Market updates, buying and selling tips, neighborhood guides, and expert insights from Barrett Henry."
      />

      {/* === Category filter tabs === */}
      <section className="container-wide pt-8 pb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                category === "All"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-muted hover:bg-accent/10 hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
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
              {/* Placeholder image area — replaced with real images from CMS */}
              <div className="h-48 bg-primary/10 flex items-center justify-center">
                <span className="font-body text-muted text-sm">
                  Featured Image
                </span>
              </div>

              <div className="p-5">
                {/* Category badge */}
                <span className="inline-block px-3 py-1 rounded-full text-xs font-body font-semibold bg-accent/20 text-primary mb-3">
                  {post.category}
                </span>

                {/* Title */}
                <h2 className="font-heading font-bold text-lg text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="font-body text-muted text-sm mb-3 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Date + reading time */}
                <div className="flex items-center gap-3 text-xs font-body text-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* === Pagination placeholder === */}
      <section className="container-wide pb-12">
        <div className="flex items-center justify-center gap-2">
          <button
            disabled
            className="px-4 py-2 rounded-lg text-sm font-body font-medium bg-gray-100 text-muted cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 rounded-lg text-sm font-body font-bold bg-primary text-white">
            1
          </span>
          <button className="px-4 py-2 rounded-lg text-sm font-body font-medium bg-gray-100 text-muted hover:bg-accent/10 hover:text-primary transition-colors">
            2
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-body font-medium bg-gray-100 text-muted hover:bg-accent/10 hover:text-primary transition-colors">
            3
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-body font-medium bg-gray-100 text-muted hover:bg-accent/10 hover:text-primary transition-colors">
            Next
          </button>
        </div>
      </section>
    </>
  );
}
