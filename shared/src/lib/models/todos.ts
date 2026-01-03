import { FieldValue, Timestamp } from '@firebase/firestore';

export interface Todo {
  id: string; // Firestore ID
  userId: string;
  title: string;
  description?: string;
  status: 'todo' | 'done' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Timestamp;
  reminderDate?: Timestamp;
  projectId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type newTodoData = Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>;
