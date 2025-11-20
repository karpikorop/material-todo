import {Component, inject, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, map, take, firstValueFrom} from 'rxjs';

import {TodoItemComponent} from '../../components/todo-item/todo-item.component';
import {AddTodoComponent} from '../../components/add-todo/add-todo.component';
import {Todo, TodoService} from '../../services/todo-service/todo.service';
import {AuthService} from '../../services/auth-service/auth.service';
import {NotificationService} from '../../services/notification-service/notification.service';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {shareReplay, switchMap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../components/dialogs/confirmation-dialog/confirmation-dialog.component';
import {ProjectService} from '../../services/project-service/project.service';

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
  private todoService = inject(TodoService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);


  @ViewChild(AddTodoComponent) addTodoComponent!: AddTodoComponent;

  protected projectId$: Observable<string> = this.route.params.pipe(
    map((params) => params['id']),
    shareReplay(1)
  );

  protected todos$: Observable<Todo[]> = this.projectId$.pipe(
    switchMap((id: string) => this.todoService.getTodosByProject(id)),
    map(todos => todos.sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === 'done' ? 1 : -1;
    })),
    shareReplay(1)
  );

  constructor() {
  }

  // Lifecycle hook to focus the input field after the view is checked
  // Focus is set to the input field of the AddTodoComponent
  /* Disabled because it works bad on mobile(triggers keybord)
  ngAfterViewChecked(): void {
    if (this.addTodoComponent) {
      this.addTodoComponent.focusInput();
    }
  }*/

  protected updateTodo(event: {
    todoId: string;
    data: Partial<Omit<Todo, 'id'>>;
  }): void {
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.todoService
          .updateTodo(user.uid, event.todoId, event.data)
          .catch((err) =>
            this.notificationService.showError('Failed to update task.')
          );
      }
    });
  }

  protected deleteTodo(todoId: string): void {
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.todoService
          .deleteTodo(user.uid, todoId)
          .then(() => {
            this.notificationService.showSuccess('Task deleted successfully.');
          })
          .catch((err) =>
            this.notificationService.showError('Failed to delete task.')
          );
      }
    });
  }

  protected async deleteProject() {
    const currentProjectId = await firstValueFrom(this.projectId$);
    if (!currentProjectId) {
      this.notificationService.showError('Could not get project ID.');
      return;
    }
    // TODO improve check for inbox project
    if (currentProjectId === 'inbox') {
      this.notificationService.showError('Cannot delete Inbox project.');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Project',
        message: 'Are you sure you want to delete this project?',
        mainButtonText: 'Delete',
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        try {
          await this.router.navigate(['/app/project', 'inbox']);
          await this.projectService.deleteProject(currentProjectId); // TODO delete only todos, not project
        } catch (error: any) {
          this.notificationService.showError('Failed to delete project.', error);
        }
      }
    })
  }
}
