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
