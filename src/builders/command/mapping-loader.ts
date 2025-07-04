import { ConfigError } from "@/errors"
import { MAPPING_FILES, MAPPINGS_DIR } from "@/constants"
import * as path from "path"
import * as fs from "fs"
import * as yaml from "js-yaml"

// Type definitions for mapping structure
export type Rule = {
  configPath: string | string[];
  flag: string;
  transform?: string;
  parent?: string;
  enabled?:
    | {
        configPath: string;
        transform?: string;
      }
    | {
        configPath: string;
        transform?: string;
      }[];
};

export type Mappings = {
  rules: Rule[];
  valueFormat: "equals" | "space";
};

/**
 * Loads YAML mapping files from the data directory
 * Handles loading and parsing of client configuration mappings
 */
export class MappingLoader {
  /**
   * Load a YAML file from the mappings directory
   * @param filename - The name of the YAML file to load
   * @returns The parsed YAML content
   * @throws ConfigError if the file cannot be loaded or parsed
   */
  static loadYamlFile(filename: string): Mappings {
    try {
      const filePath = path.join(process.cwd(), MAPPINGS_DIR, filename)
      const content = fs.readFileSync(filePath, "utf8")
      const parsed = yaml.load(content)
      
      if (!parsed || typeof parsed !== "object") {
        throw new ConfigError(`Invalid YAML format in ${filename}`)
      }
      
      return parsed as Mappings
    } catch (error) {
      if (error instanceof ConfigError) {
        throw error
      }
      throw new ConfigError(
        `Failed to load mapping file ${filename}: ${(error as Error).message}`,
        path.join(process.cwd(), MAPPINGS_DIR, filename),
        error as Error
      )
    }
  }

  /**
   * Load all mapping files for a client type
   * @param clientType - The type of client (execution, consensus, or validator)
   * @returns Record of client name to mappings
   */
  static loadClientMappings<T extends keyof typeof MAPPING_FILES>(
    clientType: T
  ): Record<string, Mappings> {
    const mappings: Record<string, Mappings> = {}
    const files = MAPPING_FILES[clientType]

    for (const [clientName, filename] of Object.entries(files)) {
      mappings[clientName] = this.loadYamlFile(filename)
    }

    return mappings
  }


} 