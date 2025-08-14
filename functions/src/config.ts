import { defineSecret, defineString } from 'firebase-functions/params';

export const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
export const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');
export const JWT_SIGNING_KEY = defineSecret('JWT_SIGNING_KEY');
export const PLATFORM_FEE_PERCENT = defineString('PLATFORM_FEE_PERCENT');
export const APP_BASE_URL = defineString('APP_BASE_URL');
