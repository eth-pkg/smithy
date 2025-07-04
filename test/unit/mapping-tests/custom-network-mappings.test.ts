import { expect } from "chai";
import { CommandClientRegistry } from "@/builders/command/command-client-registry";
import {
  ExecutionClientName,
  ConsensusClientName,
  ValidatorClientName,
} from "@/types";
import { testConfig } from "@test/fixtures/configs";
import { deepMerge } from "@test/fixtures/deepMerge.fixture";

describe("Custom Network Mappings Tests", () => {
  let registry: CommandClientRegistry;

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  const testnetDir = "/path/to/testnet";
  const besuGenesisFile = "/path/to/testnet/besu.json";
  const genesisFile = "/path/to/testnet/genesis.json";
  const chainSpecFile = "/path/to/testnet/chainspec.json";
  const genesisSSZFile = "/path/to/testnet/genesis.ssz";
  const paramsFile = "/path/to/testnet/config.yaml";
  const dataDir = "/path/to/data";

  const createBaseConfig = () => {
    return deepMerge(testConfig, {
      common: {
        ...testConfig.common,
        dataDir,
        network: {
          name: "custom",
          id: 1337,
          custom: {
            name: "devnet",
            testnetDir,
            besuGenesisFile,
            genesisFile,
            chainSpecFile,
            genesisSSZFile,
            paramsFile,
          },
        },
      },
    });
  };

  const createExecutionConfig = (clientName: ExecutionClientName) => {
    const baseConfig = createBaseConfig();
    return {
      ...baseConfig,
      execution: {
        ...testConfig.execution,
        client: {
          name: clientName,
          version: "",
        },
      },
    };
  };

  const createConsensusConfig = (clientName: ConsensusClientName) => {
    const baseConfig = createBaseConfig();
    return {
      ...baseConfig,
      consensus: {
        ...testConfig.consensus,
        client: {
          name: clientName,
          version: "",
        },
      },
    };
  };

  const createValidatorConfig = (clientName: ValidatorClientName) => {
    const baseConfig = createBaseConfig();
    return {
      ...baseConfig,
      validator: {
        ...testConfig.validator,
        enabled: true,
        client: {
          name: clientName,
          version: "",
        },
      },
    };
  };

  describe.skip("Execution Clients", () => {
    const executionClients: ExecutionClientName[] = [
      "besu",
      "erigon",
      "geth",
      "nethermind",
      "reth",
    ];

    executionClients.forEach((client) => {
      it(`should correctly map custom network configuration for ${client}`, () => {
        const config = createExecutionConfig(client);
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        console.log(scriptString);
        switch (client) {
          case "besu":
            expect(scriptString).to.contain(
              `--genesis-file=${besuGenesisFile}`
            );
            expect(scriptString).to.not.contain(`--network=custom`);
            expect(scriptString).to.contain(`--network-id=1337`);
            break;
          case "erigon":
            expect(scriptString).to.contain(
              `erigon init --datadir ${dataDir} ${genesisFile}`
            );
            expect(scriptString).to.not.contain(`--network`);
            expect(scriptString).to.contain(`--networkid 1337`);
            break;
          case "geth":
            expect(scriptString).to.contain(
              `geth init --datadir ${dataDir} ${genesisFile}`
            );
            expect(scriptString).to.not.contain(`--network`);
            expect(scriptString).to.contain(`--networkid 1337`);
            expect(scriptString).to.not.contain(`--mainnet`);
            expect(scriptString).to.not.contain(`--sepolia`);
            expect(scriptString).to.not.contain(`--holesky`);
            expect(scriptString).to.not.contain(`--hoodi`);
            expect(scriptString).to.not.contain(`--ephemery`);
            break;
          case "nethermind":
            expect(scriptString).to.contain(
              `--Init.ChainSpecPath ${chainSpecFile}`
            );
            expect(scriptString).to.not.contain(`--network`);
            expect(scriptString).to.contain(`--config none.cfg`);
            break;
          case "reth":
            expect(scriptString).to.contain(`--chain ${genesisFile}`);
            expect(scriptString).to.not.contain(`--network`);
            break;
        }
      });
    });
  });

  describe("Consensus Clients", () => {
    const consensusClients: ConsensusClientName[] = [
      "lighthouse",
      "lodestar",
      "nimbus-eth2",
      "prysm",
      "teku",
    ];

    consensusClients.forEach((client) => {
      it(`should correctly map custom network configuration for ${client}`, () => {
        const config = createConsensusConfig(client);
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case "lighthouse":
            expect(scriptString).to.contain(`--testnet-dir ${testnetDir}`);
            expect(scriptString).to.not.contain(`--network`);
            break;
          case "lodestar":
            expect(scriptString).to.contain(`--paramsFile ${genesisSSZFile}`);
            expect(scriptString).to.not.contain(`--network`);
            break;
          case "nimbus-eth2":
            expect(scriptString).to.contain(`--network ${testnetDir}`);
            break;
          case "prysm":
            expect(scriptString).to.contain(
              `--genesis-state ${genesisSSZFile}`
            );
            expect(scriptString).to.not.contain(`--mainnet`);
            expect(scriptString).to.not.contain(`--sepolia`);
            expect(scriptString).to.not.contain(`--holesky`);
            expect(scriptString).to.not.contain(`--hoodi`);
            expect(scriptString).to.not.contain(`--ephemery`);
            break;
          case "teku":

            expect(scriptString).to.contain(`--network=${paramsFile}`);
            expect(scriptString).to.contain(
              `--genesis-state=${genesisSSZFile}`
            );
            break;
        }
      });
    });
  });

  describe("Validator Clients", () => {
    const validatorClients: ValidatorClientName[] = [
      "lighthouse",
      "lodestar",
      "nimbus-eth2",
      "prysm",
      "teku",
    ];

    validatorClients.forEach((client) => {
      it(`should correctly map custom network configuration for ${client} validator`, () => {
        const config = createValidatorConfig(client);
        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();

        switch (client) {
          case "lighthouse":
            expect(scriptString).to.contain(`--testnet-dir ${testnetDir}`);
            expect(scriptString).to.not.contain(`--network`);
            break;
          case "lodestar":
            expect(scriptString).to.contain(`--paramsFile ${genesisSSZFile}`);
            expect(scriptString).to.not.contain(`--network`);
            break;
          case "nimbus-eth2":
            expect(scriptString).to.contain(`--network ${testnetDir}`);
            break;
          case "prysm":
            expect(scriptString).to.not.contain(
              `--genesis-state ${genesisSSZFile}`
            );
            expect(scriptString).to.not.contain(`--mainnet`);
            expect(scriptString).to.not.contain(`--sepolia`);
            expect(scriptString).to.not.contain(`--holesky`);
            expect(scriptString).to.not.contain(`--hoodi`);
            expect(scriptString).to.not.contain(`--ephemery`);
            break;
          case "teku":
            // todo not sure 
            // expect(scriptString).to.contain(`--network=${paramsFile}`);
            // expect(scriptString).to.contain(
            //   `--genesis-state=${genesisSSZFile}`
            // );
            break;
        }
      });
    });
  });
});
