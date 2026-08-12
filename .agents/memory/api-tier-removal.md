# The API tier was removed — don't resurrect it by accident

**Date:** 2026-08-11. **Scope:** `artifacts/api-server`, `artifacts/web`, `lib/*` (all of it),
`infra/`, `Dockerfile`, `railway.toml`, `.github/workflows/deploy.yml`, `supabase/`.

## Why this happened

The Express API was real once. Mobile called it via `useGenerateMealPlan` from
`@workspace/api-client-react` from 2026-04-30 (`21982c2`). It went dark in four days, all by
Replit Agent commits, and nobody wrote it down:

| Date | Commit | Effect |
|---|---|---|
| 2026-07-21 | `813b50f` | Last commit ever to touch `artifacts/api-server` |
| 2026-07-22 | `d95fde7` | Mobile switched to calling `api.groq.com` directly; last API hook removed |
| 2026-07-23 | `319ad8d` | Groq key placeholder pulled from `eas.json` |
| 2026-07-24 | `c91f0d3` | `EXPO_PUBLIC_DOMAIN` deleted from the `production` EAS profile |

With no `EXPO_PUBLIC_DOMAIN` in `production`, `setBaseUrl` was never called, `_baseUrl` stayed
`null`, and every generated hook would have issued a relative URL — unresolvable on native.
The API was unreachable from the shipped app for ~3 weeks before deletion.

## The actual architecture now

Expo app → Firebase Auth + Cloud Firestore (direct, local-first `onSnapshot` sync).
Expo app → Groq `llama-3.3-70b-versatile` (direct).
No server tier. No Postgres. No OpenAPI/Orval codegen.

## Things that will bite you

- **The AI provider is Groq, not Anthropic.** `replit.md` and old docs said Claude. They were
  wrong even before deletion — `ai.ts` imported `groq-sdk`. Both Anthropic workspace packages
  (`lib/integrations-anthropic-ai` and an orphaned no-`package.json` copy at
  `lib/integrations/anthropic_ai_integrations`) were dead code.
- **The Groq API key ships inside the AAB** as `EXPO_PUBLIC_GROQ_API_KEY`, injected via EAS
  secrets. `EXPO_PUBLIC_*` is compiled into the bundle and is extractable from the APK.
  Rotating it changes nothing on its own — the call has to move server-side first. This was
  knowingly left in place; it is the top open security item.
- **The account-deletion page is on Firebase Hosting**, not Cloud Run:
  <https://pariverse-prod.web.app/delete-account>, source now in `hosting/`. It is the URL
  registered with Google Play. If it 404s the app is out of policy compliance.
  See `hosting/README.md` — the `cleanUrls` layout is load-bearing.
- **`artifacts/web` was not the live website.** The live `mummaverse.com` is built with
  Hostinger Website Builder (`x-powered-by: HostingerWebsiteBuilder`) and shares no markup
  with the deleted React/Vite app. The repo copy was an abandoned fork, last touched
  2026-06-12. Its privacy page also named the wrong AI sub-processor.
- **Cloudflare Pages was never wired to anything.** Two conflicting `wrangler.toml` files
  existed (root used `pages_build_output_dir`, `artifacts/web/` used `[assets]`), same project
  name, no CI referencing either.

## If a backend ever comes back

Everything is recoverable from git history — nothing was force-pushed. But check
`.github/workflows/deploy.yml` in history before rebuilding CI: it used Workload Identity
Federation, not a long-lived GCP key, and that part was correct.

Do not restore `POST /api/db/setup`. It was public, unauthenticated, and executed arbitrary
SQL via a Supabase RPC. `/api/ai/*` and `/api/invite` were also unauthenticated behind a
wide-open `cors()`.
