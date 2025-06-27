/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cashmoney.monster',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Cache headers for static assets
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  env: {
    CONFIG_ID: '003',
    CONFIG_NAME: 'cashmoney monster',
    GCL_ENDPOINT: 'https://www.submitlead.com/cash/1.6/',
    GCL_SOURCE_ID: process.env.GCL_SOURCE_ID,
    GCL_PARTNER: process.env.GCL_PARTNER,
  },
  
  // Allow development origins
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '0.0.0.0', 
    '167.71.91.24',
    'cashmoney.monster',
    '172.21.99.160'
  ],
  
  // Necessary for framer-motion with newer Next.js
  transpilePackages: ['framer-motion'],
  
  // Configure webpack
  webpack(config, { isServer, dev }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    
    // Bundle optimizations for production
    if (!dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Configure Turbopack
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname)
    }
  }
};

module.exports = nextConfig;