import { PresetManager } from "@/utils/preset";

/**
 * List available configurations
 * @returns List of configuration names
 */
export async function listConfigs(): Promise<string[]> {
  const presetManager = new PresetManager();
  return await presetManager.listConfigs();
}