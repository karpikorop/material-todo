import { inject, Injectable } from '@angular/core';
import { doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../auth-service/auth.service';
import { distinctUntilChanged, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { getTimeZonesList, SETTINGS_DOCUMENT_ID, Themes, UserSettings } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  private readonly defaultSettings: UserSettings = {
    theme: Themes.LIGHT,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  };

  /**
   * An observable that streams the current user's settings profile.
   * It listens to changes in the '/users/{userId}/settings/preferences' document.
   * Emits null if no user is not logged in.
   */
  public userSettings$: Observable<UserSettings | null> = this.authService.currentUser$.pipe(
    switchMap((user) => {
      if (user) {
        const settingsRef = doc(
          this.firestore,
          `users/${user.uid}/settings/${SETTINGS_DOCUMENT_ID}`
        );
        return docData(settingsRef) as Observable<Partial<UserSettings> | null>;
      } else {
        return of(null);
      }
    }),
    map((settingsFromDb) => {
      // If there are settings from the DB, merge them with defaults.
      // The values from the DB will overwrite the default values.
      // EXPERIMENTAL
      if (settingsFromDb) {
        return { ...this.defaultSettings, ...settingsFromDb };
      }
      return null;
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  /**
   * Creates the default settings document for a new user.
   * This should be called during profile creation.
   * @param userId The ID of the new user.
   */
  async createDefaultSettings(userId: string): Promise<void> {
    const settingsRef = doc(this.firestore, `users/${userId}/settings/preferences`);
    return setDoc(settingsRef, this.defaultSettings);
  }

  /**
   * Updates the user's settings document in Firestore.
   * @param userId - The ID of the user whose settings need to be updated.
   * @param data - An object with the fields to be updated.
   */
  async updateSettings(userId: string, data: Partial<UserSettings>): Promise<void> {
    const { id, ...cleanData } = data as any; // remove id if present

    const settingsRef = doc(this.firestore, `users/${userId}/settings/${SETTINGS_DOCUMENT_ID}`);
    return updateDoc(settingsRef, cleanData);
  }

  /**
   * Returns a list of all supported timezones.
   * @returns An array of TimeZone obj representing the timezones.
   */
  public get timezones(): TimeZone[] {
    return getTimeZonesList();
  }

  public get timezoneNames(): string[] {
    return this.timezones.map((tz) => tz.name);
  }
}
