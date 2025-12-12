import {Injectable, inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {
  Auth,
  User,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  UserCredential,
  sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider
} from '@angular/fire/auth';
import {NotificationService} from '../notification-service/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private notificationService = inject(NotificationService);

  private currentUser = new BehaviorSubject<User | undefined | null>(undefined);

  /**
   * An observable that emits the current user whenever it changes.
   * Emits null if no user is logged in.
   * Emits undefined if no information about the user is available (e.g., during initialization).
   */
  public currentUser$ = this.currentUser.asObservable();

  constructor() {
    authState(this.auth).subscribe((user) => {
      this.currentUser.next(user);
      if (user) {
        console.log('User logged in');
      } else {
        console.log('User logged out.');
      }
    });
  }

  get userSnapshot(): User | null {
    return this.currentUser.value || null;
  }

  public async signUp(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await sendEmailVerification(userCredential.user);
      this.notificationService.showInfo(
        'Verification email sent. Please check your inbox. Check spam folder if not found.'
      );
      return userCredential;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async logIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    try {
      return await signInWithPopup(this.auth, provider);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public logout(): Promise<void> {
    return signOut(this.auth).catch((error) => {
      this.handleAuthError(error);
      throw error;
    });
  }

  public async reauthenticate(password: string): Promise<void> {
    const user = this.userSnapshot;

    if (!user || !user.email) {
      throw new Error('No user logged in to re-authenticate.');
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  }

  // TODO Move notification service out of the auth service
  private handleAuthError(error: any): void {
    let message;
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No user found with this email address';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        message = 'Email address is already in use';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid credentials';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Sign-in popup was closed';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection';
        break;
      default:
        message = error.message || 'Authentication failed';
    }

    this.notificationService.showError(message);
  }
}
