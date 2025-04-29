import { ConfigManager } from "../utils/config";

/**
 * List available configuration presets
 * @returns List of preset names
 */
export async function listPresets(): Promise<string[]> {
  const configManager = new ConfigManager();
  return await configManager.listPresets();
}
