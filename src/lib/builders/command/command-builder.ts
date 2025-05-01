import { OperatingSystem, NodeConfig } from "../../types"

type TransformFunction = (value: any, os: string) => any

type Rule = {
  configPath: string
  flag: string
  transform?: string
  parent?: string
}

type Mappings = {
  rules: Rule[]
}

const transformers: Record<string, TransformFunction> = {
  formatPath: (value: string, os: string) => {
    if (os === "windows") {
      return value.replace(/\//g, "\\")
    }
    return value
  },
  joinComma: (value: string | string[]) => {
    return Array.isArray(value) ? value.join(",") : value
  },
  syncMode: (value: string) => {
    const isFastSync = value.toLowerCase() === "fast" || value.toLowerCase() === "snap"
    return isFastSync ? "fast" : "full"
  },
  network: (value: string) => {
    return `--${value}`
  }
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
      this.args.push(Buffer.from(`${flag}=${value}`))
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
    const { commonConfig } = config
    const os = commonConfig.operatingSystem
    const builder = new CommandBuilder(baseCommand, mappings)

    for (const rule of mappings.rules) {
      const value = this.getValueFromPath(config, rule.configPath)
      if (value !== undefined) {
        let transformedValue = value
        if (rule.transform) {
          transformedValue = transformers[rule.transform](value, os)
        }

        // Check if this flag has a parent and if the parent is enabled
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

        if (typeof value === 'boolean') {
          builder.addFlag(rule.flag, value)
        } else {
          builder.addArg(rule.flag, transformedValue)
        }
      }
    }

    return builder.build(os)
  }

  private static getValueFromPath(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => {
      if (current === undefined) return undefined
      return current[key]
    }, obj)
  }
}
