import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Mission patches — imgbox
      {
        protocol: "https",
        hostname: "images2.imgbox.com",
      },
      {
        protocol: "https",
        hostname: "images.imgbox.com",
      },
      // Flickr (launch photos on detail pages)
      {
        protocol: "https",
        hostname: "live.staticflickr.com",
      },
      {
        protocol: "https",
        hostname: "*.staticflickr.com",
      },
      // Wikipedia (sometimes used in rocket images)
      {
        protocol: "https",
        hostname: "*.wikipedia.org",
      },
      {
        protocol: "https",
        hostname: "*.wikimedia.org",
      },
      // Imgur (older SpaceX assets)
      {
        protocol: "https",
        hostname: "imgur.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
};

export default nextConfig;