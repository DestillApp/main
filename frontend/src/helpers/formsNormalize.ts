/**
 * Normalizes selected fields in an object by converting null or undefined string fields to empty strings.
 * @template T - The type of the input object.
 * @param {T} data - The input object to normalize.
 * @param {(keyof T)[]} keysToNormalize - The keys of the fields to normalize.
 * @returns {T} The normalized object with selected fields set to empty strings if they were null or undefined.
 */
export function normalizeSelectedFields<T extends Record<string, any>>(
  data: T,
  keysToNormalize: (keyof T)[]
): T {
  const result = { ...data };
  for (const key of keysToNormalize) {
    const value = result[key];
    if (value === null || value === undefined) {
      if (typeof value === "string" || value === null) {
        result[key] = "" as T[typeof key];
      }
    }
  }
  return result;
}
