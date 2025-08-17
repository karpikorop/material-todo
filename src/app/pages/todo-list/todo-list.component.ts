import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Observable, map, take} from 'rxjs';

import {TodoItemComponent} from '../../components/todo-item/todo-item.component';
import {AddTodoComponent} from '../../components/add-todo/add-todo.component';
import {Todo, TodoService} from '../../services/todo-service/todo.service';
import {AuthService} from '../../services/auth-service/auth.service';
import {NotificationService} from '../../services/notification-service/notification.service';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Functions, httpsCallable} from '@angular/fire/functions';
import {shareReplay, switchMap} from 'rxjs/operators';

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
  private todoService = inject(TodoService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private readonly functions = inject(Functions);

  protected projectId$: Observable<string> = this.route.params.pipe(
    map((params) => params['id']),
    shareReplay(1)
  );

  protected todos$: Observable<Todo[]> = this.projectId$.pipe(
    switchMap((id: string) => this.todoService.getTodosByProject(id)),
    shareReplay(1)
  );

  constructor() {
  }

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
    const confirmed = window.confirm('Delete this project and all its tasks?');
    if (!confirmed) {
      return;
    }
    const deleteProjectFn = httpsCallable(this.functions, 'deleteProjectAndTodos');

    try {
      console.log(`Calling cloud function to delete project: ${this.projectId$}`);
      const result = await deleteProjectFn({projectId: this.projectId$});
      console.log('Cloud function executed successfully:', result.data);
    } catch (error: any) {
      console.error(`Error from cloud function (${error.code}):`, error.message);
      throw error;
    }
  }
}
