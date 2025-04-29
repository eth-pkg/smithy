import { describe } from 'mocha';
import { runNetworkPresetTests } from './network-preset.test-helper';

describe('Goerli Preset Tests', () => {
  runNetworkPresetTests({
    network: 'goerli',
    networkId: 5,
    dataDir: '$HOME/ethereum/goerli'
  });
}); 