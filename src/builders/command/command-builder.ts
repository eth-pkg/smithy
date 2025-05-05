import { OperatingSystem, NodeConfig } from "@/lib/types"

type TransformFunction = (value: any, os: string, flag: string) => any
type TransformFunctionWithConfig = (value: any, config: any) => any

type Rule = {
  configPath: string
  flag: string
  transform?: string
  parent?: string
  enabled?: {
    configPath: string
    transform?: string
  }
}

type Mappings = {
  rules: Rule[]
  valueFormat: 'equals' | 'space'
}

const transformers: Record<string, TransformFunction | TransformFunctionWithConfig> = {
  formatPath: (value: string, os: string) => {
    if (os === "windows") {
      return value.replace(/\//g, "\\")
    }
    return value
  },
  joinComma: (value: string | string[]) => {
    return Array.isArray(value) ? value.join(",") : value
  },
  flagEnabled: (value: string) => {
    return value === "true" ? true : false
  },
  isFlag: () => {
    return true
  },
  syncMode: (value: string) => {
    const isFastSync = value.toLowerCase() === "fast" || value.toLowerCase() === "snap"
    return isFastSync ? "fast" : "full"
  },
  network: (value: string, _os: string, flag: string) => {
    // If the value matches the flag (without --), return empty string since flag already has --
    const flagWithoutPrefix = flag.replace(/^--/, '')
    return value === flagWithoutPrefix ? true : false
  },
  interpolate: (template: string, config: NodeConfig) => {
    if (typeof template !== 'string') {
      return template;
    }
    return template.replace(/\{([^}]+)\}/g, (_, path) => {
      const value = CommandBuilder.getValueFromPath(config, path);
      return value !== undefined ? value : '';
    });
  },
  hostAllowlist: (value: string | string[]) => {
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    return value;
  },
  jwtEnabled: (value: any) => value === "jwt",
  ipcEnabled: (value: string) => value === "ipc",
}

// Base builder class for all client commands
export class CommandBuilder {
  protected command: string
  protected args: Buffer[] = []
  protected mappings?: Mappings

  constructor(baseCommand: string, mappings?: Mappings) {
    this.command = baseCommand
    this.mappings = mappings
  }

  addArg(flag: string, value?: string | number | boolean): this {
    if (value !== undefined && value !== null && value !== "") {
      const formattedValue = this.mappings?.valueFormat === 'equals' ? `${flag}=${value}` : `${flag} ${value}`
      this.args.push(Buffer.from(formattedValue))
    }
    return this
  }

  addFlag(flag: string, condition = true): this {
    if (condition) {
      this.args.push(Buffer.from(flag))
    }
    return this
  }

  build(os: OperatingSystem): Buffer {
    const commandBuffer = Buffer.from(this.command)
    const spaceBuffer = Buffer.from(" ")
    const newlineBuffer = Buffer.from(" \\\n  ")

    const parts: Buffer[] = []

    // Add shell script header based on OS
    if (os === "windows") {
      parts.push(Buffer.from("@echo off\n\n"))
    } else {
      parts.push(Buffer.from("#!/bin/bash\n\n"))
    }

    // Add the command
    parts.push(commandBuffer)

    // Add arguments
    for (let i = 0; i < this.args.length; i++) {
      if (i === 0) {
        parts.push(spaceBuffer)
      } else {
        parts.push(newlineBuffer)
      }
      parts.push(this.args[i])
    }

    return Buffer.concat(parts)
  }

  static buildFromConfig(config: NodeConfig, baseCommand: string, mappings: Mappings): Buffer {
    const { common } = config
    const os = common.operatingSystem
    const builder = new CommandBuilder(baseCommand, mappings)

    for (const rule of mappings.rules) {
      // Check if this rule is enabled via the 'enabled' property
      if (rule.enabled) {
        let enabledValue = this.getValueFromPath(config, rule.enabled.configPath)
        if (rule.enabled.transform) {
          if (!transformers[rule.enabled.transform]) {
            throw new Error(`Unknown transform function: ${rule.enabled.transform} for flag: ${rule.flag}`);
          }
          enabledValue = (transformers[rule.enabled.transform] as TransformFunction)(enabledValue, os, rule.flag)
        }
        if (!enabledValue) {
          continue
        }
      }

      const value = this.getValueFromPath(config, rule.configPath)

      if (value !== undefined) {
        let transformedValue = value
        if (rule.transform) {
          if (!transformers[rule.transform]) {
            throw new Error(`Unknown transform function: ${rule.transform} for flag: ${rule.flag}`);
          }

          if (rule.transform === 'interpolate') {
            transformedValue = (transformers[rule.transform] as TransformFunctionWithConfig)(value, config);
          } else {
            transformedValue = (transformers[rule.transform] as TransformFunction)(value, os, rule.flag);
          }
        }

        // Check if this flag has a parent and if the parent is enabled
        // todo remove this and use flagEnabled instead and enable the flag if the parent is enabled
        if (typeof rule.parent === 'string') {
          const parentRule = mappings.rules.find(r => r.flag === rule.parent)
          if (typeof parentRule === 'undefined') {
            continue
          }
          const parentConfigPath = parentRule.configPath
          const parentValue = this.getValueFromPath(config, parentConfigPath)
          if (parentValue === false) {
            continue
          }
        }

        if (typeof transformedValue === 'boolean') {
          builder.addFlag(rule.flag, transformedValue)
        } else {
          builder.addArg(rule.flag, transformedValue)
        }
      }
    }

    return builder.build(os)
  }

  static getValueFromPath(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => {
      if (current === undefined) return undefined
      return current[key]
    }, obj)
  }
}
