import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName, ConsensusClientName, ValidatorClientName } from '@/lib/types';
import { testConfig } from '../preset-tests/network-preset.test-helper';

describe('DataDir Interpolation Tests', () => {
  let registry: CommandClientRegistry;
 
  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  describe('Execution Clients', () => {
    const executionClients: ExecutionClientName[] = [
      'besu',
      'erigon',
      'geth',
      'nethermind',
      'reth'
    ];

    executionClients.forEach(client => {
      it(`should interpolate dataDir and use correct flag for ${client}`, () => {
        const config = {
          ...testConfig,
          executionConfig: {
            ...testConfig.executionConfig,
            client: {
              name: client,
              version: ''
            },
            dataDir: '{commonConfig.dataDir}/{executionConfig.client.name}'
          }
        };
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const expectedDataDir = `${config.commonConfig.dataDir}/${client}`;
        
        expect(scriptString).to.contain(expectedDataDir);
        
        switch (client) {
          case 'besu':
            expect(scriptString).to.contain(`--data-path=${expectedDataDir}`);
            break;
          case 'erigon':
            expect(scriptString).to.contain(`--datadir ${expectedDataDir}`);
            break;
          case 'geth':
            expect(scriptString).to.contain(`--datadir ${expectedDataDir}`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--datadir ${expectedDataDir}`);
            break;
          case 'reth':
            expect(scriptString).to.contain(`--datadir ${expectedDataDir}`);
            break;
        }
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
      it(`should interpolate dataDir and use correct flag for ${client}`, () => {
        const config = {
          ...testConfig,
          consensusConfig: {
            ...testConfig.consensusConfig,
            client: {
              name: client,
              version: ''
            },
            dataDir: '{commonConfig.dataDir}/{consensusConfig.client.name}'
          }
        };
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const expectedDataDir = `${config.commonConfig.dataDir}/${client}`;
        
        expect(scriptString).to.contain(expectedDataDir);
        
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain(`--datadir ${expectedDataDir}`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--dataDir ${expectedDataDir}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain(`--data-dir ${expectedDataDir}`);
            break;
          case 'prysm':
            expect(scriptString).to.contain(`--datadir ${expectedDataDir}`);
            break;
          case 'teku':
            expect(scriptString).to.contain(`--data-path=${expectedDataDir}`);
            break;
        }
      });
    });
  });

  describe('Validator Clients', () => {
    const validatorClients: ValidatorClientName[] = [
      'lighthouse', 
      'lodestar', 
      'nimbus-eth2', 
      'prysm', 
      'teku'
    ];

    validatorClients.forEach(client => {
      it(`should interpolate dataDir and use correct flag for ${client}`, () => {
        const config = {
          ...testConfig,
          validatorConfig: {
            ...testConfig.validatorConfig,
            client: {
              name: client,
              version: ''
            },
            dataDir: '{commonConfig.dataDir}/{validatorConfig.client.name}-validator'
          }
        };
        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const expectedDataDir = `${config.commonConfig.dataDir}/${client}-validator`;
        
        expect(scriptString).to.contain(expectedDataDir);
        
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain(`--datadir ${expectedDataDir}`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--dataDir ${expectedDataDir}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain(`--data-dir ${expectedDataDir}`);
            break;
          case 'prysm':
            expect(scriptString).to.contain(`--datadir ${expectedDataDir}`);
            break;
          case 'teku':
            expect(scriptString).to.contain(`--data-path=${expectedDataDir}`);
            break;
        }
      });
    });
  });
});