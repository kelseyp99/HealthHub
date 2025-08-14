import * as functions from 'firebase-functions';
import { getStripe } from './stripe';
import { getExpert, setExpert } from './firestore';
import { withCors } from './http';

export const expertsConnect = functions
  .region('us-central1')
  .https.onRequest(async (req, res): Promise<void> => {
    if (withCors(req as any, res as any)) return;
    if (req.method !== 'POST') { res.status(405).send('Method Not Allowed'); return; }
    const { expertId } = req.body || {};
    if (!expertId) { res.status(400).json({ error: 'expertId required' }); return; }

    try {
      const stripe = await getStripe();
      const expert = await getExpert(expertId);

      let accountId = expert?.stripeConnectId;
      if (!accountId) {
        const account = await stripe.accounts.create({ type: 'express' });
        accountId = account.id;
        await setExpert(expertId, { stripeConnectId: accountId, status: 'pending' });
      }

      const origin = (req.headers.origin as string) || 'https://example.com';
      const link = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${origin}/connect/refresh`,
        return_url: `${origin}/connect/return`,
        type: 'account_onboarding'
      });

      res.json({ onboardingUrl: link.url, stripeConnectId: accountId });
      return;
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'internal_error', details: e.message });
      return;
    }
  });
