import {Component, inject, input} from '@angular/core';
import {Project, ProjectService} from '../../services/project-service/project.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NotificationService} from '../../services/notification-service/notification.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../dialogs/confirmation-dialog/confirmation-dialog.component';

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
  private dialog = inject(MatDialog);
  protected isHidden = false;

  public project = input.required<Project>();

  protected async deleteProject() {
    // TODO improve check for inbox project
    if (this.project().id === 'inbox') {
      this.notificationService.showError('Cannot delete Inbox project.');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Project',
        message: `Are you sure you want to delete ${this.project().name} project?`,
        mainButtonText: 'Delete',
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
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
    });
  }
}
