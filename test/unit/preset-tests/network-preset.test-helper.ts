import { expect } from 'chai';
import { PresetManager } from '@/utils/preset';
import { EthereumConfig, CommonConfig } from '@/clients/types';

interface NetworkConfig {
  network: string;
  networkId: number;
  dataDir: string;
}

export const baseConfig = {
  clients: {
    execution: 'geth',
    consensus: 'lighthouse',
    validator: 'lighthouse'
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
  syncMode: 'snap'
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
    const presetName = config.network;
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
      const presetName = config.network;
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
      const presetName = config.network;
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
      const presetName = config.network;
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
      const presetName = config.network;
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