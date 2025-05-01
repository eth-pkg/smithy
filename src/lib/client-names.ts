import { Geth, Erigon, Besu, Nethermind, Reth } from "./types";
import { Lighthouse, Lodestar, NimbusEth2, Prysm, Teku } from "./types";

const Geth: Geth = "geth";
const Erigon: Erigon = "erigon";
const Besu: Besu = "besu";
const Nethermind: Nethermind = "nethermind";
const Reth: Reth = "reth";

const Lighthouse: Lighthouse = "lighthouse";
const Lodestar: Lodestar = "lodestar";
const NimbusEth2: NimbusEth2 = "nimbus-eth2";
const Prysm: Prysm = "prysm";
const Teku: Teku = "teku";

export const EXECUTION_CLIENTS = [Geth, Erigon, Besu, Nethermind, Reth] as const;
export const CONSENSUS_CLIENTS = [Lighthouse, Lodestar, NimbusEth2, Prysm, Teku] as const;
export const VALIDATOR_CLIENTS = [Lighthouse, Lodestar, NimbusEth2, Prysm, Teku] as const;