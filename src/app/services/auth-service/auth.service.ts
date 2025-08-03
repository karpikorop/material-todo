import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
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
} from '@angular/fire/auth';
import { NotificationService } from '../notification-service/notification.service';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private notificationService = inject(NotificationService);

  public user$: Observable<User | null> = authState(this.auth).pipe(
    tap((user) => {
      console.log('authState in AuthService emitted:', user);
    }),
    shareReplay(1)
  );

  constructor() {
    console.log('AuthService constructor - Injected Auth:', this.auth);
    this.user$.subscribe((user) => {
      if (user) {
        console.log('User logged in:', user);
      } else {
        console.log('User logged out.');
      }
    });
  }

  get currentUser$(): Observable<User | null> {
    return this.user$;
  }

  public signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(userCredential.user);
        this.notificationService.showInfo(
          'Verification email sent. Please check your inbox. Check spam folder if not found.'
        );
        return userCredential;
      })
      .catch((error) => {
        this.handleAuthError(error);
        throw error;
      });
  }

  public logIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password).catch(
      (error) => {
        this.handleAuthError(error);
        throw error;
      }
    );
  }

  public loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(this.auth, provider).catch((error) => {
      this.handleAuthError(error);
      throw error;
    });
  }

  public logout(): Promise<void> {
    return signOut(this.auth).catch((error) => {
      this.handleAuthError(error);
      throw error;
    });
  }

  private handleAuthError(error: any): void {
    let message = 'An error occurred during authentication';

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
