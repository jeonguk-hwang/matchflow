import './globals.css'
import type { Metadata } from 'next'
import Providers from './providers'

export const metadata: Metadata = { title: 'MatchFlow' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="bg-black">
      {/* 전역 배경 데코: 은은한 그라디언트 + 레드 링 */}
      <body className="min-h-screen bg-black text-zinc-100 antialiased relative">
        <div className="pointer-events-none fixed inset-0 -z-10">
          {/* 중앙 그라디언트 */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-black" />
          {/* 레드 링/글로우 */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full border border-rose-700/10 blur-3xl" />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}