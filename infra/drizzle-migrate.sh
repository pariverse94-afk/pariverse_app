#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────────────────
# Run Drizzle migrations against Cloud SQL using Cloud SQL Auth Proxy
# Usage: bash infra/drizzle-migrate.sh
# Prereqs: gcloud CLI authenticated, cloud-sql-proxy installed
# Install proxy: gcloud components install cloud-sql-proxy
# ────────────────────────────────────────────────────────────────────────────
set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-$(grep 'project_id' infra/terraform.tfvars | grep -v '^#' | cut -d'"' -f2)}"
REGION="${GCP_REGION:-asia-south1}"
APP_NAME="pariverse"
DB_PASSWORD="${DB_PASSWORD:-$(grep 'db_password' infra/terraform.tfvars | grep -v '^#' | cut -d'"' -f2)}"
INSTANCE="${PROJECT_ID}:${REGION}:${APP_NAME}-db"
LOCAL_PORT=5433

echo "Starting Cloud SQL Auth Proxy on port $LOCAL_PORT..."
cloud-sql-proxy "${INSTANCE}" --port="$LOCAL_PORT" &
PROXY_PID=$!

# Wait for proxy to be ready
sleep 3

export DATABASE_URL="postgresql://pariverse:${DB_PASSWORD}@localhost:${LOCAL_PORT}/pariverse"

echo "Running Drizzle migrations..."
pnpm --filter @workspace/db run migrate

echo "Done."
kill $PROXY_PID
