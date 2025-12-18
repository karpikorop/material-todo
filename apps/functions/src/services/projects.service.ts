import * as logger from 'firebase-functions/logger';
import { injectable } from 'tsyringe';
import {FirebaseAdminService} from './firebase-admin.service';

@injectable()
export class ProjectsService {

  constructor(private firebase: FirebaseAdminService) {}

  /**
   * Deletes a project and its associated todos.
   * @returns Promise resolving to success status
   * @param projectId - ID of the project to delete
   * @param uid - ID of the user who owns the project
   */
  public async deleteProject(
    projectId: string,
    uid: string
  ): Promise<void> {
    if (!projectId) {
      throw new Error(
        'A valid projectId must be provided.'
      );
    }

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
  }
}
