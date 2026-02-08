import { injectable } from 'tsyringe';
import { FirebaseAdminService } from './firebase-admin.service';
import { getEntriesCollectionPath, Task, isStringEmpty, mapFirestoreSnapshot } from '@shared';

@injectable()
export class EntryService {
  constructor(private firebaseAdmin: FirebaseAdminService) {}

  public async getEntries(
    userId: string,
    projectId?: string,
    columns?: (keyof Task)[]
  ): Promise<Task[]> {
    let query = this.firebaseAdmin.firestore
      .collection(getEntriesCollectionPath(userId))
      .where('userId', '==', userId);

    if (!isStringEmpty(projectId)) {
      query = query.where('projectId', '==', projectId);
    }

    if (columns) {
      query = query.select(...columns);
    }

    const entriesSnapshot = await query.get();
    return entriesSnapshot.docs
      .map((doc) => mapFirestoreSnapshot<Task>(doc))
      .filter((task) => !!task);
  }
}
