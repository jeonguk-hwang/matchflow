import type { NextConfig } from 'next'

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000' // dev 기본값

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_BASE}/api/:path*` }
    ]
  }
}
export default nextConfig