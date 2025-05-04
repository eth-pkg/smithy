import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { PresetManager } from '@/utils/preset';
import { NodeConfig } from '@/lib/types';
import { baseConfig, testConfig } from './network-preset.test-helper';

describe.skip('Non-Staker Preset Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct non-staker config', async () => {
    const config: Partial<NodeConfig> = {
      commonConfig: {
        ...baseConfig,
        network: 'mainnet',
        networkId: 1,
        dataDir: '$HOME/ethereum/mainnet'
      }
    };

    const result = await presetManager.validateAndApplyRules(config, 'combined/mainnet-non-staker');
    expect(result.validatorConfig?.enabled).to.be.false;
  });

  it('should reject non-staker preset with staking set to true', async () => {
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

    try {
      await presetManager.validateAndApplyRules(config, 'combined/mainnet-non-staker');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('must be equal to constant');
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });

  it('should reject staker preset with empty validator client', async () => {
    const config: Partial<NodeConfig> = {
      commonConfig: {
        ...baseConfig,
        network: 'mainnet',
        networkId: 1,
        dataDir: '$HOME/ethereum/mainnet',
      },
      validatorConfig: {
        ...testConfig.validatorConfig,
        enabled: true,
        client: {
          name: '',
          version: ''
        }
      }
    };

    try {
      await presetManager.validateAndApplyRules(config, 'combined/mainnet-non-staker');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Validator client must be specified');
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });
}); 