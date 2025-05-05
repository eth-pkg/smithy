import { expect } from 'chai';
import { PresetManager } from '@/utils/preset';
import { baseConfig } from './network-preset.test-helper';
import { ExecutionClientName, ConsensusClientName, NodeConfig, ValidatorClientName } from '@/lib/types';
import { testConfig } from '../preset-tests/network-preset.test-helper';

describe('PresetManager', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  describe('validateAndApplyRules', () => {
    it('should validate a correct config', async () => {

      const result = await presetManager.validateAndApplyRules(testConfig);
      expect(result.execution?.client?.name).to.equal('geth');
      expect(result.consensus?.client?.name).to.equal('lighthouse');
    });

    it('should reject invalid execution client type', async () => {
      const config: Partial<NodeConfig> = {
        ...testConfig,
        execution: {
          ...testConfig.execution,
          client: {
            name: 'invalid' as ExecutionClientName,
            version: ''
          }
        }
      };
      try {
        const result = await presetManager.validateAndApplyRules(config);
        expect.fail('Should have thrown an error');
      } catch (error: unknown) {
        if (error instanceof Error) {
          expect(error.message).to.include('Execution client must be one of: besu, erigon, geth, nethermind, reth');
        } else {
          expect.fail('Expected an Error object');
        }
      }
    });

    it('should reject invalid consensus client type', async () => {
      const config: Partial<NodeConfig> = {
        ...testConfig,
        consensus: {
          ...testConfig.consensus,
          client: {
            name: 'invalid' as ConsensusClientName,
            version: ''
          }
        }
      };
      try {
        await presetManager.validateAndApplyRules(config);
        expect.fail('Should have thrown an error');
      } catch (error: unknown) {
        if (error instanceof Error) {
          expect(error.message).to.include('Consensus client must be one of: lighthouse, lodestar, nimbus-eth2, prysm, teku');
        } else {
          expect.fail('Expected an Error object');
        }
      }
    });

    it('should reject invalid validator client type', async () => {
      const config: Partial<NodeConfig> = {
        ...testConfig,
        validator: {
          ...testConfig.validator,
          client: {
            name: 'invalid' as ValidatorClientName,
            version: ''
          }
        }
      };
      try {
        await presetManager.validateAndApplyRules(config);
        expect.fail('Should have thrown an error');
      } catch (error: unknown) {
        if (error instanceof Error) {
          // The error message for validator client may be the same as consensus, adjust if needed
          expect(error.message).to.include('Validator client must be one of: lighthouse, lodestar, nimbus-eth2, prysm, teku');
        } else {
          expect.fail('Expected an Error object');
        }
      }
    });

    it('should apply defaults from schema', async () => {
      const config: Partial<NodeConfig> = {
        ...testConfig,
        common: {
          ...baseConfig,
          network: 'mainnet',
          networkId: 1,
          dataDir: '$HOME/ethereum/mainnet'
        }
      };

      const result = await presetManager.validateAndApplyRules(config);
      expect(result.common?.network).to.equal('mainnet');
      expect(result.common?.syncMode).to.equal('snap');
    });

    it('should reject config with empty client values', async () => {
      const config: Partial<NodeConfig> = {
        ...testConfig,
        common: {
          ...baseConfig,
          network: 'mainnet',
          networkId: 1,
          dataDir: '$HOME/ethereum/mainnet'
        },
        execution: {
          ...testConfig.execution,
          client: {
            name: '',
            version: ''
          }
        },
        consensus: {
          ...testConfig.consensus,
          client: {
            name: '',
            version: ''
          }
        },
        validator: {
          ...testConfig.validator,
          client: {
            name: '',
            version: ''
          }
        }
      };
      try {
        await presetManager.validateAndApplyRules(config);
        expect.fail('Should have thrown an error for empty client values');
      } catch (error: unknown) {
        if (error instanceof Error) {
          expect(error.message).to.include('Consensus client must be one of: lighthouse, lodestar, nimbus-eth2, prysm, teku');
          expect(error.message).to.include('Execution client must be one of: besu, erigon, geth, nethermind, reth');
        } else {
          expect.fail('Expected an Error object');
        }
      }
    });
  });

}); 