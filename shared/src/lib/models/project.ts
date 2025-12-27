import {FireTimestamp} from './fire-timestamp';

export interface Project {
  id: string; // Firestore ID
  name: string;
  icon: string;
  sortOrder?: number;
  createdAt: FireTimestamp;
  userId: string;
}
