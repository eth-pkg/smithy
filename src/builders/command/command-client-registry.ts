import { ExecutionClientName, NodeConfig, ValidatorClientName, ConsensusClientName } from "@/lib/types"
import { CommandBuilder } from "./command-builder"
import * as path from "path"
import * as fs from "fs"
import * as yaml from "js-yaml"

const ROOT_DIR = path.join(__dirname, "../../../data/mappings")
function loadYamlFile(filename: string): any {
  return yaml.load(fs.readFileSync(path.join(ROOT_DIR, filename), "utf8"))
}

// Execution client mappings
const besuMappings = loadYamlFile("besu-cmd-mappings.yaml")
const erigonMappings = loadYamlFile("erigon-cmd-mappings.yaml")
const gethMappings = loadYamlFile("geth-cmd-mappings.yaml")
const nethermindMappings = loadYamlFile("nethermind-cmd-mappings.yaml")
const rethMappings = loadYamlFile("reth-cmd-mappings.yaml")

// Consensus client mappings
const lighthouseMappings = loadYamlFile("lighthouse-cmd-mappings.yaml")
const lodestarMappings = loadYamlFile("lodestar-cmd-mappings.yaml")
const nimbusMappings = loadYamlFile("nimbus-eth2-cmd-mappings.yaml")
const prysmMappings = loadYamlFile("prysm-cmd-mappings.yaml")
const tekuMappings = loadYamlFile("teku-cmd-mappings.yaml")

// Validator client mappings
const lighthouseValidatorMappings = loadYamlFile("lighthouse-validator-cmd-mappings.yaml")
const lodestarValidatorMappings = loadYamlFile("lodestar-validator-cmd-mappings.yaml")
const nimbusValidatorMappings = loadYamlFile("nimbus-eth2-validator-cmd-mappings.yaml")
const prysmValidatorMappings = loadYamlFile("prysm-validator-cmd-mappings.yaml")
const tekuValidatorMappings = loadYamlFile("teku-validator-cmd-mappings.yaml")

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
    reth: "reth node",
  }

  private consensusClientCommands: Record<ConsensusClientName, string> = {
    lighthouse: "lighthouse beacon",
    lodestar: "lodestar beacon",
    "nimbus-eth2": "nimbus_beacon_node",
    prysm: "beacon-chain",
    teku: "teku beacon",
  }

  private validatorClientCommands: Record<ValidatorClientName, string> = {
    lighthouse: "lighthouse validator_client",
    lodestar: "lodestar validator",
    "nimbus-eth2": "nimbus-eth2 validator",
    prysm: "prysm validator",
    teku: "teku validator-client",
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
    } else if (clientName in consensusClientMappings && !isValidator) {
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
