variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
}

variable "region" {
  description = "GCP region (asia-south1 = Mumbai)"
  type        = string
  default     = "asia-south1"
}

variable "db_password" {
  description = "Cloud SQL PostgreSQL password for the 'pariverse' user"
  type        = string
  sensitive   = true
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
  default     = "pariverse"
}

variable "db_tier" {
  description = "Cloud SQL machine tier (db-f1-micro = cheapest, ~$10/mo)"
  type        = string
  default     = "db-f1-micro"
}
