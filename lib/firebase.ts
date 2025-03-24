import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Ensure Firebase config is valid before initializing
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => Boolean(value));

if (!isFirebaseConfigured) {
  console.error('Firebase configuration is incomplete. Please check your environment variables.');
}

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db: Firestore = getFirestore(app);
// const storage = getStorage(app); // ✅ Corrected storage typing
let analytics: Analytics | null = null;

// Only initialize analytics in the browser
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, analytics };
