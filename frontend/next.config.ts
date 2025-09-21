import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint errors during production builds to avoid blocking on tooling config issues
    ignoreDuringBuilds: true,
  },
  // Point Next.js tracing to the monorepo root to avoid multiple lockfile warnings
  outputFileTracingRoot: path.join(__dirname, '..'),
  experimental: {
    serverComponentsExternalPackages: []
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001'
      }
    ]
  }
}

export default nextConfig