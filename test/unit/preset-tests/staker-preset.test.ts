import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { PresetManager } from '@/utils/preset';
import { DeepPartial, NodeConfig } from '@/lib/types';

describe('Staker Preset Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct staker config', async () => {
    const config: DeepPartial<NodeConfig> = {
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
        enabled: true,
        client: {
          name: 'lighthouse',
          version: 'latest'
        }
      }
    };

    const result = await presetManager.validateAndApplyRules(config, 'combined/mainnet-staker');
    expect(result.validator?.enabled).to.be.true;
  });

  it('should reject staker preset with staking set to false', async () => {
    const config: DeepPartial<NodeConfig> = {
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
        client: {
          name: 'lighthouse',
          version: 'latest'
        }
      }
    };

    try {
      await presetManager.validateAndApplyRules(config, 'combined/mainnet-staker');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Validator must be enabled when staker preset is selected');
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });
}); 