import { Timestamp } from '@firebase/firestore';
import {WithId} from './withId';

export interface Todo extends WithId {
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
