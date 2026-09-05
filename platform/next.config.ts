import type { NextConfig } from 'next';

/**
 * Deliberately not `output: 'export'`. This app exists because the rebate
 * platform needs route handlers and scheduled work, which a static export
 * cannot host.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
