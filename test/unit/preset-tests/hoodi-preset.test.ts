import { describe } from 'mocha';
import { runNetworkPresetTests } from '@test/fixtures/network-preset.fixture';

describe('Hoodi Preset Tests', () => {
  runNetworkPresetTests({
    network: 'hoodi',
    networkId: 17001,
    dataDir: '$HOME/ethereum/hoodi'
  });
}); 