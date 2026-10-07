import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@dermo/types', '@dermo/schemas'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/auth/login',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/auth/signup',
        destination: '/book-demo',
        permanent: false,
      },
      {
        source: '/auth',
        destination: '/login',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/auth/:path*',
        destination: `${apiBase}/api/auth/:path*`,
      },
      {
        source: '/api/v1/:path*',
        destination: `${apiBase}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
