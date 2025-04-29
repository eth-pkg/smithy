import { describe } from 'mocha';
import { runNetworkPresetTests } from './network-preset.test-helper';

describe('Ephemery Preset Tests', () => {
  runNetworkPresetTests({
    network: 'ephemery',
    networkId: 31337,
    dataDir: '$HOME/ethereum/ephemery'
  });
}); 