# Pariverse — agent working notes

Family app for urban India. **Expo mobile app only — there is no server tier.** Shipping on
Google Play (package `com.pariverse.app`, currently in **closed testing**).

Product/feature detail lives in [replit.md](replit.md) — read it for what the app *does*.
This file is for how to *work on* it.

## Repo layout (pnpm workspaces)

| Path | What |
|---|---|
| `artifacts/mobile` | Expo SDK 54 app, expo-router v6 — **the Play Store artifact** |
| `artifacts/mockup-sandbox` | Vite design sandbox, not shipped |
| `hosting/` | Firebase Hosting — serves the **Play-required account-deletion page** |
| `scripts` | Misc workspace tooling |
| `.agents/memory/` | **Hard-won debugging knowledge — read before touching build/auth/sync** |

The Express API, Postgres/Drizzle, OpenAPI codegen, Cloud Run, Terraform and the Cloudflare
Pages config were **deleted on 2026-08-11** after being dead since 2026-07-22. Before
proposing to "reconnect the backend" or restore any of it, read
[`.agents/memory/api-tier-removal.md`](.agents/memory/api-tier-removal.md) — it explains what
was removed, why, and which parts must never come back as they were.

## Read `.agents/memory/` first

`.agents/memory/MEMORY.md` indexes short notes on problems already solved here
(Metro `_tmp_` crashes, Firebase RN auth init, EAS Gradle debugging, Android Google Sign-In,
local-first Firestore sync, the API tier removal).

These encode failures that cost real time. Check the index before debugging anything in
those areas, and add a note when you solve a new one.

## Architecture in one line

Expo app → Firebase Auth + Cloud Firestore (direct, local-first) and → Groq (direct).
Nothing else. No API of our own.

## Commands

Package manager is **pnpm** and the root `preinstall` hard-fails under npm/yarn. Never run
`npm install` here. If `pnpm` is not on PATH, `corepack pnpm@10 …` works — pin **10**, since
the lockfile is `lockfileVersion 9.0` and pnpm 11 may rewrite it.

```bash
pnpm install
pnpm typecheck          # per-package typecheck across artifacts/* and scripts
pnpm build              # typecheck + recursive build
```

Mobile (`artifacts/mobile`):

```bash
pnpm --filter @workspace/mobile typecheck
pnpm exec expo export --platform android   # proves Metro still resolves
```

The mobile `dev` script is written for Replit (`$REPLIT_DEV_DOMAIN`, `$PORT`) and will not
run as-is on Windows. For local dev use `pnpm exec expo start` from `artifacts/mobile` with
the `EXPO_PUBLIC_FIREBASE_*` vars supplied via `.env.local` (see the Firebase RN auth init
entry in `MEMORY.md`).

## Release path (Play Store)

Builds go through **EAS**, not local Gradle. `artifacts/mobile/eas.json` defines
`development` / `preview` / `production` profiles; production builds an `app-bundle`.

Before any production build, bump **`android.versionCode`** in
`artifacts/mobile/app.json` — Play rejects a duplicate versionCode. Bump `version` too
when it is a user-visible release. Current: `version 1.0.0`, `versionCode 5`.

`submit.production.android.track` is currently `internal`. Closed testing is a *different*
track — change this deliberately, don't assume it is right.

`google-play-key.json` (the submit service account) is gitignored and must never be
committed. This repo is **public**.

## Play compliance — don't break these

- **Account-deletion URL:** <https://pariverse-prod.web.app/delete-account>, source in
  `hosting/`. Must return 200 without login. Read `hosting/README.md` before touching it —
  the `cleanUrls` layout is load-bearing, and a bad deploy takes the page offline.
- The app also has an in-app deletion screen at `artifacts/mobile/app/delete-account.tsx`.
  Both are required; they are not substitutes for each other.
- **Naming is inconsistent:** `app.json` ships `name: "Pariverse"`, but the deletion page and
  parts of `replit.md` say "Parivaar". Resolve this — a deletion page branded as a different
  app is a plausible policy flag.

## Secrets posture

This repository is public. Before committing, assume anything added is world-readable.

- `google-services.json` / `GoogleService-Info.plist` are **intentionally tracked** —
  they are project identifiers, not private keys. Security lives in Firebase rules.
- Most `EXPO_PUBLIC_*` values (including the Firebase web API key in `eas.json`) are shipped
  inside the app binary and are public by design. Not a leak.
- **Exception — `EXPO_PUBLIC_GROQ_API_KEY` is a real credential shipped in the binary.**
  It is injected via EAS secrets, but `EXPO_PUBLIC_*` is compiled into the bundle and is
  extractable from any AAB. Rotating it alone fixes nothing; the call must move behind a
  server that holds the key. **Top open security item.**
- Anything else that *is* a credential — service accounts, keystores, `.env`, Play signing
  keys — stays out of git and goes in EAS secrets or GitHub Actions secrets.

## CI

**There is none.** `.github/workflows/deploy.yml` deployed the API to Cloud Run and was
deleted with it. Nothing builds, tests, or deploys on push.

Mobile ships only via an explicit EAS build + submit. A PR typecheck workflow would be a
sensible addition and does not exist yet.

## Conventions

- Design system is warm-Indian: primary `#E07B39`, secondary `#2D6A4F`, background
  `#FFF8F0`, accent `#C44B2B`. Light + dark both supported. Typography: Inter.
- Data layer is **local-first Firestore sync**. Supabase was fully removed; treat any
  remaining reference to it as stale.
- Context providers must reset state on `uid` change (shared-device privacy) but must not
  reset on cold start. See the `local-first-firestore-sync` memory note.
