/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirects for pages that should point to equivalent pages
  async redirects() {
    return [
      // /home -> / (homepage)
      { source: "/home", destination: "/", permanent: true },
      // /st-pete-homes-for-sale -> /st-petersburg-homes-for-sale (canonical)
      { source: "/st-pete-homes-for-sale", destination: "/st-petersburg-homes-for-sale", permanent: true },
      // /terms -> /terms-of-use
      { source: "/terms", destination: "/terms-of-use", permanent: true },
      // /privacy -> /privacy-policy
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      // /first-time-home-buyer-guide also exists as /guides/first-time-home-buyer-guide
      // Keep both active (catch-all handles the non-/guides/ version)
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
