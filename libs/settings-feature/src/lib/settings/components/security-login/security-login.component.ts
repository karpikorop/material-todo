import { Component, effect, input, output, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider, AuthUser } from 'auth-data-access';
import { MatDivider } from '@angular/material/list';
import { InfoBannerComponent, WarningBannerComponent } from 'shared-ui';

@Component({
  selector: 'security-login-settings',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDivider,
    InfoBannerComponent,
    WarningBannerComponent,
  ],
  templateUrl: './security-login.component.html',
  styleUrl: './security-login.component.scss',
})
export class SecurityLoginComponent {
  public user = input.required<AuthUser>();
  public emailUpdate = output<string>();
  public googleAccountChange = output<void>();
  public googleAccountRemove = output<void>();
  public googleAccountLink = output<void>();
  public passwordReset = output<void>();

  protected emailForm: FormGroup;

  protected passwordProvider = computed(() => {
    return this.user()?.providerData.find((p) => p.providerId === AuthProvider.Password);
  });

  protected googleProvider = computed(() => {
    return this.user()?.providerData.find((p) => p.providerId === AuthProvider.Google);
  });

  protected hasPasswordProvider = computed(() => !!this.passwordProvider());
  protected hasGoogleProvider = computed(() => !!this.googleProvider());

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    // Use effect to react to user changes
    effect(() => {
      const currentUser = this.user();
      const passwordProv = this.passwordProvider();
      if (currentUser && passwordProv) {
        this.emailForm.patchValue({
          email: passwordProv.email || '',
        });
      }
    });

    // Use effect to disable/enable email field based on password provider existence
    effect(() => {
      const emailControl = this.emailForm.get('email');
      if (emailControl) {
        if (this.hasPasswordProvider()) {
          emailControl.enable();
        } else {
          emailControl.disable();
        }
      }
    });
  }

  protected onEmailChange() {
    if (this.emailForm.valid && this.isEmailChanged()) {
      this.emailUpdate.emit(this.emailForm.value.email);
    }
    this.emailForm.setValue({
      email: this.passwordProvider()?.email,
    });
  }

  protected isEmailChanged(): boolean {
    const passwordProv = this.passwordProvider();
    return passwordProv?.email !== this.emailForm.value.email && this.emailForm.value.email.trim();
  }

  protected isSaveEnabled(): boolean {
    return this.emailForm.valid && this.isEmailChanged();
  }

  protected onGoogleAccountLink() {
    this.googleAccountLink.emit();
  }

  protected onGoogleAccountChange() {
    this.googleAccountChange.emit();
  }

  protected onGoogleAccountRemove() {
    this.googleAccountRemove.emit();
  }

  protected onPasswordReset() {
    this.passwordReset.emit();
  }
}
