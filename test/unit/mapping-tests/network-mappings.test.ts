import { expect } from 'chai';
import { CommandClientRegistry } from '@/lib/builders/command/command-client-registry';
import { ExecutionClientName, ConsensusClientName, ValidatorClientName } from '@/lib/types';
import { testConfig } from '../preset-tests/network-preset.test-helper';

describe('Network Mappings Tests', () => {
  let registry: CommandClientRegistry;
 

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  const networks = ['mainnet', 'hoodi', 'sepolia', 'holesky', 'ephemery'];

  describe('Execution Clients', () => {
    const executionClients: ExecutionClientName[] = [
      'geth',
      'erigon',
      'nethermind',
      'besu',
      'reth'
    ];

    executionClients.forEach(client => {
      describe(`${client}`, () => {
        networks.forEach(network => {
          it(`should correctly map ${network} network`, () => {
            const config = { ...testConfig, commonConfig: { ...testConfig.commonConfig, network, networkId: getNetworkId(network) } };
            const scriptContent = registry.getScriptContent(client, config);
            const scriptString = scriptContent.toString();
            // Verify network-specific flags are present
            switch (client) {
              case 'geth':
                expect(scriptString).to.contain(`--${network}`);
                expect(scriptString).to.contain(`--networkid ${getNetworkId(network)}`);
                expect(scriptString).to.not.contain(`--network ${network}`);
                // Verify no other network flags are present
                networks.filter(n => n !== network).forEach(otherNetwork => {
                  expect(scriptString).to.not.contain(`--${otherNetwork}`);
                });
                break;
              case 'erigon':
                expect(scriptString).to.contain(`--chain ${network}`);
                expect(scriptString).to.contain(`--networkid ${getNetworkId(network)}`);
                break;
              case 'nethermind':
                // Nethermind doesn't support network flag, should use network ID instead
                expect(scriptString).to.not.contain(`--network ${network}`);
                expect(scriptString).to.contain(`--networkid ${getNetworkId(network)}`);
                break;
              case 'besu':
                expect(scriptString).to.contain(`--network=${network}`);
                expect(scriptString).to.contain(`--network-id=${getNetworkId(network)}`);
                break;
              case 'reth':
                expect(scriptString).to.contain(`--chain ${network}`);
                expect(scriptString).to.not.contain(`--networkid ${getNetworkId(network)}`);
                break;
            }
          });
        });
      });
    });
  });

  describe('Consensus Clients', () => {
    const consensusClients: ConsensusClientName[] = [
      'lighthouse', 
      'lodestar', 
      'nimbus-eth2', 
      'prysm',
      'teku'
    ];

    consensusClients.forEach(client => {
      describe(`${client}`, () => {
        networks.forEach(network => {
          it(`should correctly map ${network} network`, () => {
            const config = { ...testConfig, commonConfig: { ...testConfig.commonConfig, network, networkId: getNetworkId(network) } };
            const scriptContent = registry.getScriptContent(client, config);
            const scriptString = scriptContent.toString();

            // Verify network-specific flags are present
            switch (client) {
              case 'lighthouse':
                expect(scriptString).to.contain(`--network ${network}`);
                expect(scriptString).to.not.contain(`--networkid ${getNetworkId(network)}`);
                break;
              case 'lodestar':
                expect(scriptString).to.contain(`--network ${network}`);
                expect(scriptString).to.not.contain(`--networkid ${getNetworkId(network)}`);
                break;
              case 'nimbus-eth2':
                expect(scriptString).to.contain(`--network ${network}`);
                expect(scriptString).to.not.contain(`--networkid ${getNetworkId(network)}`);
                break;
              case 'prysm':
                expect(scriptString).to.contain(`--${network}`);
                expect(scriptString).to.contain(`--network-id ${getNetworkId(network)}`);
                expect(scriptString).to.not.contain(`--network ${network}`);
                // Verify no other network flags are present
                networks.filter(n => n !== network).forEach(otherNetwork => {
                  expect(scriptString).to.not.contain(`--${otherNetwork}`);
                });
                break;
              case 'teku':
                expect(scriptString).to.contain(`--network=${network}`);
                expect(scriptString).to.not.contain(`--networkid ${getNetworkId(network)}`);
                break;
            }
          });
        });
      });
    });
  });

  describe('Validator Clients', () => {
    const validatorClients: ValidatorClientName[] = [
      //'lighthouse', 
      //'lodestar', 
      // 'nimbus-eth2', 
      // 'prysm', 
       'teku'
    ];

    validatorClients.forEach(client => {
      describe(`${client}`, () => {
        networks.forEach(network => {
          it(`should correctly map ${network} network`, () => {
            const config = { ...testConfig, commonConfig: { ...testConfig.commonConfig, network, networkId: getNetworkId(network) } };
            const scriptContent = registry.getScriptContent(client, config, true);
            const scriptString = scriptContent.toString();

            // Verify network-specific flags are present
            switch (client) {
              case 'lighthouse':
                expect(scriptString).to.contain(`--network ${network}`);
                expect(scriptString).to.not.contain(`--networkid ${getNetworkId(network)}`);
                break;
              case 'lodestar':
                expect(scriptString).to.contain(`--network ${network}`);
                expect(scriptString).to.not.contain(`--networkid ${getNetworkId(network)}`);
                break;
              case 'nimbus-eth2':
                expect(scriptString).to.not.contain(`--network ${network}`);
                expect(scriptString).to.not.contain(`--networkid ${getNetworkId(network)}`);
                break;
              case 'prysm':
                expect(scriptString).to.contain(`--${network}`);
                expect(scriptString).to.not.contain(`--network-id ${getNetworkId(network)}`);
                expect(scriptString).to.not.contain(`--network ${network}`);
                // Verify no other network flags are present
                networks.filter(n => n !== network).forEach(otherNetwork => {
                  expect(scriptString).to.not.contain(`--${otherNetwork}`);
                });
                break;
              case 'teku':
                expect(scriptString).to.contain(`--network=${network}`);
                expect(scriptString).to.not.contain(`--networkid ${getNetworkId(network)}`);
                break;
            }
          });
        });
      });
    });
  });
});

// Helper function to get network IDs
function getNetworkId(network: string): number {
  const networkIds: Record<string, number> = {
    mainnet: 1,
    goerli: 5,
    sepolia: 11155111,
    holesky: 17000,
    ephemery: 1337
  }
  return networkIds[network] || 1
} 