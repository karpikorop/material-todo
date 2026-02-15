import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, take, firstValueFrom } from 'rxjs';

import { TodoItemComponent } from '../../components/todo-item/todo-item.component';
import { AddTodoComponent } from '../../components/add-todo/add-todo.component';
import { EntryService } from '../../services/entry-service/entry.service';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { NotificationService } from '../../services/notification-service/notification.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { shareReplay, switchMap } from 'rxjs/operators';
import {
  ConfirmationDialogComponent,
  ConfirmDialogData,
} from '../../components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ProjectService } from '../../services/project-service/project.service';
import { INBOX_ID, Task, TaskStatus } from '@shared';
import { DialogService } from '../../components/dialogs/dialog-service/dialog.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    TodoItemComponent,
    AddTodoComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private entryService = inject(EntryService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private projectService = inject(ProjectService);
  private dialogService = inject(DialogService);

  @ViewChild(AddTodoComponent) addTodoComponent!: AddTodoComponent;

  protected projectId$: Observable<string> = this.route.params.pipe(
    map((params) => params['id']),
    shareReplay(1)
  );

  protected todos$: Observable<Task[]> = this.projectId$.pipe(
    switchMap((id: string) => this.entryService.getTasksByProject(id)),
    map((todos) =>
      todos.sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === TaskStatus.DONE ? 1 : -1;
      })
    ),
    shareReplay(1)
  );

  // Lifecycle hook to focus the input field after the view is checked
  // Focus is set to the input field of the AddTodoComponent
  /* Disabled because it works bad on mobile(triggers keybord)
  ngAfterViewChecked(): void {
    if (this.addTodoComponent) {
      this.addTodoComponent.focusInput();
    }
  }*/

  protected updateTodo(event: { todoId: string; data: Partial<Omit<Task, 'id'>> }): void {
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.entryService
          .updateTodo(user.uid, event.todoId, event.data)
          .catch(() => this.notificationService.showError('Failed to update task.'));
      }
    });
  }

  protected deleteTodo(todoId: string): void {
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.entryService
          .deleteTodo(user.uid, todoId)
          .then(() => {
            this.notificationService.showSuccess('Task deleted successfully.');
          })
          .catch(() => this.notificationService.showError('Failed to delete task.'));
      }
    });
  }

  protected async deleteProject() {
    const currentProjectId = await firstValueFrom(this.projectId$);
    if (!currentProjectId) {
      this.notificationService.showError('Could not get project ID.');
      return;
    }

    if (currentProjectId === INBOX_ID) {
      this.notificationService.showError('Cannot delete Inbox project.');
      return;
    }
    const result = await this.dialogService.openDialog<ConfirmDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        title: 'Delete Project',
        message: 'Are you sure you want to delete this project?',
        mainButtonText: 'Delete',
      },
      {
        width: '400px',
      }
    );

    if (result) {
      try {
        await this.router.navigate(['/app/project', 'inbox']);
        await this.projectService.deleteProject(currentProjectId); // TODO delete only todos, not project
      } catch (error: any) {
        this.notificationService.showError('Failed to delete project.', error);
      }
    }
  }
}
