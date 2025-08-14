"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = db;
exports.getExpert = getExpert;
exports.setExpert = setExpert;
exports.getJob = getJob;
exports.createPayment = createPayment;
exports.updatePaymentBySessionId = updatePaymentBySessionId;
const firestore_1 = require("firebase-admin/firestore");
const app_1 = require("firebase-admin/app");
function initAdmin() {
    if (!(0, app_1.getApps)().length) {
        (0, app_1.initializeApp)({ credential: (0, app_1.applicationDefault)() });
    }
}
function db() {
    initAdmin();
    return (0, firestore_1.getFirestore)();
}
async function getExpert(expertId) {
    const doc = await db().collection('experts').doc(expertId).get();
    return { id: doc.id, ...doc.data() };
}
async function setExpert(expertId, data) {
    await db().collection('experts').doc(expertId).set(data, { merge: true });
}
async function getJob(jobId) {
    const doc = await db().collection('jobs').doc(jobId).get();
    return { id: doc.id, ...doc.data() };
}
async function createPayment(data) {
    const ref = await db().collection('payments').add(data);
    return { id: ref.id };
}
async function updatePaymentBySessionId(sessionId, data) {
    const snap = await db().collection('payments').where('stripeSessionId', '==', sessionId).limit(1).get();
    const doc = snap.docs[0];
    if (!doc)
        return;
    await doc.ref.set(data, { merge: true });
}
//# sourceMappingURL=firestore.js.map