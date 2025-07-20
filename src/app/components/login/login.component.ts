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
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
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
  protected loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  protected async onSubmit(): Promise<void> {
    const data = this.loginForm.value;
    await this.authService.logIn(data.email, data.password).then(
      (userCredential: UserCredential) => {
        console.log('User signed up successfully:', userCredential);
        this.router.navigate(['/app/todos']);
      },
      (error) => {
        console.error('Error signing up:', error);
        throw error;
      }
    );
  }

  protected loginWithGoogle(): void {
    this.authService.loginWithGoogle().then(
      (userCredential: UserCredential) => {
        console.log('User logged in with Google:', userCredential);
        this.router.navigate(['/app/todos']);
      },
      (error) => {
        console.error('Error logging in with Google:', error);
        throw error;
      }
    );
  }
}
