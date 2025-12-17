import {HttpsError} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { injectable, inject } from 'tsyringe';
import {FirebaseAdminService} from './firebase-admin.service';

@injectable()
export class ProjectsService {

  constructor(private firebase: FirebaseAdminService) {}

  /**
   * Deletes a project and its associated todos.
   * @returns Promise resolving to success status
   * @throws {HttpsError} If user is not authenticated or projectId is invalid
   * @param projectId
   * @param uid
   */
  public async deleteProject(
    projectId: string,
    uid: string
  ): Promise<{ status: string }> {
    if (!projectId) {
      throw new Error(
        'A valid projectId must be provided.'
      );
    }

    try {
      const db = this.firebase.firestore;
      const batch = db.batch();
      const projectRef = db
        .collection('users')
        .doc(uid)
        .collection('projects')
        .doc(projectId);
      const todosQuery = db
        .collection('users')
        .doc(uid)
        .collection('todos')
        .where('userId', '==', uid)
        .where('projectId', '==', projectId);

      const todoSnapshots = await todosQuery.get();

      todoSnapshots.forEach((doc) => batch.delete(doc.ref));
      batch.delete(projectRef);

      await batch.commit();

      logger.info(
        `Successfully deleted project and ${todoSnapshots.size} todos.`,
        { uid, projectId }
      );
      return {status: 'success'};
    } catch (error) {
      logger.error('Error during project deletion:', error);
      throw new HttpsError('internal', 'Failed to delete the project.');
    }
  }
}
