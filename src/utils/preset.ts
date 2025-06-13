import * as fs from "fs-extra";
import * as path from "path";
import * as yaml from "js-yaml";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import { NodeConfig, DeepPartial } from "@/types";
import { Logger } from "./logger";
import SchemaUtils from "./schema";

interface SchemaProperty {
  type?: string;
  const?: any;
  properties?: Record<string, SchemaProperty>;
}

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
      useDefaults: true,
      coerceTypes: true,
      loadSchema: this.loadSchema.bind(this),
      strict: true
    });
    ajvErrors(this.ajv);
  }

  /**
   * Get the path to the presets directory
   */
  getPresetsDir(): string {
    return path.join(__dirname, "..", "..", "data", "presets");
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
      return ["default"];
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

    this.logger.debug(`Loading default config from: ${configFile}`);

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

  /**
   * Load a preset from the presets directory
   * Presets contain both validation rules and default values
   */
  async loadPreset(presetName: string): Promise<any> {
    if (this.schema) {
      return this.schema;
    }

    const presetsDir = this.getPresetsDir();
    const presetPath = path.join(presetsDir, `${presetName}.yml`);

    try {
      if (!await fs.pathExists(presetPath)) {
        throw new Error(`Preset not found: ${presetName}.yml`);
      }

      const fileContent = await fs.readFile(presetPath, 'utf-8');
      this.schema = yaml.load(fileContent);
      this.logger.debug(`Loaded preset: ${presetName} from ${presetPath}`);
      return this.schema;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load preset: ${error.message}`);
      }
      throw new Error(`Failed to load preset for ${presetName}`);
    }
  }


  /**
   * Check if the config is trying to override any constant values from the preset
   */
  private checkConstantOverrides(config: any, schema: SchemaProperty, path: string[] = []): string[] {
    const overrides: string[] = [];

    if (schema.type === 'object' && schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        const currentPath = [...path, key];
        const fullPath = currentPath.join('.');

        if (value && typeof value === 'object') {
          if (value.const !== undefined) {
            let current = config;
            for (const p of currentPath) {
              if (current && typeof current === 'object') {
                current = current[p];
              } else {
                current = undefined;
                break;
              }
            }
            if (current !== undefined && current !== value.const) {
              overrides.push(fullPath);
            }
          }

          if (config && typeof config === 'object' && config[key]) {
            overrides.push(...this.checkConstantOverrides(config[key], value, currentPath));
          }
        }
      }
    }

    return overrides;
  }

  /**
   * Validate and apply preset rules to a configuration
   */
  public async validateAndApplyRules(config: DeepPartial<NodeConfig>, presetName: string = "default"): Promise<NodeConfig> {
    try {
      const preset = await this.loadPreset(presetName);
      const validationSchema = preset.schema || preset;

      const constantOverrides = this.checkConstantOverrides(config, validationSchema);
      if (constantOverrides.length > 0) {
        throw new Error(`Cannot override constant values in preset: ${constantOverrides.join(', ')}`);
      }

      const ajv = new Ajv({
        allErrors: true,
        coerceTypes: true,
        loadSchema: this.loadSchema.bind(this),
        strict: true
      });
      ajvErrors(ajv);

      const validate = await ajv.compileAsync(validationSchema);


      // Validate the final config
      const valid = validate(config);

      if (!valid) {
        const formattedErrors = this.formatValidationErrors(validate.errors || []);
        throw new Error(formattedErrors);
      }

      return config as NodeConfig;
    } catch (error) {
      throw error;
    }
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
   * Format validation errors into a user-friendly message
   */
  private formatValidationErrors(errors: any[]): string {
    if (!errors || errors.length === 0) {
      return "Unknown validation error";
    }

    const groupedErrors: { [key: string]: string[] } = {};

    errors.forEach(error => {
      const fieldPath = error.instancePath.split('/').filter(Boolean);
      const fieldName = fieldPath[fieldPath.length - 1] || 'root';

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

      const topLevelField = fieldPath[0] || 'root';
      if (!groupedErrors[topLevelField]) {
        groupedErrors[topLevelField] = [];
      }
      groupedErrors[topLevelField].push(message);
    });

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