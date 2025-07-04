import { ExecutionClientName, NodeConfig, ValidatorClientName, ConsensusClientName } from "@/types"
import { CommandBuilder } from "./command-builder"
import { ConfigError, ValidationError } from "@/errors"
import { MappingLoader, Mappings } from "./mapping-loader"
import { 
  CLIENT_TYPES, 
  DEFAULT_PARAMS, 
  ERROR_MESSAGES, 
  DEFAULT_CLIENT_COMMANDS,
  SCRIPT_EXTENSION,
  VALIDATOR_SUFFIX
} from "@/constants"
import * as path from "path"
import * as fs from "fs"

/**
 * Registry for managing Ethereum client commands and configurations
 * Handles execution, consensus, and validator clients with their respective
 * command mappings and script generation capabilities.
 */
export class CommandClientRegistry {
  // Instance variables (private first)
  private readonly executionMappings: Record<ExecutionClientName, Mappings>
  private readonly consensusMappings: Record<ConsensusClientName, Mappings>
  private readonly validatorMappings: Record<ValidatorClientName, Mappings>

  private executionClientCommands: Record<ExecutionClientName, string>
  private consensusClientCommands: Record<ConsensusClientName, string>
  private validatorClientCommands: Record<ValidatorClientName, string>

  constructor() {
    // Load all mappings
    this.executionMappings = MappingLoader.loadClientMappings(CLIENT_TYPES.EXECUTION) as Record<ExecutionClientName, Mappings>
    this.consensusMappings = MappingLoader.loadClientMappings(CLIENT_TYPES.CONSENSUS) as Record<ConsensusClientName, Mappings>
    this.validatorMappings = MappingLoader.loadClientMappings(CLIENT_TYPES.VALIDATOR) as Record<ValidatorClientName, Mappings>

    // Initialize commands with defaults
    this.executionClientCommands = { ...DEFAULT_CLIENT_COMMANDS.execution }
    this.consensusClientCommands = { ...DEFAULT_CLIENT_COMMANDS.consensus }
    this.validatorClientCommands = { ...DEFAULT_CLIENT_COMMANDS.validator }
  }



  /**
   * Get the script content for a specific client without writing to file
   * @param clientName - The name of the client
   * @param config - The node configuration
   * @param isValidator - Whether this is a validator client
   * @returns Buffer containing the script content
   * @throws ValidationError if the client is not found or command is not registered
   */
  getScriptContent(
    clientName: ExecutionClientName | ConsensusClientName | ValidatorClientName,
    config: NodeConfig,
    isValidator: boolean = DEFAULT_PARAMS.IS_VALIDATOR
  ): Buffer {
    let mappings: Mappings
    let command: string
    let version: string

    // Determine client type and get appropriate mappings and command
    if (clientName in this.executionMappings) {
      mappings = this.executionMappings[clientName as ExecutionClientName]
      command = this.executionClientCommands[clientName as ExecutionClientName]
      version = config.execution.client.version
    } else if (clientName in this.consensusMappings && !isValidator) {
      mappings = this.consensusMappings[clientName as ConsensusClientName]
      command = this.consensusClientCommands[clientName as ConsensusClientName]
      version = config.consensus.client.version
    } else if (clientName in this.validatorMappings && isValidator) {
      mappings = this.validatorMappings[clientName as ValidatorClientName]
      command = this.validatorClientCommands[clientName as ValidatorClientName]
      version = config.validator.client.version
    } else {
      throw new ValidationError(
        ERROR_MESSAGES.CLIENT_NOT_FOUND(clientName, isValidator),
        "clientName",
        clientName
      )
    }

    if (!command) {
      throw new ValidationError(
        ERROR_MESSAGES.COMMAND_NOT_REGISTERED(clientName),
        "command",
        command
      )
    }

    return CommandBuilder.buildFromConfig(
      config,
      command,
      mappings,
      { version, name: clientName }
    )
  }

  /**
   * Generate a script file for a specific client
   * @param clientName - The name of the client
   * @param config - The node configuration
   * @param outputPath - The directory to write the script to
   * @param isValidator - Whether this is a validator client
   * @returns The path to the generated script file
   * @throws ConfigError if the file cannot be written
   */
  generateScript(
    clientName: ExecutionClientName | ConsensusClientName | ValidatorClientName,
    config: NodeConfig,
    outputPath: string,
    isValidator: boolean = DEFAULT_PARAMS.IS_VALIDATOR
  ): string {
    try {
      const scriptContent = this.getScriptContent(clientName, config, isValidator)
      const fileName = this.getScriptFileName(clientName, isValidator)
      const filePath = path.join(outputPath, fileName)

      // Ensure output directory exists
      const outputDir = path.dirname(filePath)
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      fs.writeFileSync(filePath, scriptContent)
      return filePath
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error
      }
      throw new ConfigError(
        ERROR_MESSAGES.SCRIPT_GENERATION_FAILED(clientName, (error as Error).message),
        outputPath,
        error as Error
      )
    }
  }
  // Private methods
  /**
   * Generate an appropriate script filename based on client and validator status
   * @param clientName - The name of the client
   * @param isValidator - Whether this is a validator client
   * @returns The filename for the script
   */
  private getScriptFileName(clientName: string, isValidator: boolean = DEFAULT_PARAMS.IS_VALIDATOR): string {
    const baseName = isValidator ? `${clientName}${VALIDATOR_SUFFIX}` : clientName
    return `${baseName}${SCRIPT_EXTENSION}`
  }
}
