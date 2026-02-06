import { FirestoreEvent, Change, DocumentSnapshot } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { mapFirestoreSnapshot } from '@shared/utils/map-firestore-snapshot';
import { calculateChangedFields } from '@shared/utils/calculate-changed-fields';
import { DataObject } from '@shared/models/data-object';

/**
 * Abstract base class for Firestore document write triggers (create, update, delete).
 * Automatically routes events to lifecycle hooks and tracks changed fields on updates.
 */
export abstract class AbstractOnDocumentWrittenFunction<T = any> {
  /** Firestore collection path where the document change occurred */
  protected collectionPath!: string;

  /** Document data after the write operation */
  private newData?: T;

  /** Document data before the write operation */
  private oldData?: T;

  /** Firestore event containing document snapshots and metadata */
  protected event!: FirestoreEvent<Change<DocumentSnapshot>>;

  /** Path parameters extracted from the document reference */
  protected params!: DataObject<string>;

  /** List of field names that changed during an update operation */
  protected changedFields: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async onCreate(_newData: T): Promise<void> {
    /* empty */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async onUpdate(_newData: T, _oldData: T): Promise<void> {
    /* empty */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async onDelete(_oldData: T): Promise<void> {
    /* empty */
  }

  protected async execute(): Promise<void> {
    /* empty */
  }

  public handle = async (event: FirestoreEvent<Change<DocumentSnapshot>>): Promise<void> => {
    this.event = event;
    this.params = event?.params;

    const data = event.data;

    if (!data) {
      logger.warn('Event triggered without data');
    }

    if (data.after.exists) {
      this.newData = mapFirestoreSnapshot<T>(data.after);
    }

    if (data.before.exists) {
      this.oldData = mapFirestoreSnapshot<T>(data.before);
    }

    const ref = event.data.after.ref || event.data.before.ref;
    this.collectionPath = ref.parent.path;

    await this.execute();

    if (!this.oldData && this.newData) {
      await this.onCreate(this.newData);
    } else if (this.oldData && !this.newData) {
      await this.onDelete(this.oldData);
    } else if (this.oldData && this.newData) {
      this.changedFields = calculateChangedFields(this.oldData, this.newData);

      await this.onUpdate(this.newData, this.oldData);
    }
  };
}
