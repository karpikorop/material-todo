import {Component, inject, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Observable, take} from 'rxjs';
import {
  UserService,
  UserProfile,
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
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);

  public close = output();

  protected userProfile$: Observable<UserProfile | null> =
    this.userService.currentUserProfile$;
  protected projects$: Observable<Project[]> = this.projectService.projects$;

  constructor() {
  }

  addNewProject(): void {
    const newProjectName = prompt('Enter a name for the new project:');

    if (newProjectName && newProjectName.trim() !== '') {
      this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
        if (user) {
          this.projectService
            .addProject(newProjectName.trim(), user.uid)
            .then(() => {
              this.notificationService.showSuccess(
                `Project "${newProjectName}" created!`
              );
            })
            .catch((error) => {
              console.error('Error adding project:', error);
              this.notificationService.showError(
                'Failed to create the project.'
              );
            });
        } else {
          this.notificationService.showError(
            'You must be logged in to add a project.'
          );
        }
      });
    }
  }

  protected onClose(): void {
    this.close.emit();
  }
}
