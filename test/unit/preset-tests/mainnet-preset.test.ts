import { describe } from 'mocha';
import { runNetworkPresetTests } from '../../fixtures/network-preset.fixture';

describe('Mainnet Preset Tests', () => {
  runNetworkPresetTests({
    network: 'mainnet',
    networkId: 1,
    dataDir: '$HOME/ethereum/mainnet'
  });
}); 