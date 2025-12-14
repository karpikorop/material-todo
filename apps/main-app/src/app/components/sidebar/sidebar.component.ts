import {Component, inject, output} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Observable, take} from 'rxjs';
import {
  UserService, PLACEHOLDER_AVATAR_URL, UserProfile,
} from '../../services/user-service/user.service';
import {
  ProjectService,
  Project,
} from '../../services/project-service/project.service';

import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {AuthService} from '../../services/auth-service/auth.service';
import {NotificationService} from '../../services/notification-service/notification.service';
import {ProjectListItemComponent} from '../project-list-item/project-list-item.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import {StringInputDialogComponent} from '../dialogs/string-input-dialog/string-input-dialog.component';

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
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  protected close = output();

  protected userProfile$: Observable<UserProfile> =
    this.userService.currentUserProfile$;
  protected projects$: Observable<Project[]> = this.projectService.projects$;

  constructor() {
  }

  protected addNewProject(): void {

    const dialogRef = this.dialog.open(StringInputDialogComponent, {
      data: {
        title: 'Add new project',
        message: 'Enter project name',
        placeholder: 'Project name',
        mainButtonText: 'Add project',
      },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((newProjectName: string) => {
      if (newProjectName?.trim()) {
        this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
          if (user) {
            this.projectService
              .addProject(newProjectName.trim(), user.uid)
              .then((id) => {
                this.router.navigate(['/app/project', id]).then();
              })
              .catch((error) => {
                this.notificationService.showError(
                  'Error adding project:', error
                );
              });
          } else {
            this.notificationService.showError(
              'You must be logged in to add a project.'
            );
          }
        });
      }
    })
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected async logout() {
    await this.authService.logout();
  }

  protected readonly PLACEHOLDER_AVATAR_URL = PLACEHOLDER_AVATAR_URL;
}
