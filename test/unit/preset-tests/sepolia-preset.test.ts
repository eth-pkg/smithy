import { describe } from 'mocha';
import { runNetworkPresetTests } from '../../fixtures/network-preset.fixture';

describe('Sepolia Preset Tests', () => {
  runNetworkPresetTests({
    network: 'sepolia',
    networkId: 11155111,
    dataDir: '$HOME/ethereum/sepolia'
  });
}); 