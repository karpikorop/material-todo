import 'reflect-metadata';
import { container, InjectionToken } from 'tsyringe';
import {
  onCall,
  CallableOptions,
  onRequest,
  HttpsOptions,
  CallableRequest,
} from 'firebase-functions/v2/https';
import { onSchedule, ScheduledEvent, ScheduleOptions } from 'firebase-functions/v2/scheduler';
import { onObjectFinalized, StorageOptions, StorageEvent } from 'firebase-functions/v2/storage';
import { DocumentOptions, onDocumentWritten } from 'firebase-functions/firestore';
import { Change, DocumentSnapshot, FirestoreEvent } from 'firebase-functions/v2/firestore';

/**
 * Extracts an injectable class token from an imported module.
 *
 * - Returns `module.default` if present.
 * - Otherwise finds the first exported function (class/constructor) and returns it.
 * - Throws an error if no class/function export is found.
 */
function extractClass(module: any): InjectionToken<any> {
  if (module.default) return module.default;

  const found = Object.values(module).find((exp) => typeof exp === 'function');
  if (!found) {
    throw new Error(`No class found in module. Did you forget to 'export default'?`);
  }
  return found as InjectionToken<any>;
}

/**
 * Returns a function that resolves the instance only once.
 * On later calls, it returns the cached instance immediately.
 */
function createLazyLoader(importFn: () => Promise<any>) {
  let module: any = null;

  return async () => {
    if (!module) {
      module = await importFn();
    }
    const ClassToken = extractClass(module);
    return container.resolve(ClassToken);
  };
}

/**
 * Creates a Callable Function (Lazy Singleton)
 */
export function createCall(options: CallableOptions, importFn: () => Promise<any>) {
  const getInstance = createLazyLoader(importFn);

  return onCall(options, async (req: CallableRequest) => {
    const instance = await getInstance();
    return instance.handle(req);
  });
}

/**
 * Creates an HTTP Function (Lazy Singleton)
 */
export function createRequest(options: HttpsOptions, importFn: () => Promise<any>) {
  const getInstance = createLazyLoader(importFn);

  return onRequest(options, async (req, res) => {
    const instance = await getInstance();
    return instance.handle(req, res);
  });
}

/**
 * Creates a Scheduled Function (Lazy Singleton)
 */
export function createSchedule(
  schedule: string,
  options: Omit<ScheduleOptions, 'schedule'>,
  importFn: () => Promise<any>
) {
  const getInstance = createLazyLoader(importFn);

  return onSchedule({ schedule, ...options }, async (event: ScheduledEvent) => {
    const instance = await getInstance();
    return instance.execute(event);
  });
}

/**
 * Creates a Storage Object Finalized Function (Lazy Singleton)
 */
export function createObjectFinalized(options: StorageOptions, importFn: () => Promise<any>) {
  const getInstance = createLazyLoader(importFn);

  return onObjectFinalized(options, async (event: StorageEvent) => {
    const instance = await getInstance();
    return instance.execute(event);
  });
}

export function createDocumentWritten(
  documentPath: string,
  options: Omit<DocumentOptions, 'document'>,
  importFn: () => Promise<any>
) {
  const getInstance = createLazyLoader(importFn);

  const triggerOptions: DocumentOptions = {
    document: documentPath,
    ...options,
  };

  return onDocumentWritten(
    triggerOptions,
    async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined>) => {
      const instance = await getInstance();
      return instance.handle(event);
    }
  );
}
