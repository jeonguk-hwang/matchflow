import type { VercelRequest, VercelResponse } from '@vercel/node'

type User = { id: string; email: string }

/** ALLOWED_ORIGINS 파싱 + CORS 헤더 세팅 */
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

/** 안전한 jsonwebtoken sign 로더 (ESM/CJS 인터롭 대응) */
async function jwtSign(payload: any, secret: string, options?: Record<string, any>) {
  const mod: any = await import('jsonwebtoken')
  const sign =
    mod?.sign ??
    mod?.default?.sign // CJS를 ESM으로 import하면 default 밑에 존재할 수 있음
  if (typeof sign !== 'function') {
    throw new Error('jsonwebtoken.sign not available')
  }
  return sign(payload, secret, options)
}

/** body 파서 (Vercel Functions에서 req.body가 string일 수 있음) */
function parseBody<T = any>(req: VercelRequest): T {
  const b: any = (req as any).body
  if (typeof b === 'string') {
    try { return JSON.parse(b) as T } catch { /* fallthrough */ }
  }
  return b as T
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { allowed } = setCorsHeaders(req, res)

    // Preflight
    if (req.method === 'OPTIONS') {
      res.status(allowed ? 204 : 403).end()
      return
    }

    if (!allowed) {
      res.status(403).json({ message: 'CORS: Origin not allowed' })
      return
    }

    if (req.method !== 'POST') {
      res.status(405).json({ message: 'Method Not Allowed' })
      return
    }

    const { email, password } = parseBody<{ email?: string; password?: string }>(req) || {}
    if (!email || !password) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    const SECRET = process.env.JWT_SECRET || 'matchflow-dev-secret'
    const user: User = { id: 'u_1', email }
    const token = await jwtSign(user, SECRET, { expiresIn: '7d' })

    res.status(200).json({ token, user })
  } catch (e) {
    // 디버깅 시 아래 주석을 임시로 열어도 됨: res.status(500).json({ message: (e as Error).message })
    res.status(500).json({ message: 'Internal Server Error' })
  }
}