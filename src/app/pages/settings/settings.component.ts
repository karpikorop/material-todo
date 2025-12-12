import {Component, inject} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { PasswordManagementComponent } from './components/password-management/password-management.component';
import { DangerZoneComponent } from './components/danger-zone/danger-zone.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PersonalizationComponent } from './components/personalization/personalization.component';
import {UserProfile, UserService} from '../../services/user-service/user.service';
import {AsyncPipe} from '@angular/common';
import {NotificationService} from '../../services/notification-service/notification.service';
import {ConfirmationDialogComponent} from '../../components/dialogs/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {
  PasswordInputDialogComponent
} from '../../components/dialogs/password-input-dialog/password-input-dialog.component';
import {AuthService} from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-settings',
  imports: [
    MatTabsModule,
    MatIconModule,
    ProfileFormComponent,
    PasswordManagementComponent,
    DangerZoneComponent,
    NotificationsComponent,
    PersonalizationComponent,
    AsyncPipe
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  protected userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);
  protected authService = inject(AuthService);

  async updateProfile(userProfile: Partial<UserProfile>) {
    const email = userProfile.email;
    if (email) {
      this.handleEmailChange(userProfile, email);
    }

      try {
        await this.userService.updateUserProfile(userProfile);
      } catch (error: any) {
        this.notificationService.showError('Failed to update profile:', error);
      }


  }

  private handleEmailChange(userProfile: Partial<UserProfile>, email: string) {
    const confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Email change confirmation',
        message: `Are you sure you want to change email to "${userProfile.email}"?`,
        mainButtonText: 'Yes',
        secondaryButtonText: 'No'
      },
      width: '500px',
    });

    confirmDialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (!result) {
        return;
      }

      const passwordEnterDialogRef = this.dialog.open(PasswordInputDialogComponent, {
        data: {
          title: 'Enter your password',
          message: 'Enter your password to confirm email change.',
        },
        width: '500px',
      });

      passwordEnterDialogRef.afterClosed().subscribe(async (result: string) => {
        if (!result?.trim()) {
          return;
        }

        try {
          await this.authService.reauthenticate(result);
          await this.userService.changeUserAuthEmail(email);
          this.notificationService.showSuccess(`Email verification sent to "${email}". Please check your email to confirm the change.`, 9999);
        } catch (error: any) {
          this.notificationService.showError('Failed to update profile:', error);
        }
      });
    });
  }
}
