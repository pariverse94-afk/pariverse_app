---
name: Legacy Supabase sync layer (dead but present)
description: Mobile contexts still call a deleted Supabase project; why it never crashes and what that means for features/policy claims.
---

**Rule:** The old Supabase project (`plmyqemtffqfegltehhw.supabase.co`) no longer resolves (DNS dead, verified July 2026), but FamilyContext, MealContext, and CommunityContext still call it as best-effort sync. Treat all family/meal/community data as **device-local only** (AsyncStorage), and Mom's Corner as **not shared between users** (seed posts + own local posts).

**Why:** The Firebase migration replaced auth only; the data-sync layer was never removed. supabase-js v2 builders *resolve* with `{ data: null, error }` instead of throwing on network failure, and every call site is optimistic-local-first with null-guarded destructures — so the dead backend causes zero crashes, only silent no-ops (and `ERR_NAME_NOT_RESOLVED` console noise in dev web, where the URL is empty because `.env.local` has no Supabase vars).

**How to apply:**
- Don't "fix" the console DNS errors by re-adding Supabase env vars — the project is gone.
- EAS server-side production env still stores stale `EXPO_PUBLIC_SUPABASE_URL`/`ANON_KEY` secrets that get baked into builds; harmless but should be deleted if the layer is ever ripped out.
- If cross-device / shared community features are requested, this layer must be replaced (e.g., Firestore or deployed API), not revived.
- Privacy policy currently lists only Firebase + Groq as processors — accurate *because* Supabase is dead; revisit if any sync backend is added.
