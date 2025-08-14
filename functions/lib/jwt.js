"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
async function signAccessToken(expertId, jobId, perms = ['read'], ttlSeconds = 3600) {
    const key = await config_1.JWT_SIGNING_KEY.value();
    if (!key)
        throw new Error('Missing JWT_SIGNING_KEY');
    const now = Math.floor(Date.now() / 1000);
    const payload = { sub: expertId, jobId, perms, iat: now, exp: now + ttlSeconds };
    return jsonwebtoken_1.default.sign(payload, key, { algorithm: 'HS256' });
}
//# sourceMappingURL=jwt.js.map