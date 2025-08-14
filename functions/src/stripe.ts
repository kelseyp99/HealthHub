import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from './config';

let stripeClient: Stripe | null = null;

export async function getStripe(): Promise<Stripe> {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY || (await STRIPE_SECRET_KEY.value());
    if (!key) throw new Error('Missing STRIPE_SECRET_KEY');
    stripeClient = new Stripe(key, { apiVersion: '2024-06-20' });
  }
  return stripeClient;
}

export function getStripeWebhookSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET || STRIPE_WEBHOOK_SECRET.value() || '';
}
