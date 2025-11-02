import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
// @ts-ignore - getReactNativePersistence is available at runtime in 'firebase/auth' for React Native
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Support both dev (expo go) and EAS builds where extra may be on different fields
const extra = (Constants as any).expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};
const config = (extra as any)?.firebase;
if (!config) {
  // eslint-disable-next-line no-console
  console.warn('Firebase config missing in app.json extra');
}

const app = getApps().length ? getApps()[0]! : initializeApp(config || {});

// Initialize Auth with React Native persistence; fall back to getAuth if already initialized
let authInstance: ReturnType<typeof getAuth> | undefined;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch {
  authInstance = getAuth(app);
}
export const auth = authInstance;
// Firestore Web SDK in React Native doesn't support IndexedDB persistence.
// Use initializeFirestore with long polling to improve reliability on RN/Expo.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
});
