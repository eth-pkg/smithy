import { NodeConfig } from "@/lib/types"
import { getValueFromPath } from "./utils"

export type TransformFunction = (value: any, os: string, flag: string) => any
export type TransformFunctionWithConfig = (value: any, config: NodeConfig) => any

export type FlagEnabledFunction = (value: any) => boolean
export type FlagTransformFunction = (value: any, os: string, flag: string) => boolean

export const transformFunctions: Record<string, TransformFunction | TransformFunctionWithConfig> = {
  joinComma: (value: string | string[]): string => {
    return Array.isArray(value) ? value.join(",") : value
  },

  repeatFlag: (value: string | string[]): string[] => {
    if (Array.isArray(value)) {
      return value
    }
    if (typeof value === 'string') {
      return value.split(',')
    }
    return [value]
  },

  interpolate: (template: string, config: NodeConfig): string => {
    if (typeof template !== 'string') {
      return template
    }

    let result = template
    let previousResult: string
    let depth = 0
    const MAX_DEPTH = 10
    
    do {
      previousResult = result
      result = result.replace(/\{([^}]+)\}/g, (_, path) => {
        if (path === 'HOME') {
          return process.env.HOME || process.env.USERPROFILE || ''
        }
        const value = getValueFromPath(config, path)
        return value !== undefined ? String(value) : ''
      })
      depth++
    } while (result !== previousResult && depth < MAX_DEPTH)
    
    if (depth >= MAX_DEPTH) {
      throw new Error(`Maximum interpolation depth (${MAX_DEPTH}) reached. This may indicate a circular reference in your configuration.`)
    }
    
    return result
  },

  allowlist: (value: string | string[]): string | string[] => {
    if (typeof value === 'string') {
      return `"${value}"`
    }
    if (Array.isArray(value)) {
      return `"${value.join(',')}"`
    }
    return value
  },
  toUpnp: (value: string | boolean) => {
    if (value == true || value == 'true') {
      return 'upnp'
    }
    if (value == false || value == 'false') {
      return 'none'
    }
    return value
  },

}

export const flagFunctions: Record<string, FlagEnabledFunction | FlagTransformFunction> = {
  flagEnabled: (value: string | boolean): boolean => {
    if (typeof value === 'boolean') {
      return value
    }
    return value === "true"
  },
  // same as flagEnabled but the difference is that it will concanate the value with the flag name
  booleanFlag: (value: string | boolean): boolean => {
    if (typeof value === 'boolean') {
      return value
    }
    return value === "true"
  },

  negate: (value: string | boolean): boolean => {
    if (typeof value === 'boolean') {
      return !value
    }
    return value !== "true"
  },

  isFlag: (): boolean => true,

  network: (value: string, _os: string, flag: string): boolean => {
    const flagWithoutPrefix = flag.replace(/^--/, '')
    return value === flagWithoutPrefix
  },

  jwtEnabled: (value: any): boolean => value === "jwt",

  ipcEnabled: (value: string): boolean => value === "ipc",

  isJson: (value: string): boolean => value === "json",

}

export const transformers = {
  ...transformFunctions,
  ...flagFunctions
} 