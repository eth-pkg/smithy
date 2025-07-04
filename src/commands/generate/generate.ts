import { ClientChoices } from "@/types";
import { PromptManager } from "./prompt-manager";
import { CommandGenerator } from "./command-generator";
import { ConfigBuilder } from "./config-builder";
import { PresetManager } from "@/nodeconfig/preset";
import ConfigManager from "@/nodeconfig/config";

/**
 * Generate Ethereum client commands
 * @param options Generation options
 */
export async function generate(
  options: Partial<ClientChoices>
): Promise<void> {
  const configManager = new ConfigManager();
  const presetManager = new PresetManager();
  const promptManager = new PromptManager();
  const commandGenerator = new CommandGenerator();
  const configBuilder = new ConfigBuilder();

  try {
    // Load initial configuration
    const userConfig = await configManager.loadConfigFile(options.configFile || "");

    // Determine missing fields and prompt user if needed
    const finalOptions = await promptManager.promptForMissingFields(options, userConfig);

    // Build final configuration with client selections
    const finalConfig = configBuilder.buildFinalConfig(userConfig, finalOptions);

    // Process configuration with preset
    const preset = options.preset || "default";
    const config =  await presetManager.validateAndApplyRules(
      finalConfig,
      preset
    );

    // Generate client commands
    await commandGenerator.generateClientCommands(config, finalOptions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Generation failed: ${message}`);
  }
} 