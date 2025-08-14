"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStripe = getStripe;
exports.getStripeWebhookSecret = getStripeWebhookSecret;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("./config");
let stripeClient = null;
async function getStripe() {
    if (!stripeClient) {
        const key = await config_1.STRIPE_SECRET_KEY.value();
        if (!key)
            throw new Error('Missing STRIPE_SECRET_KEY');
        stripeClient = new stripe_1.default(key, { apiVersion: '2024-06-20' });
    }
    return stripeClient;
}
function getStripeWebhookSecret() {
    return config_1.STRIPE_WEBHOOK_SECRET.value() || '';
}
//# sourceMappingURL=stripe.js.map