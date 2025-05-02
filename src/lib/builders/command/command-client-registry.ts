import { ExecutionClientName, NodeConfig, ValidatorClientName, ConsensusClientName } from "../../types"
import { CommandBuilder } from "./command-builder"
import * as path from "path"
import * as fs from "fs"
import * as yaml from "js-yaml"

// Execution client mappings
const besuMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/besu-cmd-mappings.yaml"), "utf8"))
const erigonMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/erigon-cmd-mappings.yaml"), "utf8"))
const gethMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/geth-cmd-mappings.yaml"), "utf8"))
const nethermindMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/nethermind-cmd-mappings.yaml"), "utf8"))
const rethMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/reth-cmd-mappings.yaml"), "utf8"))

// Consensus client mappings
const lighthouseMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/lighthouse-cmd-mappings.yaml"), "utf8"))
const lodestarMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/lodestar-cmd-mappings.yaml"), "utf8"))
const nimbusMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/nimbus-eth2-cmd-mappings.yaml"), "utf8"))
const prysmMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/prysm-cmd-mappings.yaml"), "utf8"))
const tekuMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/teku-cmd-mappings.yaml"), "utf8"))

// Validator client mappings
const lighthouseValidatorMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/lighthouse-validator-cmd-mappings.yaml"), "utf8"))
const lodestarValidatorMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/lodestar-validator-cmd-mappings.yaml"), "utf8"))
const nimbusValidatorMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/nimbus-eth2-validator-cmd-mappings.yaml"), "utf8"))
const prysmValidatorMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/prysm-validator-cmd-mappings.yaml"), "utf8"))
const tekuValidatorMappings = yaml.load(fs.readFileSync(path.join(__dirname, "mappings/teku-validator-cmd-mappings.yaml"), "utf8"))

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
