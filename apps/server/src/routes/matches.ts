import type { Router } from 'express';
import type { Match } from '../../lib/types';
import { getBearerToken, verifyTokenString } from '../../lib/auth';
import { Matches } from '../../lib/matches';

export default function matchRoutes(router: Router) {
  router.get('/matches', (req, res) => {
    const token = getBearerToken(req.headers.authorization);
    if (!token) return res.status(401).json({ message: 'No token' });
    try {
      verifyTokenString(token);
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.json(Matches.list());
  });

  router.post('/matches', (req, res) => {
    const token = getBearerToken(req.headers.authorization);
    if (!token) return res.status(401).json({ message: 'No token' });
    try {
      verifyTokenString(token);
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const body = req.body as Omit<Match, 'id'>;
    if (!body?.event || !body?.red || !body?.blue || !body?.status) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const created = Matches.create(body);
    return res.status(201).json(created);
  });
}