export const AVATAR_BUCKET_SUFFIX = '-avatars';

export function getAvatarBucketName(projectId: string): string {
  if (!projectId) {
    throw new Error('Project ID is required to generate bucket name');
  }
  return `${projectId}${AVATAR_BUCKET_SUFFIX}`;
}
