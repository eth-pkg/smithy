import * as fs from "fs-extra";
import * as path from "path";
import * as yaml from "js-yaml";


class SchemaUtils {
  constructor(private presetsDir: string) {
    this.presetsDir = presetsDir;
  }

  resolvePath(ref: string): string {
    if (path.isAbsolute(ref)) {
      return ref;
    }
    return path.resolve(this.presetsDir, ref);
  }

  extractDefaults(schemaName: string): any {
    const schemaPath = this.resolvePath(schemaName);
    const schema = this.loadSchemaSync(schemaPath);
    return this.extractDefaultsFromSchema(schema, schemaPath);
  }

  extractDefaultsFromSchema(schema: any, schemaPath: string): any {
    if (!schema || typeof schema !== 'object') {
      return undefined;
    }

    if (schema.default !== undefined) {
      return schema.default;
    }

    if (schema.$ref) {
      const refPath = this.resolvePath(schema.$ref);
      return this.extractDefaults(refPath);
    }

    if (schema.allOf) {
      const results = [];

      for (const subSchema of schema.allOf) {
        if (subSchema.$ref) {
          const subschemaPath = this.resolvePath(subSchema.$ref);
          const defaults = this.extractDefaults(subschemaPath);
          if (defaults !== undefined) {
            results.push(defaults);
          }
        }
      }

      return results.reduce((merged, result) => {
        return this.deepMerge(merged || {}, result);
      }, {});
    }

    if (schema.anyOf || schema.oneOf) {
      const schemas = schema.anyOf || schema.oneOf;
      const results = [];

      for (const subSchema of schemas) {

        const subschemaPath = this.resolvePath(subSchema.$ref);
        const defaults = this.extractDefaults(subschemaPath);
        if (defaults !== undefined) {
          results.push(defaults);
        }
      }

      return results.length > 0 ? results[0] : undefined;
    }

    if (schema.type === 'object' && schema.properties) {
      const result: any = {};

      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (typeof propSchema === 'object' && propSchema !== null) {
          const defaultValue = this.extractDefaultsFromSchema(propSchema, schemaPath);
          if (defaultValue !== undefined) {
            result[key] = defaultValue;
          }
        }
      }

      return Object.keys(result).length > 0 ? result : undefined;
    }

    if (schema.type === 'array' && schema.items) {
      const itemDefault = this.extractDefaultsFromSchema(schema.items, schemaPath);
      return itemDefault !== undefined ? [itemDefault] : undefined;
    }

    return undefined;
  }

  loadSchemaSync(path: string): any {
    try {
      if (path.endsWith('.yml') || path.endsWith('.yaml')) {
        const fileContent = fs.readFileSync(path, 'utf-8');
        return yaml.load(fileContent);
      }

      const ymlPath = `${path}.yml`;
      const yamlPath = `${path}.yaml`;

      if (fs.existsSync(ymlPath)) {
        const fileContent = fs.readFileSync(ymlPath, 'utf-8');
        return yaml.load(fileContent);
      }

      if (fs.existsSync(yamlPath)) {
        const fileContent = fs.readFileSync(yamlPath, 'utf-8');
        return yaml.load(fileContent);
      }

      throw new Error(`No schema file found at ${path} with .yml or .yaml extension`);
    } catch (error) {
      throw new Error(`Failed to load schema reference: ${path}`);
    }
  }

  deepMerge(target: any, source: any): any {
    if (!source) return target;
    if (!target) return { ...source };

    const result = { ...target };

    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = this.deepMerge(result[key] || {}, value);
      } else if (value !== undefined) {
        result[key] = value;
      }
    }

    return result;
  }
}

export default SchemaUtils;