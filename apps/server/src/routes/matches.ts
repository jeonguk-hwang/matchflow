import type { Router } from 'express';
import type { Match } from '../types';
import { verifyToken } from '../middleware/auth';
import { nanoid } from 'nanoid';

const memory: Match[] = [
  { id: nanoid(8), event: 'BlackCombat 41', red: 'Kim A', blue: 'Park B', status: 'scheduled' },
  { id: nanoid(8), event: 'BlackCombat 41', red: 'Lee C', blue: 'Choi D', status: 'changed' },
  { id: nanoid(8), event: 'BlackCombat 42', red: 'Jung E', blue: 'Han F', status: 'scheduled' }
];

export default function matchRoutes(router: Router) {
  router.get('/matches', verifyToken, (_req, res) => {
    return res.json(memory);
  });

  router.post('/matches', verifyToken, (req, res) => {
    const body = req.body as Omit<Match, 'id'>;
    const created: Match = { id: nanoid(8), ...body };
    memory.unshift(created);
    return res.status(201).json(created);
  });
}