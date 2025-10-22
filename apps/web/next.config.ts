import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'

// 프로덕션에선 env 없으면 빌드 실패(오작동 방지)
if (isProd && !process.env.NEXT_PUBLIC_API_BASE) {
  throw new Error('NEXT_PUBLIC_API_BASE is required in production')
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // /api/* 로 들어온 요청을 로컬에선 http://localhost:4000/**:path*** 로 보냄
      // (중요) 로컬 Express는 /api prefix가 없으므로 목적지에서 /api 제거
      { source: '/api/:path*', destination: `${API_BASE}/:path*` }
    ]
  }
}
export default nextConfig