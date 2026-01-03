export const AVAILABLE_LIST_ICONS = [
  'folder',
  'inbox',
  'calendar_today',
  'list',
  'celebration',
  'work',
  'home',
  'shopping_cart',
  'fitness_center',
  'school',
  'book_2',
  'flight',
  'local_cafe',
  'savings',
  'pets',
  'build',
  'code',
  'music_note_2',
  'sports_esports',
  'person',
] as const;

export type ListIcon = (typeof AVAILABLE_LIST_ICONS)[number];
