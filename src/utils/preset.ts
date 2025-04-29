import * as fs from "fs-extra";
import * as path from "path";
import * as yaml from "js-yaml";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import { EthereumConfig } from "@/clients/types";
import { Logger } from "./logger";

/**
 * Preset utility for loading preset rules and validating configurations
 */
export class PresetManager {
  private logger: Logger;
  private ajv: Ajv;
  private schema: any;

  constructor(verbose = false) {
    this.logger = new Logger(verbose ? "verbose" : "info");
    this.ajv = new Ajv({ 
      allErrors: true,
      useDefaults: true, // Apply defaults from schema
      coerceTypes: true,  // Convert types if needed
      loadSchema: this.loadSchema.bind(this) // Add schema loader
    });
    ajvErrors(this.ajv);
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
        .filter((file) => (file.endsWith(".yaml") || file.endsWith(".yml")))
        .map((file) => path.basename(file, path.extname(file)));
    } catch (error) {
      this.logger.error(`Failed to read presets directory: ${presetsDir}`);
      if (error instanceof Error) {
        this.logger.error(error.message);
      }
      return ["default-preset"]; // Return at least the default preset
    }
  }

  /**
   * List available configs
   */
  async listConfigs(): Promise<string[]> {
    const configsDir = this.getConfigsDir();
    this.logger.debug(`Looking for configs in: ${configsDir}`);

    try {
      const files = await fs.readdir(configsDir);
      return files
        .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
        .map((file) => path.basename(file, path.extname(file)));
    } catch (error) {
      this.logger.error(`Failed to read configs directory: ${configsDir}`);
      if (error instanceof Error) {
        this.logger.error(error.message);
      }
      return ["default"]; // Return at least the default config
    }
  }

  /**
   * Get the path to the configs directory
   */
  getConfigsDir(): string {
    // Similar to getPresetsDir but for configs
    const nodeModulesDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "node_modules",
    );

    if (fs.existsSync(nodeModulesDir)) {
      // Development mode - use local configs
      return path.join(__dirname, "..", "..", "configs");
    } else {
      // Installed package - use package configs
      return path.join(__dirname, "..", "..", "configs");
    }
  }

  /**
   * Load a default configuration file
   */
  async loadDefaultConfig(configName: string = "default"): Promise<EthereumConfig> {
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

    this.logger.debug(`Loading default config from: ${configFile}`);

    try {
      const fileContent = await fs.readFile(configFile, "utf-8");
      const config = yaml.load(fileContent) as EthereumConfig;

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

  /**
   * Load a preset from the presets directory
   * Presets contain both validation rules and default values
   */
  async loadPreset(presetName: string): Promise<any> {
    if (this.schema) {
      return this.schema;
    }

    const presetsDir = this.getPresetsDir();
    const presetPath = path.join(presetsDir, `${presetName}-preset.yml`);

    try {
      if (!await fs.pathExists(presetPath)) {
        throw new Error(`Preset not found: ${presetName}-preset.yml`);
      }

      const fileContent = await fs.readFile(presetPath, 'utf-8');
      this.schema = yaml.load(fileContent);
      this.logger.debug(`Loaded preset: ${presetName}`);
      return this.schema;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load preset: ${error.message}`);
      }
      throw new Error(`Failed to load preset for ${presetName}`);
    }
  }

  /**
   * Validate a configuration against the preset schema
   */
  async validateConfig(config: Partial<EthereumConfig>, presetName: string): Promise<{ valid: boolean; errors: any[] }> {
    try {
      const preset = await this.loadPreset(presetName);
      
      // Extract the validation schema from the preset
      const validationSchema = preset.schema || preset;
      
      const validate = this.ajv.compile(validationSchema);
      const valid = validate(config);

      if (!valid) {
        this.logger.debug(`Validation errors: ${JSON.stringify(validate.errors)}`);
        return { valid: false, errors: validate.errors || [] };
      }

      return { valid: true, errors: [] };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Validation error: ${error.message}`);
      }
      return { valid: false, errors: [{ message: 'Failed to validate config' }] };
    }
  }

  /**
   * Extract defaults from a schema
   */
  private extractDefaults(schema: any): any {
    const result: any = {};
    
    if (schema.default !== undefined) {
      return schema.default;
    }
    
    if (schema.type === 'object' && schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        if (typeof value === 'object' && value !== null) {
          result[key] = this.extractDefaults(value as any);
        }
      }
    }
    
    return result;
  }

  /**
   * Validate and apply preset rules to a configuration
   */
  async validateAndApplyRules(
    config: Partial<EthereumConfig>, 
    presetName: string = "default"
  ): Promise<EthereumConfig> {
    try {
      // Load the preset schema
      const preset = await this.loadPreset(presetName);
      const validationSchema = preset.schema || preset;

      // Create a new Ajv instance with defaults enabled
      const ajv = new Ajv({ 
        allErrors: true,
        useDefaults: true,
        coerceTypes: true,
        loadSchema: this.loadSchema.bind(this)
      });
      ajvErrors(ajv);

      // Compile the schema with references
      const validate = await ajv.compileAsync(validationSchema);

      // Create an empty config object that will be populated with defaults
      const configWithDefaults: Partial<EthereumConfig> = this.extractDefaults(validationSchema);
      
      // Now merge in the user's config to override any defaults
      this.deepMerge(configWithDefaults, config);

      // Validate the final configuration
      const valid = validate(configWithDefaults);
      
      if (!valid) {
        // Format validation errors into a more user-friendly message
        const formattedErrors = this.formatValidationErrors(validate.errors || []);
        this.logger.error(`Configuration validation failed:\n${formattedErrors}`);
        throw new Error(formattedErrors);
      }
      
      return configWithDefaults as EthereumConfig;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process config with preset: ${error.message}`);
      }
      throw error;
    }
  }
  
  /**
   * Apply user configuration overrides to the base config
   */
  private applyUserConfig(
    baseConfig: EthereumConfig,
    userConfig: Partial<EthereumConfig>
  ): void {
    // Apply user overrides in a deep-merge fashion
    this.deepMerge(baseConfig, userConfig);
  }
  
  /**
   * Deep merge utility for configurations
   */
  private deepMerge(target: any, source: any): any {
    if (!source) return target;
    
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {};
        }
        this.deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined) {
        target[key] = source[key];
      }
    });
    
    return target;
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
   * Format validation errors into a user-friendly message
   */
  private formatValidationErrors(errors: any[]): string {
    if (!errors || errors.length === 0) {
      return "Unknown validation error";
    }

    // Group errors by field for better organization
    const groupedErrors: { [key: string]: string[] } = {};

    errors.forEach(error => {
      // Extract the field name from the instancePath
      const fieldPath = error.instancePath.split('/').filter(Boolean);
      const fieldName = fieldPath[fieldPath.length - 1] || 'root';

      // Format the error message
      let message = '';
      if (error.keyword === 'required') {
        message = `Missing required field: ${error.params.missingProperty}`;
      } else if (error.keyword === 'enum') {
        const allowedValues = error.params.allowedValues.join(', ');
        message = `Invalid value for ${fieldName}. Must be one of: ${allowedValues}`;
      } else if (error.keyword === 'errorMessage') {
        message = error.message;
      } else {
        message = `${fieldName}: ${error.message}`;
      }

      // Group by the top-level field
      const topLevelField = fieldPath[0] || 'root';
      if (!groupedErrors[topLevelField]) {
        groupedErrors[topLevelField] = [];
      }
      groupedErrors[topLevelField].push(message);
    });

    // Format the grouped errors into a readable message
    const formattedMessage = Object.entries(groupedErrors)
      .map(([field, messages]) => {
        const fieldHeader = field === 'root' ? 'Configuration' : `Field: ${field}`;
        return `${fieldHeader}:\n${messages.map(msg => `  - ${msg}`).join('\n')}`;
      })
      .join('\n\n');

    return formattedMessage;
  }

  /**
   * Load a schema from a file
   */
  private async loadSchema(uri: string): Promise<any> {
    const presetsDir = this.getPresetsDir();
    const schemaPath = path.join(presetsDir, uri);
    
    try {
      if (!await fs.pathExists(schemaPath)) {
        throw new Error(`Schema not found: ${uri}`);
      }

      const fileContent = await fs.readFile(schemaPath, 'utf-8');
      return yaml.load(fileContent);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load schema ${uri}: ${error.message}`);
      }
      throw new Error(`Failed to load schema ${uri}`);
    }
  }
}

export default PresetManager;