import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY            ?? "",
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? "",
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID         ?? "pariverse-prod",
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID              ?? "",
};

// Every value above falls back to "", which makes a missing env file surface as
// confusing auth errors deep in a sign-in flow rather than as a clear setup
// problem. Fail loudly in dev instead. Production keeps the silent fallback so a
// release can never hard-crash on startup over this.
if (__DEV__ && (!firebaseConfig.apiKey || !firebaseConfig.appId)) {
  throw new Error(
    "Firebase config is missing. Copy artifacts/mobile/.env.example to " +
      ".env.local, fill in the values, and restart the dev server — Expo only " +
      "reads .env.local at startup, so a hot reload will not pick it up.",
  );
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// On web, Firebase automatically uses localStorage persistence — getAuth() is enough.
// On native, we wire AsyncStorage persistence via initializeAuth().
// getReactNativePersistence is not exported from firebase/auth's web TypeScript types,
// so we access it via require() which Metro resolves to the react-native bundle.
let _auth: ReturnType<typeof getAuth>;

if (Platform.OS === "web") {
  _auth = getAuth(app);
} else {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
    const { getReactNativePersistence } = require("firebase/auth") as any;
    _auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // initializeAuth already called on hot-reload — reuse the existing auth instance.
    _auth = getAuth(app);
  }
}

export const auth = _auth;
export default app;
