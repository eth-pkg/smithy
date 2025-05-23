// Re-export all types
export * from './basic'
export * from './network'
export * from './clients'
export * from './http'
export * from './p2p'
export * from './logging'
export * from './consensus'
export * from './execution'

// Main Configuration Interface
import { OperatingSystem } from './basic'
import { NetworkConfig } from './network'
import { EngineConfig } from './http'
import { Consensus } from './consensus'
import { Validator } from './consensus'
import { Execution } from './execution'

export interface Common {
  dataDir: string
  engine: EngineConfig
  network: NetworkConfig
  operatingSystem: OperatingSystem
}

export interface NodeConfig {
  common: Common
  consensus: Consensus
  validator: Validator
  execution: Execution
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

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}; 