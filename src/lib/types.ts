export type OperatingSystem = "linux" | "darwin" | "windows"
export type SyncMode = "snap" | "full" | "light"

export type EngineScheme = "http" | "https"
export type Communication = "jwt" | "ipc"
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
export type EmptyValue = ""


export type ExecutionClientName = Geth | Erigon | Besu | Nethermind | Reth
export type ConsensusClientName = Prysm | Lighthouse | Teku | NimbusEth2 | Lodestar
export type ValidatorClientName = Prysm | Lighthouse | Teku | NimbusEth2 | Lodestar

export type Mainnet = "mainnet"
export type Sepolia = "sepolia"
export type Holesky = "holesky"
export type Hoodi = "hoodi"
export type Ephemery = "ephemery"
export type Custom = string
export type NetworkName = Mainnet | Sepolia | Holesky | Hoodi | Ephemery | Custom

export interface EngineBaseConfig {
  enabled: boolean
}

export interface common {
  networkId: number
  dataDir: string
  engine: EngineConfig
  network: NetworkName
  operatingSystem: OperatingSystem
  syncMode: SyncMode
}

export interface consensus {
  client: {
    name: ConsensusClientName | EmptyValue
    version: string
  }
  dataDir: string
  httpPort: number
  metricsPort: number
  p2pPort: number
}

export interface validator {
  client: {
    name: ValidatorClientName | EmptyValue
    version: string
  }
  enabled: boolean
  dataDir: string
  beaconRpcProvider: string
  numValidators: number
  feeRecipientAddress: string
  metricsPort: string

  graffiti?: string
  graffitiFile?: string
  proposerConfigFile?: string
  suggestedGasLimit?: number
  doppelgangerProtection?: boolean
  builderEnabled?: boolean
  externalSignerUrl?: string
  externalSignerKeystore?: string
  externalSignerKeystorePasswordFile?: string
  externalSignerPublicKeys?: string[]
  externalSignerTimeout?: number
  externalSignerTruststore?: string
  externalSignerTruststorePasswordFile?: string
  proposerBlindedBlocksEnabled?: boolean
  proposerConfigRefreshEnabled?: boolean
  metricsEnabled?: boolean
  metricsAddress?: string
  logFile?: string
  logLevel?: string
  logFormat?: string
  validatorsDir?: string
  secretsDir?: string
  configFile?: string
  distributed?: boolean
}

export interface HttpConfig {
  apiPrefixes: string[]
  cors: string[]
  enabled: boolean
  port: number
}

export interface MetricsConfig {
  enabled: boolean
  port: number
}

export interface P2PConfig {
  maxPeers: number
  port: number
}

export interface WebSocketConfig {
  enabled: boolean
  port: number
}

export interface execution {
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
  common: common
  consensus: consensus
  validator: validator
  execution: execution
}


// Client-specific config interfaces
export interface GethConfig {
  /* geth specific properties */
  _eslint_error: string
}

export interface ErigonConfig {
  /* erigon specific properties */
  _eslint_error: string
}

export interface BesuConfig {
  /* besu specific properties */
  _eslint_error: string
}

export interface NethermindConfig {
  /* nethermind specific properties */
  _eslint_error: string
}

export interface RethConfig {
  /* reth specific properties */
  _eslint_error: string
}

export interface Prysmconsensus {
  /* prysm specific properties */
  _eslint_error: string
}

export interface Lighthouseconsensus {
  /* lighthouse specific properties */
  _eslint_error: string
}

export interface Tekuconsensus {
  /* teku specific properties */
  _eslint_error: string
}

export interface NimbusEth2consensus {
  /* nimbus-eth2 specific properties */
  _eslint_error: string
}

export interface Lodestarconsensus {
  /* lodestar specific properties */
  _eslint_error: string
}

export interface Prysmvalidator {
  /* prysm validator specific properties */
  _eslint_error: string
}

export interface Lighthousevalidator {
  /* lighthouse validator specific properties */
  _eslint_error: string
}

export interface Tekuvalidator {
  /* teku validator specific properties */
  _eslint_error: string
}

export interface NimbusEth2validator {
  /* nimbus-eth2 validator specific properties */
  _eslint_error: string
}

export interface Lodestarvalidator {
  /* lodestar validator specific properties */
  _eslint_error: string
}

export type ExecutionClientConfigMap = {
  [K in ExecutionClientName]: K extends "geth"
  ? GethConfig
  : K extends Erigon
  ? ErigonConfig
  : K extends Besu
  ? BesuConfig
  : K extends Nethermind
  ? NethermindConfig
  : K extends Reth
  ? RethConfig
  : never
}

export type ConsensusClientConfigMap = {
  [K in ConsensusClientName]: K extends Prysm
  ? Prysmconsensus
  : K extends Lighthouse
  ? Lighthouseconsensus
  : K extends Teku
  ? Tekuconsensus
  : K extends NimbusEth2
  ? NimbusEth2consensus
  : K extends Lodestar
  ? Lodestarconsensus
  : never
}

export type ValidatorClientConfigMap = {
  [K in ValidatorClientName]: K extends Prysm
  ? Prysmvalidator
  : K extends Lighthouse
  ? Lighthousevalidator
  : K extends Teku
  ? Tekuvalidator
  : K extends NimbusEth2
  ? NimbusEth2validator
  : K extends Lodestar
  ? Lodestarvalidator
  : never
}

export type ClientName = ExecutionClientName | ConsensusClientName | ValidatorClientName

export interface GenerateOptions {
  preset: string;
  execution: string;
  consensus: string;
  validator?: string;
  output?: string;
  configFile?: string;
  verbose?: boolean;
}

export type EngineConfigWithJwt = EngineBaseConfig & {
  communication: "jwt"
  jwtFile: string
  ipcPath?: never
  scheme: EngineScheme
  host: string
  port: number
  url: string
  ip: string
  hostAllowlist: string
}

export type EngineConfigWithIpc = EngineBaseConfig & {
  communication: "ipc"
  ipcPath: string
  jwtFile?: never
  scheme?: never
  host?: never
  port?: never
  url?: never
  ip?: never
  hostAllowlist?: never
}

export type EngineConfig = EngineConfigWithJwt | EngineConfigWithIpc