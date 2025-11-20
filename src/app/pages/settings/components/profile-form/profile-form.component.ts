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
  selector: 'app-profile-form',
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

  protected profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
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
  }

  protected onSubmit() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      this.profileUpdate.emit({
        username: formValue.username,
        email: formValue.email
      });
    }
  }

  protected isSaveEnabled(): boolean {
    const userNameChanged = this.userProfile()?.username !== this.profileForm.value.username;
    const userEmailChanged = this.userProfile()?.email !== this.profileForm.value.email;
    return this.profileForm.valid && (userNameChanged || userEmailChanged);
  }
}
