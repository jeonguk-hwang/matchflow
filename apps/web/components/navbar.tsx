'use client'
import Link from 'next/link'

export default function Navbar() {
  const onLogout = () => {
    document.cookie = 'mf_token=; path=/; max-age=0'
    location.href = '/login'
  }
  return (
    <div className="container">
      <div className="nav">
        <Link href="/">Dashboard</Link>
        <Link href="/matches">Matches</Link>
        <div className="ml-auto flex items-center gap-2">
          <span className="badge">admin@matchflow.dev</span>
          <button className="btn" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  )
}