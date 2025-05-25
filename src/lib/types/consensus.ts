import { ConsensusClientName } from './clients'
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
