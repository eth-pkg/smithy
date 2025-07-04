import inquirer from "inquirer";
import { ClientChoices, NodeConfig } from "@/types";
import { EXECUTION_CLIENTS, CONSENSUS_CLIENTS, VALIDATOR_CLIENTS } from "@/types";

interface PromptQuestion {
  type: "list" | "input";
  name: string;
  message: string;
  choices?: readonly string[];
  default?: string;
}

interface PromptAnswers {
  execution?: string;
  consensus?: string;
  validator?: string;
  output?: string;
}

type ClientField = "execution" | "consensus" | "validator";

export class PromptManager {
  private static readonly DEFAULT_OUTPUT_DIR = "./node-commands";
  private static readonly DEFAULT_PRESET = "default";

  async promptForMissingFields(options: Partial<ClientChoices>, userConfig: Partial<NodeConfig>): Promise<ClientChoices> {
    const missingFields = this.determineMissingFields(userConfig);
    return this.promptForMissingOptions(options, userConfig, missingFields);
  }

  private async promptForMissingOptions(
    options: Partial<ClientChoices>,
    configValues: Partial<NodeConfig>,
    missingFields: ClientField[]
  ): Promise<ClientChoices> {
    const questions = this.buildPromptQuestions(options, missingFields);
    const answers = await this.promptUser(questions);
    return this.mergeOptions(options, configValues, answers);
  }

  private determineMissingFields(userConfig: Partial<NodeConfig>): ClientField[] {
    const missing: ClientField[] = [];
    if (!userConfig.execution?.client?.name) missing.push("execution");
    if (!userConfig.consensus?.client?.name) missing.push("consensus");
    if (userConfig.validator?.enabled && !userConfig.validator?.client?.name) missing.push("validator");
    return missing;
  }

  private buildPromptQuestions(options: Partial<ClientChoices>, missingFields: ClientField[]): PromptQuestion[] {
    const questions: PromptQuestion[] = [];
    this.addClientQuestions(questions, missingFields);
    if (!options.output) {
      questions.push({
        type: "input",
        name: "output",
        message: "Output directory for commands:",
        default: PromptManager.DEFAULT_OUTPUT_DIR,
      });
    }
    return questions;
  }

  private addClientQuestions(questions: PromptQuestion[], missingFields: ClientField[]): void {
    const clientConfigs = [
      { field: "execution" as const, message: "Select an execution client:", choices: EXECUTION_CLIENTS },
      { field: "consensus" as const, message: "Select a consensus client:", choices: CONSENSUS_CLIENTS },
      { field: "validator" as const, message: "Select a validator client:", choices: VALIDATOR_CLIENTS },
    ];

    for (const { field, message, choices } of clientConfigs) {
      if (missingFields.includes(field)) {
        questions.push({ type: "list", name: field, message, choices });
      }
    }
  }

  private async promptUser(questions: PromptQuestion[]): Promise<PromptAnswers> {
    if (!questions.length) return {};
    try {
      return await inquirer.prompt(questions);
    } catch (error) {
      throw new Error(`Failed to prompt user: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private mergeOptions(options: Partial<ClientChoices>, configValues: Partial<NodeConfig>, answers: PromptAnswers): ClientChoices {
    return {
      preset: options.preset || PromptManager.DEFAULT_PRESET,
      execution: configValues.execution?.client?.name || answers.execution || "",
      consensus: configValues.consensus?.client?.name || answers.consensus || "",
      validator: configValues.validator?.client?.name || answers.validator,
      output: options.output || answers.output || PromptManager.DEFAULT_OUTPUT_DIR,
      configFile: options.configFile,
    };
  }
}