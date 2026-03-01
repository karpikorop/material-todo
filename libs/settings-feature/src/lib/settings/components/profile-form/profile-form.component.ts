import { Component, input, output, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PLACEHOLDER_AVATAR_URL, UserProfile, UserProfileInterface } from '@shared';
import { NotificationService } from 'core-data-access';

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
  styleUrl: './profile-form.component.scss',
})
export class ProfileFormComponent {
  public userProfile = input.required<UserProfile>();
  public profileUpdate = output<Partial<UserProfileInterface>>();
  public avatarUpload = output<File>();
  public avatarReset = output<void>();

  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  protected profileForm: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
    });

    // Use effect to react to userProfile signal changes
    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        this.profileForm.patchValue({
          username: profile.username || '',
        });
      }
    });
  }

  protected onSubmit() {
    if (this.profileForm.valid && this.isUsernameChanged()) {
      const updateData: Partial<UserProfileInterface> = {
        username: this.profileForm.value.username,
      };

      this.profileUpdate.emit(updateData);
    }
  }

  protected get userAvatarUrl(): string {
    return this.userProfile()?.avatarUrl || PLACEHOLDER_AVATAR_URL;
  }

  protected isUsernameChanged(): boolean {
    return this.userProfile()?.username !== this.profileForm.value.username;
  }

  protected isSaveEnabled(): boolean {
    return this.profileForm.valid && this.isUsernameChanged();
  }

  protected onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.notificationService.showError('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.notificationService.showError('Image is too large. Max 2MB.');
      return;
    }
    this.avatarUpload.emit(file);
    input.value = '';
  }

  protected onAvatarReset() {
    this.avatarReset.emit();
  }
}
