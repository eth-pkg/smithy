import { describe } from 'mocha';
import { runNetworkPresetTests } from './network-preset.test-helper';

describe('Holesky Preset Tests', () => {
  runNetworkPresetTests({
    network: 'holesky',
    networkId: 17000,
    dataDir: '$HOME/ethereum/holesky'
  });
}); 