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
exports.expertsConnect = void 0;
const functions = __importStar(require("firebase-functions"));
const stripe_1 = require("./stripe");
const firestore_1 = require("./firestore");
const http_1 = require("./http");
exports.expertsConnect = functions
    .region('us-central1')
    .https.onRequest(async (req, res) => {
    if ((0, http_1.withCors)(req, res))
        return;
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const { expertId } = req.body || {};
    if (!expertId) {
        res.status(400).json({ error: 'expertId required' });
        return;
    }
    try {
        const stripe = await (0, stripe_1.getStripe)();
        const expert = await (0, firestore_1.getExpert)(expertId);
        let accountId = expert === null || expert === void 0 ? void 0 : expert.stripeConnectId;
        if (!accountId) {
            const account = await stripe.accounts.create({ type: 'express' });
            accountId = account.id;
            await (0, firestore_1.setExpert)(expertId, { stripeConnectId: accountId, status: 'pending' });
        }
        const origin = req.headers.origin || 'https://example.com';
        const link = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${origin}/connect/refresh`,
            return_url: `${origin}/connect/return`,
            type: 'account_onboarding'
        });
        res.json({ onboardingUrl: link.url, stripeConnectId: accountId });
        return;
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'internal_error', details: e.message });
        return;
    }
});
//# sourceMappingURL=experts.js.map