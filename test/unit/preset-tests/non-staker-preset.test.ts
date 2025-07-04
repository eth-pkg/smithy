import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { PresetManager } from '@/nodeconfig/preset';
import { DeepPartial, NodeConfig } from '@/types';

describe('Non-Staker Preset Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct non-staker config', async () => {
    const config: DeepPartial<NodeConfig> = {
      common: {
        network: {
          name: 'mainnet',
          id: 1
        }
      },
      consensus: {
        client: {
          name: 'lighthouse',
          version: 'latest'
        }
      },
      execution: {
        client: {
          name: 'geth',
          version: 'latest'
        }
      },
      
    };

    const result = await presetManager.validateAndApplyRules(config, 'combined/mainnet-non-staker');
    expect(result.validator?.enabled).to.be.undefined;
  });

  it('should reject non-staker preset with staking set to true', async () => {
    const config: DeepPartial<NodeConfig> = {
      consensus: {
        client: {
          name: 'lighthouse',
          version: 'latest'
        }
      },
      execution: {
        client: {
          name: 'geth',
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

    try {
      await presetManager.validateAndApplyRules(config, 'combined/mainnet-non-staker');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        expect(error.message).to.include('Validator cannot be enabled when non-staker preset is selected');
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });

  it('should reject staker preset with empty validator client', async () => {
    const config: DeepPartial<NodeConfig> = {
      consensus: {
        client: {
          name: 'lighthouse',
          version: 'latest'
        }
      },
      execution: {
        client: {
          name: 'geth',
          version: 'latest'
        }
      },
      
      validator: {
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
        expect(error.message).to.include('Validator cannot be enabled when non-staker preset is selected');
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });
}); 