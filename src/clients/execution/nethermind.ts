import { ClientConfig, EthereumConfig } from "@/clients/types";

/**
 * Generate Nethermind configuration based on the provided Ethereum config
 * @param config The Ethereum configuration
 * @returns Nethermind configuration as a string
 */
function generateConfig(config: EthereumConfig): string {
  const { commonConfig, executionConfig } = config;

  // Network ID based on network name
  const networkId =
    commonConfig.network === "mainnet"
      ? 1
      : commonConfig.network === "goerli"
        ? 5
        : commonConfig.network === "sepolia"
          ? 11155111
          : 1;

  // This is a dummy implementation - in a real scenario,
  // we would generate a proper JSON configuration
  return `
{
  "Init": {
    "ChainSpecPath": "chainspec/${commonConfig.network}.json",
    "GenesisHash": "",
    "BaseDbPath": "${commonConfig.dataDir}/nethermind",
    "LogFileName": "nethermind.log",
    "MemoryHint": 1024000000
  },
  "Network": {
    "DiscoveryPort": ${executionConfig.p2p.port},
    "P2PPort": ${executionConfig.p2p.port},
    "ActivePeersMaxCount": ${executionConfig.p2p.maxPeers},
    "TrustedPeers": []
  },
  "TxPool": {
    "Size": 2048
  },
  "Sync": {
    "FastSync": ${commonConfig.syncMode === "fast" || commonConfig.syncMode === "snap"},
    "SnapSync": ${commonConfig.syncMode === "snap"},
    "FastBlocks": true
  },
  "EthStats": {
    "Enabled": false,
    "Name": "Nethermind",
    "Secret": "secret",
    "Url": "ws://localhost:3000/api"
  },
  "Metrics": {
    "Enabled": ${executionConfig.metrics.enabled},
    "NodeName": "Nethermind",
    "ExposePort": ${executionConfig.metrics.port}
  },
  "JsonRpc": {
    "Enabled": ${executionConfig.http.enabled},
    "Host": "0.0.0.0",
    "Port": ${executionConfig.http.port},
    "EnabledModules": [${executionConfig.http.apiPrefixes.map((p) => `"${p}"`).join(", ")}],
    "JwtSecretFile": "${commonConfig.engine.jwtFile}"
  },
  "Engine": {
    "Enabled": true,
    "Host": "${commonConfig.engine.host}",
    "Port": ${commonConfig.engine.apiPort}
  },
  "Pruning": {
    "Mode": "Full"
  }
}`;
}

export const client: ClientConfig = {
  name: "Nethermind",
  type: "execution",
  generateConfig,
};
