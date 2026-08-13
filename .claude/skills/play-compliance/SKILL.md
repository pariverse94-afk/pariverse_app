---
name: play-compliance
description: Pre-release audit for the Google Play listing — account-deletion URL, Data safety accuracy, privacy-policy sub-processors, app naming, and versionCode. Run before any production build or Play submission, and whenever a change touches deletion, data collection, or a third-party service.
---

# Google Play compliance audit

Package `com.pariverse.app`. Run this **before** a production build or a Play submission, not
after. Report findings as pass/fail with evidence — never assert a pass you did not check.

## 1. Account-deletion URL must return 200 without login

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://pariverse-prod.web.app/delete-account
```

Anything but `200` is a live policy violation. Source is in `hosting/`; see the
`firebase-deploy` skill before touching it — the `cleanUrls` layout is load-bearing.

Google requires **both** paths, and they are not substitutes:
- the public web URL above (Play Console → Data safety → Data deletion)
- the in-app screen at `artifacts/mobile/app/delete-account.tsx`

Note the in-app flow is a `mailto:` to `pariverse94@gmail.com` with a 30-day promise — it is
**manual**. Every missed email is a breach. Flag this if user numbers are growing.

## 2. Naming consistency — known open issue

`app.json` ships `name: "Pariverse"`, but the live deletion page is branded **"Parivaar"**
throughout, including the email subject line it tells users to send. A deletion page that
appears to belong to a different app is a plausible reviewer flag.

Check `app.json`, `hosting/delete-account/index.html`, `replit.md`, and the Play listing agree.

## 3. Privacy policy must name the real sub-processors

The policy has been wrong before: it named **Anthropic Claude** when the app actually calls
**Groq** (`llama-3.3-70b-versatile`). Verify the policy lists exactly what is true today:

- Google Firebase (Auth, Firestore, Hosting)
- Groq — AI meal planning and first-aid guidance
- anything added since (e.g. Sentry, if crash reporting has landed)

`docs/pariverse-privacy-policy.md` is the repo copy; the live policy is hosted elsewhere and
is the one that legally matters. **Adding a new third-party service without updating the
policy first is the actual violation** — not the code change.

## 4. Data safety declarations must match behaviour

The app collects: name, family name, email, children's ages, meal plans, community posts, and
first-aid queries (health-adjacent — treat carefully). Anything sent to Groq leaves the
device. Confirm the Data safety form reflects this, especially after any feature adding a new
field or a new outbound call.

## 5. versionCode

```bash
node -e "console.log(require('./artifacts/mobile/app.json').expo.android.versionCode)"
```

Play rejects duplicates. Bump before every production build; bump `version` too for a
user-visible release. Confirm against Play Console → App bundle explorer rather than assuming
the repo is in sync — `versionCode` is a binary integer in the AAB manifest and is not
reliably greppable.

## 6. Track

`eas.json` → `submit.production.android.track` is `internal`. Closed and open testing are
**different tracks**. Confirm the intended track deliberately; do not assume the current value
is right.

## Related

- Secrets shipped in the binary: use the `security-audit` agent.
- Deploying the hosted page: use the `firebase-deploy` skill.
