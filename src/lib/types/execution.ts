import { ExecutionClientName } from './clients'
import { EmptyValue } from './basic'
import { HttpConfig, MetricsConfig, WebSocketConfig, GraphQLConfig } from './http'
import { ExecutionP2PConfig } from './p2p'
import { LogConfig } from './logging'

export type GpoConfig = {
  enabled: boolean
  blocks: number
  maxPrice: number
  ignorePrice: number
  percentile: number
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
  p2p: ExecutionP2PConfig
  ws: WebSocketConfig
  graphql: GraphQLConfig
  gpo: GpoConfig
  logging: LogConfig
} 