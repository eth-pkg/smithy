import { expect } from "chai"
import { CommandClientRegistry } from "@/builders/command/command-client-registry"
import { ExecutionClientName, ConsensusClientName, ValidatorClientName, NodeConfig } from "@/lib/types"
import { testConfig } from "../preset-tests/network-preset.test-helper"

describe("CommandClientRegistry", () => {
  const registry = new CommandClientRegistry()
  // Map of expected commands for each client type
  const expectedCommands = {
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
    }
  }

  Object.entries(expectedCommands.execution).forEach(([client, expectedCommand]) => {
    it(`should use the correct command (${expectedCommand}) for execution client ${client}`, () => {
      let config = {
        ...testConfig,
        execution: {
          ...testConfig.execution,
          client: {
            name: client as ExecutionClientName,
            version: "",
          }
        }
      }
      const script = registry.getScriptContent(client as ExecutionClientName, config)
      const scriptStr = script.toString()
      expect(scriptStr).to.include(expectedCommand)
    })
  })

  Object.entries(expectedCommands.consensus).forEach(([client, expectedCommand]) => {
    it(`should use the correct command (${expectedCommand}) for consensus client ${client}`, () => {
      let config = {
        ...testConfig,
        consensus: {
          ...testConfig.consensus,
          client: {
            name: client as ConsensusClientName,
            version: "",
          }
        }
      }
      const script = registry.getScriptContent(client as ConsensusClientName, config)
      const scriptStr = script.toString()
      expect(scriptStr).to.include(expectedCommand)
    })
  })

  Object.entries(expectedCommands.validator).forEach(([client, expectedCommand]) => {
    it(`should use the correct command (${expectedCommand}) for validator client ${client}`, () => {
      let config = {
        ...testConfig,
        validator: {
          ...testConfig.validator,
          client: {
            name: client as ValidatorClientName,
            version: "",
          }
        }
      }
      const script = registry.getScriptContent(client as ValidatorClientName, config, true)
      const scriptStr = script.toString()
      expect(scriptStr).to.include(expectedCommand)
    })
  })
})