import * as fs from "fs-extra";
import {
  GenerateOptions,
  NodeConfig,
  ExecutionClientName,
  ConsensusClientName,
  ValidatorClientName,
  Execution,
  Consensus,
  Validator,
} from "@/types";
import { NodeConfigManager } from "@/utils/node-config";
import { Logger } from "@/utils/logger";
import {
  EXECUTION_CLIENTS,
  CONSENSUS_CLIENTS,
  VALIDATOR_CLIENTS,
} from "@/types";
import { CommandClientRegistry } from "@/builders/command/command-client-registry";
import inquirer from "inquirer";

/**
 * Generate Ethereum client commands
 * @param options Generation options
 */
export async function generate(
  options: Partial<GenerateOptions>
): Promise<void> {
  const logger = new Logger(options.verbose ? "verbose" : "info");
  const nodeconfig = new NodeConfigManager(options.verbose);
  const preset = options.preset || "default";
  logger.info(`Using preset: ${preset}`);

  let userConfig: Partial<NodeConfig> = {};
  if (options.configFile) {
    logger.info(`Loading config file: ${options.configFile}`);
    try {
      userConfig = await nodeconfig.loadConfigFile(options.configFile);
      logger.debug(`Loaded config: ${JSON.stringify(userConfig, null, 2)}`);
    } catch (error) {
      handleError(error, logger, "Failed to load config file");
    }
  } else if (preset.startsWith("default") && !options.configFile) {
    logger.info(`Loading default config: ${preset}`);
    userConfig = await nodeconfig.loadDefaultConfig(preset);
  }

  userConfig = nodeconfig.mergeOptionsWithConfig(userConfig, options);
  logger.debug(`Merged config: ${JSON.stringify(userConfig, null, 2)}`);

  const missingFields = determineMissingFields(userConfig, options);
  logger.debug(`Missing fields: ${missingFields.join(", ")}`);

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

  console.log("userConfig", userConfig);
  try {
    const config = await nodeconfig.processConfigWithPreset(
      userConfig,
      preset
    );
    await generateClientCommands(config, finalOptions, logger);
    logger.success("Client commands generated successfully");
  } catch (error) {
    handleError(error, logger, "Config validation failed");
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
  const configValues = await loadConfigValues(options);

  if (shouldPromptForField("execution", options, configValues.execution)) {
    questions.push({
      type: "list",
      name: "execution",
      message: "Select an execution client:",
      choices: EXECUTION_CLIENTS,
    });
  }

  if (shouldPromptForField("consensus", options, configValues.consensus)) {
    questions.push({
      type: "list",
      name: "consensus",
      message: "Select a consensus client:",
      choices: CONSENSUS_CLIENTS,
    });
  }

  if (missingFields.includes("validator")) {
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
      default: "./node-commands",
    });
  }

  const answers = questions.length > 0 ? await inquirer.prompt(questions) : {};

  return {
    preset: options.preset || "default",
    execution:
      options.execution || configValues.execution || answers.execution || "",
    consensus:
      options.consensus || configValues.consensus || answers.consensus || "",
    validator: options.validator || configValues.validator || answers.validator,
    output: options.output || answers.output || "./node-commands",
    configFile: options.configFile,
  };
}

/**
 * Load configuration values from the config file
 * @param options Command line options
 * @returns Object containing execution, consensus, and validator client names
 */
async function loadConfigValues(options: Partial<GenerateOptions>) {
  if (!options.configFile)
    return { execution: "", consensus: "", validator: "" };

  try {
    const configManager = new NodeConfigManager();
    const loadedConfig = await configManager.loadConfigFile(options.configFile);
    return {
      execution: loadedConfig.execution?.client?.name || "",
      consensus: loadedConfig.consensus?.client?.name || "",
      validator: loadedConfig.validator?.enabled
        ? loadedConfig.validator?.client?.name || ""
        : "",
    };
  } catch (error) {
    throw new Error(`Failed to load config file values: ${error}`);
  }
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
  logger: Logger
): Promise<void> {
  const outputDir = options.output || "./node-commands";
  const registry = new CommandClientRegistry();

  await fs.ensureDir(outputDir);

  const clients = [
    { type: "execution", name: options.execution },
    { type: "consensus", name: options.consensus },
    { type: "validator", name: options.validator },
  ] as const;

  for (const { type, name } of clients) {
    if (name) {
      logger.info(`Generating command for ${type} client: ${name}`);
      registry.generateScript(
        name as ExecutionClientName | ConsensusClientName | ValidatorClientName,
        config,
        outputDir,
        type === "validator"
      );
    }
  }
}

/**
 * Check if a field should be prompted for
 * @param field The field name to check
 * @param options Command line options
 * @param configValue Value from config file
 * @returns Whether the field should be prompted for
 */
function shouldPromptForField(
  field: string,
  options: Partial<GenerateOptions>,
  configValue: string
): boolean {
  return !options[field as keyof GenerateOptions] && !configValue;
}

/**
 * Determine which fields are missing from the configuration
 * @param userConfig The current user configuration
 * @param options The command line options
 * @returns Array of missing field names
 */
function determineMissingFields(
  userConfig: Partial<NodeConfig>,
  options: Partial<GenerateOptions>
): string[] {
  const missingFields: string[] = [];

  if (!userConfig.execution?.client?.name && !options.execution) {
    missingFields.push("execution");
  }
  if (!userConfig.consensus?.client?.name && !options.consensus) {
    missingFields.push("consensus");
  }
  if (
    userConfig.validator?.enabled === true &&
    !userConfig.validator?.client?.name
  ) {
    missingFields.push("validator");
  }

  return missingFields;
}

function handleError(error: unknown, logger: Logger, context: string): never {
  const message = error instanceof Error ? error.message : "Unknown error";
  logger.error(`${context}: ${message}`);
  throw new Error(`${context}: ${message}`);
}

