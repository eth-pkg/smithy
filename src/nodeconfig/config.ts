import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";
import { NodeConfig } from "@/types";
import { ConfigError } from "@/errors";

type SupportedExtension = ".yaml" | ".yml" | ".json";

export class ConfigManager {
  private static readonly SUPPORTED_EXTENSIONS : SupportedExtension[] = [".yaml", ".yml", ".json"] as const;
  private static readonly YAML_EXTENSIONS = [".yaml", ".yml"] as const;

  async listConfigs(): Promise<string[]> {
    const configsDir = this.getConfigsDir();
    try {
      const files = await fs.readdir(configsDir);
      return files
        .filter(file => this.isSupportedConfigFile(file))
        .map(file => path.basename(file, path.extname(file)));
    } catch {
      return ["default"];
    }
  }

  async loadDefaultConfig(configName: string = "default"): Promise<NodeConfig> {
    const configsDir = this.getConfigsDir();
    const configFile = await this.findConfigFile(configsDir, configName);
    
    if (!configFile) {
      throw new ConfigError(`Default config not found: ${configName}`);
    }

    return this.readConfigFile(configFile, configName);
  }

  async loadConfigFile(configPath: string): Promise<Partial<NodeConfig>> {
    if (!await fs.pathExists(configPath)) {
      throw new ConfigError(`Config file not found: ${configPath}`);
    }

    const ext = path.extname(configPath).toLowerCase();
    if (!ConfigManager.SUPPORTED_EXTENSIONS.includes(ext as SupportedExtension)) {
      throw new ConfigError(
        `Unsupported format: ${ext}. Supported: ${ConfigManager.SUPPORTED_EXTENSIONS.join(", ")}`
      );
    }

    return this.readConfigFile(configPath);
  }

  private getConfigsDir(): string {
    return path.join(__dirname, "..", "..", "configs");
  }

  private isSupportedConfigFile(filename: string): boolean {
    return ConfigManager.SUPPORTED_EXTENSIONS.some(ext => 
      filename.toLowerCase().endsWith(ext)
    );
  }

  private isYamlFile(filepath: string): boolean {
    return ConfigManager.YAML_EXTENSIONS.some(ext => 
      filepath.toLowerCase().endsWith(ext)
    );
  }

  private async findConfigFile(configsDir: string, configName: string): Promise<string | null> {
    for (const ext of ConfigManager.YAML_EXTENSIONS) {
      const filePath = path.join(configsDir, `${configName}${ext}`);
      if (await fs.pathExists(filePath)) {
        return filePath;
      }
    }
    return null;
  }

  private async readConfigFile(filePath: string, configName?: string): Promise<NodeConfig> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const config = this.isYamlFile(filePath) 
        ? yaml.load(content) 
        : JSON.parse(content);

      if (!config || typeof config !== "object") {
        throw new ConfigError(`Invalid config format in ${configName || filePath}`);
      }

      return config as NodeConfig;
    } catch (error) {
      const message = configName 
        ? `Failed to load default config ${configName}`
        : `Failed to load config file ${filePath}`;
      throw error instanceof ConfigError 
        ? error 
        : new ConfigError(`${message}: ${(error as Error).message}`, filePath, error as Error);
    }
  }
}

export default ConfigManager;