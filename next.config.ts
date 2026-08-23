import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project. Without it Turbopack walks up and
    // picks up a stray package-lock.json in the home directory.
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
