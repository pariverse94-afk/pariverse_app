# Pariverse — agent working notes

Family app for urban India: an Expo mobile app plus a few Firebase Cloud Functions for
community moderation. There is no API of our own. Package `com.pariverse.app` on Google Play:
closed testing passed, but the **production submission was rejected on disclosure policy**
(2026-11). Read
[`.agents/memory/handoff-2026-11-16-play-rejection.md`](.agents/memory/handoff-2026-11-16-play-rejection.md)
first — it has the current state and the open items.

Product/feature detail lives in [docs/product.md](docs/product.md) — read it for what the app *does*.
This file is for how to *work on* it.

## Repo layout (pnpm workspaces)

| Path | What |
|---|---|
| `artifacts/mobile` | Expo SDK 54 app, expo-router v6 — **the Play Store artifact** |
| `hosting/` | Firebase Hosting — serves the **Play-required account-deletion page** |
| `functions/` | Cloud Functions (Node 22, `asia-south1`) — image SafeSearch scan, post-image cleanup, post classification via Groq, auto-hide on reports |
| `firestore.rules`, `storage.rules` | The access-control layer for Firestore and uploaded images |
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

Expo app → Firebase Auth + Cloud Firestore (direct, local-first) + Firebase Storage (profile
and post images) and → Groq (direct, for meals and first aid). Cloud Functions react to
Firestore and Storage events: Cloud Vision SafeSearch on uploads, Groq for post categories.
The app never calls a function directly. No API of our own.

## Blast radius — check before you act

The app is live on Play. **Repo edits cannot reach an installed build**; the shipped AAB is
frozen. Runtime services can, immediately and with no review:

| Reaches live users at once | Cannot affect them |
|---|---|
| Deploying Firestore or Storage rules | Any source/config/doc edit |
| Deploying Cloud Functions | |
| Revoking/rotating the Groq key | `.env.local`, `package.json`, lockfile |
| Firestore data-shape changes | `eas.json` (shapes *future* builds only) |
| Firebase Auth / API-key config | |
| Deploying Firebase Hosting | |
| Play Console changes | |

**Say so and get confirmation before doing anything in the left column.**

The exception that inverts this: once EAS Update ships in a build, JS changes published to
that channel reach users automatically. Not configured yet as of 2026-08-13.

## Tooling

- **`firebase-deploy` skill** — use for *any* Firebase deploy. Enforces diff-live-vs-repo,
  dry-run, confirmation, and post-deploy verification.
- **`play-compliance` skill** — run before every production build or Play submission.
- **`security-audit` agent** — read-only sweep for shipped secrets and rules weaknesses.

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

For local dev the quick loop is the web target: `pnpm --filter @workspace/mobile dev:web`.
`dev` needs an installed development build. Both need the `EXPO_PUBLIC_FIREBASE_*` vars in
`artifacts/mobile/.env.local`, which is gitignored — copy the values from the `env` block in
`eas.json` (see the Firebase RN auth init entry in `MEMORY.md`).

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
  parts of `docs/product.md` say "Parivaar". Resolve this — a deletion page branded as a different
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
