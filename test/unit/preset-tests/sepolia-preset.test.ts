import { describe } from 'mocha';
import { runNetworkPresetTests } from './network-preset.test-helper';

describe('Sepolia Preset Tests', () => {
  runNetworkPresetTests({
    network: 'sepolia',
    networkId: 11155111,
    dataDir: '$HOME/ethereum/sepolia'
  });
}); 