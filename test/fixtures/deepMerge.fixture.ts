/**
 * Deep merge utility function for merging objects recursively
 */
export function deepMerge(target: any, source: any): any {
  if (!source) return target;
  if (!target) return { ...source };

  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = deepMerge(result[key] || {}, value);
    } else if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
} 