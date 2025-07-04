import * as fs from "fs-extra";
import * as path from "path";
import * as yaml from "js-yaml";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import { DeepPartial, NodeConfig } from "@/types";

// Constants
const SUPPORTED_EXTENSIONS = [".yaml", ".yml"] as const;
const DEFAULT_PRESET = "default" as const;

// Type definitions
interface SchemaProperty {
  readonly type?: string;
  readonly const?: unknown;
  readonly properties?: Record<string, SchemaProperty>;
}

interface PresetData {
  readonly schema?: SchemaProperty;
  readonly [key: string]: unknown;
}

interface ValidationError {
  readonly keyword: string;
  readonly instancePath: string;
  readonly message: string;
  readonly params?: Record<string, unknown>;
}

interface GroupedErrors {
  [field: string]: string[];
}

export class PresetManager {
  // Instance variables (private first)
  private readonly ajv: Ajv;
  private readonly schemaCache: Map<string, PresetData> = new Map();

  constructor(verbose = false) {
    this.ajv = new Ajv({
      allErrors: true,
      useDefaults: true,
      coerceTypes: true,
      loadSchema: this.loadSchema.bind(this),
      strict: true,
    });
    ajvErrors(this.ajv);
  }

  // Public instance methods
  async listPresets(): Promise<readonly string[]> {
    const presetsDir = this.getPresetsDir();
    try {
      const files = await fs.readdir(presetsDir);
      return files
        .filter((file) => SUPPORTED_EXTENSIONS.some(ext => file.endsWith(ext)))
        .map((file) => path.basename(file, path.extname(file)));
    } catch (error) {
      return [DEFAULT_PRESET];
    }
  }

  async loadPreset(presetName: string): Promise<PresetData> {
    const cachedPreset = this.schemaCache.get(presetName);
    if (cachedPreset) {
      return cachedPreset;
    }

    const presetPath = path.join(this.getPresetsDir(), `${presetName}.yml`);
    try {
      if (!(await fs.pathExists(presetPath))) {
        throw new Error(`Preset not found: ${presetName}.yml`);
      }
      const fileContent = await fs.readFile(presetPath, "utf-8");
      const presetData = yaml.load(fileContent) as PresetData;
      
      if (!presetData || typeof presetData !== "object") {
        throw new Error(`Invalid preset format: ${presetName}`);
      }

      this.schemaCache.set(presetName, presetData);
      return presetData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to load preset ${presetName}: ${errorMessage}`);
    }
  }

  async validateAndApplyRules(config: DeepPartial<NodeConfig>, presetName: string = DEFAULT_PRESET): Promise<NodeConfig> {
    try {
      const preset = await this.loadPreset(presetName);
      const validationSchema = preset.schema || preset;

      const overrides = this.checkConstantOverrides(config, validationSchema as SchemaProperty);
      if (overrides.length > 0) {
        throw new Error(`Cannot override constants: ${overrides.join(", ")}`);
      }

      const validate = await this.ajv.compileAsync(validationSchema);
      if (!validate(config)) {
        const errors = validate.errors || [];
        const validationErrors: ValidationError[] = errors.map(error => ({
          keyword: error.keyword,
          instancePath: error.instancePath,
          message: error.message || "Unknown error",
          params: error.params
        }));
        throw new Error(this.formatValidationErrors(validationErrors));
      }

      return config as NodeConfig;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Validation failed: ${errorMessage}`);
    }
  }

  // Private instance methods
  private getPresetsDir(): string {
    return path.join(__dirname, "..", "..", "data", "presets");
  }

  private async loadSchema(uri: string): Promise<SchemaProperty> {
    const schemaPath = path.join(this.getPresetsDir(), uri);
    try {
      if (!(await fs.pathExists(schemaPath))) {
        throw new Error(`Schema not found: ${uri}`);
      }
      const fileContent = await fs.readFile(schemaPath, "utf-8");
      const schema = yaml.load(fileContent) as SchemaProperty;
      
      if (!schema || typeof schema !== "object") {
        throw new Error(`Invalid schema format: ${uri}`);
      }

      return schema;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to load schema ${uri}: ${errorMessage}`);
    }
  }

  private checkConstantOverrides(config: unknown, schema: SchemaProperty, path: readonly string[] = []): readonly string[] {
    const overrides: string[] = [];

    if (schema.type === "object" && schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        const currentPath = [...path, key];
        const fullPath = currentPath.join(".");

        if (value.const !== undefined) {
          let current = config;
          for (const p of currentPath) {
            if (current && typeof current === "object" && p in current) {
              current = (current as Record<string, unknown>)[p];
            } else {
              current = undefined;
              break;
            }
          }
          if (current !== undefined && current !== value.const) {
            overrides.push(fullPath);
          }
        }

        if (config && typeof config === "object" && key in config) {
          overrides.push(...this.checkConstantOverrides((config as Record<string, unknown>)[key], value, currentPath));
        }
      }
    }
    return overrides;
  }

  private formatValidationErrors(errors: readonly ValidationError[]): string {
    if (!errors.length) return "Unknown validation error";

    const groupedErrors: GroupedErrors = {};
    errors.forEach((error) => {
      const fieldPath = error.instancePath.split("/").filter(Boolean);
      const fieldName = fieldPath[fieldPath.length - 1] || "root";
      const topLevelField = fieldPath[0] || "root";

      let message: string;
      switch (error.keyword) {
        case "required":
          message = `Missing required field: ${error.params?.missingProperty as string}`;
          break;
        case "enum":
          message = `Invalid value for ${fieldName}. Must be one of: ${(error.params?.allowedValues as unknown[])?.join(", ")}`;
          break;
        case "errorMessage":
          message = error.message;
          break;
        default:
          message = `${fieldName}: ${error.message}`;
      }

      if (!groupedErrors[topLevelField]) {
        groupedErrors[topLevelField] = [];
      }
      groupedErrors[topLevelField].push(message);
    });

    return Object.entries(groupedErrors)
      .map(([field, messages]) => {
        const header = field === "root" ? "Configuration" : `Field: ${field}`;
        return `${header}:\n${messages.map((msg) => `  - ${msg}`).join("\n")}`;
      })
      .join("\n\n");
  }
}