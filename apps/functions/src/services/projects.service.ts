import * as logger from 'firebase-functions/logger';
import { injectable } from 'tsyringe';
import { FirebaseAdminService } from './firebase-admin.service';
import { BatchAction, BatchSaveService } from './batch-save.service';
import { getProjectsCollectionPath, getEntriesCollectionPath } from '@shared';

@injectable()
export class ProjectsService {
  constructor(
    private firebase: FirebaseAdminService,
    private batchSave: BatchSaveService
  ) {}

  public async deleteProjectEntries(projectId: string, uid: string): Promise<number> {
    if (!projectId || !uid) {
      throw new Error('A valid projectId and userId must be provided.');
    }

    const entriesQuery = this.firebase.firestore
      .collection(getEntriesCollectionPath(uid))
      .where('projectId', '==', projectId);

    const entriesSnapshot = await entriesQuery.get();
    const actions: BatchAction[] = entriesSnapshot.docs.map((doc) => ({
      type: 'delete',
      ref: doc.ref,
    }));
    await this.batchSave.executeBatch(actions);

    return actions.length;
  }

  /**
   * Deletes a project and its associated entries.
   * @returns Promise resolving to success status
   * @param projectId - ID of the project to delete
   * @param uid - ID of the user who owns the project
   */
  public async deleteProject(projectId: string, uid: string): Promise<void> {
    if (!projectId) {
      throw new Error('A valid projectId must be provided.');
    }

    const entriesQuery = this.firebase.firestore
      .collection(getEntriesCollectionPath(uid))
      .where('userId', '==', uid)
      .where('projectId', '==', projectId);

    const entriesSnapshot = await entriesQuery.get();

    const actions: BatchAction[] = entriesSnapshot.docs.map((doc) => ({
      type: 'delete',
      ref: doc.ref,
    }));

    const projectRef = this.firebase.firestore.doc(
      `${getProjectsCollectionPath(uid)}/${projectId}`
    );
    actions.push({ type: 'delete', ref: projectRef });

    await this.batchSave.executeBatch(actions);

    logger.info(`Successfully deleted project and ${entriesSnapshot.size} entries.`, {
      uid,
      projectId,
    });
  }
}
