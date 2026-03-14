import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict mode is intentionally disabled while the R3F scene is being
  // stabilised (double-mount in dev breaks some Three.js lifecycle hooks).
  // Re-enable once Sprint 1 model integration is complete.
  reactStrictMode: false,
};

export default nextConfig;
