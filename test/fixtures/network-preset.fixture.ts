import { expect } from 'chai';
import { PresetManager } from '@/utils/preset';
import { NodeConfig, DeepPartial } from '@/types';

export interface NetworkConfig {
  network: string;
  networkId: number;
  dataDir: string;
}

export const createNetworkConfig = (config: NetworkConfig): DeepPartial<NodeConfig> => ({
  common: {
    network: {
      name: config.network,
      id: config.networkId
    },
    dataDir: config.dataDir
  },
  execution: {
    client: {
      name: 'geth',
      version: 'latest'
    }
  },
  consensus: {
    client: {
      name: 'lighthouse',
      version: 'latest'
    }
  },
  validator: {
    enabled: false,
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
    expect(result.common?.network.name).to.equal(config.network);
    expect(result.common?.network.id).to.equal(config.networkId);
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