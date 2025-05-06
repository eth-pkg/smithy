export function getValueFromPath(obj: any, path: string): any {
  if (typeof obj === 'string') {
    return undefined
  }
  if (path == null) {
    return undefined
  }
  return path.split(".").reduce((current, key) => {
    if (current === undefined) return undefined
    return current[key]
  }, obj)
} 