import * as fs from "fs-extra";
import * as path from "path";
import inquirer from "inquirer";
import { GenerateOptions, EthereumConfig, ClientSelection } from "@/clients/types";
import { ConfigManager } from "@/utils/config";
import { Logger } from "@/utils/logger";
import { clients, getClientNames } from "@/clients";

/**
 * Generate Ethereum client configurations
 * @param options Generation options
 */
export async function generate(
  options: Partial<GenerateOptions>,
): Promise<void> {
  const logger = new Logger(options.verbose ? "verbose" : "info");
  const configManager = new ConfigManager(options.verbose);

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
      logger.debug(`Loaded config: ${JSON.stringify(userConfig, null, 2)}`);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to load config file: ${error.message}`);
      } else {
        logger.error(`Failed to load config file: Unknown error`);
      }
      // Exit if config file loading fails
      process.exit(1);
    }
  }

  // Merge CLI options with loaded config
  userConfig = configManager.mergeOptionsWithConfig(userConfig, options);
  logger.debug(`Merged config: ${JSON.stringify(userConfig, null, 2)}`);

  // Extract client values from the merged config
  const configExecution = userConfig.commonConfig?.clients?.execution || "";
  const configConsensus = userConfig.commonConfig?.clients?.consensus || "";
  const configValidator = userConfig.commonConfig?.clients?.validator || "";

  logger.debug(`Config values - Execution: ${configExecution}, Consensus: ${configConsensus}, Validator: ${configValidator}`);

  // Determine missing fields based on config and CLI options
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

  // If clients aren't specified, prompt for them
  const finalOptions = await promptForMissingOptions(options, missingFields);

  // Ensure commonConfig exists
  if (!userConfig.commonConfig) {
    userConfig.commonConfig = {
      clients: {
        consensus: "",
        execution: "",
        validator: ""
      },
      dataDir: "",
      engine: {
        apiPort: 0,
        communication: "",
        endpointUrl: "",
        host: "",
        ip: "",
        jwtFile: "",
        scheme: ""
      },
      features: {
        mevBoost: false,
        monitoring: false,
        staking: false
      },
      network: "",
      operatingSystem: "",
      syncMode: ""
    };
  }

  // Set client values
  userConfig.commonConfig.clients.execution = finalOptions.execution;
  userConfig.commonConfig.clients.consensus = finalOptions.consensus;
  userConfig.commonConfig.clients.validator = finalOptions.validator || "";

  // If validator is provided, set staking to true
  if (finalOptions.validator) {
    userConfig.commonConfig.features.staking = true;
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

  // Get values from config file if available
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
      // If config file fails to load, we'll just use empty strings
      console.warn("Failed to load config file values:", error);
    }
  }

  // Check if execution client is in config or CLI options
  if ((missingFields.includes('execution') || !options.execution) && !options.execution && !configExecution) {
    questions.push({
      type: "list",
      name: "execution",
      message: "Select an execution client:",
      choices: executionClients,
    });
  }

  // Check if consensus client is in config or CLI options
  if ((missingFields.includes('consensus') || !options.consensus) && !options.consensus && !configConsensus) {
    questions.push({
      type: "list",
      name: "consensus",
      message: "Select a consensus client:",
      choices: consensusClients,
    });
  }

  // Check if validator client is in config or CLI options
  console.log(missingFields, options.validator, configValidator);
  if ((missingFields.includes('validator'))) {
    questions.push({
      type: "list",
      name: "validator",
      message: "Select a validator client:",
      choices: validatorClients,
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

  // Merge command line options with answers and config file values
  const result: GenerateOptions = {
    preset: options.preset || "default",
    execution: options.execution || configExecution || answers.execution || "",
    consensus: options.consensus || configConsensus || answers.consensus || "",
    validator: options.validator || configValidator || answers.validator,
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