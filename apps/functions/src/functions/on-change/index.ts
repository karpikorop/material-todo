import { createDocumentWritten } from '../../utils/di.setup';

export const projects = createDocumentWritten(
  'users/{userId}/projects/{projectId}',
  {
    memory: '512MiB',
  },
  () => import('./on-projects-change/on-projects-change.function')
);
