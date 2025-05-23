import { ConsensusClientName, ValidatorClientName } from './clients'
import { EmptyValue } from './basic'
import { HttpConfig, MetricsConfig, WebSocketConfig } from './http'
import { ConsensusP2PConfig } from './p2p'
import { LogConfig } from './logging'

export interface CheckpointSyncConfig {
  enabled: boolean
  url: string
  block: string
  state: string
  force: boolean
  ignoreWeakSubjectivityPeriod: boolean
  wss: string
}

export interface GraffitiConfig {
  enabled: boolean
  message: string
}

export interface ProposerConfig {
  enabled: boolean
  file: string
  refreshEnabled: boolean
  blindedBlocksEnabled: boolean
  refreshInterval: number
  maxValidators: number
  maxProposerDelay: number
  maxProposerPriority: number
}

export interface ExternalSignerConfig {
  enabled: boolean
  url: string
  keystore: string
  keystorePasswordFile: string
  publicKeys: string[]
  timeout: number
  truststore: string
  truststorePasswordFile: string
}

export interface GenesisSyncConfig {
  enabled: boolean
  url: string
  state: string
}

export interface BuilderConfig {
  enabled: boolean
  url: string,
  userAgent: string
  enableSSZ: boolean
}

export interface Consensus {
  client: {
    name: ConsensusClientName | EmptyValue
    version: string
  }
  dataDir: string
  http: HttpConfig
  metrics: MetricsConfig
  p2p: ConsensusP2PConfig
  ws: WebSocketConfig
  checkpointSync: CheckpointSyncConfig
  logging: LogConfig
  builder: BuilderConfig
  genesisSync: GenesisSyncConfig
}

export interface Validator {
  client: {
    name: ValidatorClientName | EmptyValue
    version: string
  }
  isExternal: boolean
  enabled: boolean
  dataDir: string
  beaconRpcProvider: string
  numValidators: number
  feeRecipientAddress: string
  graffiti: GraffitiConfig
  proposerConfig: ProposerConfig
  externalSigner: ExternalSignerConfig
  suggestedGasLimit?: number
  doppelgangerProtection?: boolean
  builderEnabled?: boolean
  metrics: MetricsConfig
  logging: LogConfig
  validatorsDir?: string
  secretsDir?: string
  distributed?: boolean
} 