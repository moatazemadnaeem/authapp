import type { NextConfig } from "next";

const nextConfig = {
  typescript: {
    // ⚠️ This allows production builds to complete even with type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Also ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
