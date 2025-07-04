// Client types for mapping loader
export const CLIENT_TYPES = {
  EXECUTION: "execution",
  CONSENSUS: "consensus",
  VALIDATOR: "validator",
} as const

// Default parameter values
export const DEFAULT_PARAMS = {
  IS_VALIDATOR: false,
} as const

// Error messages
export const ERROR_MESSAGES = {
  CLIENT_NOT_FOUND: (clientName: string, isValidator: boolean) => 
    `Client "${clientName}" not found in registry or invalid client type for validator=${isValidator}`,
  COMMAND_NOT_REGISTERED: (clientName: string) => 
    `Command for client "${clientName}" not registered`,
  SCRIPT_GENERATION_FAILED: (clientName: string, errorMessage: string) => 
    `Failed to generate script for client ${clientName}: ${errorMessage}`,
} as const

// Default client commands
export const DEFAULT_CLIENT_COMMANDS = {
  execution: {
    geth: "geth",
    erigon: "erigon",
    nethermind: "nethermind",
    besu: "besu",
    reth: "reth node",
  },
  consensus: {
    lighthouse: "lighthouse beacon",
    lodestar: "lodestar beacon",
    "nimbus-eth2": "nimbus_beacon_node",
    prysm: "beacon-chain",
    teku: "teku beacon",
  },
  validator: {
    lighthouse: "lighthouse validator_client",
    lodestar: "lodestar validator",
    "nimbus-eth2": "nimbus-eth2 validator",
    prysm: "prysm validator",
    teku: "teku validator-client",
  },
} as const

// Script generation constants
export const SCRIPT_EXTENSION = ".sh"
export const VALIDATOR_SUFFIX = "-validator" 