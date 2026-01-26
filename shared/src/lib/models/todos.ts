import { Timestamp } from '@firebase/firestore';
import {WithId} from './withId';

export interface BaseItem extends WithId {
  userId: string;
  projectId: string;

  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Task extends BaseItem {
  type: ItemType.TASK;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface Event extends BaseItem {
  type: ItemType.EVENT;
}

export enum ItemType {
  TASK = 'task',
  EVENT = 'event'
}

export enum TaskStatus {
  TODO = 'todo',
  DONE = 'done',
  IN_PROGRESS = 'in_progress',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export type ScheduledItem = Task | Event;


type SystemFields = 'id' | 'userId' | 'createdAt' | 'updatedAt';

export type newTaskData = Omit<Task, SystemFields>;
