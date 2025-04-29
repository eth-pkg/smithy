import { ClientList } from "./types";

// Import execution clients
import * as geth from "./execution/geth";
import * as nethermind from "./execution/nethermind";
import * as besu from "./execution/besu";

// Import consensus clients
import * as lighthouseConsensus from "./consensus/lighthouse";
import * as prysmConsensus from "./consensus/prysm";
import * as tekuConsensus from "./consensus/teku";

// Import validator clients
import * as lighthouseValidator from "./validator/lighthouse";
import * as prysmValidator from "./validator/prysm";
import * as tekuValidator from "./validator/teku";

// Register all available clients
export const clients: ClientList = {
  execution: {
    geth: geth.client,
    nethermind: nethermind.client,
    besu: besu.client,
  },
  consensus: {
    lighthouse: lighthouseConsensus.client,
    prysm: prysmConsensus.client,
    teku: tekuConsensus.client,
  },
  validator: {
    lighthouse: lighthouseValidator.client,
    prysm: prysmValidator.client,
    teku: tekuValidator.client,
  },
};

/**
 * Get a list of available client names by type
 * @param type The type of client (execution, consensus, validator)
 * @returns Array of client names
 */
export function getClientNames(
  type: "execution" | "consensus" | "validator",
): string[] {
  return Object.keys(clients[type]);
}
