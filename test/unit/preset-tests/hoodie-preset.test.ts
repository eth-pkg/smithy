import { describe } from 'mocha';
import { runNetworkPresetTests } from './network-preset.test-helper';

describe('Hoodie Preset Tests', () => {
  runNetworkPresetTests({
    network: 'hoodie',
    networkId: 17001,
    dataDir: '$HOME/ethereum/hoodie'
  });
}); 