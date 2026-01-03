import { injectable } from 'tsyringe';
import { HttpsError } from 'firebase-functions/v2/https';
import { ProjectsService } from '../services/projects.service';
import * as logger from 'firebase-functions/logger';
import { AbstractCallableFunction } from '../common/abstract-callable.function';
import type { VoidResponseInterface } from '@shared';

interface deleteProjectRequest {
  projectId: string;
}

@injectable()
export default class DeleteProject extends AbstractCallableFunction<
  deleteProjectRequest,
  VoidResponseInterface
> {
  constructor(private projectsService: ProjectsService) {
    super();
  }

  public async execute(data: deleteProjectRequest, auth?: any): Promise<VoidResponseInterface> {
    if (!data.projectId) {
      throw new HttpsError('invalid-argument', 'Project ID is required.');
    }

    logger.info('Deleting project', { uid: auth.uid, projectId: data.projectId });

    try {
      await this.projectsService.deleteProject(data.projectId, auth.uid);
      return { success: true, message: 'Project deleted successfully' };
    } catch (error: any) {
      logger.error('Delete failed', error);
      throw new HttpsError('internal', 'Failed to delete project');
    }
  }
}
