import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { PresetManager } from '@/utils/preset';
import { NodeConfig } from '@/lib/types';
import { baseConfig, testConfig } from '@test/fixtures/configs';

describe('Default Preset Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct default config', async () => {
    const config: Partial<NodeConfig> = {
      ...testConfig,
      common: {
        ...baseConfig,
        network: {
          name: 'mainnet',
          id: 1,
        },
        dataDir: '$HOME/ethereum/mainnet'
      }
    };

    const result = await presetManager.validateAndApplyRules(config, 'default');
    expect(result.common?.network.name).to.equal('mainnet');
    expect(result.common?.network.id).to.equal(1);
  });

  it('should reject config with invalid network', async () => {
    const config: Partial<NodeConfig> = {
      ...testConfig,
      common: {
        ...baseConfig,
        network: {
          name: 'invalid',
          id: 1
        },
        dataDir: '$HOME/ethereum/mainnet'
      }
    };

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Network must be one of: mainnet, sepolia, holesky, hoodi, ephemery, custom');
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });
}); 