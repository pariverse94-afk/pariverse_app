---
name: EAS build debugging
description: How to fetch real EAS build failure logs from the shell, and the Reanimated 4 / New Architecture Gradle gate.
---

# EAS build debugging

**Rule:** Never diagnose an EAS build failure without the actual phase logs. Guessing from symptoms ("probably that iOS-only package") led to a wrong diagnosis once — the real error was unrelated and identical across builds.

**How to apply:** The EAS CLI session in the workspace shell is usually authenticated (user logs in there). To get real logs:
1. `pnpm exec eas build:list --platform android --limit N --non-interactive --json` — gives `status`, `gitCommitHash`, and `logFiles` (signed GCS URLs, ~15 min expiry).
2. Download the log URL with curl — the content is **brotli-compressed** (`content-encoding: br`); decompress with Node: `zlib.brotliDecompressSync`.
3. Each line is JSON (`{phase, msg, ...}`); filter `msg` for `FAILED|FAILURE|What went wrong`.
4. Compare `gitCommitHash` across failed builds to know exactly which code state each build tested.

**Gradle gate to remember:** react-native-reanimated 4.x hard-fails Android builds with `assertNewArchitectureEnabledTask` unless `newArchEnabled: true` in app.json (Expo SDK 54+ default). Also: reanimated 4 requires `react-native-worklets` as a separate package — removing it breaks Metro resolution of reanimated itself.
