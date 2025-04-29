import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { PresetManager } from '@/utils/preset';
import { EthereumConfig } from '@/clients/types';
import { baseConfig } from './network-preset.test-helper';

describe('Hoodie Preset Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct hoodie config', async () => {
    const config: Partial<EthereumConfig> = {
      commonConfig: {
        ...baseConfig,
        network: 'hoodie',
        networkId: 31337,
        dataDir: '$HOME/ethereum/hoodie'
      }
    };

    const result = await presetManager.validateAndApplyRules(config, 'hoodie');
    expect(result.commonConfig?.network).to.equal('hoodie');
    expect(result.commonConfig?.networkId).to.equal(31337);
  });

  it('should reject config with wrong network', async () => {
    const config: Partial<EthereumConfig> = {
      commonConfig: {
        ...baseConfig,
        network: 'mainnet',
        networkId: 31337,
        dataDir: '$HOME/ethereum/hoodie'
      }
    };

    try {
      await presetManager.validateAndApplyRules(config, 'hoodie');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Network must be set to \'hoodie\'');
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });

  it('should reject config with wrong networkId', async () => {
    const config: Partial<EthereumConfig> = {
      commonConfig: {
        ...baseConfig,
        network: 'hoodie',
        networkId: 1,
        dataDir: '$HOME/ethereum/hoodie'
      }
    };

    try {
      await presetManager.validateAndApplyRules(config, 'hoodie');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Network ID must be set to 31337');
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });
}); 