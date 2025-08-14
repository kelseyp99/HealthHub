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
exports.grantAccessToken = void 0;
const functions = __importStar(require("firebase-functions"));
const firestore_1 = require("./firestore");
const jwt_1 = require("./jwt");
const http_1 = require("./http");
exports.grantAccessToken = functions
    .region('us-central1')
    .https.onRequest(async (req, res) => {
    if ((0, http_1.withCors)(req, res))
        return;
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const { jobId, expertId } = req.body || {};
    if (!jobId || !expertId) {
        res.status(400).json({ error: 'missing_fields' });
        return;
    }
    const snap = await (0, firestore_1.db)().collection('payments')
        .where('jobId', '==', jobId)
        .where('expertId', '==', expertId)
        .where('status', '==', 'succeeded')
        .limit(1)
        .get();
    if (snap.empty) {
        res.status(403).json({ error: 'payment_required' });
        return;
    }
    const token = await (0, jwt_1.signAccessToken)(expertId, jobId, ['read']);
    res.json({ token });
    return;
});
//# sourceMappingURL=access.js.map