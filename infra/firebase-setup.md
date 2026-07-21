# Firebase Auth Setup Guide

Firebase Auth is set up via the Firebase Console (no Terraform needed — Google manages it).

## Step 1 — Add Firebase to your GCP Project ✅

1. Go to **console.firebase.google.com**
2. Click **"Add project"**
3. Select your existing GCP project (`pariverse-prod`) — this links Firebase to the same project
4. Disable Google Analytics (not needed)
5. Click **"Continue"** → **"Add Firebase"**

## Step 2 — Enable Authentication providers ✅

1. In Firebase Console → **Build → Authentication → Get started**
2. Enable **Email/Password** (Sign-in method tab)
3. Enable **Google** sign-in:
   - Click Google → Enable
   - Set "Project support email" to your email
   - Click Save

## Step 3 — Firebase config files ✅

Both config files have been placed in the repo:

| File | Location | Used by |
|------|----------|---------|
| `google-services.json` | `artifacts/mobile/google-services.json` | EAS Android builds |
| `GoogleService-Info.plist` | `artifacts/mobile/GoogleService-Info.plist` | EAS iOS builds |

`app.json` already references both files via `googleServicesFile`.

Key values extracted (already filled into `eas.json`):
- **Project ID:** `pariverse-prod`
- **Android app ID:** `1:51629814454:android:e6b62d27ca02907c0c2c17`
- **iOS app ID:** `1:51629814454:ios:e310e960e8b37e430c2c17`
- **Google Web Client ID** (for Google Sign-In): `51629814454-2mu91mq66nrk31lfn4434ll6p4r8clo4.apps.googleusercontent.com`
- **Messaging Sender ID:** `51629814454`
- **Storage bucket:** `pariverse-prod.firebasestorage.app`

## Step 4 — Firebase Admin credentials (API server) ✅

Service account key generated. The secret in GCP Secret Manager is called `firebase-admin-key`.

After running `terraform apply`, populate the secret with:

```bash
gcloud secrets versions add firebase-admin-key \
  --project pariverse-prod \
  --data-file=/path/to/your/serviceAccountKey.json
```

The Cloud Run service reads `FIREBASE_SERVICE_ACCOUNT_JSON` from Secret Manager at startup (already wired in `main.tf`).

## Step 5 — Deploy

```bash
# 1. Apply Terraform (creates Cloud Run, Cloud SQL, Secret Manager secrets)
cd infra
terraform init
terraform apply

# 2. Populate secrets
gcloud secrets versions add firebase-admin-key --project pariverse-prod --data-file=./serviceAccountKey.json
gcloud secrets versions add session-secret --project pariverse-prod --data-file=<(echo "YOUR_RANDOM_SECRET")

# 3. Build and push the API container
./deploy.sh

# 4. Run DB migration
./drizzle-migrate.sh

# 5. Build the mobile APK for testing
cd ../artifacts/mobile
eas build --platform android --profile preview
```

## Remaining steps before production

- [ ] Replace `EXPO_PUBLIC_DOMAIN` in `eas.json` with the actual Cloud Run URL (shown after `terraform apply`)
- [ ] Submit AAB to Google Play: `eas build --platform android --profile production` then `eas submit`
- [ ] Add an iOS app to Firebase Console once you have an Apple Developer account
