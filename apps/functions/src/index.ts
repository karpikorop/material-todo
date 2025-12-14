import 'reflect-metadata';
import { createCall } from './utils/di.setup';
/**
 * Deletes a project and all associated todos.
 * Uses lazy loading and dependency injection for optimal cold start performance.
 */
export const deleteProjectAndTodos = createCall(
  {
    timeoutSeconds: 300,
    memory: '256MiB',
    cors: true,
    invoker: "public"
  },
  () => import('./functions/delete-projects.function')
);
