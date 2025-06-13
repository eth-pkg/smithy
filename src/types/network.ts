// Network Types
export type Mainnet = "mainnet"
export type Sepolia = "sepolia"
export type Holesky = "holesky"
export type Hoodi = "hoodi"
export type Ephemery = "ephemery"
export type CustomNetwork = "custom"

export type NetworkName = Mainnet | Sepolia | Holesky | Hoodi | Ephemery | CustomNetwork

export type CustomSettings = {
  name: string // devnet, testnet, devnet-2, etc.
  testnetDir: string
  besuGenesisFile: string
  genesisFile: string
  chainSpecFile: string
  genesisSSZFile: string
  paramsFile: string
}

export type StandardNetworkConfig = {
  name: Omit<NetworkName, CustomNetwork>
  id: number
}

export type CustomNetworkConfig = {
  name: CustomNetwork
  id: number
  custom: CustomSettings
}

export type NetworkConfig = StandardNetworkConfig | CustomNetworkConfig 