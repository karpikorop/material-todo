import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EntryService } from 'entries-data-access';
import { NotificationService, IS_MOBILE } from 'core-data-access';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { EntryType, TaskStatus, newTaskData } from '@shared';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
  ],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss',
})
export class AddTodoComponent {
  @Input({ required: true }) projectId!: string;
  @Output() todoAdded = new EventEmitter<void>();
  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  private entryService = inject(EntryService);
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

    const newTodoData: newTaskData = {
      type: EntryType.TASK,
      title: this.addTodoForm.value.title,
      projectId: this.projectId,
      status: TaskStatus.TODO,
    };

    this.entryService
      .addTodo(newTodoData)
      .then(() => {
        this.addTodoForm.reset();
        this.todoAdded.emit();
      })
      .catch((error) => {
        console.error('Error adding todo:', error);
        this.notificationService.showError('Failed to add task.');
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
