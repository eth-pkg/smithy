import { OperatingSystem, NodeConfig } from "@/lib/types"
import { FlagEnabledFunction, transformers, TransformFunction, TransformFunctionWithConfig } from "./transformers"
import { getValueFromPath } from "./utils"

type Rule = {
  configPath: string
  flag: string
  transform?: string
  parent?: string
  enabled?: {
    configPath: string
    transform?: string
  } | {
    configPath: string
    transform?: string
  }[]
}

type Mappings = {
  rules: Rule[]
  valueFormat: 'equals' | 'space'
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
   
    
      if (rule.enabled) {
        const enabledConditions = Array.isArray(rule.enabled) ? rule.enabled : [rule.enabled]
        const allEnabled = enabledConditions.every(condition => {
          let enabledValue = getValueFromPath(config, condition.configPath)
          if (condition.transform) {
            if (!transformers[condition.transform]) {
              throw new Error(`Unknown transform function: ${condition.transform} for flag: ${rule.flag}`);
            }
            enabledValue = (transformers[condition.transform] as FlagEnabledFunction)(enabledValue)
          }
          return enabledValue
        })
        
        if (!allEnabled) {
          continue
        }
      }

      const value = getValueFromPath(config, rule.configPath)

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

        if (typeof transformedValue === 'boolean') {
          builder.addFlag(rule.flag, transformedValue)
        } else {
          builder.addArg(rule.flag, transformedValue)
        }
      }
    }

    return builder.build(os)
  }
}
