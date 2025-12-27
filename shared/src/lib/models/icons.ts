export const AVAILABLE_LIST_ICONS = [
  'folder',
  'inbox',
  'calendar_today',
  'list',
  'star',
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
  'code'
] as const;

export type ListIcon = typeof AVAILABLE_LIST_ICONS[number];
