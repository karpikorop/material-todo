import { Request } from 'firebase-functions/v2/https';
import { Response } from 'express';
import * as logger from 'firebase-functions/logger';

/**
 * Abstract base class for HTTP onRequest Firebase Functions.
 * Provides error handling and response management.
 * @abstract
 */
export abstract class AbstractHttpFunction {
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
  protected abstract execute(req: Request, res: Response): Promise<never>;

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

      if (!res.headersSent && result !== undefined) {
        res.status(200).json(result);
      }
    } catch (error: any) {
      logger.error('HTTP Function crashed', error);

      if (!res.headersSent) {
        res.status(500).json({
          error: 'Internal Server Error',
          message: error.message,
        });
      }
    }
  }
}
