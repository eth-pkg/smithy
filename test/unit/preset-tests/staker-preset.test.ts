import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { PresetManager } from '@/utils/preset';
import { NodeConfig } from '@/lib/types';
import { baseConfig } from './network-preset.test-helper';

describe('Staker Preset Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct staker config', async () => {
    const config: Partial<NodeConfig> = {
      commonConfig: {
        ...baseConfig,
        features: {
          ...baseConfig.features,
          staking: true
        },
        network: 'mainnet',
        networkId: 1,
        dataDir: '$HOME/ethereum/mainnet'
      }
    };

    const result = await presetManager.validateAndApplyRules(config, 'combined/mainnet-staker');
    expect(result.commonConfig?.features?.staking).to.be.true;
  });

  it('should reject staker preset with staking set to false', async () => {
    const config: Partial<NodeConfig> = {
      commonConfig: {
        ...baseConfig,
        features: {
          ...baseConfig.features,
          staking: false
        },
        network: 'mainnet',
        networkId: 1,
        dataDir: '$HOME/ethereum/mainnet'
      }
    };

    try {
      await presetManager.validateAndApplyRules(config, 'combined/mainnet-staker');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('must be equal to constant');
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });
}); 