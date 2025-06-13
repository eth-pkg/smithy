import { EngineScheme } from './basic'

export type HttpModules = "eth" | "net" | "web3" | "debug" | "admin" | "txpool" | "trace"

export interface HttpConfig {
  modules: HttpModules[]
  allowlist: string[]
  enabled: boolean
  port: number
  address: string
  tls: {
    enabled: boolean
    cert: string
    key: string
  }
}

export interface ExecutionHttpConfig {
  modules: HttpModules[]
  allowlist: string[]
  netrestrict: string[]
  enabled: boolean
  port: number
  address: string
}

export interface MetricsConfig {
  enabled: boolean
  port: number
  address: string
}

export interface WebSocketConfig {
  enabled: boolean
  port: number
}

export interface GraphQLConfig {
  enabled: boolean
  address: string
  port: number
  allowlist: string[]
}

export interface EngineConfig {
  jwt: {
    file: string
    id: string
  }
  api: {
    scheme: EngineScheme,
    host: string
    port: number
    urls: string[]
    ip: string
    allowlist: string[]
  }
} 