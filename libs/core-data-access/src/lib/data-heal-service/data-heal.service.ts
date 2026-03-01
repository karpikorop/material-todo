import { User } from '@angular/fire/auth';
import {
  defaultSettings,
  getProjectsCollectionPath,
  getSettingsCollectionPath,
  INBOX_ID,
  PLACEHOLDER_AVATAR_URL,
  Project,
  SETTINGS_DOCUMENT_ID,
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
import { inject, Injectable } from '@angular/core';
import { AuthService } from 'auth-data-access';

@Injectable({
  providedIn: 'root',
})
export class DataHealService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  constructor() {
    this.authService.currentUser$.subscribe(async (user) => {
      if (user) {
        await this.runHealingSequence(user);
      }
    });
  }

  private async runHealingSequence(user: User): Promise<void> {
    await this.checkAndCreateUserProfile(user);
    await this.healDefaultInbox(user);
    await this.healDefaultSettings(user);
  }

  /**
   * Creates a profile document for a new user in Firestore.
   * If the user already exists, updates the email if it was changed manually in settings.
   * @param user - User object received from Firebase Auth
   */
  private async checkAndCreateUserProfile(user: User): Promise<void> {
    const userRef = doc(this.firestore, `${USERS_COLLECTION}/${user.uid}`);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      const userData: UserProfileInterface = {
        id: user.uid,
        email: user.email!,
        username: user.displayName || user.email?.split('@')[0] || 'username',
        avatarUrl: user.photoURL || PLACEHOLDER_AVATAR_URL,
        supporter: false,
        createdAt: serverTimestamp() as Timestamp,
      };
      await setDoc(userRef, userData, { merge: true });
    } else {
      const currentData = docSnap.data() as UserProfileInterface;
      if (user.email && currentData.email && currentData.email !== user.email) {
        await updateDoc(userRef, { email: user.email });
        console.log('Synced Firestore email with new Auth email');
      }
    }
  }

  /**
   * Creates a default "Inbox" project for a new user.
   * @param user - User object received from Firebase Auth
   */
  private async healDefaultInbox(user: User): Promise<void> {
    const inboxRef = doc(this.firestore, `${getProjectsCollectionPath(user.uid)}/${INBOX_ID}`);
    const inboxSnap = await getDoc(inboxRef);

    if (!inboxSnap.exists()) {
      await setDoc(inboxRef, {
        name: 'Inbox',
        sortOrder: 0,
        createdAt: serverTimestamp() as Timestamp,
        userId: user.uid,
        icon: 'inbox',
      } as Omit<Project, 'id'>);
    }
  }

  private async healDefaultSettings(user: User): Promise<void> {
    const settingsRef = doc(
      this.firestore,
      `${getSettingsCollectionPath(user.uid)}/${SETTINGS_DOCUMENT_ID}`
    );
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, defaultSettings);
    }
  }
}
