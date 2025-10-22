import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Match } from './_lib/types'

/** CORS 헤더 세팅 (로그인과 동일한 방식) */
function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined
  const raw = process.env.ALLOWED_ORIGINS || ''
  const list = raw.split(',').map(s => s.trim()).filter(Boolean)
  const allowAll = list.length === 0 || list.includes('*')
  const allowed = allowAll || (!!origin && list.includes(origin))

  const reqMethod =
    (req.headers['access-control-request-method'] as string | undefined) ?? 'GET,POST,OPTIONS'
  const reqHeaders =
    (req.headers['access-control-request-headers'] as string | undefined) ??
    'Content-Type, Authorization'

  res.setHeader('Access-Control-Allow-Methods', reqMethod)
  res.setHeader('Access-Control-Allow-Headers', reqHeaders)
  res.setHeader('Access-Control-Max-Age', '600')

  if (allowAll) {
    res.setHeader('Access-Control-Allow-Origin', '*')
  } else if (allowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }

  return { allowed: allowAll || allowed }
}

/** Authorization 헤더에서 Bearer 토큰 추출 */
function getBearerToken(authorization?: string | string[]) {
  if (!authorization) return null
  const header = Array.isArray(authorization) ? authorization[0] : authorization
  return header?.startsWith('Bearer ') ? header.slice(7) : null
}

/** 안전한 jsonwebtoken verify (ESM/CJS 인터롭 대응) */
async function jwtVerify(token: string, secret: string) {
  const mod: any = await import('jsonwebtoken')
  const verify =
    mod?.verify ??
    mod?.default?.verify
  if (typeof verify !== 'function') throw new Error('jsonwebtoken.verify not available')
  return verify(token, secret)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { allowed } = setCorsHeaders(req, res)

    // ✅ 프리플라이트는 여기서 종료
    if (req.method === 'OPTIONS') {
      res.status(allowed ? 204 : 403).end()
      return
    }

    if (!allowed) {
      res.status(403).json({ message: 'CORS: Origin not allowed' })
      return
    }

    // ✅ 인증 (동적 import 사용)
    const token = getBearerToken(req.headers.authorization as any)
    if (!token) {
      res.status(401).json({ message: 'No token' })
      return
    }
    const SECRET = process.env.JWT_SECRET || 'matchflow-dev-secret'
    try {
      await jwtVerify(token, SECRET)
    } catch {
      res.status(401).json({ message: 'Invalid token' })
      return
    }

    if (req.method === 'GET') {
      const { Matches } = await import('./_lib/matches')
      res.status(200).json(Matches.list())
      return
    }

    if (req.method === 'POST') {
      const { Matches } = await import('./_lib/matches')
      const body = req.body as Omit<Match, 'id'>
      if (!body?.event || !body?.red || !body?.blue || !body?.status) {
        res.status(400).json({ message: 'Bad Request' })
        return
      }
      const created = Matches.create(body)
      res.status(201).json(created)
      return
    }

    res.status(405).json({ message: 'Method Not Allowed' })
  } catch {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}