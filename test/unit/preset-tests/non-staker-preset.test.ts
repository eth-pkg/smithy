import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { PresetManager } from '@/utils/preset';
import { EthereumConfig } from '@/clients/types';
import { baseConfig } from './network-preset.test-helper';

describe('Non-Staker Preset Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct non-staker config', async () => {
    const config: Partial<EthereumConfig> = {
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

    const result = await presetManager.validateAndApplyRules(config, 'combined/mainnet-non-staker');
    expect(result.commonConfig?.features?.staking).to.be.false;
  });

  it('should reject non-staker preset with staking set to true', async () => {
    const config: Partial<EthereumConfig> = {
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

  it('should reject non-staker preset with empty validator client', async () => {
    const config: Partial<EthereumConfig> = {
      commonConfig: {
        ...baseConfig,
        features: {
          ...baseConfig.features,
          staking: false
        },
        network: 'mainnet',
        networkId: 1,
        dataDir: '$HOME/ethereum/mainnet',
        clients: {
          ...baseConfig.clients,
          validator: ''
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