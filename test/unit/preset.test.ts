import { expect } from 'chai';
import { PresetManager } from '../../src/utils/preset';
import { EthereumConfig, CommonConfig, ClientSelection, Features } from '../../src/clients/types';

describe('PresetManager', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  describe('validateAndApplyRules', () => {
    it('should validate a correct config', async () => {
      const config: Partial<EthereumConfig> = {
        commonConfig: {
          clients: {
            execution: 'geth',
            consensus: 'lighthouse',
            validator: 'lighthouse'
          },
          dataDir: '$HOME/ethereum/mainnet',
          engine: {
            apiPort: 8551,
            communication: 'jwt',
            endpointUrl: 'http://localhost:8551',
            host: 'localhost',
            ip: '127.0.0.1',
            jwtFile: '$HOME/ethereum/jwt.hex',
            scheme: 'http'
          },
          features: {
            mevBoost: false,
            monitoring: true,
            staking: true
          },
          network: 'mainnet',
          operatingSystem: 'linux',
          syncMode: 'snap'
        }
      };

      const result = await presetManager.validateAndApplyRules(config);
      expect(result.commonConfig?.clients?.execution).to.equal('geth');
      expect(result.commonConfig?.clients?.consensus).to.equal('lighthouse');
    });

    it('should reject invalid client types', async () => {
      const config: Partial<EthereumConfig> = {
        commonConfig: {
          clients: {
            execution: 'invalid',
            consensus: 'invalid',
            validator: ''
          },
          dataDir: '$HOME/ethereum/mainnet',
          engine: {
            apiPort: 8551,
            communication: 'jwt',
            endpointUrl: 'http://localhost:8551',
            host: 'localhost',
            ip: '127.0.0.1',
            jwtFile: '$HOME/ethereum/jwt.hex',
            scheme: 'http'
          },
          features: {
            mevBoost: false,
            monitoring: true,
            staking: false
          },
          network: 'mainnet',
          operatingSystem: 'linux',
          syncMode: 'snap'
        }
      };

      try {
        await presetManager.validateAndApplyRules(config);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).to.be.an('Error');
        expect(error.message).to.include('Execution client must be one of: geth, nethermind, besu');
        expect(error.message).to.include('Consensus client must be one of: lighthouse, prysm, teku');
      }
    });

    it('should apply defaults from schema', async () => {
      const config: Partial<EthereumConfig> = {
        commonConfig: {
          clients: {
            execution: 'geth',
            consensus: 'lighthouse',
            validator: ''
          },
          dataDir: '$HOME/ethereum/mainnet',
          engine: {
            apiPort: 8551,
            communication: 'jwt',
            endpointUrl: 'http://localhost:8551',
            host: 'localhost',
            ip: '127.0.0.1',
            jwtFile: '$HOME/ethereum/jwt.hex',
            scheme: 'http'
          },
          features: {
            mevBoost: false,
            monitoring: true,
            staking: false
          },
          network: 'mainnet',
          operatingSystem: 'linux',
          syncMode: 'snap'
        }
      };

      const result = await presetManager.validateAndApplyRules(config);
      expect(result.commonConfig?.features?.monitoring).to.equal(true);
      expect(result.commonConfig?.network).to.equal('mainnet');
      expect(result.commonConfig?.syncMode).to.equal('snap');
    });

    it('should reject config with empty client values', async () => {
      const config: Partial<EthereumConfig> = {
        commonConfig: {
          clients: {
            execution: '',
            consensus: '',
            validator: ''
          },
          dataDir: '$HOME/ethereum/mainnet',
          engine: {
            apiPort: 8551,
            communication: 'jwt',
            endpointUrl: 'http://localhost:8551',
            host: 'localhost',
            ip: '127.0.0.1',
            jwtFile: '$HOME/ethereum/jwt.hex',
            scheme: 'http'
          },
          features: {
            mevBoost: false,
            monitoring: true,
            staking: false
          },
          network: 'mainnet',
          operatingSystem: 'linux',
          syncMode: 'snap'
        }
      };

      try {
        await presetManager.validateAndApplyRules(config);
        expect.fail('Should have thrown an error for empty client values');
      } catch (error: any) {
        expect(error).to.be.an('Error');
        expect(error.message).to.include('Consensus client must be one of: lighthouse, prysm, teku');
        expect(error.message).to.include('Execution client must be one of: geth, nethermind, besu');
      }
    });
  });

  describe('validateConfig', () => {
    it('should validate a complete config', async () => {
      const config: Partial<EthereumConfig> = {
        commonConfig: {
          clients: {
            execution: 'geth',
            consensus: 'lighthouse',
            validator: 'lighthouse'
          },
          features: {
            mevBoost: false,
            monitoring: true,
            staking: true
          },
          dataDir: '$HOME/ethereum/mainnet',
          engine: {
            apiPort: 8551,
            communication: 'jwt',
            endpointUrl: 'http://localhost:8551',
            host: 'localhost',
            ip: '127.0.0.1',
            jwtFile: '$HOME/ethereum/jwt.hex',
            scheme: 'http'
          },
          network: 'mainnet',
          operatingSystem: 'linux',
          syncMode: 'snap'
        }
      };

      const result = await presetManager.validateConfig(config, 'default');
      expect(result.valid).to.be.true;
      expect(result.errors).to.be.empty;
    });

    it('should detect missing required fields', async () => {
      const config: Partial<EthereumConfig> = {
        commonConfig: {
          clients: {
            execution: '',
            consensus: '',
            validator: ''
          },
          dataDir: '$HOME/ethereum/mainnet',
          engine: {
            apiPort: 8551,
            communication: 'jwt',
            endpointUrl: 'http://localhost:8551',
            host: 'localhost',
            ip: '127.0.0.1',
            jwtFile: '$HOME/ethereum/jwt.hex',
            scheme: 'http'
          },
          features: {
            mevBoost: false,
            monitoring: true,
            staking: false
          },
          network: 'mainnet',
          operatingSystem: 'linux',
          syncMode: 'snap'
        }
      };

      const result = await presetManager.validateConfig(config, 'default');
      expect(result.valid).to.be.false;
      expect(result.errors).to.not.be.empty;
    });
  });
}); 