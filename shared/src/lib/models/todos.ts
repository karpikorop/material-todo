import { FieldValue, Timestamp } from '@firebase/firestore';

export interface Todo {
  id: string; // Firestore ID
  userId: string;
  title: string;
  description?: string;
  status: 'todo' | 'done' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Timestamp | FieldValue;
  reminderDate?: Timestamp | FieldValue;
  projectId: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export type newTodoData = Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>;
