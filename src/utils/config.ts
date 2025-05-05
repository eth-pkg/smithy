import * as fs from "fs-extra";
import * as path from "path";
import * as yaml from "js-yaml";
import { NodeConfig } from "@/lib/types";
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
  async loadConfigFile(configPath: string): Promise<Partial<NodeConfig>> {
    this.logger.debug(`Loading config from: ${configPath}`);

    try {
      if (!await fs.pathExists(configPath)) {
        throw new Error(`Config file not found: ${configPath}`);
      }

      const fileContent = await fs.readFile(configPath, "utf-8");
      let config: Partial<NodeConfig> = {};

      if (configPath.endsWith('.json')) {
        config = JSON.parse(fileContent);
      } else if (configPath.endsWith('.yml') || configPath.endsWith('.yaml')) {
        config = yaml.load(fileContent) as Partial<NodeConfig>;
      } else {
        throw new Error(`Unsupported config file format: ${path.extname(configPath)}`);
      }

      return config;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      }
      throw new Error(`Failed to load config file ${configPath}`);
    }
  }

  /**
   * Check if a config has all required values
   * Returns a list of missing fields that should be prompted for
   */
  getMissingRequiredFields(config: Partial<NodeConfig>): string[] {
    const missingFields: string[] = [];

    // Check for required client selections
    if (!config.execution?.client?.name) {
      missingFields.push('execution');
    }

    if (!config.consensus?.client?.name) {
      missingFields.push('consensus');
    }

    // Other required fields can be added here

    return missingFields;
  }

  /**
   * Merge command-line options with loaded config
   */
  mergeOptionsWithConfig(
    config: Partial<NodeConfig>,
    options: Record<string, any>
  ): Partial<NodeConfig> {
    const mergedConfig = {...config} as any;

    if (!mergedConfig.common) {
      mergedConfig.common = {} as any;
    }

    if (options.execution) {
      mergedConfig.execution.client.name = options.execution;
    }

    if (options.consensus) {
      mergedConfig.consensus.client.name = options.consensus;
    }

    if (options.validator) {
      mergedConfig.validator.client.name = options.validator;
      mergedConfig.validator.enabled = true;
    }

    if (options.dataDir) {
      mergedConfig.common.dataDir = options.dataDir;
    }

    if (options.network) {
      mergedConfig.common.network = options.network;
    }


    return mergedConfig as Partial<NodeConfig>;
  }

  /**
   * Process a user configuration with a preset
   * Validates and applies preset rules to ensure the configuration is valid
   */
  async processConfigWithPreset(
    userConfig: Partial<NodeConfig>,
    presetName: string
  ): Promise<NodeConfig> {
    try {

      // Validate the user config against the preset rules
      // The preset will apply default values from its schema
      return await this.presetManager.validateAndApplyRules(
        userConfig,
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
  async saveConfig(config: NodeConfig, filePath: string): Promise<void> {
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