import * as fs from "fs-extra";
import inquirer from "inquirer";
import { GenerateOptions, NodeConfig, CommonConfig, ClientsConfig, FeaturesConfig, ExecutionClientName, ConsensusClientName, ValidatorClientName } from "@/lib/types";
import { ConfigManager } from "@/utils/config";
import { Logger } from "@/utils/logger";
import { EXECUTION_CLIENTS, CONSENSUS_CLIENTS, VALIDATOR_CLIENTS } from "@/lib/client-names";
import { CommandClientRegistry } from "@/lib/builders/command/command-client-registry";

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
      } else {
        logger.error(`Failed to load config file: Unknown error`);
      }
      process.exit(1);
    }
  }

  userConfig = configManager.mergeOptionsWithConfig(userConfig, options);
  logger.debug(`Merged config: ${JSON.stringify(userConfig, null, 2)}`);

  const configExecution = userConfig.commonConfig?.clients?.execution || "";
  const configConsensus = userConfig.commonConfig?.clients?.consensus || "";
  const configValidator = userConfig.commonConfig?.clients?.validator || "";

  logger.debug(`Config values - Execution: ${configExecution}, Consensus: ${configConsensus}, Validator: ${configValidator}`);

  const missingFields: string[] = [];
  if (!configExecution && !options.execution) {
    missingFields.push('execution');
  }
  if (!configConsensus && !options.consensus) {
    missingFields.push('consensus');
  }
  if ((userConfig.commonConfig?.features?.staking === true && !userConfig.commonConfig?.clients?.validator)) {
    missingFields.push('validator');
  }

  logger.debug(`Missing fields: ${missingFields.join(', ')}`);

  const finalOptions = await promptForMissingOptions(options, missingFields);

  userConfig.commonConfig = {
    ...userConfig?.commonConfig,
    clients: {
      execution: finalOptions.execution,
      consensus: finalOptions.consensus,
      validator: finalOptions.validator || ""
    } as ClientsConfig,
    features: {
      ...userConfig.commonConfig?.features,
      staking: finalOptions.validator ? true : false,
    } as FeaturesConfig,
  } as CommonConfig;

  try {
    const config = await configManager.processConfigWithPreset(userConfig, preset);

    await generateClientCommands(config, finalOptions, logger);

    logger.success("Client commands generated successfully");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Config validation failed: ${error.message}`);
    } else {
      logger.error("Config validation failed with an unknown error");
    }
    process.exit(1);
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
      configExecution = loadedConfig.commonConfig?.clients?.execution || "";
      configConsensus = loadedConfig.commonConfig?.clients?.consensus || "";
      configValidator = loadedConfig.commonConfig?.clients?.validator || "";
    } catch (error) {
      console.error("Failed to load config file values:", error);
      process.exit(1);

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