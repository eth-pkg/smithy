export interface EngineConfig {
  apiPort: number;
  communication: string;
  endpointUrl: string;
  host: string;
  ip: string;
  jwtFile: string;
  scheme: string;
}

export interface Features {
  mevBoost: boolean;
  monitoring: boolean;
  staking: boolean;
}

export interface ClientSelection {
  consensus: string;
  execution: string;
  validator: string;
}

export interface CommonConfig {
  clients: ClientSelection;
  dataDir: string;
  engine: EngineConfig;
  features: Features;
  network: string;
  networkId: number;
  operatingSystem: string;
  syncMode: string;
}

export interface ConsensusConfig {
  httpPort: number;
  metricsPort: number;
  p2pPort: number;
}

export interface HttpConfig {
  apiPrefixes: string[];
  cors: string[];
  enabled: boolean;
  port: number;
}

export interface MetricsConfig {
  enabled: boolean;
  port: number;
}

export interface P2pConfig {
  maxPeers: number;
  port: number;
}

export interface WsConfig {
  enabled: boolean;
  port: number;
}

export interface ExecutionConfig {
  http: HttpConfig;
  metrics: MetricsConfig;
  p2p: P2pConfig;
  ws: WsConfig;
}

export interface EthereumConfig {
  commonConfig: CommonConfig;
  consensusConfig: ConsensusConfig;
  executionConfig: ExecutionConfig;
}

export type ClientType = "execution" | "consensus" | "validator";

export interface ClientConfig {
  name: string;
  type: ClientType;
  generateConfig: (config: EthereumConfig) => string;
}

export interface GenerateOptions {
  preset: string;
  execution: string;
  consensus: string;
  validator?: string;
  output?: string;
  configFile?: string;
  verbose?: boolean;
}

export type ClientList = {
  [key in ClientType]: {
    [clientName: string]: ClientConfig;
  };
};
