import {Component, inject} from '@angular/core';
import {MatTabsModule, MatTabGroup} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { PasswordManagementComponent } from './components/password-management/password-management.component';
import { DangerZoneComponent } from './components/danger-zone/danger-zone.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PersonalizationComponent } from './components/personalization/personalization.component';
import { DataManagementComponent } from './components/data-management/data-management.component';
import {UserService} from '../../services/user-service/user.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [
    MatTabGroup,
    MatTabsModule,
    MatIconModule,
    ProfileFormComponent,
    PasswordManagementComponent,
    DangerZoneComponent,
    NotificationsComponent,
    PersonalizationComponent,
    DataManagementComponent,
    AsyncPipe
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
protected userService = inject(UserService);


}
