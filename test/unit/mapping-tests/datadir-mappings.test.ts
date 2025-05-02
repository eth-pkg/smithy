import { expect } from 'chai';
import { CommandClientRegistry } from '@/lib/builders/command/command-client-registry';
import { NodeConfig, ExecutionClientName, ConsensusClientName, ValidatorClientName } from '@/lib/types';
import { baseConfig } from '../preset-tests/network-preset.test-helper';

describe('DataDir Interpolation Tests', () => {
  let registry: CommandClientRegistry;
  const testConfig: NodeConfig = {
    commonConfig: {
      ...baseConfig,
      dataDir: '/test/data',
      clients: {
        execution: 'geth',
        consensus: 'lighthouse',
        validator: 'prysm'
      },
      network: 'mainnet',
      engine: {
        apiPort: 8551,
        communication: 'jwt',
        endpointUrl: 'http://localhost:8551',
        host: 'localhost',
        ip: '127.0.0.1',
        jwtFile: '/test/jwt',
        scheme: 'http'
      }
    },
    consensusConfig: {
      dataDir: '{commonConfig.dataDir}/{commonConfig.clients.consensus}',
      httpPort: 5052,
      metricsPort: 8008,
      p2pPort: 9000
    },
    validatorConfig: {
      dataDir: '{commonConfig.dataDir}/{commonConfig.clients.validator}',
      beaconRpcProvider: 'http://localhost:5052',
      numValidators: 1,
      feeRecipientAddress: '0x0000000000000000000000000000000000000000',
      metricsPort: '8080'
    },
    executionConfig: {
      dataDir: '{commonConfig.dataDir}/{commonConfig.clients.execution}',
      http: {
        enabled: true,
        port: 8545,
        apiPrefixes: ['eth', 'net', 'web3'],
        cors: []
      },
      metrics: {
        enabled: true,
        port: 6060
      },
      p2p: {
        maxPeers: 50,
        port: 30303
      },
      ws: {
        enabled: true,
        port: 8546
      }
    }
  };

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
          commonConfig: {
            ...testConfig.commonConfig,
            clients: { ...testConfig.commonConfig.clients, execution: client }
          },
          executionConfig: {
            ...testConfig.executionConfig,
            dataDir: '{commonConfig.dataDir}/{commonConfig.clients.execution}'
          }
        };
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const expectedDataDir = `${config.commonConfig.dataDir}/${client}`;
        
        // Check for interpolated path
        expect(scriptString).to.contain(expectedDataDir);
        
        // Verify data directory flag for each client
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
          commonConfig: {
            ...testConfig.commonConfig,
            clients: { ...testConfig.commonConfig.clients, consensus: client }
          },
          consensusConfig: {
            ...testConfig.consensusConfig,
            dataDir: '{commonConfig.dataDir}/{commonConfig.clients.consensus}'
          }
        };
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const expectedDataDir = `${config.commonConfig.dataDir}/${client}`;
        
        // Check for interpolated path
        expect(scriptString).to.contain(expectedDataDir);
        
        // Verify data directory flag for each client
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

  describe.only('Validator Clients', () => {
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
          commonConfig: {
            ...testConfig.commonConfig,
            clients: { ...testConfig.commonConfig.clients, validator: client }
          },
          validatorConfig: {
            ...testConfig.validatorConfig,
            dataDir: '{commonConfig.dataDir}/{commonConfig.clients.validator}-validator'
          }
        };
        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const expectedDataDir = `${config.commonConfig.dataDir}/${client}-validator`;
        
        // Check for interpolated path
        expect(scriptString).to.contain(expectedDataDir);
        
        // Verify data directory flag for each client
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