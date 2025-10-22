'use client'
import { useState, FormEvent } from 'react'
import { api } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@matchflow.dev')
  const [password, setPassword] = useState('admin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      document.cookie = `mf_token=${data.token}; path=/; max-age=${60*60*24*7}`
      location.href = '/'
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="container section">
      <div className="grid md:grid-cols-2 items-stretch gap-6">
        {/* Left: 브랜드/히어로 패널 (md 이상에서만 표시) */}
        <div className="hidden md:flex relative overflow-hidden rounded-2xl border border-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-black" />
          <div className="absolute -left-24 top-0 h-full w-2/3 -rotate-6 bg-gradient-to-r from-rose-600/20 to-transparent" />
          <div className="relative p-10 flex flex-col justify-end">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-500">OFFICIAL OPERATIONS SUITE</p>
            <h1 className="mt-2 text-5xl font-extrabold leading-[1.05]">
              MATCH<span className="text-rose-600">FLOW</span>
            </h1>
            <p className="mt-3 text-zinc-300">
              블랙컴뱃 스타일 운영 툴 — 매치카드 변경, 공지, 알림을 한 곳에서.
            </p>
          </div>
        </div>

        {/* Right: 로그인 카드 */}
        <div className="flex items-center">
          <div className="w-full card">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold">Sign in</h2>
              <p className="opacity-70 text-sm mt-1">관리자 계정으로 로그인하세요.</p>
            </div>

            <form onSubmit={onSubmit} className="grid gap-3">
              <label className="grid gap-2">
                <span className="text-sm opacity-80">Email</span>
                <input
                  className="input"
                  placeholder="admin@matchflow.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm opacity-80">Password</span>
                <input
                  className="input"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </label>

              {error && <div className="text-rose-400 text-sm">{error}</div>}

              <button className="btn border-rose-700 text-rose-500 hover:bg-rose-700/10 mt-2" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              {/* 서브 액션 */}
              <div className="flex items-center justify-between pt-2 text-sm opacity-70">
                <span>계정 문의: 운영팀</span>
                <a href="/" className="hover:opacity-100">돌아가기</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 모바일 전용 브랜드 바 */}
      <div className="md:hidden mt-6 text-center text-sm text-zinc-400">
        <span className="font-bold">MATCH<span className="text-rose-600">FLOW</span></span> — For Black Combat style operations
      </div>
    </div>
  )
}