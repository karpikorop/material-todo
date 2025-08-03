import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap, take } from 'rxjs';

import { TodoItemComponent } from '../../components/todo-item/todo-item.component';
import { AddTodoComponent } from '../../components/add-todo/add-todo.component';
import { Todo, TodoService } from '../../services/todo-service/todo.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { NotificationService } from '../../services/notification-service/notification.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    TodoItemComponent,
    AddTodoComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  private route = inject(ActivatedRoute);
  private todoService = inject(TodoService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  public projectId$: Observable<string> = this.route.params.pipe(
    map((params) => params['id'])
  );

  public todos$: Observable<Todo[]> = this.todoService.getTodosByProject(
    this.projectId$
  );

  constructor() {}

  handleUpdate(event: {
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

  handleDelete(todoId: string): void {
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
}
