import * as fs from "fs-extra";
import { GenerateOptions, NodeConfig, ExecutionClientName, ConsensusClientName, ValidatorClientName, Execution, Consensus, Validator } from "@/lib/types";
import { ConfigManager } from "@/utils/config";
import { Logger } from "@/utils/logger";
import { EXECUTION_CLIENTS, CONSENSUS_CLIENTS, VALIDATOR_CLIENTS } from "@/lib/client-names";
import { CommandClientRegistry } from "@/builders/command/command-client-registry";
import inquirer from "inquirer";

/**
 * Generate Ethereum client commands
 * @param options Generation options
 */
export async function generate(
  options: Partial<GenerateOptions>,
): Promise<void> {
  const logger = new Logger(options.verbose ? "verbose" : "info");
  const configManager = new ConfigManager(options.verbose);

  const preset = options.preset || "default";
  logger.info(`Using preset: ${preset}`);

  let userConfig: Partial<NodeConfig> = {};

  if (options.configFile) {
    logger.info(`Loading config file: ${options.configFile}`);
    try {
      userConfig = await configManager.loadConfigFile(options.configFile);
      logger.debug(`Loaded config: ${JSON.stringify(userConfig, null, 2)}`);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to load config file: ${error.message}`);
        throw new Error(`Failed to load config file: ${error.message}`);
      } else {
        logger.error(`Failed to load config file: Unknown error`);
        throw new Error('Failed to load config file: Unknown error');
      }
    }
  }

  userConfig = configManager.mergeOptionsWithConfig(userConfig, options);
  logger.debug(`Merged config: ${JSON.stringify(userConfig, null, 2)}`);

  const configExecution = userConfig.execution?.client?.name || "";
  const configConsensus = userConfig.consensus?.client?.name || "";
  const configValidator = userConfig.validator?.client?.name || "";

  logger.debug(`Config values - Execution: ${configExecution}, Consensus: ${configConsensus}, Validator: ${configValidator}`);

  const missingFields: string[] = [];
  if (!configExecution && !options.execution) {
    missingFields.push('execution');
  }
  if (!configConsensus && !options.consensus) {
    missingFields.push('consensus');
  }
  if ((userConfig.validator?.enabled === true && !userConfig.validator?.client?.name)) {
    missingFields.push('validator');
  }

  logger.debug(`Missing fields: ${missingFields.join(', ')}`);

  const finalOptions = await promptForMissingOptions(options, missingFields);

  userConfig.execution = {
    ...userConfig.execution,
    client: {
      name: finalOptions.execution as ExecutionClientName,
      version: "",
    },
  } as Execution;
  userConfig.consensus = {
    ...userConfig.consensus,
    client: {
      name: finalOptions.consensus as ConsensusClientName,
      version: "",
    },
  } as Consensus;
  userConfig.validator = {
    ...userConfig.validator,
    enabled: finalOptions.validator ? true : false,
    client: {
      name: finalOptions.validator as ValidatorClientName,
      version: "",
    },
  } as Validator;

  try {
    const config = await configManager.processConfigWithPreset(userConfig, preset);

    await generateClientCommands(config, finalOptions, logger);

    logger.success("Client commands generated successfully");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Config validation failed: ${error.message}`);
      throw new Error(`Config validation failed: ${error.message}`);
    } else {
      logger.error("Config validation failed with an unknown error");
      throw new Error('Config validation failed with an unknown error');
    }
  }
}

/**
 * Prompt the user for any missing options
 * @param options Partial options from the command line
 * @param missingFields List of fields that need to be prompted
 * @returns Complete options with user input
 */
async function promptForMissingOptions(
  options: Partial<GenerateOptions>,
  missingFields: string[] = []
): Promise<GenerateOptions> {
  const questions = [];

  let configExecution = "";
  let configConsensus = "";
  let configValidator = "";

  if (options.configFile) {
    try {
      const configManager = new ConfigManager();
      const loadedConfig = await configManager.loadConfigFile(options.configFile);
      configExecution = loadedConfig.execution?.client?.name || "";
      configConsensus = loadedConfig.consensus?.client?.name || "";
      configValidator = loadedConfig.validator?.enabled ? loadedConfig.validator?.client?.name || "" : "";
    } catch (error) {
      throw new Error(`Failed to load config file values: ${error}`);
    }
  }

  if ((missingFields.includes('execution') || !options.execution) && !options.execution && !configExecution) {
    questions.push({
      type: "list",
      name: "execution",
      message: "Select an execution client:",
      choices: EXECUTION_CLIENTS,
    });
  }

  if ((missingFields.includes('consensus') || !options.consensus) && !options.consensus && !configConsensus) {
    questions.push({
      type: "list",
      name: "consensus",
      message: "Select a consensus client:",
      choices: CONSENSUS_CLIENTS,
    });
  }

  if ((missingFields.includes('validator'))) {
    questions.push({
      type: "list",
      name: "validator",
      message: "Select a validator client:",
      choices: VALIDATOR_CLIENTS,
    });
  }

  if (!options.output) {
    questions.push({
      type: "input",
      name: "output",
      message: "Output directory for commands:",
      default: "./ethereum-commands",
    });
  }

  const answers: Record<string, any> = questions.length > 0 ? await inquirer.prompt(questions) : {};

  const result: GenerateOptions = {
    preset: options.preset || "default",
    execution: options.execution || configExecution || answers.execution || "",
    consensus: options.consensus || configConsensus || answers.consensus || "",
    validator: options.validator || configValidator || answers.validator,
    output: options.output || answers.output || "./ethereum-commands",
    configFile: options.configFile,
  };

  return result;
}

/**
 * Generate commands for the selected clients
 * @param config The complete configuration
 * @param options The generation options
 * @param logger Logger instance
 */
async function generateClientCommands(
  config: NodeConfig,
  options: GenerateOptions,
  logger: Logger,
): Promise<void> {
  const outputDir = options.output || "./ethereum-commands";
  const registry = new CommandClientRegistry();

  await fs.ensureDir(outputDir);

  if (options.execution) {
    logger.info(`Generating command for execution client: ${options.execution}`);
    registry.generateScript(options.execution as ExecutionClientName, config, outputDir);
  }

  if (options.consensus) {
    logger.info(`Generating command for consensus client: ${options.consensus}`);
    registry.generateScript(options.consensus as ConsensusClientName, config, outputDir);
  }

  if (options.validator) {
    logger.info(`Generating command for validator client: ${options.validator}`);
    registry.generateScript(options.validator as ValidatorClientName, config, outputDir, true);
  }
}