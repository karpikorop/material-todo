import { firebaseConfig } from './firebase.config';

/**
 * Environment Configuration
 *
 * Contains application-wide settings for development environment.
 * For production settings, see `environment.prod.ts`.
 *
 * @property {boolean} production - Indicates if the app is running in production mode
 * @property {boolean} useEmulators - Whether to use Firebase emulators for local development
 * @property {object} firebase - Firebase project configuration from `firebase.config.ts`
 */
export const environment = {
  production: false,
  useEmulators: false,
  firebase: firebaseConfig,
};
