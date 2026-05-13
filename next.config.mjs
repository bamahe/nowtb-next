/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
};

export default nextConfig;
