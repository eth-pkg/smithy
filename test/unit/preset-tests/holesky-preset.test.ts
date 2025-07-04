import { describe } from 'mocha';
import { runNetworkPresetTests } from '../../fixtures/network-preset.fixture';

describe('Holesky Preset Tests', () => {
  runNetworkPresetTests({
    network: 'holesky',
    networkId: 17000,
    dataDir: '$HOME/ethereum/holesky'
  });
}); 