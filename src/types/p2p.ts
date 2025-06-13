export interface ExecutionP2PConfig {
  enabled: boolean
  maxPeers: number
  port: number
  bootnodes: string[]
  allowlist: string[]
  netrestrict: string[]
  discovery: DiscoveryConfig
}

export interface DiscoveryConfig {
  enabled: boolean
  port: number,
  dns: {
    enabled: boolean
    url: string
  },
  v4: {
    enabled: boolean
  }
  v5: {
    enabled: boolean
  }
}

export type ConsensusP2PConfig = {
  enabled: boolean
  listenAddress: string
  port: number // both udp and tcp
  port6: number // both udp and tcp
  discoveryPort: number // discovery udp
  discoveryPort6: number // discovery udp
  bootnodes: string[]
  staticPeers: string[]
  trustedPeers: string[]
  targetPeers: number
  maxPeers: number
  nodiscover: boolean
  localPeerDiscovery: boolean
  subscribeAllSubnets: boolean
  upnp: boolean
  staticId: string
} 