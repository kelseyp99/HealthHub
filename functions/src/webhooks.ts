import * as functions from 'firebase-functions';
import { getStripe, getStripeWebhookSecret } from './stripe';
import { updatePaymentBySessionId, db } from './firestore';
import type Stripe from 'stripe';

export const stripeWebhook = functions
  .region('us-central1')
  .https.onRequest(async (req, res): Promise<void> => {
    const rawBody = (req as any).rawBody;
    const sig = req.headers['stripe-signature'] as string;

    try {
  const stripe = await getStripe();
  const webhookSecret = getStripeWebhookSecret();
  const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret) as Stripe.Event;

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        await updatePaymentBySessionId(session.id, {
          status: 'succeeded',
          paymentIntentId: session.payment_intent
        });
        if (session.metadata?.jobId) {
          await db().collection('jobs').doc(session.metadata.jobId).set({ status: 'paid' }, { merge: true });
        }
      }

  res.json({ received: true });
  return;
    } catch (e: any) {
      console.error(e);
  res.status(400).send(`Webhook Error: ${e.message}`);
  return;
    }
  });
