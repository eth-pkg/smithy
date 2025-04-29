#!/usr/bin/env node
import { Command } from "commander";
import * as commands from "./commands";
import { Logger } from "./utils/logger";

// Create CLI instance
const program = new Command();
const logger = new Logger();

// Configure the CLI
program
  .name("smithy")
  .description("A CLI tool for generating Ethereum client configurations")
  .version("0.1.0");

// Add generate command
program
  .command("generate")
  .description("Generate configuration files for Ethereum clients")
  .option("-p, --preset <preset>", "Preset configuration file", "default")
  .option(
    "-e, --execution <client>",
    "Execution client (geth, nethermind, besu)",
  )
  .option(
    "-c, --consensus <client>",
    "Consensus client (lighthouse, prysm, teku)",
  )
  .option(
    "-v, --validator <client>",
    "Validator client (lighthouse, prysm, teku)",
  )
  .option(
    "-o, --output <directory>",
    "Output directory for configuration files",
  )
  .option("--verbose", "Enable verbose logging")
  .action(async (options: any) => {
    try {
      if (options.verbose) {
        logger.setLevel("verbose");
      }

      logger.info("Generating Ethereum client configurations");
      await commands.generate(options);
      logger.success("Successfully generated client configurations");
    } catch (error) {
      logger.error("Failed to generate configurations");
      if (error instanceof Error) {
        logger.error(error.message);
      }
      process.exit(1);
    }
  });

// Add preset list command
program
  .command("presets")
  .description("List available configuration presets")
  .action(async () => {
    try {
      const presets = await commands.listPresets();
      console.log("Available presets:");
      presets.forEach((preset) => console.log(`- ${preset}`));
    } catch (error) {
      logger.error("Failed to list presets");
      if (error instanceof Error) {
        logger.error(error.message);
      }
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// If no arguments provided, show help
if (process.argv.length === 2) {
  program.outputHelp();
}

export default program;
