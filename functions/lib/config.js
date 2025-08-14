"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_BASE_URL = exports.PLATFORM_FEE_PERCENT = exports.JWT_SIGNING_KEY = exports.STRIPE_WEBHOOK_SECRET = exports.STRIPE_SECRET_KEY = void 0;
const params_1 = require("firebase-functions/params");
exports.STRIPE_SECRET_KEY = (0, params_1.defineSecret)('STRIPE_SECRET_KEY');
exports.STRIPE_WEBHOOK_SECRET = (0, params_1.defineSecret)('STRIPE_WEBHOOK_SECRET');
exports.JWT_SIGNING_KEY = (0, params_1.defineSecret)('JWT_SIGNING_KEY');
exports.PLATFORM_FEE_PERCENT = (0, params_1.defineString)('PLATFORM_FEE_PERCENT');
exports.APP_BASE_URL = (0, params_1.defineString)('APP_BASE_URL');
//# sourceMappingURL=config.js.map