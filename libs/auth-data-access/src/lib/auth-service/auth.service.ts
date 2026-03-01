import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  linkWithPopup,
  unlink,
  verifyBeforeUpdateEmail,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
//import { NotificationService } from 'core-data-access';

export enum AuthProvider {
  Password = 'password',
  Google = 'google.com',
}

export type AuthUser = User | null | undefined;

// TODO check all the methods usages and check if they used the right way for its case (awaited or not)
// TODO move notification service out of the auth service
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  //private notificationService = inject(NotificationService);

  private currentUser = new BehaviorSubject<AuthUser>(undefined);

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

  get primaryEmail(): string | null {
    return this.userSnapshot?.email || null;
  }

  public getPasswordEmail(user = this.userSnapshot): string | null {
    const passProvider = user?.providerData.find((p) => p.providerId === AuthProvider.Password);
    return passProvider?.email || null;
  }

  public async signUp(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await sendEmailVerification(userCredential.user);
      return userCredential;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async logIn(email: string, password: string): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUser.next(result.user);
      return result;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      this.currentUser.next(result.user);
      return result;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      return await signOut(this.auth);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /** Re-authenticates the user with the given password.
   * Used for sensitive operations like changing email or password, or deleting an account.
   * **/
  public async reauthenticate(password: string, user = this.userSnapshot): Promise<void> {
    if (!user?.email) {
      throw new Error('No user logged in to re-authenticate.');
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  }

  /**
   * Sends a password reset email to the user.
   * Email from a password provider is used as target email.
   * @returns A promise that resolves if the email was sent successfully, or rejects with an error otherwise.
   */
  public async sendPasswordResetEmail(user = this.userSnapshot): Promise<void> {
    const email = this.getPasswordEmail(user);
    if (!user || !email) {
      throw new Error('No user logged in or user has no email address.');
    }

    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Links a Google account to the current user account.
   * This allows the user to sign in with either password or Google.
   */
  public async linkGoogleAccount(): Promise<UserCredential> {
    const user = this.userSnapshot;

    if (!user) {
      throw new Error('No user logged in to link Google account.');
    }

    const provider = new GoogleAuthProvider();
    try {
      const result = await linkWithPopup(user, provider);

      await result.user.reload();
      await this.emitNextUser(result.user);
      return result;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Unlinks the Google provider from the current user account.
   * The user must have at least one other authentication method remaining.
   */
  public async unlinkGoogleAccount(): Promise<void> {
    const user = this.userSnapshot;

    if (!user) {
      throw new Error('No user logged in to unlink Google account.');
    }

    const hasGoogleProvider = user.providerData.some((p) => p.providerId === AuthProvider.Google);
    if (!hasGoogleProvider) {
      throw new Error('Google account is not linked to this user.');
    }

    if (user.providerData.length <= 1) {
      throw new Error(
        'Cannot unlink Google account. You must have at least one authentication method.'
      );
    }

    try {
      const result = await unlink(user, AuthProvider.Google);
      await result.reload();
      await this.emitNextUser(result);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Changes the user's authentication email in Firebase Auth.
   * Sends verification email to the new address.
   * User's profile obj email field in Firestore updates is handled in healing logic.
   * @param newEmail The new email address to set
   */
  public async changeUserAuthEmail(newEmail: string): Promise<void> {
    const user = this.userSnapshot;
    if (!user) throw new Error('No user');

    await verifyBeforeUpdateEmail(user, newEmail);
    // userProfile email field change should be handled in healing logic
  }

  /**
   * Emits the next user to the subscribers of currentUser$.
   * This is used to update the UI after certain operations.
   * This shit is needed because signals don't emit if obj reference doesn't change
   * @param user
   */
  public async emitNextUser(user: AuthUser): Promise<void> {
    this.currentUser.next(null);
    await new Promise((resolve) => setTimeout(resolve, 0));
    this.currentUser.next(user);
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
      case 'auth/credential-already-in-use':
        message = 'This Google account is already linked to another user';
        break;
      case 'auth/provider-already-linked':
        message = 'Google account is already linked to this user';
        break;
      case 'auth/no-such-provider':
        message = 'This provider is not linked to your account';
        break;
      default:
        message = error.message || 'Authentication failed';
    }

    //this.notificationService.showError(message);
  }
}
