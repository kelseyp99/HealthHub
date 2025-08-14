import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';

function initAdmin() {
  if (!getApps().length) {
    initializeApp({ credential: applicationDefault() });
  }
}

export function db() {
  initAdmin();
  return getFirestore();
}

export async function getExpert(expertId: string) {
  const doc = await db().collection('experts').doc(expertId).get();
  return { id: doc.id, ...doc.data() } as any;
}

export async function setExpert(expertId: string, data: any) {
  await db().collection('experts').doc(expertId).set(data, { merge: true });
}

export async function getJob(jobId: string) {
  const doc = await db().collection('jobs').doc(jobId).get();
  return { id: doc.id, ...doc.data() } as any;
}

export async function createPayment(data: any) {
  const ref = await db().collection('payments').add(data);
  return { id: ref.id };
}

export async function updatePaymentBySessionId(sessionId: string, data: any) {
  const snap = await db().collection('payments').where('stripeSessionId', '==', sessionId).limit(1).get();
  const doc = snap.docs[0];
  if (!doc) return;
  await doc.ref.set(data, { merge: true });
}
