import { getApps, initializeApp, cert, getApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;

if (!getApps().length) {
  // Prefer GOOGLE_APPLICATION_CREDENTIALS when set (managed by hosting/CI),
  // otherwise use env-provided service account JSON.
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    const credential = cert(JSON.parse(serviceAccountJson));
    adminApp = initializeApp({ credential });
  } else {
    adminApp = initializeApp();
  }
} else {
  adminApp = getApp();
}

export const firestoreAdmin = getFirestore(adminApp);
