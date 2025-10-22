import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/', '/matches']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (PROTECTED.includes(pathname)) {
    const has = req.cookies.get('mf_token')?.value
    if (!has) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/', '/matches'] }