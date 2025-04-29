import { PresetManager } from "../utils/preset";

/**
 * List available configuration presets
 * @returns List of preset names
 */
export async function listPresets(): Promise<string[]> {
  const presetManager = new PresetManager();
  const presets = await presetManager.listPresets();
  
  // Filter out preset files to only show the base names without the -preset suffix
  return presets
    .filter(preset => preset.endsWith('-preset'))
    .map(preset => preset.replace('-preset', ''));
}
