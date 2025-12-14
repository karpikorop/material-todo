export interface VoidResponseInterface<T> {
  success: boolean;
  message?: string;
  data?: T;
}
