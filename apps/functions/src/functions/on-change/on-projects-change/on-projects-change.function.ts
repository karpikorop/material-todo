import { AbstractOnDocumentWrittenFunction } from '../../../common/abstract-on-document-written.function';
import { Project } from '@shared/models/project';
import { injectable } from 'tsyringe';
import { ProjectsService } from '../../../services/projects.service';
import { logger } from 'firebase-functions';

@injectable()
export default class OnProjectsChangeFunction extends AbstractOnDocumentWrittenFunction<Project> {
  constructor(private projectsService: ProjectsService) {
    super();
  }

  protected override async onDelete(oldData: Project): Promise<void> {
    const projectId = oldData.id || this.params['projectId'];
    const userId = oldData.userId || this.params['userId'];

    logger.info(`Project ${projectId} deleted. Deleting associated entries.`);
    const count = await this.projectsService.deleteProjectEntries(projectId, userId);
    logger.info(`Deleted ${count} entries.`);
  }
}
