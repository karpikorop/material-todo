import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { SecurityLoginComponent } from './components/security-login/security-login.component';
import { DangerZoneComponent } from './components/danger-zone/danger-zone.component';
import { PersonalizationComponent } from './components/personalization/personalization.component';
import { UserService } from '../../services/user-service/user.service';
import { AsyncPipe } from '@angular/common';
import { NotificationService } from '../../services/notification-service/notification.service';
import {
  ConfirmationDialogComponent,
  ConfirmDialogData,
} from '../../components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  PasswordDialogData,
  PasswordInputDialogComponent,
} from '../../components/dialogs/password-input-dialog/password-input-dialog.component';
import { AuthService } from '../../services/auth-service/auth.service';
import { DialogService } from '../../components/dialogs/dialog-service/dialog.service';
import { UserProfileInterface } from '@shared';

@Component({
  selector: 'app-settings',
  imports: [
    MatTabsModule,
    MatIconModule,
    ProfileFormComponent,
    SecurityLoginComponent,
    DangerZoneComponent,
    PersonalizationComponent,
    AsyncPipe,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  protected userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);
  protected authService = inject(AuthService);
  private dialogService = inject(DialogService);

  public async updateProfile(userProfile: Partial<UserProfileInterface>) {
    try {
      await this.userService.updateUserProfile(userProfile);
      this.notificationService.showSuccess('Profile updated successfully');
    } catch (error: any) {
      this.notificationService.showError('Failed to update profile:', error);
    }
  }

  public async updateEmail(email: string) {
    const result = await this.dialogService.openDialog<ConfirmDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        title: 'Email change confirmation',
        message: `Are you sure you want to change email to "${email}"?`,
        mainButtonText: 'Yes',
        secondaryButtonText: 'No',
      },
      {
        width: '500px',
      }
    );

    if (!result) {
      return;
    }

    const password = await this.dialogService.openDialog<PasswordDialogData, string>(
      PasswordInputDialogComponent,
      {
        title: 'Enter your password',
        message: 'Enter your password to confirm email change.',
      },
      {
        width: '500px',
      }
    );

    if (!password?.trim()) {
      return;
    }

    try {
      await this.authService.reauthenticate(password);
      await this.authService.changeUserAuthEmail(email);
      this.notificationService.showSuccess(
        `Email verification sent to "${email}". Please check your email to confirm the change.`,
        9999
      );
    } catch (error: any) {
      this.notificationService.showError('Failed to update email:', error);
    }
  }

  public async handleGoogleAccountChange() {
    const confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Change Google Account',
        message:
          'This will disconnect your current Google account and allow you to link a different one. Continue?',
        mainButtonText: 'Yes, Change',
        secondaryButtonText: 'Cancel',
      },
      width: '500px',
    });

    confirmDialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (!result) {
        return;
      }

      try {
        await this.authService.unlinkGoogleAccount();
        await this.authService.linkGoogleAccount();
        this.notificationService.showSuccess('Google account changed successfully');
      } catch (error: any) {
        this.notificationService.showError('Failed to change Google account:', error);
      }
    });
  }

  public async handleGoogleAccountLink() {
    try {
      await this.authService.linkGoogleAccount();
      this.notificationService.showSuccess('Google account linked successfully');
    } catch (error: any) {
      this.notificationService.showError('Failed to link Google account:', error);
    }
  }

  public async handleGoogleAccountRemove() {
    const confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Disconnect Google Account',
        message:
          'Are you sure you want to disconnect your Google account? You will only be able to sign in with your password.',
        mainButtonText: 'Yes, Disconnect',
        secondaryButtonText: 'Cancel',
      },
      width: '500px',
    });

    confirmDialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (!result) {
        return;
      }

      try {
        await this.authService.unlinkGoogleAccount();
        this.notificationService.showSuccess('Google account disconnected successfully');
      } catch (error: any) {
        this.notificationService.showError('Failed to disconnect Google account:', error);
      }
    });
  }

  protected async uploadUserAvatar(file: File) {
    try {
      this.notificationService.showInfo('Uploading...');
      await this.userService.uploadUserAvatar(file);
      this.notificationService.showSuccess('Avatar updated!');
    } catch (err) {
      this.notificationService.showError('Upload failed', err);
    }
  }

  protected async resetUserAvatar() {
    try {
      await this.userService.resetUserAvatar();
    } catch (err) {
      this.notificationService.showError('Upload failed', err);
    }
  }

  protected async resetUserPassword() {
    const response = await this.dialogService.openDialog<ConfirmDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        title: 'Reset Password',
        message: 'Are you sure you want to reset your password?',
        mainButtonText: 'Set Reset Email',
      }
    );
    if (!response) {
      return;
    }
    this.authService
      .sendPasswordResetEmail()
      .then(() => {
        this.notificationService.showInfo('Password reset email sent. Please check your inbox.');
      })
      .catch((error: any) => {
        this.notificationService.showError('Failed to send password reset email:', error);
      });
  }
}
