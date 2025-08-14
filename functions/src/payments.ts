import * as functions from 'firebase-functions';
import { getStripe } from './stripe';
import { getExpert, getJob, createPayment } from './firestore';
import { PLATFORM_FEE_PERCENT, APP_BASE_URL } from './config';
import { withCors } from './http';

export const createCheckoutSession = functions
  .region('us-central1')
  .https.onRequest(async (req, res): Promise<void> => {
    if (withCors(req as any, res as any)) return;
    if (req.method !== 'POST') { res.status(405).send('Method Not Allowed'); return; }
    const { jobId, expertId, amountCents, currency = 'usd', userEmail } = req.body || {};
    if (!jobId || !expertId || !amountCents || !userEmail) {
  res.status(400).json({ error: 'missing_fields' });
  return;
    }

    try {
      const stripe = await getStripe();
      const expert = await getExpert(expertId);
      const job = await getJob(jobId);
  if (!expert?.stripeConnectId) { res.status(400).json({ error: 'expert_not_connected' }); return; }

  const feePercent = parseFloat(process.env.PLATFORM_FEE_PERCENT || PLATFORM_FEE_PERCENT.value() || '0.15');
      const fee = Math.round(amountCents * feePercent);

  const successBase = process.env.APP_BASE_URL || APP_BASE_URL.value() || 'https://example.com';

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: userEmail,
  metadata: { jobId, expertId },
        line_items: [
          {
            price_data: {
              currency,
              product_data: { name: job?.title || 'Consultation' },
              unit_amount: amountCents
            },
            quantity: 1
          }
        ],
        payment_intent_data: {
          application_fee_amount: fee,
          transfer_data: { destination: expert.stripeConnectId }
        },
        success_url: `${successBase}/success?sid={CHECKOUT_SESSION_ID}`,
        cancel_url: `${successBase}/cancel`
      });

      const paymentDoc = await createPayment({
        jobId,
        userId: job?.userId,
        expertId,
        stripeSessionId: session.id,
        amountCents,
        feeCents: fee,
        currency,
        status: 'pending',
        createdAt: Date.now()
      });

  res.json({ checkoutUrl: session.url, sessionId: session.id, paymentId: paymentDoc.id });
  return;
    } catch (e: any) {
      console.error(e);
  res.status(500).json({ error: 'internal_error', details: e.message });
  return;
    }
  });
