---
name: firebase-deploy
description: Safely deploy Firestore rules, indexes, or Hosting to pariverse-prod. Use whenever a deploy to Firebase is requested or implied — it enforces diff-before-deploy, dry-run, explicit confirmation, and post-deploy verification. Also use to just READ what is currently live without deploying.
---

# Deploying to Firebase safely

**This project has no server tier.** Firestore rules are the entire security model, and the
Hosting page at `/delete-account` is a Google Play compliance requirement. Both reach live
users the instant they deploy — there is no build step, no review, no rollout percentage.

Never deploy without walking these steps in order.

## 1. Say what the blast radius is, and stop

Before running anything that writes, tell the user plainly:

- **Rules:** enforced server-side immediately. A rule the shipped app violates causes silent
  permission-denied errors for every installed build, including versions you can't update.
- **Hosting:** a bad deploy takes `https://pariverse-prod.web.app/delete-account` offline. That
  is the account-deletion URL registered with Google Play — an outage is a policy violation,
  not just a broken page.

Then get explicit confirmation. Do not batch this with other work.

## 2. Diff live against the repo — always

The Firebase CLI has **no** `firestore:rules get`. Use the Rules API. The CLI's stored refresh
token can be exchanged for an access token (the client id/secret below are the well-known
public pair embedded in the open-source firebase-tools):

```js
const c = require(require('os').homedir() + '/.config/configstore/firebase-tools.json');
// POST https://oauth2.googleapis.com/token
//   client_id=563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com
//   client_secret=j9iVZfS8kkCEFUPaAeJV0sAi
//   refresh_token=<c.tokens.refresh_token>&grant_type=refresh_token
// GET  https://firebaserules.googleapis.com/v1/projects/pariverse-prod/releases
// GET  https://firebaserules.googleapis.com/v1/projects/pariverse-prod/rulesets/<id>
```

**Never print the token.** Write it to a scratchpad file, use it, delete it.

### Compare semantically, not visually

A raw `diff` between a repo file and a live ruleset will show **every line as changed** —
CRLF-vs-LF plus the fact that deploys strip comments. That looks like a total rewrite and is
almost always noise. Normalize before concluding anything:

```bash
norm(){ sed -e 's|//.*$||' -e 's/[[:space:]]\+/ /g' -e 's/^ //' -e 's/ $//' "$1" \
        | tr -d '\r' | grep -v '^$'; }
norm firestore.rules > /tmp/repo.n && norm live.rules > /tmp/live.n && diff -u /tmp/repo.n /tmp/live.n
```

If they differ, **the live version is the truth about user data right now**. Understand the
difference and say so before overwriting — the repo is not automatically correct.

## 2b. Run the rules tests

```bash
pnpm test:rules      # scripts/test-firestore-rules.mjs
```

**No emulator and no JDK needed** — it posts the ruleset plus simulated requests to
`firebaserules.googleapis.com` and asks what the rules would decide. Nothing is written and
nothing is deployed. Earlier notes claiming rules testing was blocked on installing a JDK were
wrong; that only applies to the local emulator.

Any failure blocks the deploy. Add a case whenever you add a rule — the suite is only worth
what it covers.

## 3. Dry run

```bash
firebase deploy --only firestore:rules --project pariverse-prod --dry-run
```

Compiles rules and reads indexes without deploying. Must exit 0.

## 4. Deploy, only after confirmation

```bash
firebase deploy --only firestore:rules --project pariverse-prod
firebase deploy --only hosting --project pariverse-prod
```

## 5. Verify immediately

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://pariverse-prod.web.app/delete-account
```

Anything but `200` means the compliance page is down — roll back in the Firebase console
(Hosting → release history) **before doing anything else**.

For rules, re-fetch the live ruleset and re-run the normalized diff to confirm it now matches.

## Project specifics

- Project: `pariverse-prod`. Config: `firebase.json` (hosting + firestore + emulators).
- `hosting/` layout is **load-bearing**: the file is at `delete-account/index.html` with
  `cleanUrls: true`. Flattening it to `delete-account.html` changes the served URL and breaks
  the Play link. `.gitattributes` marks `hosting/** -text` so autocrlf can't corrupt it.
- The root `/` returning 404 is expected — only `/delete-account` is deployed.
- `firestore.indexes.json` is intentionally empty. The app issues one query
  (`orderBy("createdAt","desc")` + `limit`), served by the automatic single-field index.
- Rules are covered by `pnpm test:rules` (Rules API, no emulator). The *local emulator* still
  needs a JDK, but nothing here depends on it.
