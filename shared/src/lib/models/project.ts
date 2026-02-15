import { WithId } from './withId';
import { FireTimestamp } from './fire-timestamp';

export const INBOX_ID = 'inbox';

export interface Project extends WithId {
  name: string;
  icon: string;
  sortOrder?: number;
  createdAt: FireTimestamp;
  userId: string;
}
