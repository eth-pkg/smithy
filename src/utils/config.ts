import * as fs from "fs-extra";
import * as path from "path";
import * as yaml from "js-yaml";
import { EthereumConfig } from "../clients/types";
import { Logger } from "./logger";
import { PresetManager } from "./preset";

/**
 * Configuration manager for loading and handling user configs
 */
export class ConfigManager {
  private logger: Logger;
  private presetManager: PresetManager;

  constructor(verbose = false) {
    this.logger = new Logger(verbose ? "verbose" : "info");
    this.presetManager = new PresetManager(verbose);
  }

  /**
   * Load a user configuration file
   */
  async loadConfigFile(configPath: string): Promise<Partial<EthereumConfig>> {
    this.logger.debug(`Loading config from: ${configPath}`);

    try {
      if (!await fs.pathExists(configPath)) {
        throw new Error(`Config file not found: ${configPath}`);
      }

      const fileContent = await fs.readFile(configPath, "utf-8");
      let config: Partial<EthereumConfig> = {};

      if (configPath.endsWith('.json')) {
        config = JSON.parse(fileContent);
      } else if (configPath.endsWith('.yml') || configPath.endsWith('.yaml')) {
        config = yaml.load(fileContent) as Partial<EthereumConfig>;
      } else {
        throw new Error(`Unsupported config file format: ${path.extname(configPath)}`);
      }

      return config;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load config file ${configPath}: ${error.message}`);
      }
      throw new Error(`Failed to load config file ${configPath}`);
    }
  }

  /**
   * Check if a config has all required values
   * Returns a list of missing fields that should be prompted for
   */
  getMissingRequiredFields(config: Partial<EthereumConfig>): string[] {
    const missingFields: string[] = [];

    // Check for required client selections
    if (!config.commonConfig?.clients?.execution) {
      missingFields.push('execution');
    }

    if (!config.commonConfig?.clients?.consensus) {
      missingFields.push('consensus');
    }

    // Other required fields can be added here

    return missingFields;
  }

  /**
   * Merge command-line options with loaded config
   */
  mergeOptionsWithConfig(
    config: Partial<EthereumConfig>,
    options: Record<string, any>
  ): Partial<EthereumConfig> {
    // Clone the config to avoid modifying the original
    const mergedConfig = JSON.parse(JSON.stringify(config)) as any;

    // Ensure the config has the expected structure
    if (!mergedConfig.commonConfig) {
      mergedConfig.commonConfig = {} as any;
    }

    if (!mergedConfig.commonConfig.clients) {
      mergedConfig.commonConfig.clients = {} as any;
    }

    if (!mergedConfig.commonConfig.features) {
      mergedConfig.commonConfig.features = {} as any;
    }

    // Apply overrides from options if specified
    if (options.execution) {
      mergedConfig.commonConfig.clients.execution = options.execution;
    }

    if (options.consensus) {
      mergedConfig.commonConfig.clients.consensus = options.consensus;
    }

    if (options.validator) {
      mergedConfig.commonConfig.clients.validator = options.validator;
      mergedConfig.commonConfig.features.staking = true;
    }

    if (options.dataDir) {
      mergedConfig.commonConfig.dataDir = options.dataDir;
    }

    if (options.network) {
      mergedConfig.commonConfig.network = options.network;
    }

    if (options.mevBoost !== undefined) {
      mergedConfig.commonConfig.features.mevBoost = options.mevBoost === true;
    }

    return mergedConfig as Partial<EthereumConfig>;
  }

  /**
   * Process a user configuration with a preset
   * Validates and applies preset rules to ensure the configuration is valid
   */
  async processConfigWithPreset(
    userConfig: Partial<EthereumConfig>,
    presetName: string
  ): Promise<EthereumConfig> {
    try {
      // Default config is no longer needed as the preset schema has defaults
      const defaultConfig = {} as EthereumConfig;

      // Validate the user config against the preset rules
      // The preset will apply default values from its schema
      return await this.presetManager.validateAndApplyRules(
        userConfig,
        defaultConfig,
        presetName
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process config with preset: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Save a configuration to a file
   */
  async saveConfig(config: EthereumConfig, filePath: string): Promise<void> {
    try {
      const dirPath = path.dirname(filePath);
      await fs.ensureDir(dirPath);

      let content: string;
      if (filePath.endsWith('.json')) {
        content = JSON.stringify(config, null, 2);
      } else if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
        content = yaml.dump(config);
      } else {
        // Default to YAML
        content = yaml.dump(config);
      }

      await fs.writeFile(filePath, content, 'utf-8');
      this.logger.debug(`Config saved to: ${filePath}`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to save config to ${filePath}: ${error.message}`);
      }
      throw new Error(`Failed to save config to ${filePath}`);
    }
  }
}

export default ConfigManager;