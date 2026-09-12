import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Field-day setting: a type or lint error must never be the reason a demo
  // fails to deploy at 13:45. Fix them, but do not let them block the build.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
