import { 
  ClientChoices, 
  NodeConfig, 
  Execution, 
  Consensus, 
  Validator 
} from "@/types";

export class ConfigBuilder {
  /**
   * Build the final configuration with client selections
   */
  buildFinalConfig(
    userConfig: Partial<NodeConfig>,
    finalOptions: ClientChoices
  ): Partial<NodeConfig> {
    const config = { ...userConfig };

    config.execution = this.buildClientConfig(userConfig.execution, finalOptions.execution, 'execution');
    config.consensus = this.buildClientConfig(userConfig.consensus, finalOptions.consensus, 'consensus');
    config.validator = this.buildClientConfig(userConfig.validator, finalOptions.validator, 'validator');

    return config;
  }

  /**
   * Build client configuration with proper typing
   */
  private buildClientConfig<T extends Execution | Consensus | Validator>(
    existingConfig: Partial<T> | undefined,
    clientName: string | undefined,
    clientType: 'execution' | 'consensus' | 'validator'
  ): T {
    const baseConfig = {
      ...existingConfig,
      client: {
        name: clientName || "",
        version: existingConfig?.client?.version || "",
      },
    };

    // Add validator-specific properties
    if (clientType === 'validator') {
      return {
        ...baseConfig,
        enabled: Boolean(clientName),
      } as T;
    }

    return baseConfig as T;
  }
} 