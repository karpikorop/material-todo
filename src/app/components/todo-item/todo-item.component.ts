import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Todo } from '../../services/todo-service/todo.service';
import { inject } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '../../services/notification-service/notification.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  private notificationService = inject(NotificationService);
  @Input({ required: true }) todo!: Todo;

  @Output() update = new EventEmitter<Partial<Omit<Todo, 'id'>>>();
  @Output() delete = new EventEmitter<string>();

  isHovered = signal(false);

  onStatusChange(checked: boolean): void {
    const newStatus = checked ? 'done' : 'todo';
    this.update.emit({ status: newStatus });
  }

  onDelete(): void {
    this.delete.emit(this.todo.id);
  }

  onEdit(): void {
    this.notificationService.showInfo(
      'Edit functionality is not implemented yet.'
    );
    console.log('Edit clicked for todo:', this.todo.id);
  }

  onSetTime(): void {
    this.notificationService.showInfo(
      'Set time functionality is not implemented yet.'
    );
    console.log('Set time clicked for todo:', this.todo.id);
  }
}
