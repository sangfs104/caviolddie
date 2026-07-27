import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cavibe.onrender.com",
      },
    ],
  },
};

export default nextConfig;