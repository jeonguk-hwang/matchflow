import type { Router } from 'express';
import type { User } from '../../lib/types';
import { signToken } from '../../lib/auth';

export default function authRoutes(router: Router) {
  router.post('/auth/login', (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) return res.status(400).json({ message: 'Invalid credentials' });

    const user: User = { id: 'u_1', email };
    const token = signToken(user);
    return res.json({ token, user });
  });
}