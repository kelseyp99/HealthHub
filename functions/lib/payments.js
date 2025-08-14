"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = void 0;
const functions = __importStar(require("firebase-functions"));
const stripe_1 = require("./stripe");
const firestore_1 = require("./firestore");
const config_1 = require("./config");
const http_1 = require("./http");
exports.createCheckoutSession = functions
    .region('us-central1')
    .https.onRequest(async (req, res) => {
    if ((0, http_1.withCors)(req, res))
        return;
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const { jobId, expertId, amountCents, currency = 'usd', userEmail } = req.body || {};
    if (!jobId || !expertId || !amountCents || !userEmail) {
        res.status(400).json({ error: 'missing_fields' });
        return;
    }
    try {
        const stripe = await (0, stripe_1.getStripe)();
        const expert = await (0, firestore_1.getExpert)(expertId);
        const job = await (0, firestore_1.getJob)(jobId);
        if (!(expert === null || expert === void 0 ? void 0 : expert.stripeConnectId)) {
            res.status(400).json({ error: 'expert_not_connected' });
            return;
        }
        const feePercent = parseFloat(config_1.PLATFORM_FEE_PERCENT.value() || '0.15');
        const fee = Math.round(amountCents * feePercent);
        const successBase = config_1.APP_BASE_URL.value() || 'https://example.com';
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            customer_email: userEmail,
            metadata: { jobId, expertId },
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: { name: (job === null || job === void 0 ? void 0 : job.title) || 'Consultation' },
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
        const paymentDoc = await (0, firestore_1.createPayment)({
            jobId,
            userId: job === null || job === void 0 ? void 0 : job.userId,
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
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'internal_error', details: e.message });
        return;
    }
});
//# sourceMappingURL=payments.js.map