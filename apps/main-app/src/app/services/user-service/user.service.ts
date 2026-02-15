import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { AuthProvider, AuthService } from '../../core/services/auth-service/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataHealService } from '../../core/services/data-heal-service/data-heal.service';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import {
  UserProfile,
  UserProfileInterface,
  PLACEHOLDER_AVATAR_URL,
  USERS_COLLECTION,
} from '@shared';

// TODO fix google avatar error, to much requests, maybe cache the image, or move to storage

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);
  private healService: DataHealService = inject(DataHealService);
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
   * If the user is not logged in, it returns null.
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

    return user.providerData.some((profile) => profile.providerId === AuthProvider.Password);
  }

  constructor() {
    this.authService.currentUser$
      .pipe(
        switchMap((authUser) => {
          if (!authUser) {
            return of(null);
          }
          return docData(doc(this.firestore, `${USERS_COLLECTION}/${authUser.uid}`), {
            idField: 'id',
          }) as Observable<UserProfile>;
        })
      )
      .subscribe((profile) => {
        this.currentUserProfile.next(profile);
      });
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
    userId = this.userId
  ): Promise<void> {
    if (!userId) {
      throw new Error('Cannot update user profile: no user ID provided');
    }

    const { id, email, ...cleanData } = data;
    const userRef = doc(this.firestore, `${USERS_COLLECTION}/${userId}`);
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
    const filePath = `${USERS_COLLECTION}/${user.id}/avatar`;
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
    // TODO delete existing file
    return this.updateUserProfile({ avatarUrl: PLACEHOLDER_AVATAR_URL });
  }
}
