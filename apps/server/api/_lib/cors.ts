import type { VercelRequest, VercelResponse } from '@vercel/node'

function toList(env?: string) {
  return (env ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
function matchOrigin(origin: string, pattern: string) {
  if (pattern === '*') return true
  if (pattern.includes('*')) {
    const esc = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*')
    return new RegExp(`^${esc}$`).test(origin)
  }
  return origin === pattern
}
function isAllowed(origin: string | undefined, list: string[]) {
  if (!origin) return false
  return list.some((p) => matchOrigin(origin, p))
}

/** 안정형 CORS (OPTIONS 항상 204, 와일드카드/정확매치 지원) */
export function withCors(req: VercelRequest, res: VercelResponse): boolean {
  try {
    const origin = (req.headers.origin as string | undefined) ?? ''
    const reqMethod =
      (req.headers['access-control-request-method'] as string | undefined) ?? 'GET,POST,OPTIONS'
    const reqHeaders =
      (req.headers['access-control-request-headers'] as string | undefined) ??
      'Content-Type, Authorization'

    const list = toList(process.env.ALLOWED_ORIGINS)
    const allowAll = list.length === 0 || list.includes('*')
    const allowed = allowAll || isAllowed(origin, list)

    res.setHeader('Access-Control-Allow-Methods', reqMethod)
    res.setHeader('Access-Control-Allow-Headers', reqHeaders)
    res.setHeader('Access-Control-Max-Age', '600')

    if (allowAll) {
      res.setHeader('Access-Control-Allow-Origin', '*')
    } else if (allowed && origin) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')
    }

    if (req.method === 'OPTIONS') {
      res.status(allowAll || allowed ? 204 : 403).end()
      return true
    }
    if (!allowAll && !allowed) {
      res.status(403).json({ message: 'CORS: Origin not allowed' })
      return true
    }
    return false
  } catch {
    if (req.method === 'OPTIONS') {
      res.status(204).end()
      return true
    }
    return false
  }
}