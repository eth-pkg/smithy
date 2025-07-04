// Mapping file configurations
export const MAPPING_FILES = {
  execution: {
    besu: "besu-cmd-mappings.yaml",
    erigon: "erigon-cmd-mappings.yaml",
    geth: "geth-cmd-mappings.yaml",
    nethermind: "nethermind-cmd-mappings.yaml",
    reth: "reth-cmd-mappings.yaml",
  },
  consensus: {
    lighthouse: "lighthouse-cmd-mappings.yaml",
    lodestar: "lodestar-cmd-mappings.yaml",
    "nimbus-eth2": "nimbus-eth2-cmd-mappings.yaml",
    prysm: "prysm-cmd-mappings.yaml",
    teku: "teku-cmd-mappings.yaml",
  },
  validator: {
    lighthouse: "lighthouse-validator-cmd-mappings.yaml",
    lodestar: "lodestar-validator-cmd-mappings.yaml",
    "nimbus-eth2": "nimbus-eth2-validator-cmd-mappings.yaml",
    prysm: "prysm-validator-cmd-mappings.yaml",
    teku: "teku-validator-cmd-mappings.yaml",
  },
} as const

// Mapping directory constant
export const MAPPINGS_DIR = "data/mappings" 