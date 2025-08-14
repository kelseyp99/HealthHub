import * as functions from 'firebase-functions';
import { db } from './firestore';
import { signAccessToken } from './jwt';
import { withCors } from './http';

export const grantAccessToken = functions
  .region('us-central1')
  .https.onRequest(async (req, res): Promise<void> => {
    if (withCors(req as any, res as any)) return;
    if (req.method !== 'POST') { res.status(405).send('Method Not Allowed'); return; }
    const { jobId, expertId } = req.body || {};
    if (!jobId || !expertId) { res.status(400).json({ error: 'missing_fields' }); return; }

    const snap = await db().collection('payments')
      .where('jobId', '==', jobId)
      .where('expertId', '==', expertId)
      .where('status', '==', 'succeeded')
      .limit(1)
      .get();

  if (snap.empty) { res.status(403).json({ error: 'payment_required' }); return; }
    const token = await signAccessToken(expertId, jobId, ['read']);
  res.json({ token });
  return;
  });
