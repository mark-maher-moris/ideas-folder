/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Disable static export due to Server Actions incompatibility
  // output: 'export',
  distDir: '.next',
  output: 'standalone',
};

module.exports = nextConfig;
