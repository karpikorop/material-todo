import 'reflect-metadata';
import { container, InjectionToken } from 'tsyringe';
import * as admin from 'firebase-admin';
import {
  onCall, CallableOptions,
  onRequest, HttpsOptions
} from 'firebase-functions/v2/https';
import {
  onSchedule, ScheduleOptions
} from 'firebase-functions/v2/scheduler';

function ensureDependencies() {
  if (container.isRegistered('Firestore')) return;

  try {
    admin.app();
  } catch {
    admin.initializeApp();
  }
  container.register('Firestore', { useValue: admin.firestore() });
  container.register('Auth', { useValue: admin.auth() });
  container.register('Storage', { useValue: admin.storage() });
}

function extractClass(module: any): InjectionToken<any> {
  if (module.default) return module.default;

  const found = Object.values(module).find(exp => typeof exp === 'function');
  if (!found) {
    throw new Error(`No class found in module. Did you forget to 'export default'?`);
  }
  return found as InjectionToken<any>;
}

async function runHandler(
  importFn: () => Promise<any>,
  executeFn: (instance: any) => Promise<any>
) {
  ensureDependencies();

  const module = await importFn();
  const ClassToken = extractClass(module);
  const instance = container.resolve(ClassToken);

  return executeFn(instance);
}

/**
 * Creates a Callable Function (Lazy + DI)
 */
export function createCall(
  options: CallableOptions,
  importFn: () => Promise<any>
) {
  return onCall(options, (req) =>
    runHandler(importFn, (instance) => instance.handle(req))
  );
}

/**
 * Creates an HTTP Function (Lazy + DI)
 */
export function createRequest(
  options: HttpsOptions,
  importFn: () => Promise<any>
) {
  return onRequest(options, (req, res) =>
    runHandler(importFn, (instance) => instance.handle(req, res))
  );
}

/**
 * Creates a Scheduled Function (Lazy + DI)
 */
export function createSchedule(
  schedule: string,
  options: Omit<ScheduleOptions, 'schedule'>,
  importFn: () => Promise<any>
) {
  return onSchedule({ schedule, ...options }, (event) =>
    runHandler(importFn, (instance) => instance.execute(event))
  );
}
