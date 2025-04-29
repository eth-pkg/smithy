import * as fs from "fs-extra";
import * as path from "path";
import inquirer from "inquirer";
import { GenerateOptions, EthereumConfig, ClientSelection } from "../clients/types";
import { ConfigManager } from "../utils/config";
import { Logger } from "../utils/logger";
import { clients, getClientNames } from "../clients";

/**
 * Generate Ethereum client configurations
 * @param options Generation options
 */
export async function generate(
  options: Partial<GenerateOptions>,
): Promise<void> {
  const logger = new Logger(options.preset ? "verbose" : "info");
  const configManager = new ConfigManager(options.preset !== undefined);

  // Set default preset
  const preset = options.preset || "default";
  logger.info(`Using preset: ${preset}`);

  // Create initial partial config from CLI options
  let userConfig: Partial<EthereumConfig> = {};

  // If a config file is provided, load it
  if (options.configFile) {
    logger.info(`Loading config file: ${options.configFile}`);
    try {
      userConfig = await configManager.loadConfigFile(options.configFile);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to load config file: ${error.message}`);
      } else {
        logger.error(`Failed to load config file: Unknown error`);
      }
      // Continue with empty config and let prompts handle it
    }
  }

  // Merge CLI options with loaded config
  userConfig = configManager.mergeOptionsWithConfig(userConfig, options);

  // Check for missing required fields and prompt for them
  const missingFields: string[] = configManager.getMissingRequiredFields(userConfig);

  // If clients aren't specified, prompt for them
  const finalOptions = await promptForMissingOptions(options, missingFields);

  // Update user config with prompted values - let the processConfigWithPreset handle defaults
  if (finalOptions.execution) {
    // Ensure commonConfig exists
    if (!userConfig.commonConfig) {
      userConfig.commonConfig = {} as any;
    }

    // Type assertions to avoid TypeScript errors
    const commonConfig = userConfig.commonConfig as any;

    // Ensure clients object exists
    if (!commonConfig.clients) {
      commonConfig.clients = {
        consensus: '',
        execution: '',
        validator: ''
      };
    }

    // Set execution client
    commonConfig.clients.execution = finalOptions.execution;
  }

  if (finalOptions.consensus) {
    // Ensure commonConfig exists
    if (!userConfig.commonConfig) {
      userConfig.commonConfig = {} as any;
    }

    // Type assertions to avoid TypeScript errors
    const commonConfig = userConfig.commonConfig as any;

    // Ensure clients object exists
    if (!commonConfig.clients) {
      commonConfig.clients = {
        consensus: '',
        execution: '',
        validator: ''
      };
    }

    // Set consensus client
    commonConfig.clients.consensus = finalOptions.consensus;
  }

  if (finalOptions.validator) {
    // Ensure commonConfig exists
    if (!userConfig.commonConfig) {
      userConfig.commonConfig = {} as any;
    }

    // Type assertions to avoid TypeScript errors
    const commonConfig = userConfig.commonConfig as any;

    // Ensure clients object exists
    if (!commonConfig.clients) {
      commonConfig.clients = {
        consensus: '',
        execution: '',
        validator: ''
      };
    }

    // Ensure features object exists
    if (!commonConfig.features) {
      commonConfig.features = {
        mevBoost: false,
        monitoring: false,
        staking: false
      };
    }

    // Set validator client and enable staking
    commonConfig.clients.validator = finalOptions.validator;
    commonConfig.features.staking = true;
  }

  // Process the user config with the preset (validate and apply rules)
  try {
    const config = await configManager.processConfigWithPreset(userConfig, preset);

    // Generate configuration files for each client
    await generateClientConfigs(config, finalOptions);

    logger.success("Configuration files generated successfully");
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

  // Get lists of available clients
  const executionClients = getClientNames("execution");
  const consensusClients = getClientNames("consensus");
  const validatorClients = getClientNames("validator");

  // Only prompt for execution client if it's missing and not in command line options
  if ((missingFields.includes('execution') || !options.execution) && !options.execution) {
    questions.push({
      type: "list",
      name: "execution",
      message: "Select an execution client:",
      choices: executionClients,
    });
  }

  // Only prompt for consensus client if it's missing and not in command line options
  if ((missingFields.includes('consensus') || !options.consensus) && !options.consensus) {
    questions.push({
      type: "list",
      name: "consensus",
      message: "Select a consensus client:",
      choices: consensusClients,
    });
  }

  // Validator is optional, only prompt if user wants it
  if (!options.validator) {
    questions.push({
      type: "confirm",
      name: "includeValidator",
      message: "Do you want to include a validator client?",
      default: false,
    });

    questions.push({
      type: "list",
      name: "validator",
      message: "Select a validator client:",
      choices: validatorClients,
      when: (answers: any) => answers.includeValidator,
    });
  }

  if (!options.output) {
    questions.push({
      type: "input",
      name: "output",
      message: "Output directory for configurations:",
      default: "./ethereum-configs",
    });
  }

  // Prompt for missing options
  const answers: Record<string, any> = questions.length > 0 ? await inquirer.prompt(questions) : {};

  // Merge command line options with answers
  const result: GenerateOptions = {
    preset: options.preset || "default",
    execution: options.execution || answers.execution || "",
    consensus: options.consensus || answers.consensus || "",
    validator: options.validator || answers.validator,
    output: options.output || answers.output || "./ethereum-configs",
    configFile: options.configFile,
  };

  return result;
}

/**
 * Generate configuration files for the selected clients
 * @param config The complete configuration
 * @param options The generation options
 */
async function generateClientConfigs(
  config: EthereumConfig,
  options: GenerateOptions,
): Promise<void> {
  const logger = new Logger();
  const outputDir = options.output || "./ethereum-configs";

  // Ensure output directory exists
  await fs.ensureDir(outputDir);

  // Generate execution client config
  const executionClient = clients.execution[options.execution];
  if (!executionClient) {
    throw new Error(`Unknown execution client: ${options.execution}`);
  }

  logger.info(`Generating config for execution client: ${options.execution}`);
  const executionConfig = executionClient.generateConfig(config);
  await fs.writeFile(
    path.join(outputDir, `${options.execution}.toml`),
    executionConfig,
    "utf-8",
  );

  // Generate consensus client config
  const consensusClient = clients.consensus[options.consensus];
  if (!consensusClient) {
    throw new Error(`Unknown consensus client: ${options.consensus}`);
  }

  logger.info(`Generating config for consensus client: ${options.consensus}`);
  const consensusConfig = consensusClient.generateConfig(config);
  await fs.writeFile(
    path.join(outputDir, `${options.consensus}.toml`),
    consensusConfig,
    "utf-8",
  );

  // Generate validator client config if specified
  if (options.validator) {
    const validatorClient = clients.validator[options.validator];
    if (!validatorClient) {
      throw new Error(`Unknown validator client: ${options.validator}`);
    }

    logger.info(`Generating config for validator client: ${options.validator}`);
    const validatorConfig = validatorClient.generateConfig(config);
    await fs.writeFile(
      path.join(outputDir, `${options.validator}-validator.toml`),
      validatorConfig,
      "utf-8",
    );
  }
}