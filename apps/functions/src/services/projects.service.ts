import * as logger from 'firebase-functions/logger';
import { injectable } from 'tsyringe';
import { FirebaseAdminService } from './firebase-admin.service';
import { BatchAction, BatchSaveService } from './batch-save.service';
import {
  getProjectsCollectionPath,
  getTodosCollectionPath,
} from '@shared/lib/models/collection_names';

@injectable()
export class ProjectsService {
  constructor(private firebase: FirebaseAdminService, private batchSave: BatchSaveService) {}

  /**
   * Deletes a project and its associated todos.
   * @returns Promise resolving to success status
   * @param projectId - ID of the project to delete
   * @param uid - ID of the user who owns the project
   */
  public async deleteProject(projectId: string, uid: string): Promise<void> {
    if (!projectId) {
      throw new Error('A valid projectId must be provided.');
    }

    const todosQuery = this.firebase.firestore
      .collection(getTodosCollectionPath(uid))
      .where('userId', '==', uid)
      .where('projectId', '==', projectId);

    const todoSnapshots = await todosQuery.get();

    const actions: BatchAction[] = todoSnapshots.docs.map((doc) => ({
      type: 'delete',
      ref: doc.ref,
    }));

    const projectRef = this.firebase.firestore.doc(
      `${getProjectsCollectionPath(uid)}/${projectId}`
    );
    actions.push({ type: 'delete', ref: projectRef });

    await this.batchSave.executeBatch(actions);

    logger.info(`Successfully deleted project and ${todoSnapshots.size} todos.`, {
      uid,
      projectId,
    });
  }
}
