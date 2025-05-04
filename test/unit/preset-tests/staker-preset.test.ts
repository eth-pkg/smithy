import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { PresetManager } from '@/utils/preset';
import { NodeConfig } from '@/lib/types';
import { baseConfig, testConfig } from './network-preset.test-helper';

describe('Staker Preset Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct staker config', async () => {
    const config: Partial<NodeConfig> = {
      commonConfig: {
        ...baseConfig,
        network: 'mainnet',
        networkId: 1,
        dataDir: '$HOME/ethereum/mainnet'
      },
      validatorConfig: {
        ...testConfig.validatorConfig,
        enabled: true
      }
    };

    const result = await presetManager.validateAndApplyRules(config, 'combined/mainnet-staker');
    expect(result.validatorConfig?.enabled).to.be.true;
  });

  it('should reject staker preset with staking set to false', async () => {
    const config: Partial<NodeConfig> = {
      commonConfig: {
        ...baseConfig,
        network: 'mainnet',
        networkId: 1,
        dataDir: '$HOME/ethereum/mainnet'
      },
      validatorConfig: {
        ...testConfig.validatorConfig,
        enabled: false
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