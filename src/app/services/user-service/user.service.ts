import {Injectable, inject} from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
  getDoc, Timestamp, serverTimestamp,
} from '@angular/fire/firestore';
import {User} from '@angular/fire/auth';
import {AuthService} from '../auth-service/auth.service';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ProjectService} from '../project-service/project.service';

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

  currentUserProfile$: Observable<UserProfile | null> =
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
    this.authService.user$.subscribe(async (user) => {
      if (user) {
        await this.checkAndCreateUserProfile(user);
      }
    });
  }

  /**
   * Creates a profile document for a new user in Firestore.
   * Also creates a default "Inbox" project for the user.
   * This method should be called after successful registration.
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
      await setDoc(userRef, userData);
      await this.projectService.createDefaultInbox(user.uid);
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
