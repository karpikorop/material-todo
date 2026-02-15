import { WithId } from './withId';
import { FireTimestamp } from './fire-timestamp';

export interface BaseEntry extends WithId {
  userId: string;
  projectId: string;

  title: string;
  description?: string;

  isAllDay?: boolean;

  createdAt: FireTimestamp;
  updatedAt: FireTimestamp;
}

export interface DateRange {
  /** ISO 8601 date time string **/
  startTime: string;
  /** ISO 8601 date time string **/
  endTime: string;
}

export interface Task extends BaseEntry, Partial<DateRange> {
  type: EntryType.TASK;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface Event extends BaseEntry, DateRange {
  type: EntryType.EVENT;
}

export enum EntryType {
  TASK = 'task',
  EVENT = 'event',
}

export enum TaskStatus {
  TODO = 'todo',
  DONE = 'done',
  IN_PROGRESS = 'in_progress',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export type Entry = Task | Event;

type SystemFields = 'id' | 'userId' | 'createdAt' | 'updatedAt';

export type newTaskData = Omit<Task, SystemFields>;
