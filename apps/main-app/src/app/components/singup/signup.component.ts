import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {RouterLink, Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {AuthService} from '../../services/auth-service/auth.service';
import {MatIconModule} from '@angular/material/icon';
import {NotificationService} from '../../services/notification-service/notification.service';

@Component({
  selector: 'app-signup',
  imports: [
    RouterLink,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  protected signUpForm: FormGroup;

  constructor() {
    this.signUpForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  protected async onSubmit(): Promise<void> {
    const data = this.signUpForm.value;
    try {
      await this.authService.signUp(data.email, data.password);
      this.notificationService.showInfo(
        'Verification email sent. Please check your inbox. Check spam folder if not found.'
      );
      await this.router.navigate(['/app']);
    } catch (error) {
      this.notificationService.showError("Error signing up");
      console.error('Error signing up:', error);
    }
  }

  protected async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.loginWithGoogle();
      await this.router.navigate(['/app']);
    } catch (error) {
      this.notificationService.showError("Error logging in with Google");
      console.error('Error logging in with Google:', error);
    }
  }
}
