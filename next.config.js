/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Instead of "standalone"
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
