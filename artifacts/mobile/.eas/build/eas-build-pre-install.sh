#!/usr/bin/env bash
set -euo pipefail

echo "Decoding Firebase config files..."

if [ -n "${GOOGLE_SERVICES_JSON:-}" ]; then
  echo "$GOOGLE_SERVICES_JSON" | base64 -d > "$EAS_BUILD_WORKINGDIR/google-services.json"
  echo "✓ google-services.json written"
else
  echo "⚠ GOOGLE_SERVICES_JSON not set — skipping"
fi

if [ -n "${GOOGLE_SERVICE_INFO_PLIST:-}" ]; then
  echo "$GOOGLE_SERVICE_INFO_PLIST" | base64 -d > "$EAS_BUILD_WORKINGDIR/GoogleService-Info.plist"
  echo "✓ GoogleService-Info.plist written"
else
  echo "⚠ GOOGLE_SERVICE_INFO_PLIST not set — skipping"
fi
