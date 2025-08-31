import {Injectable, inject} from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
  getDoc, Timestamp, serverTimestamp, collection,
} from '@angular/fire/firestore';
import {User} from '@angular/fire/auth';
import {AuthService} from '../auth-service/auth.service';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ProjectService} from '../project-service/project.service';
import {SettingsService} from '../settings-service/settings.service';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  supporter: boolean;
  createdAt: Timestamp;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);
  private projectService: ProjectService = inject(ProjectService);
  private settingsService: SettingsService = inject(SettingsService);


  /**
   * An observable that streams the current user's profile data.
   * It listens to changes in the '/users/{userId}' document.
   * Emits null if no user is logged in.
   */
  public currentUserProfile$: Observable<UserProfile | null> =
    this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (user) {
          return docData(
            doc(this.firestore, `users/${user.uid}`)
          ) as Observable<UserProfile | null>;
        } else {
          return of(null);
        }
      })
    );

  constructor() {
    this.authService.currentUser$.subscribe(async (user) => {
      if (user) {
        await this.checkAndCreateUserProfile(user);
      }
    });
  }

  /**
   * Creates a profile document for a new user in Firestore.
   * Also creates a default "Inbox" project for the user.
   * @param user - User object received from Firebase Auth
   */
  private async checkAndCreateUserProfile(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      const userData: UserProfile = {
        id: user.uid,
        email: user.email!,
        username: user.displayName || user.email!.split('@')[0],
        avatarUrl:
          user.photoURL ||
          'https://placehold.co/100x100/E8E8E8/BDBDBD?text=Ava',
        supporter: false,
        createdAt: serverTimestamp() as Timestamp, // unreliable
      };
      await setDoc(userRef, userData, {merge: true});
      await this.projectService.createDefaultInbox(user.uid);
      await this.settingsService.createDefaultSettings(user.uid);
    }

    // check for missing default data and heal if necessary

    const inboxRef = doc(this.firestore, `users/${user.uid}/projects/inbox`);
    const inboxDocSnap = await getDoc(inboxRef);
    if (inboxDocSnap.exists()) {
      await this.projectService.createDefaultInbox(user.uid);
    }

    const settingsRef = doc(this.firestore, `users/${user.uid}/settings/preferences`);
    const settingsDocSnap = await getDoc(settingsRef);
    if (!settingsDocSnap.exists()) {
      await this.settingsService.createDefaultSettings(user.uid);
    }
  }

  /**
   * Updates the user's profile data.
   * @param userId - The ID of the user whose profile needs to be updated
   * @param data - An object with fields to be updated
   */
  async updateUserProfile(
    userId: string,
    data: Partial<UserProfile>
  ): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return updateDoc(userRef, data);
  }
}
