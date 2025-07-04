import * as fs from "fs-extra";
import * as path from "path";
import * as yaml from "js-yaml";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import { NodeConfig, DeepPartial } from "@/types";


/**
 * Preset utility for loading preset rules and validating configurations
 */
export class ConfigManager {

 
  /**
   * List available configs
   */
  async listConfigs(): Promise<string[]> {
    const configsDir = this.getConfigsDir();

    try {
      const files = await fs.readdir(configsDir);
      return files
        .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
        .map((file) => path.basename(file, path.extname(file)));
    } catch (error) {
      return ["default"];
    }
  }

  /**
   * Get the path to the configs directory
   */
  getConfigsDir(): string {
    return path.join(__dirname, "..", "..", "configs");
  }

  /**
   * Load a default configuration file
   */
  async loadDefaultConfig(configName: string = "default"): Promise<NodeConfig> {
    const configsDir = this.getConfigsDir();
    const yamlFile = path.join(configsDir, `${configName}.yaml`);
    const ymlFile = path.join(configsDir, `${configName}.yml`);

    let configFile = "";

    if (await fs.pathExists(yamlFile)) {
      configFile = yamlFile;
    } else if (await fs.pathExists(ymlFile)) {
      configFile = ymlFile;
    } else {
      throw new Error(`Default config not found: ${configName}`);
    }


    try {
      const fileContent = await fs.readFile(configFile, "utf-8");
      const config = yaml.load(fileContent) as NodeConfig;

      return config;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to load default config ${configName}: ${error.message}`,
        );
      }
      throw new Error(`Failed to load default config ${configName}`);
    }
  }

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

}

export default ConfigManager;