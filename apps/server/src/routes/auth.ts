import type { Router } from 'express';
import type { User } from '../types';
import { signToken } from '../middleware/auth';

export default function authRoutes(router: Router) {
  router.post('/auth/login', (req, res) => {
    const { email, password } = req.body as { email: string; password: string };
    if (email && password) {
      const user: User = { id: 'u_1', email };
      const token = signToken(user);
      return res.json({ token, user });
    }
    return res.status(400).json({ message: 'Invalid credentials' });
  });
}