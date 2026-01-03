import { Timestamp } from '@firebase/firestore';

export const INBOX_ID = 'inbox';

export interface Project {
  id: string; // Firestore ID
  name: string;
  icon: string;
  sortOrder?: number;
  createdAt: Timestamp;
  userId: string;
}
