// Basic Types
export type OperatingSystem = "linux" | "darwin" | "windows"
export type SyncMode = "snap" | "full" | "light"
export type EngineScheme = "http" | "https"
export type Communication = "jwt" | "ipc"
export type EmptyValue = ""

// Network Types
export type Mainnet = "mainnet"
export type Sepolia = "sepolia"
export type Holesky = "holesky"
export type Hoodi = "hoodi"
export type Ephemery = "ephemery"
export type Custom = string
export type NetworkName = Mainnet | Sepolia | Holesky | Hoodi | Ephemery | Custom

// Client Names
export type Geth = "geth"
export type Erigon = "erigon"
export type Besu = "besu"
export type Nethermind = "nethermind"
export type Reth = "reth"
export type Prysm = "prysm"
export type Lighthouse = "lighthouse"
export type Teku = "teku"
export type NimbusEth2 = "nimbus-eth2"
export type Lodestar = "lodestar"

export type ExecutionClientName = Geth | Erigon | Besu | Nethermind | Reth
export type ConsensusClientName = Prysm | Lighthouse | Teku | NimbusEth2 | Lodestar
export type ValidatorClientName = Prysm | Lighthouse | Teku | NimbusEth2 | Lodestar
export type ClientName = ExecutionClientName | ConsensusClientName | ValidatorClientName


export interface HttpConfig {
  apiPrefixes: string[]
  allowlist: string[]
  enabled: boolean
  port: number
}

export interface MetricsConfig {
  enabled: boolean
  port: number
}

export interface P2PConfig {
  enabled: boolean
  maxPeers: number
  port: number
  port6: number
  bootnodes: string[]
  enrAddress: string
  allowlist: string[]
  denylist: string[]
}

export interface WebSocketConfig {
  enabled: boolean
  port: number
}

export interface LogConfig {
  enabled: boolean
  file: string
  level: string
  format: string
}

// Consensus Specific Configurations
export interface CheckpointConfig {
  enabled: boolean
  url: string
  block: string
  state: string
}

export interface GraffitiConfig {
  enabled: boolean
  message: string
}

// Validator Specific Configurations
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

export interface NetworkConfig {
  name: NetworkName
  id: number
}

// Main Configuration Interfaces
export interface Common {
  dataDir: string
  engine: EngineConfig
  network: NetworkConfig
  operatingSystem: OperatingSystem
}

export interface Consensus {
  client: {
    name: ConsensusClientName | EmptyValue
    version: string
  }
  dataDir: string
  http: HttpConfig
  metrics: MetricsConfig
  p2p: P2PConfig
  ws: WebSocketConfig
  checkpoint: CheckpointConfig
  graffiti: GraffitiConfig
  log: LogConfig
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
  log: LogConfig
  validatorsDir?: string
  secretsDir?: string
  distributed?: boolean
}

export interface Execution {
  isExternal: boolean
  client: {
    name: ExecutionClientName | EmptyValue
    version: string
  }
  dataDir: string
  http: HttpConfig
  metrics: MetricsConfig
  p2p: P2PConfig
  ws: WebSocketConfig
}

export interface NodeConfig {
  common: Common
  consensus: Consensus
  validator: Validator
  execution: Execution
}


export type EngineConfig = {
  enabled: boolean
  communication: {
    method: Communication
    jwt: {
      file: string
      id: string
    }
    ipc: {
      path: string
    }
  }
  api: {
    scheme: EngineScheme,
    host: string
    port: number
    url: string
    ip: string
    allowlist: string[]
  }
}

// Generation Options
export interface GenerateOptions {
  preset: string;
  execution: string;
  consensus: string;
  validator?: string;
  output?: string;
  configFile?: string;
  verbose?: boolean;
}