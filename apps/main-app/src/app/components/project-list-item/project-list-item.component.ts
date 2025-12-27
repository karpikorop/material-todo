import {Component, inject, input} from '@angular/core';
import {ProjectService} from '../../services/project-service/project.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NotificationService} from '../../services/notification-service/notification.service';
import {Router} from '@angular/router';
import {DialogService} from '../dialogs/dialog-service/dialog.service';
import {
  ConfirmationDialogComponent,
  ConfirmDialogData
} from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import {Project} from '@shared/lib/models/project';
import {
  AddProjectDialogComponent,
  AddProjectDialogData,
  AddProjectDialogState
} from '../dialogs/add-project-dialog/add-project-dialog.component';
import {UserService} from '../../services/user-service/user.service';

@Component({
  selector: 'project-list-item',
  imports: [
    MatIconModule,
    RouterLinkActive,
    RouterLink,
    MatIconButton,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './project-list-item.component.html',
  styleUrl: './project-list-item.component.scss',
})
export class ProjectListItemComponent {
  private notificationService = inject(NotificationService);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private userService = inject(UserService);
  protected isHidden = false;

  public project = input.required<Project>();

  protected async deleteProject() {
    if(this.checkInbox()) return;

    const result = await this.dialogService.openDialog<ConfirmDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        title: 'Delete Project',
        message: `Are you sure you want to delete ${this.project().name} project?`,
        mainButtonText: 'Delete',
      },
      {
        width: '400px',
      }
    );

    if (!result) {
      return;
    }

    try {
      // TODO improve the router, maybe create a Router Service
      if (this.router.url.includes(`/app/project/${this.project().id}`)) {
        await this.router.navigate(['/app/project', 'inbox']);
      }
      this.isHidden = true;

      await this.projectService.deleteProject(this.project().id);
    } catch (error: any) {
      this.notificationService.showError('Failed to delete project. Please try again later.', error);
      this.isHidden = false;
    }
  }

  protected async editProject() {
    if(this.checkInbox()) return;

    const projConfig = await this.dialogService.openDialog<AddProjectDialogData, AddProjectDialogState>(
      AddProjectDialogComponent, {
        editMode: true,
        currentState: {
          name: this.project().name,
          icon_name: this.project().icon,
        }
      }, {
        width: '500px',
      }
    );

    const name = projConfig?.name.trim();
    const icon = projConfig?.icon_name.trim();
    if (!name || !icon) {
      return;
    }

    if(this.isProjectNameChanged(name) || this.isProjectIconChanged(icon)){
      try {
        const userId = this.userService.currentUser?.id;
        if (!userId) {
          throw new Error('You must be logged in to edit a project.');
        }
        await this.projectService.updateProject(userId, this.project().id, {name: name, icon: icon});
      } catch (error) {
        this.notificationService.showError(
          'Error editing project:', error
        );
      }
    }

  }

  private isProjectNameChanged(name: string, current_name = this.project().name): boolean {
    return current_name !== name;
  }

  private isProjectIconChanged(icon: string, current_icon = this.project().icon): boolean {
    return current_icon !== icon;
  }

  private checkInbox(id = this.project().id): boolean {
    // TODO improve check for inbox project, maybe disable the edit button
    if (id === 'inbox') {
      this.notificationService.showError('Cannot delete Inbox project.');
      return true;
    }
    return false;
  }
}
