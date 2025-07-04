import * as fs from "fs-extra";
import * as path from "path";
import * as yaml from "js-yaml";
import { NodeConfig } from "@/types";
import { PresetManager } from "./preset";

/**
 * Configuration manager for loading and handling user configs
 */
export class NodeConfigManager {
  private presetManager: PresetManager;

  constructor(verbose = false) {
    this.presetManager = new PresetManager(verbose);
  }


  async loadDefaultConfig(configName: string): Promise<Partial<NodeConfig>> {
    const config = await this.presetManager.loadDefaultConfig(configName);
    return config;
  }

  /**
   * Load a user configuration file
   */
  async loadConfigFile(configPath: string): Promise<Partial<NodeConfig>> {

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
      throw error;
    }
  }
}

export default NodeConfigManager;