# Firebase Auth Setup Guide

Firebase Auth is set up via the Firebase Console (no Terraform needed — Google manages it).

## Step 1 — Add Firebase to your GCP Project

1. Go to **console.firebase.google.com**
2. Click **"Add project"**
3. Select your existing GCP project (`YOUR_PROJECT_ID`) — this links Firebase to the same project
4. Disable Google Analytics (not needed)
5. Click **"Continue"** → **"Add Firebase"**

## Step 2 — Enable Authentication providers

1. In Firebase Console → **Build → Authentication → Get started**
2. Enable **Email/Password** (Sign-in method tab)
3. Enable **Google** sign-in:
   - Click Google → Enable
   - Set "Project support email" to your email
   - Click Save

## Step 3 — Get your Firebase config (for the mobile app)

1. Firebase Console → Project Settings (gear icon) → General
2. Scroll to "Your apps" → click **Add app** → choose **Android**
3. Android package name: `com.pariverse.app`
4. Download `google-services.json`
5. Place it at: `artifacts/mobile/google-services.json`

For iOS (when ready):
- Add an **iOS** app with bundle ID: `com.pariverse.app`
- Download `GoogleService-Info.plist`
- Place at: `artifacts/mobile/GoogleService-Info.plist`

## Step 4 — Get Firebase Admin credentials (for the API server)

The API server uses Firebase Admin SDK to verify auth tokens from the mobile app.

1. Firebase Console → Project Settings → **Service accounts**
2. Click **"Generate new private key"**
3. Save the JSON file — **do not commit it**
4. In GCP → Secret Manager, create a secret called `firebase-admin-key`
5. Paste the entire JSON as the secret value
6. The API server reads it from Secret Manager at startup

## Step 5 — Update Terraform (add Firebase Admin secret)

Add to `infra/main.tf` (I'll do this once you confirm Firebase is set up):

```hcl
resource "google_secret_manager_secret" "firebase_admin" {
  secret_id  = "firebase-admin-key"
  replication { auto {} }
}
```

## Mobile app changes needed

Once Firebase is set up, I'll update the mobile app to:
1. Replace `@supabase/supabase-js` auth calls with `@react-native-firebase/auth`
2. Keep all the data-fetching logic the same — only the auth layer changes
3. Remove `lib/supabase.ts` and replace with `lib/firebase.ts`
