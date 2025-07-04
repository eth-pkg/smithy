import { describe } from 'mocha';
import { runNetworkPresetTests } from '@test/fixtures/network-preset.fixture';

describe('Sepolia Preset Tests', () => {
  runNetworkPresetTests({
    network: 'sepolia',
    networkId: 11155111,
    dataDir: '$HOME/ethereum/sepolia'
  });
}); 