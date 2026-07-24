import { Platform } from "react-native";
import {
  collection,
  doc,
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase/firestore";
import app from "@/lib/firebase";

// Firestore over WebChannel needs long-polling auto-detection on React Native.
// initializeFirestore throws if called twice (hot reload) — fall back to the
// existing instance in that case.
let _db: Firestore;
try {
  _db =
    Platform.OS === "web"
      ? initializeFirestore(app, {})
      : initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
} catch {
  _db = getFirestore(app);
}

export const db = _db;

/** users/{uid} — private profile document (name, familyName, email). */
export const userDoc = (uid: string) => doc(db, "users", uid);

/**
 * users/{uid}/data/{name} — per-user app data, one document per domain:
 * "family" (members + chores), "meals" (plan + inventory + prefs),
 * "community" (liked/saved/hidden post ids).
 */
export const userDataDoc = (uid: string, name: "family" | "meals" | "community") =>
  doc(db, "users", uid, "data", name);

/**
 * emailIndex/{email} — exact-match lookup "is this email registered?".
 * Rules allow `get` only (no listing), so users can check a specific
 * address without being able to enumerate accounts.
 */
export const emailIndexDoc = (email: string) =>
  doc(db, "emailIndex", email.trim().toLowerCase());

/** Shared Mom's Corner posts. */
export const postsCollection = () => collection(db, "communityPosts");
export const postDoc = (id: string) => doc(db, "communityPosts", id);

/** UGC reports — create-only for clients, reviewed in the Firebase console. */
export const reportsCollection = () => collection(db, "reports");

/** Firestore rejects `undefined` field values — strip them via JSON round-trip. */
export function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
