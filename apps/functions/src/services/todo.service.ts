import { injectable } from 'tsyringe';
import { FirebaseAdminService } from './firebase-admin.service';
import { getTodosCollectionPath } from '@shared/lib/models/collection_names';
import { Todo } from '@shared/lib/models/todos';
import { isStringEmpty } from '@shared/lib/utils/is-empty';

@injectable()
export class TodoService {
  constructor(private firebaseAdmin: FirebaseAdminService) {}

  public async getTodos(
    userId: string,
    projectId?: string,
    columns?: (keyof Todo)[]
  ): Promise<Todo[]> {
    let query = this.firebaseAdmin.firestore
      .collection(getTodosCollectionPath(userId))
      .where('userId', '==', userId);

    if (!isStringEmpty(projectId)) {
      query = query.where('projectId', '==', projectId);
    }

    if (columns) {
      query = query.select(...columns);
    }

    const todoSnapshots = await query.get();
    return todoSnapshots.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        }) as Todo
    );
  }
}
