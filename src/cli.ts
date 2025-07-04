#!/usr/bin/env node
import './setup';
import { Command } from "commander";
import * as commands from "@/commands/index";
import { CLI_CONFIG, EXIT_CODES, DEFAULTS } from "@/constants";

const program = new Command();

program
  .name(CLI_CONFIG.NAME)
  .description(CLI_CONFIG.DESCRIPTION)
  .version(CLI_CONFIG.VERSION)
  .exitOverride();

program
  .command("generate")
  .description("Generate configuration files for Ethereum clients")
  .option("-p, --preset <preset>", "Preset to validate against", DEFAULTS.PRESET)
  .option("-e, --execution <client>", "Execution client (geth, nethermind, besu)")
  .option("-c, --consensus <client>", "Consensus client (lighthouse, prysm, teku)")
  .option("-v, --validator <client>", "Validator client (lighthouse, prysm, teku)")
  .option("-o, --output <directory>", "Output directory for configuration files")
  .option("-f, --config-file <path>", "Path to a configuration file to use as base")
  .action(async (options) => {
    try {
      await commands.generate(options);
      console.log("Configuration files generated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${errorMessage}`);
      process.exit(EXIT_CODES.ERROR);
    }
  });

program
  .command("presets")
  .description("List available configuration presets")
  .action(async () => {
    try {
      const presets = await commands.listPresets();
      if (presets.length === 0) {
        console.log("No presets available");
        return;
      }
      console.log("Available presets:");
      presets.forEach((preset) => console.log(`- ${preset}`));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${errorMessage}`);
      process.exit(EXIT_CODES.ERROR);
    }
  });

async function main() {
  try {
    if (process.argv.length === 2) {
      program.outputHelp();
      return;
    }
    await program.parseAsync(process.argv);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Fatal error: ${errorMessage}`);
    process.exit(EXIT_CODES.FATAL);
  }
}

main();