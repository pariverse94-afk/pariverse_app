# Play Store – Google Sign-In Setup

Google sign-in on Android is tied to the app's **signing certificate**. When you publish through the Play Store, Google Play re-signs your app bundle with its own key (Play App Signing). That key's SHA-1 must also be registered in Firebase **before** your first store release, or sign-in will silently break only for store users.

The EAS keystore SHA-1 (used for preview/development APKs) is already registered. This guide covers adding the Play App Signing SHA-1.

---

## Prerequisites

- Your first **app bundle** must have been uploaded to Google Play Console at least once (the SHA-1 is generated on first upload).

---

## Step 1 – Get the Play App Signing SHA-1

1. Open [Google Play Console](https://play.google.com/console/) → select **Parivaar**.
2. Navigate to **Setup → App signing**.
3. Under **"App signing key certificate"**, copy the **SHA-1 certificate fingerprint** (looks like `AB:CD:12:34:…`).

---

## Step 2 – Add the SHA-1 to Firebase

1. Open [Firebase Console](https://console.firebase.google.com/) → project **pariverse-prod**.
2. Go to **Project settings → Your apps** → Android app (`com.pariverse.app`).
3. Click **Add fingerprint**.
4. Paste the SHA-1 and click **Save**.

---

## Step 3 – Download and commit the updated google-services.json

1. On the same Firebase page, click **Download google-services.json**.
2. Replace `artifacts/mobile/google-services.json` with the downloaded file.
3. Verify the file now contains **two** `oauth_client` entries with `"client_type": 1` — one for the EAS keystore SHA-1 and one for the Play App Signing SHA-1.
4. Commit the updated file:
   ```bash
   git add artifacts/mobile/google-services.json
   git commit -m "chore: add Play App Signing SHA-1 to google-services.json"
   ```

---

## Step 4 – Build and verify

Run a production build:
```bash
eas build --platform android --profile production
```

Install the resulting AAB (or submit to an internal track), sign in with Google, and confirm it succeeds.

---

## Current state of google-services.json

The file at `artifacts/mobile/google-services.json` currently has **one** Android OAuth client (`client_type: 1`) with the EAS keystore SHA-1 (`e8f7b305086d440a800a1533c22ed6f86b3c121d`). After completing the steps above it will have a second entry for the Play App Signing certificate.
