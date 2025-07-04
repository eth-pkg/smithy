import { describe } from 'mocha';
import { runNetworkPresetTests } from '@test/fixtures/network-preset.fixture';

describe('Ephemery Preset Tests', () => {
  runNetworkPresetTests({
    network: 'ephemery',
    networkId: 31337,
    dataDir: '$HOME/ethereum/ephemery'
  });
}); 