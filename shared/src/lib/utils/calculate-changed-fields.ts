import { DataObject } from '../models/data-object';
/**
 * Compares two data objects and returns an array of field names that have changed.
 * Uses shallow comparison (===).
 * Handles null and undefined inputs. Returns an empty array if both objects are null or undefined.
 * @returns Array of field names that differ between the two objects
 */
export function calculateChangedFields(oldData: DataObject, newData: DataObject): string[] {
  const changes: string[] = [];
  const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);

  for (const key of allKeys) {
    if (oldData?.[key] !== newData?.[key]) {
      changes.push(key);
    }
  }
  return changes;
}
