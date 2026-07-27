/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cavibe.onrender.com",
      },
    ],
  },
};

module.exports = nextConfig;