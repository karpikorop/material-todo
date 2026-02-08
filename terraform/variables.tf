variable "project_id" {
  description = "The ID of a Firebase project"
  type        = string
}

variable "region" {
  description = "The region for the bucket"
  type        = string
  default     = "us-central1"
}

variable "avatar_suffix" {
    description = "Suffix to append to the bucket name for avatar bucket"
    type        = string
    default     = "-avatars"
}
