import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * CORS 헤더 세팅 + OPTIONS 프리플라이트 처리
 * @returns true면 이미 응답 완료(OPTIONS), 호출부에서 return
 */
export function withCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin as string | undefined
  const list = (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const allowAll = list.includes('*')
  const isAllowed = allowAll || (origin && list.includes(origin))

  if (isAllowed) {
    // 명시적 오리진 에코 + 캐시 분기
    res.setHeader('Access-Control-Allow-Origin', allowAll ? '*' : origin!)
    if (!allowAll) res.setHeader('Vary', 'Origin')
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return true
  }
  return false
}