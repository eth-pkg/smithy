import { ValidatorClientName } from "./clients";
import { EmptyValue } from "./basic";
import { MetricsConfig } from './http'
import { LogConfig } from './logging'

export interface Validator {
  client: {
    name: ValidatorClientName | EmptyValue;
    version: string;
  };
  isExternal: boolean;
  enabled: boolean;
  dataDir: string;
  beaconNodes: string;
  suggestFeeRecipientAddress: string;
  graffiti: GraffitiConfig;
  proposerConfig: ProposerConfig;
  externalSigner: ExternalSignerConfig;
  suggestedGasLimit?: number;
  doppelgangerProtection?: boolean;
  builderEnabled?: boolean;
  metrics: MetricsConfig;
  logging: LogConfig;
  validatorsDir?: string;
  secretsDir?: string;
  distributed?: boolean;
}

export interface GraffitiConfig {
  enabled: boolean;
  message: string;
  file: string;
}

export interface ProposerConfig {
  enabled: boolean;
  file: string;
}

export interface ExternalSignerConfig {
  enabled: boolean;
  url: string;
  keystore: string;
  keystorePasswordFile: string;
  publicKeys: string[];
}
