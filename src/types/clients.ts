// Client Types
export const GETH = "geth" as const
export const ERIGON = "erigon" as const
export const BESU = "besu" as const
export const NETHERMIND = "nethermind" as const
export const RETH = "reth" as const
export const PRYSM = "prysm" as const
export const LIGHTHOUSE = "lighthouse" as const
export const TEKU = "teku" as const
export const NIMBUS_ETH2 = "nimbus-eth2" as const
export const LODESTAR = "lodestar" as const

export type Geth = typeof GETH
export type Erigon = typeof ERIGON
export type Besu = typeof BESU
export type Nethermind = typeof NETHERMIND
export type Reth = typeof RETH
export type Prysm = typeof PRYSM
export type Lighthouse = typeof LIGHTHOUSE
export type Teku = typeof TEKU
export type NimbusEth2 = typeof NIMBUS_ETH2
export type Lodestar = typeof LODESTAR

export type ExecutionClientName = Geth | Erigon | Besu | Nethermind | Reth
export type ConsensusClientName = Prysm | Lighthouse | Teku | NimbusEth2 | Lodestar
export type ValidatorClientName = Prysm | Lighthouse | Teku | NimbusEth2 | Lodestar
export type ClientName = ExecutionClientName | ConsensusClientName | ValidatorClientName

export const EXECUTION_CLIENTS = [GETH, ERIGON, BESU, NETHERMIND, RETH] as const
export const CONSENSUS_CLIENTS = [LIGHTHOUSE, LODESTAR, NIMBUS_ETH2, PRYSM, TEKU] as const
export const VALIDATOR_CLIENTS = [LIGHTHOUSE, LODESTAR, NIMBUS_ETH2, PRYSM, TEKU] as const