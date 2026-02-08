terraform {
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

resource "google_storage_bucket" "avatars" {
  name = "${var.project_id}${var.avatar_suffix}"
  location      = var.region
  storage_class = "STANDARD"

  # "Uniform" access control (Recommended for Firebase)
  uniform_bucket_level_access = true

  # Ensure we don't accidentally delete the bucket via Terraform
  # if it still has files in it.
  force_destroy = false

  cors {
    origin          = ["*"] # TODO In production, change this to url
    method          = ["GET", "POST", "PUT", "HEAD", "DELETE"]
    response_header = ["Content-Type", "Authorization"]
    max_age_seconds = 3600
  }

  versioning {
    enabled = false
  }
}

# 3. Output the result
output "bucket_url" {
  value = google_storage_bucket.avatars.url
}
