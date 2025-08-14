import jwt from 'jsonwebtoken';
import { JWT_SIGNING_KEY } from './config';

export async function signAccessToken(expertId: string, jobId: string, perms: string[] = ['read'], ttlSeconds = 3600) {
  const key = process.env.JWT_SIGNING_KEY || (await JWT_SIGNING_KEY.value());
  if (!key) throw new Error('Missing JWT_SIGNING_KEY');
  const now = Math.floor(Date.now() / 1000);
  const payload = { sub: expertId, jobId, perms, iat: now, exp: now + ttlSeconds };
  return jwt.sign(payload, key, { algorithm: 'HS256' });
}
