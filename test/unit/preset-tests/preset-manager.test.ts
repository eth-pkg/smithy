import { expect } from 'chai';
import { PresetManager } from '@/utils/preset';
import { baseConfig } from './network-preset.test-helper';
import { ExecutionClientName, ConsensusClientName, NodeConfig } from '@/lib/types';

describe('PresetManager', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  describe('validateAndApplyRules', () => {
    it('should validate a correct config', async () => {
      const config: Partial<NodeConfig> = {
        commonConfig: {
          ...baseConfig,
          network: 'mainnet',
          networkId: 1,
          dataDir: '$HOME/ethereum/mainnet'
        }
      };

      const result = await presetManager.validateAndApplyRules(config);
      expect(result.commonConfig?.clients?.execution).to.equal('geth');
      expect(result.commonConfig?.clients?.consensus).to.equal('lighthouse');
    });

    it('should reject invalid client types', async () => {
      const config: Partial<NodeConfig> = {
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
          expect(error.message).to.include('Execution client must be one of: geth, nethermind, besu');
          expect(error.message).to.include('Consensus client must be one of: lighthouse, prysm, teku');
        } else {
          expect.fail('Expected an Error object');
        }
      }
    });

    it('should apply defaults from schema', async () => {
      const config: Partial<NodeConfig> = {
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
          expect(error.message).to.include('Consensus client must be one of: lighthouse, prysm, teku');
          expect(error.message).to.include('Execution client must be one of: geth, nethermind, besu');
        } else {
          expect.fail('Expected an Error object');
        }
      }
    });
  });

  describe('validateConfig', () => {
    it('should validate a complete config', async () => {
      const config: Partial<NodeConfig> = {
        commonConfig: {
          ...baseConfig,
          network: 'mainnet',
          networkId: 1,
          dataDir: '$HOME/ethereum/mainnet'
        }
      };

      const result = await presetManager.validateConfig(config, 'default');
      expect(result.valid).to.be.true;
      expect(result.errors).to.be.empty;
    });

    it('should detect missing required fields', async () => {
      const config: Partial<NodeConfig> = {
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

      const result = await presetManager.validateConfig(config, 'default');
      expect(result.valid).to.be.false;
      expect(result.errors).to.not.be.empty;
    });
  });
}); 