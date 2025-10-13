import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // This helps with local development
  },
};

export default nextConfig;
