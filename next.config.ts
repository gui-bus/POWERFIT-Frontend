import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.figma.com",
      },
      {
        hostname: "*.ufs.sh"
      },
      {
        hostname: "lh3.googleusercontent.com"
      },
      {
        hostname: "images.unsplash.com"
      },
      {
        hostname: "utfs.io"
      }
    ],
  },
};

export default nextConfig;
