import type { VercelRequest, VercelResponse } from '@vercel/node'

type User = { id: string; email: string }

/** 간단한 ALLOWED_ORIGINS 파서 */
function parseAllowed(): string[] {
  const raw = process.env.ALLOWED_ORIGINS || ''
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

/** 정확매치 전용(운영 도메인/로컬 커버). 와일드카드가 필요하면 패턴 매칭 추가 가능 */
function isAllowedOrigin(origin: string | undefined, list: string[]) {
  if (!origin) return false
  if (list.length === 0) return true // 비어있으면 전부 허용(*)
  return list.includes(origin)
}

/** 공통 CORS 헤더 세팅 */
function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined
  const list = parseAllowed()
  const allowAll = list.length === 0 || list.includes('*')
  const allowed = allowAll || isAllowedOrigin(origin, list)

  // 요청 헤더/메서드 에코
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { allowed } = setCorsHeaders(req, res)

    // ✅ 프리플라이트는 무조건 여기서 끝낸다
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

    const { email, password } = (req.body || {}) as { email?: string; password?: string }
    if (!email || !password) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    // ✅ jsonwebtoken은 POST 처리 시에만 동적 로드 (프리플라이트/모듈 로딩 영향 없음)
    const jwt = await import('jsonwebtoken')

    const user: User = { id: 'u_1', email }
    const SECRET = process.env.JWT_SECRET || 'matchflow-dev-secret'
    const token = jwt.sign(user, SECRET, { expiresIn: '7d' })

    res.status(200).json({ token, user })
  } catch {
    // 어떤 예외도 500으로 마무리
    res.status(500).json({ message: 'Internal Server Error' })
  }
}