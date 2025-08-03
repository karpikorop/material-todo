import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { take } from 'rxjs/operators';

// Сервіси
import { TodoService } from '../../services/todo-service/todo.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { NotificationService } from '../../services/notification-service/notification.service';

// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss',
})
export class AddTodoComponent {
  @Input({ required: true }) projectId!: string;
  @Output() todoAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  addTodoForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.addTodoForm.invalid) {
      return;
    }

    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        const newTodoData = {
          title: this.addTodoForm.value.title,
          projectId: this.projectId,
          status: 'todo' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        this.todoService
          .addTodo(newTodoData, user.uid)
          .then(() => {
            this.addTodoForm.reset();
            this.todoAdded.emit();
          })
          .catch((error) => {
            console.error('Error adding todo:', error);
            this.notificationService.showError('Failed to add task.');
          });
      }
    });
  }

  openDetailsDialog(): void {
    this.notificationService.showInfo(
      'This feature is not implemented yet. Please use the form on the left to add tasks.'
    );
    // This method can be used to open a dialog for more detailed task creation
    // Currently, it does nothing but can be implemented later if needed
  }
}
