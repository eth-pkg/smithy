export type OperatingSystem = "linux" | "darwin" | "windows"
export type SyncMode = "snap" | "full" | "light"

export type EngineScheme = "http" | "https"
export type Communication = "jwt" | "icp"
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

export interface EngineConfig {
  scheme: EngineScheme
  host: string
  apiPort: number
  endpointUrl: string
  ip: string
  jwtFile: string
  communication: Communication
}

export interface ClientsConfig {
  consensus: ConsensusClientName | EmptyValue
  execution: ExecutionClientName | EmptyValue
  validator: ValidatorClientName | EmptyValue
}

export interface FeaturesConfig {
  mevBoost: boolean
  monitoring: boolean
  staking: boolean
}

export interface CommonConfig {
  networkId: number
  clients: ClientsConfig
  dataDir: string
  engine: EngineConfig
  features: FeaturesConfig
  network: NetworkName
  operatingSystem: OperatingSystem
  syncMode: SyncMode
}

export interface ConsensusConfig {
  httpPort: number
  metricsPort: number
  p2pPort: number
}

export interface ValidatorConfig {
  dataDir: string
  beaconRpcProvider: string
  numValidators: number
  feeRecipientAddress: string
  metricsPort: string
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

export interface ExecutionConfig {
  http: HttpConfig
  metrics: MetricsConfig
  p2p: P2PConfig
  ws: WebSocketConfig
}

export interface NodeConfig {
  commonConfig: CommonConfig
  consensusConfig: ConsensusConfig
  validatorConfig: ValidatorConfig
  executionConfig: ExecutionConfig
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

export interface PrysmConsensusConfig {
  /* prysm specific properties */
  _eslint_error: string
}

export interface LighthouseConsensusConfig {
  /* lighthouse specific properties */
  _eslint_error: string
}

export interface TekuConsensusConfig {
  /* teku specific properties */
  _eslint_error: string
}

export interface NimbusEth2ConsensusConfig {
  /* nimbus-eth2 specific properties */
  _eslint_error: string
}

export interface LodestarConsensusConfig {
  /* lodestar specific properties */
  _eslint_error: string
}

export interface PrysmValidatorConfig {
  /* prysm validator specific properties */
  _eslint_error: string
}

export interface LighthouseValidatorConfig {
  /* lighthouse validator specific properties */
  _eslint_error: string
}

export interface TekuValidatorConfig {
  /* teku validator specific properties */
  _eslint_error: string
}

export interface NimbusEth2ValidatorConfig {
  /* nimbus-eth2 validator specific properties */
  _eslint_error: string
}

export interface LodestarValidatorConfig {
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
    ? PrysmConsensusConfig
    : K extends Lighthouse
      ? LighthouseConsensusConfig
      : K extends Teku
        ? TekuConsensusConfig
        : K extends NimbusEth2
          ? NimbusEth2ConsensusConfig
          : K extends Lodestar
            ? LodestarConsensusConfig
            : never
}

export type ValidatorClientConfigMap = {
  [K in ValidatorClientName]: K extends Prysm
    ? PrysmValidatorConfig
    : K extends Lighthouse
      ? LighthouseValidatorConfig
      : K extends Teku
        ? TekuValidatorConfig
        : K extends NimbusEth2
          ? NimbusEth2ValidatorConfig
          : K extends Lodestar
            ? LodestarValidatorConfig
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