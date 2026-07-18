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
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://172.31.46.247:3001/:path*",
      },
    ];
  },
};

export default nextConfig;
