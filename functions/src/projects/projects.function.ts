import * as admin from 'firebase-admin';
import {HttpsError, type CallableRequest} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

export class ProjectFunctions {
  private readonly db = admin.firestore();

  /**
   * Deletes a project and its associated todos.
   */
  public delete = async (
    request: CallableRequest<{ projectId: string }>
  ): Promise<{ status: string }> => {
    const uid = request.auth?.uid;
    const {projectId} = request.data;

    logger.info('Delete project function triggered.', {
      userId: uid,
      projectId: projectId,
    });

    // Check for authentication
    if (!uid) {
      throw new HttpsError(
        'unauthenticated',
        'You must be logged in to perform this action.'
      );
    }

    // Validate input data
    if (!projectId) {
      throw new HttpsError(
        'invalid-argument',
        'A valid projectId must be provided.'
      );
    }

    try {
      const batch = this.db.batch();
      const projectRef = this.db
        .collection('users')
        .doc(uid)
        .collection('projects')
        .doc(projectId);
      const todosQuery = this.db
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
        `Successfully deleted project and ${todoSnapshots.size} todos.`
      );
      return {status: 'success'};
    } catch (error) {
      logger.error('Error during project deletion:', error);
      throw new HttpsError('internal', 'Failed to delete the project.');
    }
  };
}
