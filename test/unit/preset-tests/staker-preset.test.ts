import { expect } from 'chai';
import { PresetManager } from '@/utils/preset';
import { EthereumConfig } from '@/clients/types';

describe('Staker Preset Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate staker preset configuration', async () => {
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

    const result = await presetManager.validateAndApplyRules(config, 'staker');
    expect(result.commonConfig?.features?.staking).to.be.true;
    expect(result.commonConfig?.clients?.validator).to.equal('lighthouse');
  });

  it('should reject staker preset with empty validator client', async () => {
    const config: Partial<EthereumConfig> = {
      commonConfig: {
        clients: {
          execution: 'geth',
          consensus: 'lighthouse',
          validator: ''
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

    try {
      await presetManager.validateAndApplyRules(config, 'staker');
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).to.include('Validator client must be specified');
    }
  });

  it('should reject staker preset with staking set to false', async () => {
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
          staking: false
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

    try {
      await presetManager.validateAndApplyRules(config, 'staker');
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).to.include('must be equal to constant');
    }
  });
}); 