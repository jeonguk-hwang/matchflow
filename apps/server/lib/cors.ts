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

/**
 * 안정형 CORS 처리:
 * - 어떤 상황에서도 OPTIONS는 204로 빠르게 종료
 * - 요청 헤더를 에코하여 브라우저 요구를 충족
 * - ALLOWED_ORIGINS 없으면 기본 '*' 허용(필요 시 환경변수로 제한)
 */
export function withCors(req: VercelRequest, res: VercelResponse): boolean {
  try {
    const origin = (req.headers.origin as string | undefined) ?? ''
    const reqMethod =
      (req.headers['access-control-request-method'] as string | undefined) ?? 'GET,POST,OPTIONS'
    const reqHeaders =
      (req.headers['access-control-request-headers'] as string | undefined) ??
      'Content-Type, Authorization'

    const list = toList(process.env.ALLOWED_ORIGINS)
    const allowAll = list.length === 0 || list.includes('*') // 기본: 광역 허용
    const allowed = allowAll || isAllowed(origin, list)

    // 공통 헤더
    res.setHeader('Access-Control-Allow-Methods', reqMethod)
    res.setHeader('Access-Control-Allow-Headers', reqHeaders)
    res.setHeader('Access-Control-Max-Age', '600')

    if (allowAll) {
      res.setHeader('Access-Control-Allow-Origin', '*')
    } else if (allowed && origin) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')
    }

    // 프리플라이트 즉시 종료 (허용 안 되면 403)
    if (req.method === 'OPTIONS') {
      res.status(allowAll || allowed ? 204 : 403).end()
      return true
    }

    // 실제 요청 차단
    if (!allowAll && !allowed) {
      res.status(403).json({ message: 'CORS: Origin not allowed' })
      return true
    }

    return false
  } catch {
    // 어떤 에러도 프리플라이트에서는 막지 않도록 204로 종료
    if (req.method === 'OPTIONS') {
      res.status(204).end()
      return true
    }
    // 실제 요청은 일반 500 처리
    return false
  }
}