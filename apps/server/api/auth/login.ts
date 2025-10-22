import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withCors } from '../_lib/cors'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (withCors(req, res)) return

  try {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

    const { email, password } = (req.body || {}) as { email?: string; password?: string }
    if (!email || !password) return res.status(400).json({ message: 'Invalid credentials' })

    // ✅ jsonwebtoken이 프리플라이트에서 로드되지 않도록 런타임에 동적 import
    const { signToken } = await import('../_lib/auth')
    const { User } = await import('../_lib/types') // 타입 유지 겸 런타임 안전

    const user: InstanceType<typeof User> = { id: 'u_1', email } as any
    const token = signToken(user)
    return res.status(200).json({ token, user })
  } catch {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}