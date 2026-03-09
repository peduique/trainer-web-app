import type { NextConfig } from 'next';

// API upstream URL for server-side rewrites
// Must be configured in Vercel environment variables as API_UPSTREAM_URL
// For staging: https://lobster.element26-staging-2.staging.c66.me/api/v2
const apiUpstream = process.env.API_UPSTREAM_URL ?? 'http://localhost:3500';

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_ASANA_PAT: process.env.EXPO_PUBLIC_ASANA_PAT ?? process.env.NEXT_PUBLIC_ASANA_PAT,
    NEXT_PUBLIC_ASANA_PROJECT_GID:
      process.env.EXPO_PUBLIC_ASANA_PROJECT_GID ?? process.env.NEXT_PUBLIC_ASANA_PROJECT_GID,
    NEXT_PUBLIC_TRIAGE_FUNCTION_URL:
      process.env.EXPO_PUBLIC_TRIAGE_FUNCTION_URL ?? process.env.NEXT_PUBLIC_TRIAGE_FUNCTION_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
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
