import type { NextConfig } from 'next';

const apiUpstream = process.env.API_UPSTREAM_URL ?? 'http://localhost:3500';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/v2/:path*',
        destination: `${apiUpstream}/api/v2/:path*`,
      },
    ];
  },
};

export default nextConfig;
