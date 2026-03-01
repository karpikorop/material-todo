import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'auth-data-access';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from 'core-data-access';

@Component({
  selector: 'lib-login',
  imports: [
    RouterLink,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  protected loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.authService.currentUser$.pipe(takeUntilDestroyed()).subscribe((user) => {
      if (user) {
        this.router.navigate(['/app']).then();
      }
    });
  }

  protected async onSubmit(): Promise<void> {
    const data = this.loginForm.value;
    try {
      await this.authService.logIn(data.email, data.password);
      await this.router.navigate(['/app']);
    } catch (error) {
      this.notificationService.showError('Error logging in');
      console.error('Error logging in:', error);
    }
  }

  protected async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.loginWithGoogle();
      await this.router.navigate(['/app']);
    } catch (error) {
      this.notificationService.showError('Error logging in with Google');
      console.error('Error logging in with Google:', error);
    }
  }
}
