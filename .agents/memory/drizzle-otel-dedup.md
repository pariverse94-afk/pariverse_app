---
name: Drizzle duplicate instance via OpenTelemetry
description: firebase-admin pulls @opentelemetry/api into workspace, causing pnpm to create two drizzle-orm peer-dep variants with incompatible private types
---

## Rule
When `firebase-admin` is installed anywhere in the pnpm workspace, it introduces `@opentelemetry/api` as a dependency. pnpm then creates two separate instances of `drizzle-orm` — one with and one without the opentelemetry peer — whose types are structurally incompatible (private property `shouldInlineParams`). This causes TS errors when the api-server imports from `@workspace/db` and then uses `eq()` / `onConflictDoUpdate()`.

## Fix
Pin `@opentelemetry/api` to a single version in `pnpm-workspace.yaml` overrides:

```yaml
overrides:
  '@opentelemetry/api': '1.9.0'
```

Then run `pnpm install` to deduplicate. After this, rebuild libs with `pnpm run typecheck:libs`.

**Why:** pnpm treats optional peer dependencies as part of the package identity key. By forcing one version of opentelemetry across the workspace, drizzle-orm resolves to a single instance with consistent types.
