import { Request } from 'firebase-functions/v2/https';
import { Response } from 'express';
import * as logger from 'firebase-functions/logger';

/**
 * Abstract base class for HTTP onRequest Firebase Functions.
 * Provides error handling and response management.
 * @abstract
 */
export abstract class AbstractHttpFunction<T = any> {
  /**
   * Executes the HTTP function logic.
   * Must be implemented by derived classes.
   *
   * @param req - Firebase Functions HTTP request object
   * @param res - Express response object
   * @returns Promise that resolves with the response data or never if response is sent manually
   * @protected
   * @abstract
   */
  protected abstract execute(req: Request, res: Response): Promise<T | void>;

  /**
   * Handles incoming HTTP requests with error handling.
   * Automatically sends JSON responses and handles errors.
   *
   * @param req - Firebase Functions HTTP request object
   * @param res - Express response object
   * @returns Promise that resolves when the request is handled
   * @public
   */
  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.execute(req, res);

      if (res.headersSent){
        return;
      }

      if (result != null) {
        res.status(200).json(result);
      }

      res.status(204).send();
    } catch (error: any) {
      logger.error('HTTP Function crashed', error);

      if (!res.headersSent) {
        // 500 response will be handled by queue as an error and may retry
        res.status(500).json({
          error: 'Internal Server Error',
          message: error.message,
        });
      }
    }
  }
}
