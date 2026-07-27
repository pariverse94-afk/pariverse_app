---
name: Local-first Firestore sync
description: Patterns/pitfalls for the AsyncStorage-cache + Firestore onSnapshot sync layer (family/meals/community) and shared-device account switching.
---

## Sync model
- Per-user data = ONE Firestore doc per domain (`users/{uid}/data/{family|meals|community}`), arrays inside. Local mutations apply synchronously via refs (`membersRef`/`stateRef`/`meRef`) then `setDoc` the whole doc fire-and-forget. `onSnapshot` applies remote state; listeners never write back (no echo loops).
- One-time device→cloud migration: inside the snapshot listener, upload local state only when doc `!exists` AND `!snap.metadata.fromCache` (server-confirmed empty) with a per-effect guard flag. The fromCache check prevents clobbering cloud data while offline.

## Account-switch isolation (shared family devices) — CRITICAL
**Rule:** every data provider must reset in-memory state AND remove its AsyncStorage keys when uid changes from a previously non-null value; cold start (null→uid) must NOT reset.
**Why:** providers stay mounted across sign-out. Without the reset, user B signing in after A sees A's in-memory data — and if B's cloud doc is empty, the migration path uploads A's private data into B's account (found by code review, would have shipped). But resetting on null→uid would wipe the device data an existing user needs migrated.
**How to apply:** `prevUidRef` pattern in each provider; Firebase auth always transitions A→null→B, so uid-change detection catches switches. Sign-out also multiRemoves all domain cache keys; the reset-effect removal is defense-in-depth for revoked-token drops that bypass signOut().

## Other pitfalls
- Rapid like-taps double-increment if `isLiked` derives from React state (stale closure). Derive from a synchronously-updated ref so taps alternate +1/-1. Rules additionally cap likeCount changes to exactly ±1 per write.
- Firestore rejects `undefined` field values — JSON round-trip payloads first.
- `initializeFirestore` throws on hot reload — try/catch → `getFirestore`. Native needs `experimentalAutoDetectLongPolling`.
- Email-lookup collection (`emailIndex/{email}`) is rules-locked to `get` only (no list ⇒ no account enumeration); doc id must be lowercase (rules compare `request.auth.token.email.lower()`). Entries can't be deleted by clients, so deleted test accounts leave harmless residue.
- Rules verified live with a two-account Node script (firebase web SDK works in Node; 20 assertions incl. permission-denied paths). Pattern: create/sign in two email/password users, exercise every rule branch, clean up with `deleteUser`.
