import * as fs from "fs-extra";
import * as path from "path";
import * as yaml from "js-yaml";
import { EthereumConfig } from "../clients/types";
import { Logger } from "./logger";

/**
 * Configuration utility for loading presets and generating client configs
 */
export class ConfigManager {
  private logger: Logger;

  constructor(verbose = false) {
    this.logger = new Logger(verbose ? "verbose" : "info");
  }

  /**
   * Get the path to the presets directory
   */
  getPresetsDir(): string {
    // Check if running from a built package or development
    const nodeModulesDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "node_modules",
    );

    if (fs.existsSync(nodeModulesDir)) {
      // Development mode - use local presets
      return path.join(__dirname, "..", "..", "presets");
    } else {
      // Installed package - use package presets
      return path.join(__dirname, "..", "..", "presets");
    }
  }

  /**
   * List available presets
   */
  async listPresets(): Promise<string[]> {
    const presetsDir = this.getPresetsDir();
    this.logger.debug(`Looking for presets in: ${presetsDir}`);

    try {
      const files = await fs.readdir(presetsDir);
      return files
        .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
        .map((file) => path.basename(file, path.extname(file)));
    } catch (error) {
      this.logger.error(`Failed to read presets directory: ${presetsDir}`);
      if (error instanceof Error) {
        this.logger.error(error.message);
      }
      return ["default"]; // Return at least the default preset
    }
  }

  /**
   * Load a preset configuration file
   */
  async loadPreset(presetName: string): Promise<EthereumConfig> {
    const presetsDir = this.getPresetsDir();
    const yamlFile = path.join(presetsDir, `${presetName}.yaml`);
    const ymlFile = path.join(presetsDir, `${presetName}.yml`);

    let configFile = "";

    if (await fs.pathExists(yamlFile)) {
      configFile = yamlFile;
    } else if (await fs.pathExists(ymlFile)) {
      configFile = ymlFile;
    } else {
      throw new Error(`Preset not found: ${presetName}`);
    }

    this.logger.debug(`Loading preset from: ${configFile}`);

    try {
      const fileContent = await fs.readFile(configFile, "utf-8");
      const config = yaml.load(fileContent) as EthereumConfig;

      return config;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to load preset ${presetName}: ${error.message}`,
        );
      }
      throw new Error(`Failed to load preset ${presetName}`);
    }
  }

  /**
   * Update a configuration with selected clients
   */
  updateConfigWithClients(
    config: EthereumConfig,
    execution: string,
    consensus: string,
    validator?: string,
  ): EthereumConfig {
    // Clone the config to avoid modifying the original
    const updatedConfig = JSON.parse(JSON.stringify(config)) as EthereumConfig;

    // Update client selections
    updatedConfig.commonConfig.clients.execution = execution;
    updatedConfig.commonConfig.clients.consensus = consensus;

    if (validator) {
      updatedConfig.commonConfig.clients.validator = validator;
      updatedConfig.commonConfig.features.staking = true;
    }

    return updatedConfig;
  }

  /**
   * Merge provided options with a preset config
   */
  mergeOptionsWithPreset(
    config: EthereumConfig,
    options: Record<string, any>,
  ): EthereumConfig {
    // Clone the config to avoid modifying the original
    const mergedConfig = JSON.parse(JSON.stringify(config)) as EthereumConfig;

    // Apply overrides from options if specified
    if (options.dataDir) {
      mergedConfig.commonConfig.dataDir = options.dataDir;
    }

    if (options.network) {
      mergedConfig.commonConfig.network = options.network;
    }

    if (options.mevBoost !== undefined) {
      mergedConfig.commonConfig.features.mevBoost = options.mevBoost === true;
    }

    return mergedConfig;
  }
}

export default ConfigManager;
