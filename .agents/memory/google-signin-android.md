---
name: Android Google Sign-In setup
description: Why Google blocks web-client OAuth in APKs, what the native fix requires, how to get the signing SHA-1 non-interactively
---
- Google shows "Access blocked: authorization error" when an app opens accounts.google.com with a WEB client id + custom-scheme redirect. **Why:** web client ids only allow registered https redirect URIs; Android app identity comes from the signing certificate, not a redirect.
- **How to apply:** native sign-in must use `@react-native-google-signin/google-signin` (v16 API: `signIn()` → `{type:"success"|"cancelled", data:{idToken}}`), configured with the WEB client id, then Firebase `signInWithCredential`. Keep it behind a `Platform.OS` check with a dynamic import — web bundle stays clean (verified via web export).
- Prereq: EAS keystore SHA-1 registered in Firebase (Android app → Add fingerprint), then re-download google-services.json. Valid only when it contains an `oauth_client` entry with `client_type: 1` and a `certificate_hash`.
- `eas credentials` is interactive-only (no --non-interactive). Get the SHA-1 by parsing the built APK's Signing Block v2: find EOCD → central-directory offset → magic "APK Sig Block 42" footer → pair id 0x7109871a → signer → signedData → first DER cert → sha1 digest. No keytool/apksigner needed.
- Play Store releases: Play App Signing re-signs with a DIFFERENT key — that SHA-1 must also be added to Firebase before store launch or sign-in breaks only in the store build.
- OAuth consent screen in Testing mode blocks every Google account not listed as a test user, even with a correct setup.
