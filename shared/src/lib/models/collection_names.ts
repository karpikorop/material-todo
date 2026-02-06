export const USERS_COLLECTION = 'users';

export const TODOS_SUBCOLLECTION = 'todos';

export const PROJECTS_SUBCOLLECTION = 'projects';

export const SETTINGS_SUBCOLLECTION = 'settings';

export function getEntriesCollectionPath(userId: string) {
  return `${USERS_COLLECTION}/${userId}/${TODOS_SUBCOLLECTION}`;
}

export function getProjectsCollectionPath(userId: string) {
  return `${USERS_COLLECTION}/${userId}/${PROJECTS_SUBCOLLECTION}`;
}

export function getSettingsCollectionPath(userId: string) {
  return `${USERS_COLLECTION}/${userId}/${SETTINGS_SUBCOLLECTION}`;
}
