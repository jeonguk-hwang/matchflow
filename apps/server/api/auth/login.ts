import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { User } from '../../lib/types'
import { signToken } from '../../lib/auth'
import { withCors } from '../../lib/cors'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (withCors(req, res)) return  // ✅ CORS & OPTIONS 처리

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

  const { email, password } = (req.body || {}) as { email?: string; password?: string }
  if (!email || !password) return res.status(400).json({ message: 'Invalid credentials' })

  const user: User = { id: 'u_1', email }
  const token = signToken(user)
  return res.status(200).json({ token, user })
}