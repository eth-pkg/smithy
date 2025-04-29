import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { PresetManager } from '@/utils/preset';
import { EthereumConfig } from '@/clients/types';
import { baseConfig } from './network-preset.test-helper';

describe('Default Preset Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct default config', async () => {
    const config: Partial<EthereumConfig> = {
      commonConfig: {
        ...baseConfig,
        network: 'mainnet',
        networkId: 1,
        dataDir: '$HOME/ethereum/mainnet'
      }
    };

    const result = await presetManager.validateAndApplyRules(config, 'default');
    expect(result.commonConfig?.network).to.equal('mainnet');
    expect(result.commonConfig?.networkId).to.equal(1);
  });

  it('should reject config with invalid network', async () => {
    const config: Partial<EthereumConfig> = {
      commonConfig: {
        ...baseConfig,
        network: 'invalid',
        networkId: 1,
        dataDir: '$HOME/ethereum/mainnet'
      }
    };

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Network must be one of: mainnet, goerli, sepolia, holesky');
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });
}); 