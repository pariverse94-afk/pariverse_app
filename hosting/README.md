# Firebase Hosting — `pariverse-prod`

Source for <https://pariverse-prod.web.app>.

`delete-account/index.html` is the **account-deletion URL registered with Google Play**
(Data safety → Data deletion). It must stay publicly reachable without login. If it 404s,
the app is out of policy compliance.

This directory was reconstructed on 2026-08-11 by downloading the live page, which had been
deployed on 2026-07-29 without its source ever being committed. The captured file is
byte-identical to what is served (4297 bytes).

## Layout must not change casually

The live site's behaviour was probed before writing `firebase.json`:

| Path | Live response |
|---|---|
| `/delete-account` | 200 |
| `/delete-account/` | 200 |
| `/delete-account/index.html` | 301 → `/delete-account` |
| `/delete-account.html` | 404 |
| `/` | 404 |

The 404 on `.html` plus the 301 off `index.html` is what `cleanUrls: true` produces with the
file at `delete-account/index.html`. That is why the config looks the way it does. Moving the
file to a flat `delete-account.html` would change the served URL and break the Play link.

The root `/` returning 404 is existing behaviour, not a bug — no `index.html` is deployed.

## Deploying

```bash
npx firebase-tools deploy --only hosting
```

Then **immediately verify**:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://pariverse-prod.web.app/delete-account
```

Anything other than `200` means the deletion URL is down; roll back in the Firebase console
(Hosting → release history) before doing anything else.

## Known issue

The page is branded **"Parivaar"** throughout — title, headings, footer, and the email subject
line it instructs users to send. The Play package is `com.pariverse.app`. Confirm whether that
is an intentional rebrand before editing, and keep it consistent with the Play listing.
