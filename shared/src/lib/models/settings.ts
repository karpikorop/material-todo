export const SETTINGS_DOCUMENT_ID = 'preferences';

export enum Themes {
  LIGHT = 'light',
  DARK = 'dark',
}

/**
 * Interface representing the user's application-specific settings.
 */
export interface UserSettings {
  theme?: Themes;
  timeZone: string; // IANA Time Zone Name (e.g., 'Europe/Kyiv')
}

export const defaultSettings: UserSettings = {
  theme: Themes.LIGHT,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
};
