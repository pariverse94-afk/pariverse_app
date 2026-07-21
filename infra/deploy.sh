#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────────────────
# Pariverse — deploy API to Cloud Run
# Usage: bash infra/deploy.sh
# Prereqs: gcloud CLI authenticated, Docker running, terraform applied once
# ────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Config (must match terraform.tfvars) ────────────────────────────────────
PROJECT_ID="${GCP_PROJECT_ID:-$(grep 'project_id' infra/terraform.tfvars | grep -v '^#' | cut -d'"' -f2)}"
REGION="${GCP_REGION:-asia-south1}"
APP_NAME="pariverse"
IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD 2>/dev/null || echo latest)}"
REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/${APP_NAME}-api/${APP_NAME}-api"

echo "▶ Project : $PROJECT_ID"
echo "▶ Region  : $REGION"
echo "▶ Image   : ${REGISTRY}:${IMAGE_TAG}"
echo ""

# ── Authenticate Docker with Artifact Registry ───────────────────────────────
echo "1/4 Configuring Docker auth..."
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

# ── Build Docker image from repo root (Dockerfile is in infra/) ─────────────
echo "2/4 Building Docker image..."
docker build \
  -f infra/Dockerfile \
  -t "${REGISTRY}:${IMAGE_TAG}" \
  -t "${REGISTRY}:latest" \
  .

# ── Push to Artifact Registry ────────────────────────────────────────────────
echo "3/4 Pushing image to Artifact Registry..."
docker push "${REGISTRY}:${IMAGE_TAG}"
docker push "${REGISTRY}:latest"

# ── Deploy to Cloud Run ───────────────────────────────────────────────────────
echo "4/4 Deploying to Cloud Run..."
gcloud run deploy "${APP_NAME}-api" \
  --image="${REGISTRY}:${IMAGE_TAG}" \
  --region="${REGION}" \
  --project="${PROJECT_ID}" \
  --quiet

# ── Print the live URL ────────────────────────────────────────────────────────
URL=$(gcloud run services describe "${APP_NAME}-api" \
  --region="${REGION}" \
  --project="${PROJECT_ID}" \
  --format="value(status.url)")

echo ""
echo "✅ Deployed!"
echo "   API URL: ${URL}"
echo ""
echo "Next steps:"
echo "  1. Update eas.json → EXPO_PUBLIC_DOMAIN → $(echo "$URL" | sed 's|https://||')"
echo "  2. Run: eas build --platform android --profile production"
