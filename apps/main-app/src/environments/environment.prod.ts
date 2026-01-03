import { firebaseConfig } from './firebase.config';

/**
 * Production Environment Configuration
 * Applied automatically during production builds via Angular's fileReplacement.
 */
export const environment = {
  production: true,
  useEmulators: false,
  firebase: firebaseConfig,
};
