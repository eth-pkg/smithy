import { describe } from 'mocha';
import { runNetworkPresetTests } from './network-preset.test-helper';

describe('Mainnet Preset Tests', () => {
  runNetworkPresetTests({
    network: 'mainnet',
    networkId: 1,
    dataDir: '$HOME/ethereum/mainnet'
  });
}); 