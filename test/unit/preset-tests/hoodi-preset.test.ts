import { describe } from 'mocha';
import { runNetworkPresetTests } from './network-preset.test-helper';

describe('Hoodi Preset Tests', () => {
  runNetworkPresetTests({
    network: 'hoodi',
    networkId: 17001,
    dataDir: '$HOME/ethereum/hoodi'
  });
}); 