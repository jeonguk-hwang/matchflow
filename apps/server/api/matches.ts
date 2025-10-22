import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Match } from './_lib/types'   // ✅ 타입은 type-only import
import { withCors } from './_lib/cors'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (withCors(req, res)) return

  try {
    // ✅ 값 모듈만 동적 import
    const { getBearerToken, verifyTokenString } = await import('./_lib/auth')

    const token = getBearerToken(req.headers.authorization)
    if (!token) return res.status(401).json({ message: 'No token' })
    try {
      verifyTokenString(token)
    } catch {
      return res.status(401).json({ message: 'Invalid token' })
    }

    if (req.method === 'GET') {
      const { Matches } = await import('./_lib/matches')
      return res.status(200).json(Matches.list())
    }

    if (req.method === 'POST') {
      const { Matches } = await import('./_lib/matches')
      const body = req.body as Omit<Match, 'id'>
      if (!body?.event || !body?.red || !body?.blue || !body?.status) {
        return res.status(400).json({ message: 'Bad Request' })
      }
      const created = Matches.create(body)
      return res.status(201).json(created)
    }

    return res.status(405).json({ message: 'Method Not Allowed' })
  } catch {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}