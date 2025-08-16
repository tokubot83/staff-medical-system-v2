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
  async headers() {
    return [
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'image/png',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
