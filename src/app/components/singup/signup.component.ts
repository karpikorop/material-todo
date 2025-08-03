import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { UserCredential } from '@angular/fire/auth';
import { MatIconModule } from '@angular/material/icon';

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
  protected signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  protected async onSubmit(): Promise<void> {
    const data = this.signUpForm.value;
    await this.authService.signUp(data.email, data.password).then(
      () => {
        this.router.navigate(['/app']);
      },
      (error) => {
        console.error('Error signing up:', error);
        throw error;
      }
    );
  }

  protected loginWithGoogle(): void {
    this.authService.loginWithGoogle().then(
      () => {
        this.router.navigate(['/app']);
      },
      (error) => {
        console.error('Error logging in with Google:', error);
        throw error;
      }
    );
  }
}
