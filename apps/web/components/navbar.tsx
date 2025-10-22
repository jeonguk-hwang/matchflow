'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const onLogout = () => {
    document.cookie = 'mf_token=; path=/; max-age=0'
    location.href = '/login'
  }
  const isActive = (href: string) => pathname === href

  return (
    <header className="header">
      <div className="container flex items-center gap-3 py-3">
        <Link href="/" className="brand text-xl">
          MATCH<span className="brand-accent">FLOW</span>
        </Link>
        <nav className="ml-auto hidden md:flex items-center gap-1">
          <Link href="/" className={`navlink ${isActive('/') ? 'navlink-active' : ''}`}>Dashboard</Link>
          <Link href="/matches" className={`navlink ${isActive('/matches') ? 'navlink-active' : ''}`}>Matches</Link>
          <button className="btn ml-2" onClick={onLogout}>Logout</button>
        </nav>
        {/* Mobile menu button */}
        <button className="md:hidden btn" aria-label="Toggle menu" onClick={() => setOpen(v => !v)}>
          메뉴
        </button>
      </div>
      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden border-t border-zinc-900">
          <div className="container py-3 grid gap-2">
            <Link href="/" className={`navlink ${isActive('/') ? 'navlink-active' : ''}`} onClick={() => setOpen(false)}>Dashboard</Link>
            <Link href="/matches" className={`navlink ${isActive('/matches') ? 'navlink-active' : ''}`} onClick={() => setOpen(false)}>Matches</Link>
            <button className="btn w-fit" onClick={onLogout}>Logout</button>
          </div>
        </div>
      )}
    </header>
  )
}
