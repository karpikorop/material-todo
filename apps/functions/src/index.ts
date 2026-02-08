import 'reflect-metadata';
import { createCall } from './utils/di.setup';

/**
 * Deletes a project and all associated entries.
 */
export const deleteProjectAndTodos = createCall(
  {
    timeoutSeconds: 300,
    memory: '256MiB',
    cors: true,
    invoker: 'public',
  },
  () => import('./functions/delete-projects.function')
);

export * as onChange from './functions/on-change';
