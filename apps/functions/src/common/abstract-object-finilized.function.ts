import { StorageEvent } from 'firebase-functions/v2/storage';
import * as logger from 'firebase-functions/logger';

/**
 * Abstract base class for Firebase Storage Object Finalized Functions.
 * Provides error handling and logging.
 * @abstract
 */
export abstract class AbstractObjectFinalizedFunction {
  /**
   * Executes the storage function logic.
   * Must be implemented by derived classes.
   *
   * @param event - Firebase Storage event object
   * @returns Promise that resolves when processing is complete
   * @protected
   * @abstract
   */
  protected abstract execute(event: StorageEvent): Promise<void>;

  /**
   * Handles incoming storage events with error handling and logging.
   * Automatically logs file information and errors.
   *
   * @param event - Firebase Storage event object
   * @returns Promise that resolves when the event is handled
   * @public
   */
  public async handle(event: StorageEvent): Promise<void> {
    try {
      logger.info(`Starting ${this.constructor.name}`, {
        bucket: event.bucket,
        name: event.data.name,
        contentType: event.data.contentType,
        size: event.data.size
      });

      await this.execute(event);

      logger.info(`Completed ${this.constructor.name}`);
    } catch (error: any) {
      logger.error(`Error in ${this.constructor.name}`, error);
      throw error;
    }
  }
}
