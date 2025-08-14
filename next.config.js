/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Removed output: 'export' to support dynamic routes with client components
  images: {
    unoptimized: true,
  },
  basePath: process.env.BASE_PATH || '',
  assetPrefix: process.env.BASE_PATH || '',
};

module.exports = nextConfig;
