import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors or circular references in flat config.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
