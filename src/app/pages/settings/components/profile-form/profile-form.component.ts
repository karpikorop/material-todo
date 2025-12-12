import {Component, input, output, effect} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UserProfile} from '../../../../services/user-service/user.service';

@Component({
  selector: 'profile-form-settings',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss'
})
export class ProfileFormComponent {
  public userProfile = input.required<UserProfile | null>();
  public profileUpdate = output<Partial<UserProfile>>();
  public isEmailEditable = input.required<boolean>();

  protected profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]]
    });

    // Use effect to react to userProfile signal changes
    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        this.profileForm.patchValue({
          username: profile.username || '',
          email: profile.email || ''
        });
      }
    });

    // Use effect to disable/enable email field based on isEmailEditable
    effect(() => {
      const emailControl = this.profileForm.get('email');
      if (emailControl) {
        if (this.isEmailEditable()) {
          emailControl.enable();
        } else {
          emailControl.disable();
        }
      }
    });
  }

  protected onSubmit() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;

      const updateData: Partial<UserProfile> = {
        username: formValue.username
      };

      if (formValue.email !== this.userProfile()?.email) {
        updateData.email = formValue.email;
      }

      this.profileUpdate.emit(updateData);
    }
  }

  protected get userAvatarUrl(): string {
    return this.userProfile()?.avatarUrl || `https://ui-avatars.com/api/?name=${this.userProfile()?.username}&background=random`;
  }

  protected isSaveEnabled(): boolean {
    const userNameChanged = this.userProfile()?.username !== this.profileForm.value.username;
    const userEmailChanged = this.userProfile()?.email !== this.profileForm.value.email && this.profileForm.value.email.trim();
    return this.profileForm.valid && (userNameChanged || userEmailChanged);
  }


}
