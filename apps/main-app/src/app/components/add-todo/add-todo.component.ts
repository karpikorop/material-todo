import {Component, EventEmitter, Input, Output, inject, ViewChild, ElementRef} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {take} from 'rxjs/operators';
import {TodoService} from '../../services/todo-service/todo.service';
import {AuthService} from '../../services/auth-service/auth.service';
import {NotificationService} from '../../services/notification-service/notification.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {IS_MOBILE} from '../../tokens';
import {MatTooltip} from '@angular/material/tooltip';


@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip
],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss',
})
export class AddTodoComponent {
  @Input({required: true}) projectId!: string;
  @Output() todoAdded = new EventEmitter<void>();
  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  protected isMobileView = inject(IS_MOBILE);

  addTodoForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
  });

  /* TODO Works bad on the mobile
  public focusInput(): void {
    if (this.taskInput && this.taskInput.nativeElement) {
      this.taskInput.nativeElement.focus();
    }
  }*/

  onSubmit(): void {
    if (this.addTodoForm.invalid) {
      return;
    }

    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        const newTodoData = {
          title: this.addTodoForm.value.title,
          projectId: this.projectId,
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
