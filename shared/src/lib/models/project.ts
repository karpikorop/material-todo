import { Timestamp } from '@firebase/firestore';
import {WithId} from './withId';

export const INBOX_ID = 'inbox';

export interface Project extends WithId {
  name: string;
  icon: string;
  sortOrder?: number;
  createdAt: Timestamp;
  userId: string;
}
