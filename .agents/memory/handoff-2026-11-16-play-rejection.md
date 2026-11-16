# Handoff 2026-11-16 — Play production rejection, and moving to a new PC

Written when the project moved to a different laptop. It carries over context that lived only
on the old machine. Start here, then read `CLAUDE.md`.

## Where things stand

- **Work is on branch `chore/local-dev-setup`**, well ahead of `main`. Check it out; do not
  start from `main`.
- The app passed closed testing. The **production submission was rejected by Google Play for
  "disclosure policies"**. The exact wording of the rejection email was never seen — ask the
  owner for it before theorising further.
- **Likely cause:** in Play Console → App content → Target audience, under-13 age bands had
  been ticked ("it's a family chore app"). That makes the app child-directed and pulls in the
  Families policy, which it fails: Google Sign-In, a location permission, an open public feed,
  no age gate, no parental consent. Children never hold accounts — a parent signs in and adds
  them as family members — so **18 and over only** is the accurate answer.
- On 2026-11-16 the owner changed the target audience to 18+ and resubmitted. Status was
  "Changes in review" with no result yet. **Ask what Google replied.**

## Fixed in the repo (commit c822acd) — not in any build yet

- `expo-location` removed. Nothing imported it, but it put fine and coarse location in the
  manifest.
- Onboarding no longer says data is "synced via Supabase"; it names Google Firebase.
- The sign-in screen links the Terms of Service and Privacy Policy.

These need a new EAS production build to matter. Bump `android.versionCode` past 5 first.
The new sign-up links were typechecked but not seen running.

## Disclosure gaps still open

Ordered by how likely each is to be flagged on the next review.

1. **Privacy policy is behind the code.** Both the in-app copy (`artifacts/mobile/app/legal.tsx`)
   and `docs/pariverse-privacy-policy.md` omit:
   - health information — the first-aid screen sends a child's age, condition, severity and
     free text to Groq
   - photos — optional profile photos and post images
   - Firebase Storage and Google Cloud Vision (SafeSearch scans every upload)
   - post text being sent to Groq for category labelling
   - the fact that Mom's Corner is one feed readable by every signed-in user

   It also claims device info is collected "for crash reporting"; no crash reporter exists.
   The live hosted policy is what legally counts and its URL is not recorded in the repo —
   ask the owner where it is hosted.
2. **Data safety form and Health apps declaration** in Play Console must match the above.
   Not verifiable from the repo.
3. **Camera permission** comes from `expo-image-picker`, but the app only opens the gallery.
   Consider `android.blockedPermissions` in `app.json`.
4. **Community rules:** posts can be reported and are auto-hidden after enough distinct
   reports, but there is no way to block a user and no terms acceptance before posting.
5. **AI output** on the first-aid and meal screens has no report or flag control.
6. **Seed posts** in `context/CommunityContext.tsx` use invented author names, include health
   advice, and are not labelled as samples.
7. **Deletion page** (`hosting/delete-account/index.html`) is branded "Parivaar" throughout
   and does not mention photos. Deploying it is a live action — use the `firebase-deploy`
   skill.

## Files git does not carry

Copy by hand from the old PC. The repo is public, so never via GitHub.

- `artifacts/mobile/.env.local` — the `EXPO_PUBLIC_FIREBASE_*` values for local dev. They can
  be rebuilt from the `env` block in `artifacts/mobile/eas.json`.
- `MONETIZATION_ROADMAP.md` — gitignored, exists only on the old PC.
- `google-play-key.json` — was not on the old PC either. Needed only for `eas submit`.

## Owner context worth keeping

- **Goal:** real users, not more infrastructure work. Mom's Corner is meant to be the main
  way the app attracts users, so treat feed work as product work.
- **Warn before live actions.** The owner asked to be told in advance about anything that
  reaches installed apps: Firestore or Storage rules, Functions, Hosting, the Groq key,
  Firebase Auth config, Play Console. See the blast-radius table in `CLAUDE.md`.
- **Test hardware:** one Android 12 tablet and an iPhone, no Mac. A dev build shares the
  package name `com.pariverse.app` and replaces the Play build on the tablet. Expo Go cannot
  run this app (native Google Sign-In). The web target (`pnpm --filter @workspace/mobile
  dev:web`) is the quick loop but does not exercise native sign-in or permissions.
- **Emulator:** if used, pick a "Google Play" system image, or Google Sign-In fails in a way
  that looks like a code bug. The old PC could not host one comfortably (system drive full).
- **Admin service-account keys** for the Firebase project were found and revoked on
  2026-08-13; none should exist. Whether the Firebase web API key has application
  restrictions was never checked.
- The owner sometimes runs two agent sessions in the same checkout. Do not revert
  working-tree changes you cannot trace to your own actions.
