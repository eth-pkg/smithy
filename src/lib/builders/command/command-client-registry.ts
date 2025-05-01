import { ExecutionClientName, NodeConfig, ValidatorClientName, ConsensusClientName } from "../../types"
import { CommandBuilder } from "./command-builder"
import * as path from "path"
import * as fs from "fs"

// Execution client mappings
import besuMappings from "./mappings/besu-cmd-mappings.json"
import erigonMappings from "./mappings/erigon-cmd-mappings.json"
import gethMappings from "./mappings/geth-cmd-mappings.json"
import nethermindMappings from "./mappings/nethermind-cmd-mappings.json"
import rethMappings from "./mappings/reth-cmd-mappings.json"

// Consensus client mappings
import lighthouseMappings from "./mappings/lighthouse-cmd-mappings.json"
import lodestarMappings from "./mappings/lodestar-cmd-mappings.json"
import nimbusMappings from "./mappings/nimbus-eth2-cmd-mappings.json"
import prysmMappings from "./mappings/prysm-cmd-mappings.json"
import tekuMappings from "./mappings/teku-cmd-mappings.json"

// Validator client mappings
import lighthouseValidatorMappings from "./mappings/lighthouse-validator-cmd-mappings.json"
import lodestarValidatorMappings from "./mappings/lodestar-validator-cmd-mappings.json"
import nimbusValidatorMappings from "./mappings/nimbus-eth2-validator-cmd-mappings.json"
import prysmValidatorMappings from "./mappings/prysm-validator-cmd-mappings.json"
import tekuValidatorMappings from "./mappings/teku-validator-cmd-mappings.json"

const executionClientMappings: Record<ExecutionClientName, any> = {
  geth: gethMappings,
  erigon: erigonMappings,
  nethermind: nethermindMappings,
  besu: besuMappings,
  reth: rethMappings,
}

const consensusClientMappings: Record<ConsensusClientName, any> = {
  lighthouse: lighthouseMappings,
  lodestar: lodestarMappings,
  "nimbus-eth2": nimbusMappings,
  prysm: prysmMappings,
  teku: tekuMappings,
}

const validatorClientMappings: Record<ValidatorClientName, any> = {
  lighthouse: lighthouseValidatorMappings,
  lodestar: lodestarValidatorMappings,
  "nimbus-eth2": nimbusValidatorMappings,
  prysm: prysmValidatorMappings,
  teku: tekuValidatorMappings,
}

export class CommandClientRegistry {
  private executionClientCommands: Record<ExecutionClientName, string> = {
    geth: "geth",
    erigon: "erigon",
    nethermind: "nethermind",
    besu: "besu",
    reth: "reth",
  }

  private consensusClientCommands: Record<ConsensusClientName, string> = {
    lighthouse: "lighthouse beacon",
    lodestar: "lodestar beacon",
    "nimbus-eth2": "nimbus-eth2 beacon",
    prysm: "prysm beacon",
    teku: "teku beacon",
  }

  private validatorClientCommands: Record<ValidatorClientName, string> = {
    lighthouse: "lighthouse validator",
    lodestar: "lodestar validator",
    "nimbus-eth2": "nimbus-eth2 validator",
    prysm: "prysm validator",
    teku: "teku validator",
  }

  constructor() {
  }

  /**
   * Register additional client command
   */
  registerClientCommand(name: string, command: string): this {
    if (name in this.executionClientCommands) {
      this.executionClientCommands[name as ExecutionClientName] = command
    } else if (name in this.consensusClientCommands) {
      this.consensusClientCommands[name as ConsensusClientName] = command
    } else if (name in this.validatorClientCommands) {
      this.validatorClientCommands[name as ValidatorClientName] = command
    }
    return this
  }

  /**
   * List all available clients
   */
  listClients(): {
    execution: ExecutionClientName[],
    consensus: ConsensusClientName[],
    validator: ValidatorClientName[]
  } {
    return {
      execution: Object.keys(executionClientMappings) as ExecutionClientName[],
      consensus: Object.keys(consensusClientMappings) as ConsensusClientName[],
      validator: Object.keys(validatorClientMappings) as ValidatorClientName[]
    }
  }

  /**
   * Get the script content for a specific client without writing to file
   */
  getScriptContent(
    clientName: ExecutionClientName | ConsensusClientName | ValidatorClientName, 
    config: NodeConfig, 
    isValidator: boolean = false
  ): Buffer {
    let mappings: any
    let command: string

    if (clientName in executionClientMappings) {
      mappings = executionClientMappings[clientName as ExecutionClientName]
      command = this.executionClientCommands[clientName as ExecutionClientName]
    } else if (clientName in consensusClientMappings) {
      mappings = consensusClientMappings[clientName as ConsensusClientName]
      command = this.consensusClientCommands[clientName as ConsensusClientName]
    } else if (clientName in validatorClientMappings && isValidator) {
      mappings = validatorClientMappings[clientName as ValidatorClientName]
      command = this.validatorClientCommands[clientName as ValidatorClientName]
    } else {
      throw new Error(`Client "${clientName}" not found in registry`)
    }

    if (!command) {
      throw new Error(`Command for client "${clientName}" not registered`)
    }

    return CommandBuilder.buildFromConfig(
      config,
      command,
      mappings,
    )
  }

  /**
   * Generate a script for a specific client
   */
  generateScript(
    clientName: ExecutionClientName | ConsensusClientName | ValidatorClientName, 
    config: NodeConfig, 
    outputPath: string,
    isValidator: boolean = false
  ): string {
  

    const scriptContent = this.getScriptContent(
      clientName,
      config,
      isValidator
    )

    const filePath = path.join(outputPath, this.getScriptFileName(clientName, config, isValidator))
    fs.writeFileSync(filePath, scriptContent)
    
    return filePath
  }

  /**
   * Generate scripts for all registered clients
   */
  generateAllScripts(config: NodeConfig, baseOutputDir: string): Map<string, string> {
    const outputPaths = new Map<string, string>()
    const outputDir = baseOutputDir
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const { execution, consensus, validator } = this.listClients()

    for (const clientName of execution) {
      const filePath = path.join(outputDir, this.getScriptFileName(clientName, config))
      this.generateScript(clientName, config, filePath)
      outputPaths.set(clientName, filePath)
    }

    for (const clientName of consensus) {
      const filePath = path.join(outputDir, this.getScriptFileName(clientName, config))
      this.generateScript(clientName, config, filePath)
      outputPaths.set(clientName, filePath)
    }

    for (const clientName of validator) {
      const filePath = path.join(outputDir, this.getScriptFileName(clientName, config, true))
      this.generateScript(clientName, config, filePath, true)
      outputPaths.set(clientName, filePath)
    }

    return outputPaths
  }


  /**
   * Generate an appropriate script filename based on client and OS
   */
  private getScriptFileName(clientName: string, config: NodeConfig, isValidator: boolean = false): string {
    
    if (isValidator) {
      return `${clientName}-validator.sh`;
    }
    return `${clientName}.sh`;
  }
}
