import './globals.css'
import type { Metadata } from 'next'
import Providers from './providers' // ✅ 클라 전용 Provider로 감싸기

export const metadata: Metadata = { title: 'MatchFlow' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}