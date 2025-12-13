import {Injectable, inject} from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
  getDoc, Timestamp, serverTimestamp,
} from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import {AuthService} from '../auth-service/auth.service';
import {BehaviorSubject, Observable, of, switchAll} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ProjectService} from '../project-service/project.service';
import {SettingsService} from '../settings-service/settings.service';
import {getDownloadURL, ref, Storage, uploadBytes} from '@angular/fire/storage';

export interface UserProfileInterface {
  id: string;
  /**
   * If possible, use email from Auth Service currentUser$ instead.
   */
  email: string;
  username: string;
  avatarUrl: string;
  supporter: boolean;
  createdAt: Timestamp;
}

export type UserProfile = UserProfileInterface | null;

export const PLACEHOLDER_AVATAR_URL = "https://placehold.net/avatar-4.png";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);
  private projectService: ProjectService = inject(ProjectService);
  private settingsService: SettingsService = inject(SettingsService);
  private storage = inject(Storage);

  private currentUserProfile = new BehaviorSubject<UserProfile>(null);

  /**
   * An observable that streams the current user's profile data.
   * It listens to changes in the '/users/{userId}' document.
   * Emits null if no user is logged in.
   */
  public currentUserProfile$: Observable<UserProfile> = this.currentUserProfile.asObservable();


  /**
   * Returns the current user's profile data synchronously.
   * If the user is not logged in, returns null.
   */
  public get currentUser(): UserProfile {
    return this.currentUserProfile.value;
  }

  /**
   * Returns the current user's profile data synchronously.
   * If the user is not logged in, returns null.
   */
  public get userId(): string | null {
    return this.currentUserProfile.value?.id || null;
  }

  public isEmailEditable(): boolean {
    const user = this.authService.userSnapshot;
    if (!user) return false;

    return user.providerData.some(
      (profile) => profile.providerId === 'password'
    );
  }


  constructor() {
    this.authService.currentUser$.pipe(
      switchMap(async (authUser) => {
        if (!authUser) {
          return of(null);
        }
        await this.checkAndCreateUserProfile(authUser);

        return docData(
          doc(this.firestore, `users/${authUser.uid}`), { idField: 'id' }
        ) as Observable<UserProfile>;
      }),
      switchAll(),
    ).subscribe((profile) => {
      this.currentUserProfile.next(profile);
    });
  }

  /**
   * Creates a profile document for a new user in Firestore.
   * Also creates a default "Inbox" project for the user.
   * Runs healing logic to ensure that the user's profile is not corrupted.
   * @param user - User object received from Firebase Auth
   */
  private async checkAndCreateUserProfile(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      const userData: UserProfileInterface = {
        id: user.uid,
        email: user.email!,
        username: user.displayName || user.email!.split('@')[0],
        avatarUrl:
          user.photoURL ||
          PLACEHOLDER_AVATAR_URL,
        supporter: false,
        createdAt: serverTimestamp() as Timestamp, // unreliable
      };
      await setDoc(userRef, userData, {merge: true});
      await this.projectService.createDefaultInbox(user.uid);
      await this.settingsService.createDefaultSettings(user.uid);
    }

    // check for missing default data and heal if necessary
    await this.healDefaultData(user);
  }

  private async healDefaultData(user: User): Promise<void> {
    await Promise.all([
      this.healDefaultInbox(user),
      this.healDefaultSettings(user),
      this.healUserProfileEmail(user)
    ]);
  }

  private async healDefaultInbox(user: User): Promise<void> {
    const inboxRef = doc(this.firestore, `users/${user.uid}/projects/inbox`);
    const inboxSnap = await getDoc(inboxRef);

    if (!inboxSnap.exists()) {
      await this.projectService.createDefaultInbox(user.uid);
    }
  }

  private async healDefaultSettings(user: User): Promise<void> {
    const settingsRef = doc(this.firestore, `users/${user.uid}/settings/preferences`);
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      await this.settingsService.createDefaultSettings(user.uid);
    }
  }

  // Also updates the user's email if it was changed manually in settings
  private async healUserProfileEmail(user: User){
    const firestoreEmail = this.currentUserProfile.value?.email;
    if (user.email && firestoreEmail !== user.email) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userRef, { email: user.email });
      console.log('Synced Firestore email with new Auth email');
    }
  }

  /**
   * Updates the user's profile data.
   * Actively removes the id and email field from the data to not add/change it in Firestore
   * @param data - An object with fields to be updated
   * @param userId - The ID of the user whose profile needs to be updated, defaults to the current user ID
   * @throws Error if no user ID is provided
   */
  async updateUserProfile(
    data: Partial<UserProfileInterface>,
    userId = this.userId!,
  ): Promise<void> {
    if (!userId) {
      throw new Error('Cannot update user profile: no user ID provided');
    }

    const { id, email, ...cleanData } = data;
    const userRef = doc(this.firestore, `users/${userId}`);
    return updateDoc(userRef, cleanData);
  }


  // TODO: Move to cloud function with compression
  /**
   * Uploads a file to Firebase Storage and updates the user's avatarUrl.
   * Path: users/{userId}/avatar
   * @param file The file object from the input
   */
  public async uploadUserAvatar(file: File): Promise<void> {
    const user = this.currentUser;
    if (!user) throw new Error('User not logged in');

    // Define the path: users/{userId}/avatar
    // We use a fixed name so we don't pile up garbage files.
    const filePath = `users/${user.id}/avatar`;
    const storageRef = ref(this.storage, filePath);

    // Upload the file
    // "uploadBytes" is the standard way to send raw files
    await uploadBytes(storageRef, file);

    // Get the public Download URL
    // Firebase generates a tokenized URL that bypasses security rules for display
    const newAvatarUrl = await getDownloadURL(storageRef);

    return this.updateUserProfile({ avatarUrl: newAvatarUrl });
  }

  public resetUserAvatar(): Promise<void> {
    return this.updateUserProfile({ avatarUrl: PLACEHOLDER_AVATAR_URL });
  }
}
