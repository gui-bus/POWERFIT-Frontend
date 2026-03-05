import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.figma.com",
      },
    ],
  },
};

export default nextConfig;
