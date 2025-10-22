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
      // 토큰을 쿠키에 저장하면 미들웨어 보호 라우팅 동작
      document.cookie = `mf_token=${data.token}; path=/; max-age=${60*60*24*7}`
      location.href = '/'
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="container max-w-md mt-20">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-1">Welcome to MatchFlow</h1>
        <p className="opacity-70 mb-4">관리자 계정으로 로그인하세요.</p>
        <form onSubmit={onSubmit} className="grid gap-3">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-red-400">{error}</div>}
          <button className="btn" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  )
}