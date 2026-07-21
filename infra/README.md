# Pariverse — Google Cloud Infrastructure

## Stack
- **Cloud Run** — Express API server (containerised)
- **Cloud SQL** — PostgreSQL 16 (managed)
- **Firebase** — Authentication (replaces Supabase Auth)
- **Cloud Storage** — File uploads (profile photos, etc.)
- **Artifact Registry** — Docker image storage
- **Secret Manager** — Environment secrets

## One-time setup (do this once)

### 1. Install tools
```bash
# gcloud CLI
brew install google-cloud-sdk        # macOS
# or: https://cloud.google.com/sdk/docs/install (Windows/Linux)

# Terraform
brew install terraform               # macOS
# or: https://developer.hashicorp.com/terraform/install

# Docker Desktop
# https://docs.docker.com/get-docker/
```

### 2. Authenticate
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud auth application-default login
```

### 3. Fill in your Project ID
Edit `infra/terraform.tfvars` and replace `YOUR_PROJECT_ID` with your real Project ID.

### 4. Provision infrastructure
```bash
cd infra
terraform init
terraform plan    # preview changes
terraform apply   # create resources (~5 min)
```

### 5. Deploy the API
```bash
bash infra/deploy.sh
```

## After setup
- Your API will be live at the Cloud Run URL printed at the end of `deploy.sh`
- Update `eas.json` `EXPO_PUBLIC_DOMAIN` with that Cloud Run URL (without `https://`)
- Rebuild the mobile app with `eas build --platform android --profile production`

## Ongoing deploys
Every push to `main` on GitHub auto-deploys via the GitHub Actions workflow.
Or manually: `bash infra/deploy.sh`
