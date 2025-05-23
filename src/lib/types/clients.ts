// Client Types
export type Geth = "geth"
export type Erigon = "erigon"
export type Besu = "besu"
export type Nethermind = "nethermind"
export type Reth = "reth"
export type Prysm = "prysm"
export type Lighthouse = "lighthouse"
export type Teku = "teku"
export type NimbusEth2 = "nimbus-eth2"
export type Lodestar = "lodestar"

export type ExecutionClientName = Geth | Erigon | Besu | Nethermind | Reth
export type ConsensusClientName = Prysm | Lighthouse | Teku | NimbusEth2 | Lodestar
export type ValidatorClientName = Prysm | Lighthouse | Teku | NimbusEth2 | Lodestar
export type ClientName = ExecutionClientName | ConsensusClientName | ValidatorClientName