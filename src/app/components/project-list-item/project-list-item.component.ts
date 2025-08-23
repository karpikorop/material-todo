import { Component, inject, input } from '@angular/core';
import { Project } from '../../services/project-service/project.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '../../services/notification-service/notification.service';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Router } from '@angular/router';

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
  private functions = inject(Functions);
  private router = inject(Router);

  public project = input.required<Project>();

  protected async deleteProject() {
    // TODO improve check for inbox project
    if (this.project().id === 'inbox') {
      this.notificationService.showError('Cannot delete Inbox project.');
      return;
    }
    const confirmed = window.confirm(
      `Delete project ${this.project().name} and all its tasks?`
    );
    if (!confirmed) {
      return;
    }

    try {
      const deleteProjectFn = httpsCallable(
        this.functions,
        'deleteProjectAndTodos'
      );
      console.log(
        `Calling cloud function to delete project: ${this.project().name}`
      );
      const result = await deleteProjectFn({ projectId: this.project().id });
      console.log('Cloud function executed successfully:', result.data);
      await this.router.navigate(['/app/project', 'inbox']);
    } catch (error: any) {
      console.error(
        `Error from cloud function (${error.code}):`,
        error.message
      );
      throw error;
    }
  }
}
