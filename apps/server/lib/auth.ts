import jwt from 'jsonwebtoken';
import type { User } from './types';

const SECRET = process.env.JWT_SECRET || 'matchflow-dev-secret';

export function signToken(user: User) {
  return jwt.sign(user, SECRET, { expiresIn: '7d' });
}

export function verifyTokenString(token: string) {
  return jwt.verify(token, SECRET);
}

export function getBearerToken(authorization?: string | string[]) {
  if (!authorization) return null;
  const header = Array.isArray(authorization) ? authorization[0] : authorization;
  return header?.startsWith('Bearer ') ? header.slice(7) : null;
}