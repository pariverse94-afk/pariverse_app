terraform {
  required_version = ">= 1.6"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ── Enable required APIs ────────────────────────────────────────────────────

resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "secretmanager.googleapis.com",
    "storage.googleapis.com",
    "firebase.googleapis.com",
    "identitytoolkit.googleapis.com",
    "iam.googleapis.com",
  ])
  service            = each.key
  disable_on_destroy = false
}

# ── Artifact Registry (Docker image store) ──────────────────────────────────

resource "google_artifact_registry_repository" "api" {
  depends_on    = [google_project_service.apis]
  location      = var.region
  repository_id = "${var.app_name}-api"
  description   = "Docker images for the Pariverse API server"
  format        = "DOCKER"
}

# ── Cloud SQL — PostgreSQL 16 ────────────────────────────────────────────────

resource "google_sql_database_instance" "main" {
  depends_on       = [google_project_service.apis]
  name             = "${var.app_name}-db"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier              = var.db_tier
    availability_type = "ZONAL"

    backup_configuration {
      enabled    = true
      start_time = "02:00"  # 2 AM UTC = 7:30 AM IST
    }

    ip_configuration {
      # Cloud Run connects via Cloud SQL Auth Proxy (Unix socket) — no public IP needed
      ipv4_enabled = false
      private_network = "projects/${var.project_id}/global/networks/default"
    }

    insights_config {
      query_insights_enabled = true
    }
  }

  deletion_protection = true
}

resource "google_sql_database" "pariverse" {
  name     = "pariverse"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "api_user" {
  name     = "pariverse"
  instance = google_sql_database_instance.main.name
  password = var.db_password
}

# ── Cloud Storage bucket (profile photos, uploads) ───────────────────────────

resource "google_storage_bucket" "uploads" {
  depends_on                  = [google_project_service.apis]
  name                        = "${var.project_id}-${var.app_name}-uploads"
  location                    = var.region
  uniform_bucket_level_access = true
  force_destroy               = false

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST"]
    response_header = ["Content-Type", "Authorization"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    condition { age = 365 }
    action    { type = "Delete" }
  }
}

# ── IAM: Service Account for Cloud Run ───────────────────────────────────────

resource "google_service_account" "api_runner" {
  account_id   = "${var.app_name}-api-runner"
  display_name = "Pariverse API Cloud Run SA"
}

# Allow Cloud Run SA to connect to Cloud SQL
resource "google_project_iam_member" "cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.api_runner.email}"
}

# Allow Cloud Run SA to read/write Cloud Storage
resource "google_storage_bucket_iam_member" "storage_rw" {
  bucket = google_storage_bucket.uploads.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.api_runner.email}"
}

# Allow Cloud Run SA to access secrets
resource "google_project_iam_member" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.api_runner.email}"
}

# ── Secret Manager — store sensitive env vars ─────────────────────────────────

resource "google_secret_manager_secret" "session_secret" {
  depends_on = [google_project_service.apis]
  secret_id  = "session-secret"
  replication { auto {} }
}

resource "google_secret_manager_secret_version" "session_secret_v1" {
  secret      = google_secret_manager_secret.session_secret.id
  secret_data = "REPLACE_WITH_A_LONG_RANDOM_STRING"
}

resource "google_secret_manager_secret" "db_url" {
  depends_on = [google_project_service.apis]
  secret_id  = "database-url"
  replication { auto {} }
}

resource "google_secret_manager_secret_version" "db_url_v1" {
  secret      = google_secret_manager_secret.db_url.id
  # Cloud Run connects via Unix socket when Cloud SQL Auth Proxy is used
  secret_data = "postgresql://pariverse:${var.db_password}@/pariverse?host=/cloudsql/${var.project_id}:${var.region}:${var.app_name}-db"
}

# ── Cloud Run service ─────────────────────────────────────────────────────────

resource "google_cloud_run_v2_service" "api" {
  depends_on = [
    google_project_service.apis,
    google_artifact_registry_repository.api,
  ]
  name     = "${var.app_name}-api"
  location = var.region

  template {
    service_account = google_service_account.api_runner.email

    scaling {
      min_instance_count = 0   # scale to zero when idle (cost saving)
      max_instance_count = 10
    }

    containers {
      # Image will be set by deploy.sh after first build
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.app_name}-api/${var.app_name}-api:latest"

      ports {
        container_port = 8080
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "PORT"
        value = "8080"
      }
      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_url.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "SESSION_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.session_secret.secret_id
            version = "latest"
          }
        }
      }
      env {
        name  = "GCS_BUCKET"
        value = google_storage_bucket.uploads.name
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    # Cloud SQL connection via Auth Proxy (Unix socket — no public IP needed)
    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = ["${var.project_id}:${var.region}:${var.app_name}-db"]
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Allow public access to Cloud Run (your mobile app calls it over the internet)
resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ── Outputs ───────────────────────────────────────────────────────────────────

output "cloud_run_url" {
  description = "Base URL of your API — use this in eas.json EXPO_PUBLIC_DOMAIN"
  value       = google_cloud_run_v2_service.api.uri
}

output "docker_registry" {
  description = "Docker registry path for your API images"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${var.app_name}-api/${var.app_name}-api"
}

output "cloud_sql_connection_name" {
  description = "Cloud SQL connection name (for local dev with Cloud SQL Auth Proxy)"
  value       = google_sql_database_instance.main.connection_name
}

output "storage_bucket" {
  description = "Cloud Storage bucket name for uploads"
  value       = google_storage_bucket.uploads.name
}
