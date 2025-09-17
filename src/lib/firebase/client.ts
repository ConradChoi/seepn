import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyASzdiCKdch8POhtC-HhV_11PuYrz9bZYQ',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'seepn-4820b.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'seepn-4820b',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'seepn-4820b.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '1030435231887',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:1030435231887:web:bc175d873a5eae1f6678fa',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-X4N826K3H3',
} as const;

// Initialize client app only on the client bundles that actually import this.
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const firestoreClient = getFirestore(firebaseApp);


