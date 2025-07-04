import { ConfigManager } from "@/nodeconfig/config";

/**
 * List available configurations
 * @returns List of configuration names
 */
export async function listConfigs(): Promise<string[]> {
  const configManager = new ConfigManager();
  return await configManager.listConfigs();
}