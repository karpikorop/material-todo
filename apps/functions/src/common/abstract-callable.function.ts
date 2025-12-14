import {CallableRequest, HttpsError} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

/**
 * Abstract base class for Firebase-Callable Functions.
 * Provides authentication checking, error handling, and logging.
 * @abstract
 * @template TInput - The type of input data expected by the callable function
 * @template TOutput - The type of output data returned by the callable function
 */
export abstract class AbstractCallableFunction<TInput, TOutput> {

  /**
   * Determines whether the function requires authentication.
   * When true, unauthenticated requests will be rejected with an HttpsError.
   * @protected
   * @default true
   */
  protected requiresAuth = true;

  /**
   * Executes the callable function logic.
   * Must be implemented by derived classes.
   * @param data - The input data from the callable request
   * @param auth - The authentication context from Firebase Auth (undefined if not authenticated)
   * @returns Promise that resolves with the output data
   * @protected
   * @abstract
   */
  protected abstract execute(data: TInput, auth?: any): Promise<TOutput>;

  /**
   * Handles incoming callable requests with authentication checking, error handling, and logging.
   * Automatically validates authentication if requiresAuth is true.
   * Wraps execution errors in HttpsError for proper client-side handling.
   * @param request - Firebase callable request object containing data and auth context
   * @returns Promise that resolves with the execution result
   * @throws {HttpsError} With code 'unauthenticated' if auth is required but not provided
   * @throws {HttpsError} With code 'internal' if an unexpected error occurs during execution
   * @public
   */
  public handle = async (request: CallableRequest<TInput>): Promise<TOutput> => {
    const { data, auth } = request;

    try {
      logger.info(`Starting ${this.constructor.name}`, { userId: auth?.uid });

      if (this.requiresAuth && !auth) {
        throw new HttpsError('unauthenticated', 'User must be logged in');
      }

      return await this.execute(data, auth);
    } catch (error: any) {
      logger.error(`Error in ${this.constructor.name}`, error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'An unexpected error occurred.');
    }
  };

}
