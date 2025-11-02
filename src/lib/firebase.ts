import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import Constants from 'expo-constants';

const config = (Constants.expoConfig?.extra as any)?.firebase;
if (!config) {
  // eslint-disable-next-line no-console
  console.warn('Firebase config missing in app.json extra');
}

const app = getApps().length ? getApps()[0]! : initializeApp(config || {});
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence where supported
enableIndexedDbPersistence(db).catch(() => {
  /* noop */
});
