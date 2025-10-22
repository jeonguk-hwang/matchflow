import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Match } from './_lib/types'
import { getBearerToken, verifyTokenString } from './_lib/auth'
import { Matches } from './_lib/matches'
import { withCors } from './_lib/cors'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (withCors(req, res)) return

  try {
    const token = getBearerToken(req.headers.authorization)
    if (!token) return res.status(401).json({ message: 'No token' })
    try {
      verifyTokenString(token)
    } catch {
      return res.status(401).json({ message: 'Invalid token' })
    }

    if (req.method === 'GET') {
      return res.status(200).json(Matches.list())
    }
    if (req.method === 'POST') {
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