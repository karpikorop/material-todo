import { User } from '@angular/fire/auth';
import {
  getProjectsCollectionPath,
  getSettingsCollectionPath,
  INBOX_ID,
  PLACEHOLDER_AVATAR_URL,
  SETTINGS_DOCUMENT_ID,
  UserProfile,
  UserProfileInterface,
  USERS_COLLECTION,
} from '@shared';
import {
  doc,
  Firestore,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { ProjectService } from '../project-service/project.service';
import { SettingsService } from '../settings-service/settings.service';

export class HealService {
  private firestore: Firestore = inject(Firestore);
  private projectService: ProjectService = inject(ProjectService);
  private settingsService: SettingsService = inject(SettingsService);

  /**
   * Creates a profile document for a new user in Firestore.
   * Also creates a default "Inbox" project for the user.
   * Runs healing logic to ensure that the user's profile is not corrupted.
   * @param user - User object received from Firebase Auth
   * @param currentUserProfile - The current user profile from Firestore (if it exists)
   */
  async checkAndCreateUserProfile(user: User, currentUserProfile?: UserProfile): Promise<void> {
    const userRef = doc(this.firestore, `${USERS_COLLECTION}/${user.uid}`);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      const userData: UserProfileInterface = {
        id: user.uid,
        email: user.email!,
        username: user.displayName || user.email?.split('@')[0] || 'username',
        avatarUrl: user.photoURL || PLACEHOLDER_AVATAR_URL,
        supporter: false,
        createdAt: serverTimestamp() as Timestamp, // unreliable
      };
      await setDoc(userRef, userData, { merge: true });
      await this.projectService.createDefaultInbox(user.uid);
      await this.settingsService.createDefaultSettings(user.uid);
    }

    // check for missing default data and heal if necessary
    await this.healDefaultData(user, currentUserProfile);
  }

  private async healDefaultData(user: User, currentUserProfile?: UserProfile): Promise<void> {
    await Promise.all([
      this.healDefaultInbox(user),
      this.healDefaultSettings(user),
      this.healUserProfileEmail(user, currentUserProfile),
    ]);
  }

  private async healDefaultInbox(user: User): Promise<void> {
    const inboxRef = doc(this.firestore, `${getProjectsCollectionPath(user.uid)}/${INBOX_ID}`);
    const inboxSnap = await getDoc(inboxRef);

    if (!inboxSnap.exists()) {
      await this.projectService.createDefaultInbox(user.uid);
    }
  }

  private async healDefaultSettings(user: User): Promise<void> {
    const settingsRef = doc(
      this.firestore,
      `${getSettingsCollectionPath(user.uid)}/${SETTINGS_DOCUMENT_ID}`
    );
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      await this.settingsService.createDefaultSettings(user.uid);
    }
  }

  /** updates the user's email if it was changed manually in settings **/
  public async healUserProfileEmail(user: User, currentUserProfile?: UserProfile) {
    const firestoreEmail = currentUserProfile?.email;
    if (user?.email && firestoreEmail && firestoreEmail !== user.email) {
      const userRef = doc(this.firestore, `${USERS_COLLECTION}/${user.uid}`);
      await updateDoc(userRef, { email: user.email });
      console.log('Synced Firestore email with new Auth email');
    }
  }
}
