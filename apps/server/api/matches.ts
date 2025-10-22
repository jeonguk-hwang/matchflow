import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomUUID } from 'crypto'
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
  const verify = mod?.verify ?? mod?.default?.verify
  if (typeof verify !== 'function') throw new Error('jsonwebtoken.verify not available')
  return verify(token, secret)
}

/** ✅ 이 파일 안에 Matches 스토어를 내장 (동적 import/번들 누락 이슈 제거) */
const seed: Match[] = [
  { id: randomUUID(), event: 'BlackCombat 41', red: 'Kim A',  blue: 'Park B', status: 'scheduled' },
  { id: randomUUID(), event: 'BlackCombat 41', red: 'Lee C',  blue: 'Choi D', status: 'changed'   },
  { id: randomUUID(), event: 'BlackCombat 42', red: 'Jung E', blue: 'Han F',  status: 'scheduled' }
]
let memory: Match[] = [...seed]
const Matches = {
  list(): Match[] {
    return memory
  },
  create(input: Omit<Match, 'id'>): Match {
    const created: Match = { id: randomUUID(), ...input }
    memory = [created, ...memory]
    return created
  }
}

/** 디버그 응답 헬퍼 */
function sendError(res: VercelResponse, status: number, err: unknown, hint?: string) {
  const debug = process.env.DEBUG_ERRORS === '1'
  if (debug && err instanceof Error) {
    return res.status(status).json({ message: err.message, hint, stack: err.stack })
  }
  return res.status(status).json({ message: 'Internal Server Error' })
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

    // ✅ 인증
    const token = getBearerToken(req.headers.authorization as any)
    if (!token) {
      res.status(401).json({ message: 'No token' })
      return
    }
    const SECRET = process.env.JWT_SECRET || 'matchflow-dev-secret'
    try {
      await jwtVerify(token, SECRET)
    } catch {
      const debug = process.env.DEBUG_ERRORS === '1'
      res
        .status(401)
        .json(debug ? { message: 'Invalid token', hint: 'JWT verify failed (secret/alg?)' } : { message: 'Invalid token' })
      return
    }

    if (req.method === 'GET') {
      res.status(200).json(Matches.list())
      return
    }

    if (req.method === 'POST') {
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
  } catch (e) {
    return sendError(res, 500, e, 'Top-level handler error')
  }
}