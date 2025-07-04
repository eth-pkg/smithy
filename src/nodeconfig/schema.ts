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