/** Check if a string is empty or contains only whitespace characters */
export function isStringEmpty(value: string | undefined): boolean {
  return !value?.trim().length;
}

/**
 * Checks if an object/array is empty (has no keys).
 * Returns true if the value is null, undefined, not an object, or has no keys.
 */
export function isObjectEmpty(value: any): boolean {
  if (value == null) {
    return true;
  }
  if (typeof value !== 'object') {
    return true;
  }

  return Object.keys(value).length === 0;
}
