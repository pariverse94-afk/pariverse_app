import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { logger } from "./logger";

function initAdmin() {
  if (getApps().length > 0) return getApp();

  const projectId = process.env.FIREBASE_PROJECT_ID ?? "pariverse-prod";

  // In Cloud Run: Application Default Credentials (service account) are used automatically.
  // Locally: set GOOGLE_APPLICATION_CREDENTIALS to point to a service account JSON file,
  //   OR set FIREBASE_SERVICE_ACCOUNT_JSON to the JSON contents.
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      return initializeApp({ credential: cert(serviceAccount), projectId });
    } catch (err) {
      logger.warn({ err }, "Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON; falling back to ADC");
    }
  }

  // Application Default Credentials (works in Cloud Run automatically)
  return initializeApp({ projectId });
}

initAdmin();

export const adminAuth = getAuth();

/**
 * Verify a Firebase ID token and return the decoded claims.
 * Returns null if the token is invalid or missing.
 */
export async function verifyIdToken(token: string) {
  try {
    return await adminAuth.verifyIdToken(token, true);
  } catch {
    return null;
  }
}
