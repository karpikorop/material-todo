import {Injectable, inject} from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  updateDoc, setDoc,
} from '@angular/fire/firestore';
import {AuthService} from '../auth-service/auth.service';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

/**
 * Interface representing the user's application-specific settings.
 */
export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newsletterEmails: boolean;
  theme: string; // TODO: Define possible themes or maybe prime color
  timeZone: string; // IANA Time Zone Name (e.g., 'Europe/Kyiv')
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  private readonly defaultSettings: UserSettings = {
    emailNotifications: true,
    pushNotifications: true,
    newsletterEmails: false,
    theme: 'default',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  };


  /**
   * An observable that streams the current user's settings profile.
   * It listens to changes in the '/users/{userId}/settings/preferences' document.
   * Emits null if no user is logged in.
   */
  public userSettings$: Observable<UserSettings | null> =
    this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (user) {
          const settingsRef = doc(
            this.firestore,
            `users/${user.uid}/settings/preferences`
          );
          return docData(settingsRef) as Observable<Partial<UserSettings> | null>;
        } else {
          return of(null);
        }
      }),
      map(settingsFromDb => {
        // If there are settings from the DB, merge them with defaults.
        // The values from the DB will overwrite the default values.
        // EXPERIMENTAL
        if (settingsFromDb) {
          return {...this.defaultSettings, ...settingsFromDb};
        }
        return null;
      })
    );

  /**
   * Creates the default settings document for a new user.
   * This should be called during profile creation.
   * @param userId The ID of the new user.
   */
  async createDefaultSettings(userId: string): Promise<void> {
    const settingsRef = doc(
      this.firestore,
      `users/${userId}/settings/preferences`
    );
    return setDoc(settingsRef, this.defaultSettings);
  }

  /**
   * Updates the user's settings document in Firestore.
   * @param userId - The ID of the user whose settings need to be updated.
   * @param data - An object with the fields to be updated.
   */
  async updateSettings(
    userId: string,
    data: Partial<UserSettings>
  ): Promise<void> {
    const settingsRef = doc(
      this.firestore,
      `users/${userId}/settings/preferences`
    );
    return updateDoc(settingsRef, data);
  }
}
