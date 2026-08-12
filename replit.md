# Pariverse — Family App for Urban India

A mobile app built with Expo for nuclear families in urban India.

> **Naming:** `app.json` ships `name: "Pariverse"` and package `com.pariverse.app`. Some
> surfaces still say "Parivaar" (Hindi for "family"), including the live account-deletion
> page. Pick one and make it consistent — a mismatch between the Play listing and the
> deletion page is a policy risk.

## Architecture

**Monorepo (pnpm workspaces)**

- `artifacts/mobile` — Expo (SDK 54, expo-router v6) mobile app — the Play Store artifact
- `artifacts/mockup-sandbox` — Vite design sandbox, not shipped
- `hosting/` — Firebase Hosting; serves the Play-required account-deletion page
- `scripts` — misc workspace tooling

There is **no server tier**. The Express API, Postgres/Drizzle, OpenAPI codegen and the
Cloud Run deploy were deleted on 2026-08-11 after being dead since 2026-07-22.
See `.agents/memory/api-tier-removal.md`.

## Features

### 1. Home / Chore Assignment
- Family member management (parents + children)
- Daily/weekly chore assignment with colored avatars
- Progress bar showing completion rate
- AsyncStorage persistence

### 2. AI-Assisted Meal Planning (direct Groq call from the app)
- Weekly meal planner with Mon–Sun day tabs
- Inventory-aware suggestions using pantry items
- Dietary preferences (Vegetarian, Vegan, etc.)
- Nutritional goals (High Protein, Low Oil, etc.)
- Groq-powered Indian cuisine meal suggestions with Hindi names

### 3. Mom's Corner (Community)
- Social feed for moms with categories: Recipes, Parenting, Health, General
- Create, like, save posts
- Pre-seeded with realistic Indian parenting content
- AsyncStorage persistence

### 4. AI First Aid (direct streaming Groq call from the app)
- Grid of 10 common childhood conditions
- Streaming AI guidance from Groq
- Child age + severity inputs
- Emergency helpline references (108, 1800-180-1104)
- Medical disclaimer throughout

## AI Setup

Uses **Groq**, model `llama-3.3-70b-versatile`. Not Anthropic — older revisions of this file
said Claude and were wrong even then.

The mobile app calls `https://api.groq.com/openai/v1/chat/completions` **directly**, using
`EXPO_PUBLIC_GROQ_API_KEY` injected as an EAS secret.

> ⚠️ `EXPO_PUBLIC_*` values are compiled into the app bundle. The Groq key is therefore
> extractable from any shipped APK/AAB. Rotating it does not fix that on its own — the call
> has to move behind a server that holds the key. This is a known, accepted-for-now risk and
> the top open security item.

## Design System

**Color Palette (Warm Indian):**
- Primary: `#E07B39` (saffron orange)
- Secondary: `#2D6A4F` (forest green)
- Background: `#FFF8F0` (warm cream)
- Accent: `#C44B2B` (russet)
- Supports light + dark mode

**Typography:** Inter (400, 500, 600, 700)

## Mobile App Structure

```
app/
├── _layout.tsx          # Root stack + providers
├── (tabs)/
│   ├── _layout.tsx      # 4-tab navigator (NativeTabs or Tabs)
│   ├── index.tsx        # Home (chores + family)
│   ├── meals.tsx        # Meal planner
│   ├── community.tsx    # Mom's social feed
│   └── firstaid.tsx     # First aid categories
├── firstaid/
│   └── chat.tsx         # AI first aid chat (streaming)
└── meals/
    └── suggest.tsx      # AI meal suggestion generator
context/
├── FamilyContext.tsx    # Members + chores state
├── MealContext.tsx      # Meals + inventory state
└── CommunityContext.tsx # Posts state
components/
├── ChoreCard.tsx
├── MealCard.tsx
├── PostCard.tsx
└── ErrorBoundary.tsx
```

## Outbound calls

There are no first-party API routes. The app talks to three external services directly:

- **Firebase Auth** — Google Sign-In via the native module
- **Cloud Firestore** — local-first sync (`onSnapshot`); see
  `.agents/memory/local-first-firestore-sync.md`
- **Groq** — `https://api.groq.com/openai/v1/chat/completions`, for meals and first aid

## Environment Variables

All are `EXPO_PUBLIC_*` and are supplied by `artifacts/mobile/eas.json` or EAS secrets. They
are compiled into the bundle and are public by design — except the Groq key, which should not
be (see the AI Setup warning above).

- `EXPO_PUBLIC_FIREBASE_*` — project identifiers, safe to ship
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` — safe to ship
- `EXPO_PUBLIC_GROQ_API_KEY` — **a real credential, shipped in the binary**

`EXPO_PUBLIC_DOMAIN` still appears in the `development` and `preview` EAS profiles pointing at
dead Replit domains. Nothing reads it any more; it can be removed.

## Known Notes

- Supabase was fully removed. Any remaining reference to it in this file or elsewhere is stale.
- Mobile state is local-first Firestore; AsyncStorage is used for auth persistence.
- Account deletion: in-app screen at `app/delete-account.tsx` (mailto), plus the Play-required
  public page at <https://pariverse-prod.web.app/delete-account>, sourced from `hosting/`.
