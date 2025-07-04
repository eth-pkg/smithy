import * as fs from "fs-extra";
import { NodeConfig, ClientChoices, ExecutionClientName, ConsensusClientName, ValidatorClientName } from "@/types";
import { CommandClientRegistry } from "@/builders/command/command-client-registry";

export class CommandGenerator {
  private registry: CommandClientRegistry;

  constructor() {
    this.registry = new CommandClientRegistry();
  }

  /**
   * Generate commands for the selected clients
   */
  async generateClientCommands(
    config: NodeConfig,
    options: ClientChoices
  ): Promise<void> {
    const outputDir = options.output || "./node-commands";
    await fs.ensureDir(outputDir);

    const clients = [
      { type: "execution", name: options.execution },
      { type: "consensus", name: options.consensus },
      { type: "validator", name: options.validator },
    ] as const;

    for (const { type, name } of clients) {
      if (name) {
        this.registry.generateScript(
          name as ExecutionClientName | ConsensusClientName | ValidatorClientName,
          config,
          outputDir,
          type === "validator"
        );
      }
    }
  }
} 