// Network Types
export type Mainnet = "mainnet"
export type Sepolia = "sepolia"
export type Holesky = "holesky"
export type Hoodi = "hoodi"
export type Ephemery = "ephemery"
export type Custom = string
export type NetworkName = Mainnet | Sepolia | Holesky | Hoodi | Ephemery | Custom

export interface NetworkConfig {
  name: NetworkName
  id: number
} 