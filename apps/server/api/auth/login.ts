import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { User } from '../_lib/types'   // ✅ 타입은 type-only import (런타임 영향 없음)
import { withCors } from '../_lib/cors'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (withCors(req, res)) return

  try {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

    const { email, password } = (req.body || {}) as { email?: string; password?: string }
    if (!email || !password) return res.status(400).json({ message: 'Invalid credentials' })

    // ✅ 값 모듈만 동적 import
    const { signToken } = await import('../_lib/auth')

    const user: User = { id: 'u_1', email }
    const token = signToken(user)
    return res.status(200).json({ token, user })
  } catch {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}