import { injectable } from 'tsyringe';
import { FirebaseAdminService } from './firebase-admin.service';
import { WithId} from '@shared/models/withId';
import { makeChunks } from '@shared/utils/make-chunks';
import { isObjectEmpty } from '@shared/utils/is-empty';

export interface BatchOperations<T> {
  create?: T[];
  update?: T[];
  delete?: string[];
}

export interface BatchAction {
  type: 'create' | 'update' | 'delete';
  ref: FirebaseFirestore.DocumentReference;
  data?: any;
}

const CHUNK_SIZE_LIMIT = 500;

@injectable()
export class BatchSaveService {
  constructor(private firebase: FirebaseAdminService) {}

  /**
   * Executes batch operations (create, update, delete) on a specified collection.
   * Automatically handles batching limits by splitting operations into chunks.
   * Relies on id fields to identify items to update or delete.
   * Also uses id field to identify a path for new items.
   *
   * @param collectionPath - The path to the Firestore collection.
   * @param operations - An object containing arrays of items to create, update, or delete.
   * @returns A promise that resolves when all batch operations are committed.
   */
  public async save<T extends WithId>(
    collectionPath: string,
    operations: BatchOperations<T>
  ): Promise<void> {
    const collectionRef = this.firebase.firestore.collection(collectionPath);
    const actions: BatchAction[] = [];

    if (operations.create) {
      operations.create.forEach((item) => {
        const ref = item.id ? collectionRef.doc(item.id) : collectionRef.doc();
        actions.push({ type: 'create', ref, data: item });
      });
    }
    if (operations.update) {
      operations.update.forEach((item) => {
        if (!item.id) {
          throw new Error(`Item in update list missing 'id' field: ${JSON.stringify(isObjectEmpty(item))}`);
        }
        const ref = collectionRef.doc(item.id);
        actions.push({ type: 'update', ref, data: item });
      });
    }
    if (operations.delete) {
      operations.delete.forEach((id) => {
        const ref = collectionRef.doc(id);
        actions.push({ type: 'delete', ref });
      });
    }

    await this.executeBatch(actions);
  }

  /**
   * Executes a list of batch actions.
   * Automatically handles batching limits by splitting actions into chunks.
   *
   * @param actions - An array of BatchAction items.
   * @returns A promise that resolves when all batch operations are committed.
   */
  public async executeBatch(actions: BatchAction[]): Promise<void> {
    const chunks = makeChunks(actions, CHUNK_SIZE_LIMIT);
    for (const chunk of chunks) {
      const batch = this.firebase.firestore.batch();

      chunk.forEach((action) => {
        switch (action.type) {
          case 'create':
            batch.create(action.ref, action.data);
            break;
          case 'update':
            batch.update(action.ref, action.data);
            break;
          case 'delete':
            batch.delete(action.ref);
            break;
        }
      });

      await batch.commit();
    }
  }
}
