import * as fs from "fs-extra";
import * as path from "path";
import inquirer from "inquirer";
import { GenerateOptions, EthereumConfig } from "../clients/types";
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

  // Load the preset configuration
  const presetConfig = await configManager.loadPreset(preset);

  // If clients aren't specified, prompt for them
  const finalOptions = await promptForMissingOptions(options);

  // Update the config with the selected clients
  const config = configManager.updateConfigWithClients(
    presetConfig,
    finalOptions.execution,
    finalOptions.consensus,
    finalOptions.validator,
  );

  // Generate configuration files for each client
  await generateClientConfigs(config, finalOptions);

  logger.success("Configuration files generated successfully");
}

/**
 * Prompt the user for any missing options
 * @param options Partial options from the command line
 * @returns Complete options with user input
 */
async function promptForMissingOptions(
  options: Partial<GenerateOptions>,
): Promise<GenerateOptions> {
  const questions = [];

  // Get lists of available clients
  const executionClients = getClientNames("execution");
  const consensusClients = getClientNames("consensus");
  const validatorClients = getClientNames("validator");

  if (!options.execution) {
    questions.push({
      type: "list",
      name: "execution",
      message: "Select an execution client:",
      choices: executionClients,
    });
  }

  if (!options.consensus) {
    questions.push({
      type: "list",
      name: "consensus",
      message: "Select a consensus client:",
      choices: consensusClients,
    });
  }

  questions.push({
    type: "confirm",
    name: "includeValidator",
    message: "Do you want to include a validator client?",
    default: false,
    when: !options.validator,
  });

  questions.push({
    type: "list",
    name: "validator",
    message: "Select a validator client:",
    choices: validatorClients,
    when: (answers: any) => answers.includeValidator || !!options.validator,
  });

  if (!options.output) {
    questions.push({
      type: "input",
      name: "output",
      message: "Output directory for configurations:",
      default: "./ethereum-configs",
    });
  }

  // Prompt for missing options
  const answers = questions.length > 0 ? await inquirer.prompt(questions) : {};

  // Merge command line options with answers
  return {
    preset: options.preset || "default",
    execution: options.execution || answers.execution,
    consensus: options.consensus || answers.consensus,
    validator: options.validator || answers.validator,
    output: options.output || answers.output,
  };
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
