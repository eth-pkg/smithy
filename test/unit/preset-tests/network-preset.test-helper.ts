import { expect } from 'chai';
import { PresetManager } from '@/utils/preset';
import { NodeConfig, CommonConfig, ExecutionClientName, ConsensusClientName, ValidatorClientName } from '@/lib/types';

interface NetworkConfig {
  network: string;
  networkId: number;
  dataDir: string;
}

export const baseConfig: CommonConfig = {
  clients: {
    execution: 'geth' as ExecutionClientName,
    consensus: 'lighthouse' as ConsensusClientName,
    validator: 'lighthouse' as ValidatorClientName
  },
  features: {
    mevBoost: false,
    monitoring: true,
    staking: false
  },
  engine: {
    apiPort: 8551,
    communication: 'jwt',
    endpointUrl: 'http://localhost:8551',
    host: 'localhost',
    ip: '127.0.0.1',
    jwtFile: '$HOME/ethereum/jwt.hex',
    scheme: 'http'
  },
  operatingSystem: 'linux',
  syncMode: 'snap',
  networkId: 1,
  dataDir: '$HOME/ethereum/mainnet',
  network: 'mainnet'
};

export const testConfig: NodeConfig = {
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

export const createNetworkConfig = (config: NetworkConfig): { commonConfig: CommonConfig } => ({
  commonConfig: {
    ...baseConfig,
    network: config.network,
    networkId: config.networkId,
    dataDir: config.dataDir
  }
});

export const runNetworkPresetTests = (config: NetworkConfig) => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct config', async () => {
    const testConfig = createNetworkConfig(config);
    const presetName = `combined/${config.network}-non-staker`;
    const result = await presetManager.validateAndApplyRules(testConfig, presetName);
    expect(result.commonConfig?.network).to.equal(config.network);
    expect(result.commonConfig?.networkId).to.equal(config.networkId);
  });

  it('should reject config with wrong network', async () => {
    const testConfig = createNetworkConfig({
      ...config,
      network: 'invalid-network'
    });

    try {
      const presetName = `combined/${config.network}-non-staker`;
      await presetManager.validateAndApplyRules(testConfig, presetName);
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include(`Network must be set to '${config.network}'`);
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });

  it('should reject config trying to override network constant', async () => {
    const testConfig = createNetworkConfig({
      ...config,
      network: 'custom'
    });

    try {
      const presetName = `combined/${config.network}-non-staker`;
      await presetManager.validateAndApplyRules(testConfig, presetName);
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include(`Network must be set to '${config.network}'`);
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });

  it('should reject config trying to override networkId constant', async () => {
    const testConfig = createNetworkConfig({
      ...config,
      networkId: 9999
    });

    try {
      const presetName = `combined/${config.network}-non-staker`;
      await presetManager.validateAndApplyRules(testConfig, presetName);
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include(`Network ID must be set to ${config.networkId}`);
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });

  it('should reject config trying to override multiple constants', async () => {
    const testConfig = createNetworkConfig({
      ...config,
      network: 'custom',
      networkId: 9999
    });

    try {
      const presetName = `combined/${config.network}-non-staker`;
      await presetManager.validateAndApplyRules(testConfig, presetName);
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include(`Network must be set to '${config.network}'`);
        expect(error.message).to.include(`Network ID must be set to ${config.networkId}`);
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });
}; 