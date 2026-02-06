import { Timestamp } from '@firebase/firestore';
import {WithId} from './withId';

export interface UserProfileInterface extends WithId{
  /**
   * If possible, use email from Auth Service currentUser$ instead as the source of truth.
   */
  email: string;
  username: string;
  avatarUrl: string;
  supporter: boolean;
  createdAt: Timestamp;
}

export type UserProfile = UserProfileInterface | null;

export const PLACEHOLDER_AVATAR_URL = 'https://placehold.net/avatar-4.png';
