import { Timestamp } from '@firebase/firestore';

export interface UserProfileInterface {
  id: string;
  /**
   * If possible, use email from Auth Service currentUser$ instead.
   */
  email: string;
  username: string;
  avatarUrl: string;
  supporter: boolean;
  createdAt: Timestamp;
}

export type UserProfile = UserProfileInterface | null;

export const PLACEHOLDER_AVATAR_URL = 'https://placehold.net/avatar-4.png';
