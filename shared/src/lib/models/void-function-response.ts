export interface VoidResponseInterface<T = void> {
  success: boolean;
  message?: string;
  data?: T;
}
