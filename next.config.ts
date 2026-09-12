import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the original field-day type-build setting; verify types separately.
  // Next.js 16 removed the obsolete `eslint` configuration option.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
