import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
      AUTH0_SECRET: process.env.AUTH0_SECRET,
      APP_BASE_URL: process.env.APP_BASE_URL,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  },
  output: 'standalone',
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'graph.facebook.com',
      'platform-lookaside.fbsbx.com',
      'graph.microsoft.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'graph.microsoft.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
