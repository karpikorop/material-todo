export const USERS_COLLECTION = 'users';

export const ENTRIES_SUBCOLLECTION = 'entries';

export const PROJECTS_SUBCOLLECTION = 'projects';

export const SETTINGS_SUBCOLLECTION = 'settings';

export function getEntriesCollectionPath(userId: string) {
  return `${USERS_COLLECTION}/${userId}/${ENTRIES_SUBCOLLECTION}`;
}

export function getProjectsCollectionPath(userId: string) {
  return `${USERS_COLLECTION}/${userId}/${PROJECTS_SUBCOLLECTION}`;
}

export function getSettingsCollectionPath(userId: string) {
  return `${USERS_COLLECTION}/${userId}/${SETTINGS_SUBCOLLECTION}`;
}
