import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.APP_SURFACE === "admin" ? ".next-admin" : ".next",
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};

export default nextConfig;
