import { injectable } from 'tsyringe';
import { HttpsError } from 'firebase-functions/v2/https';
import { ProjectsService } from '../services/projects.service';
import * as logger from 'firebase-functions/logger';
import { AbstractCallableFunction } from '../common/abstract-callable.function';
import type { VoidResponseInterface } from '@shared';
import {CallableRequest} from 'firebase-functions/https';

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

  public async execute(request: CallableRequest<deleteProjectRequest>): Promise<VoidResponseInterface> {

    if (!request.data.projectId) {
      throw new HttpsError('invalid-argument', 'Project ID is required.');
    }

    logger.info('Deleting project', { uid: request.auth?.uid, projectId: request.data.projectId });

    try {
      await this.projectsService.deleteProject(request.data.projectId, request.auth?.uid as string);
      return { success: true, message: 'Project deleted successfully' };
    } catch (error: any) {
      logger.error('Delete failed', error);
      throw new HttpsError('internal', 'Failed to delete project');
    }
  }
}
