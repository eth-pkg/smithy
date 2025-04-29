import { expect } from 'chai';
import { PresetManager } from '@/utils/preset';
import { EthereumConfig } from '@/clients/types';

describe('Default Preset Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct config', async () => {
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

    const result = await presetManager.validateAndApplyRules(config, 'default');
    expect(result.commonConfig?.clients?.execution).to.equal('geth');
    expect(result.commonConfig?.clients?.consensus).to.equal('lighthouse');
  });
}); 