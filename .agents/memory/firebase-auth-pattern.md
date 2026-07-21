---
name: Firebase Auth migration pattern
description: Full-stack Firebase Auth replacing Supabase — mobile uses firebase JS SDK, API uses firebase-admin with ID token middleware
---

## Pattern

### Mobile (artifacts/mobile)
- `lib/firebase.ts` — initializes the Firebase app + `initializeAuth` with `getReactNativePersistence(AsyncStorage)`; guards against double-init with try/catch fallback to `getAuth(app)`
- `context/UserContext.tsx` — `onAuthStateChanged` drives session state; profile loaded from API (with Bearer token) then AsyncStorage fallback
- `app/login.tsx` — email/password via `createUserWithEmailAndPassword` / `signInWithEmailAndPassword`; Google sign-in via implicit flow through expo-web-browser; parses Firebase error codes into user-friendly messages

### API server (artifacts/api-server)
- `src/lib/firebase-admin.ts` — initializes admin SDK using `FIREBASE_SERVICE_ACCOUNT_JSON` env var (JSON string) or falls back to Application Default Credentials (automatic in Cloud Run)
- `src/middlewares/auth.ts` — `requireAuth` middleware verifies Bearer token, attaches `req.uid` and `req.userEmail`
- `src/routes/profile.ts` — GET/POST/DELETE /api/profile using `usersTable.firebaseUid` as the conflict target for upserts

### DB schema (lib/db)
- `users` table has `firebase_uid TEXT UNIQUE NOT NULL` + `email TEXT` (nullable)
- Migration generated at `lib/db/drizzle/0000_pretty_morgan_stark.sql`
- Run `pnpm --filter @workspace/db run push` after DATABASE_URL is configured

### Cloud Run (infra/main.tf)
- `FIREBASE_PROJECT_ID` env var set from `var.project_id`
- Service account uses Application Default Credentials — no service account JSON needed in Cloud Run

**Why:** Supabase Auth replaced because GCP migration uses Cloud SQL (not Supabase Postgres) and Firebase Auth integrates cleanly with Cloud Run via ADC.
