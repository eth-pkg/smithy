import { expect } from 'chai';
import { PresetManager } from '@/utils/preset';
import { baseConfig } from './network-preset.test-helper';
import { ExecutionClientName, ConsensusClientName, NodeConfig } from '@/lib/types';
import { testConfig } from '../preset-tests/network-preset.test-helper';

describe('PresetManager', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  describe('validateAndApplyRules', () => {
    it('should validate a correct config', async () => {

      const result = await presetManager.validateAndApplyRules(testConfig);
      expect(result.commonConfig?.clients?.execution).to.equal('geth');
      expect(result.commonConfig?.clients?.consensus).to.equal('lighthouse');
    });

    it('should reject invalid client types', async () => {
      const config: Partial<NodeConfig> = {
        ...testConfig,
        commonConfig: {
          ...baseConfig,
          clients: {
            ...baseConfig.clients,
            // @ts-nocheck
            execution: 'invalid' as ExecutionClientName,
            // @ts-nocheck
            consensus: 'invalid' as ConsensusClientName,
            validator: ''
          },
          network: 'mainnet',
          networkId: 1,
          dataDir: '$HOME/ethereum/mainnet'
        }
      };

      try {
        await presetManager.validateAndApplyRules(config);
        expect.fail('Should have thrown an error');
      } catch (error: unknown) {
        if (error instanceof Error) {
          expect(error.message).to.include('Execution client must be one of: besu, erigon, geth, nethermind, reth');
          expect(error.message).to.include('Consensus client must be one of: lighthouse, lodestar, nimbus-eth2, prysm, teku');
        } else {
          expect.fail('Expected an Error object');
        }
      }
    });

    it('should apply defaults from schema', async () => {
      const config: Partial<NodeConfig> = {
        ...testConfig,
        commonConfig: {
          ...baseConfig,
          network: 'mainnet',
          networkId: 1,
          dataDir: '$HOME/ethereum/mainnet'
        }
      };

      const result = await presetManager.validateAndApplyRules(config);
      expect(result.commonConfig?.features?.monitoring).to.equal(true);
      expect(result.commonConfig?.network).to.equal('mainnet');
      expect(result.commonConfig?.syncMode).to.equal('snap');
    });

    it('should reject config with empty client values', async () => {
      const config: Partial<NodeConfig> = {
        ...testConfig,
        commonConfig: {
          ...baseConfig,
          clients: {
            ...baseConfig.clients,
            execution: '',
            consensus: '',
            validator: ''
          },
          network: 'mainnet',
          networkId: 1,
          dataDir: '$HOME/ethereum/mainnet'
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