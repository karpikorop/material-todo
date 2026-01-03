import { Component, inject, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { PLACEHOLDER_AVATAR_URL, UserProfile } from '@shared/lib/models/user';
import { ProjectService } from '../../services/project-service/project.service';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth-service/auth.service';
import { NotificationService } from '../../services/notification-service/notification.service';
import { ProjectListItemComponent } from '../project-list-item/project-list-item.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '../dialogs/dialog-service/dialog.service';
import {
  AddProjectDialogComponent,
  AddProjectDialogData,
  AddProjectDialogState,
} from '../dialogs/add-project-dialog/add-project-dialog.component';
import { Project } from '@shared/lib/models/project';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    ProjectListItemComponent,
    MatTooltipModule,
    NgOptimizedImage,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected readonly PLACEHOLDER_AVATAR_URL = PLACEHOLDER_AVATAR_URL;
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  protected closeSidebar = output();

  protected userProfile$: Observable<UserProfile> = this.userService.currentUserProfile$;
  protected projects$: Observable<Project[]> = this.projectService.projects$;

  protected async addNewProject(): Promise<void> {
    const projConfig = await this.dialogService.openDialog<
      AddProjectDialogData,
      AddProjectDialogState
    >(
      AddProjectDialogComponent,
      {},
      {
        width: '500px',
      }
    );

    const name = projConfig?.name.trim();
    const icon = projConfig?.icon_name.trim();

    if (!name || !icon) {
      return;
    }

    const user = this.authService.userSnapshot;
    if (!user) {
      this.notificationService.showError('You must be logged in to add a project.');
      return;
    }

    try {
      const id = await this.projectService.addProject(name, user.uid);
      await this.router.navigate(['/app/project', id]);
      await this.projectService.updateProject(user.uid, id, { icon: icon });
    } catch (error) {
      this.notificationService.showError('Error adding project:', error);
    }
  }

  protected onClose(): void {
    this.closeSidebar.emit();
  }

  protected async logout() {
    await this.authService.logout();
  }
}
