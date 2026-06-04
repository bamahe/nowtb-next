/** @type {import('next').NextConfig} */

// Blog post slugs from WordPress — these lived at /slug/ on WP but now live at /blog/slug
// We load them at build time to generate individual 301 redirects
import fs from 'fs';
import path from 'path';

function getBlogRedirects() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/posts-export.json');
    const posts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return posts.map((post) => ({
      source: `/${post.slug}`,
      destination: `/blog/${post.slug}`,
      permanent: true,
    }));
  } catch {
    console.warn('Could not load posts for redirects');
    return [];
  }
}

const nextConfig = {
  // Remove trailing slashes to match Next.js conventions
  // WordPress uses /slug/ but Next.js uses /slug
  trailingSlash: false,

  async redirects() {
    const blogRedirects = getBlogRedirects();

    return [
      // ── Manual redirects ──
      // /home -> / (homepage)
      { source: "/home", destination: "/", permanent: true },
      // /st-pete-homes-for-sale -> /st-petersburg-homes-for-sale (canonical)
      { source: "/st-pete-homes-for-sale", destination: "/st-petersburg-homes-for-sale", permanent: true },
      // /terms -> /terms-of-use
      { source: "/terms", destination: "/terms-of-use", permanent: true },
      // /privacy -> /privacy-policy
      { source: "/privacy", destination: "/privacy-policy", permanent: true },

      // ── WordPress nested city spoke pages → flat structure ──
      // WordPress used /city/city-topic/ but new site uses /city-topic
      // Catches patterns like /valrico/valrico-homes-with-pool/ → /valrico-homes-with-pool
      { source: "/:city/:city-:topic", destination: "/:city-:topic", permanent: true },

      // ── WordPress nested neighborhood pages → flat structure ──
      // WordPress used /city/neighborhood/ but new site uses /neighborhood
      { source: "/:city/:neighborhood", destination: "/:neighborhood", permanent: true },

      // ── WordPress Showcase IDX property pages ──
      // Old IDX used /properties/slug-name format. Bridge uses /properties/ListingKey.
      // Don't redirect — let the [id] route handle it. Old Showcase URLs will 404
      // naturally since they won't match a Bridge ListingKey.

      // ── Blog posts: /slug → /blog/slug (624 individual redirects) ──
      // WordPress served posts at root, new site nests under /blog/
      ...blogRedirects,
    ];
  },
  // Allow Bridge API listing photos and Showcase IDX images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.bridgedataoutput.com",
      },
      {
        protocol: "https",
        hostname: "images.showcaseidx.com",
      },
      {
        protocol: "https",
        hostname: "photos.stellarmls.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
