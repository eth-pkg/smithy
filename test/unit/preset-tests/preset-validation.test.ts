import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { PresetManager } from '@/utils/preset';
import { testConfig } from './network-preset.test-helper';

describe.skip('Preset Validation Tests', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  // Test invalid network values
  it('should reject invalid network value', async () => {
    const config = { ...testConfig };
    config.common!.network = 'invalid_network' as any;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Network must be one of: mainnet, sepolia, holesky, hoodi, ephemery, custom');
      }
    }
  });

  // Test invalid networkId values
  it('should reject invalid networkId value', async () => {
    const config = { ...testConfig };
    config.common!.network.id = 0;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Network ID must be a positive number');
      }
    }
  });

  // Test invalid consensus client values
  it('should reject invalid consensus client value', async () => {
    const config = { ...testConfig };
    config.consensus!.client = {
      name: 'invalid_client' as any,
      version: ''
    };

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Consensus client must be one of: lighthouse, lodestar, nimbus-eth2, prysm, teku');
      }
    }
  });

  // Test invalid execution client values
  it('should reject invalid execution client value', async () => {
    const config = { ...testConfig };
    config.execution!.client = {
      name: 'invalid_client' as any,
      version: ''
    };

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Execution client must be one of: besu, erigon, geth, nethermind, reth');
      }
    }
  });

  // Test invalid validator client values
  it('should reject invalid validator client value', async () => {
    const config = { ...testConfig };
    config.validator!.client = {
      name: 'invalid_client' as any,
      version: ''
    };

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Validator client must be one of: lighthouse, lodestar, nimbus-eth2, prysm, teku');
      }
    }
  });

  // Test invalid engine port values (minimum)
  it('should reject engine port below minimum', async () => {
    const config = { ...testConfig };
    config.common!.engine.api.port = 80;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Engine API port must be >= 1024');
      }
    }
  });

  // Test invalid engine port values (maximum)
  it('should reject engine port above maximum', async () => {
    const config = { ...testConfig };
    config.common!.engine.api.port = 70000;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Engine API port must be <= 65535');
      }
    }
  });

  // Test invalid engine communication values
  it('should reject invalid engine communication value', async () => {
    const config = { ...testConfig };
    config.common!.engine.communication = 'invalid' as any;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Engine communication method must be \'jwt\' or \'ipc\'');
      }
    }
  });

  // Test invalid engine IP address
  it('should reject invalid engine IP address', async () => {
    const config = { ...testConfig };
    config.common!.engine.api.ip = 'invalid.ip.address';

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Must be a valid IPv4 address');
      }
    }
  });

  // Test invalid engine scheme
  it('should reject invalid engine scheme', async () => {
    const config = { ...testConfig };
    config.common!.engine.api.scheme = 'invalid' as any;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Engine scheme must be either \'http\' or \'https\'');
      }
    }
  });

  // Test invalid operating system values
  it('should reject invalid operating system value', async () => {
    const config = { ...testConfig };
    config.common!.operatingSystem = 'invalid_os' as any;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Operating system must be one of: linux, darwin, windows');
      }
    }
  });


  // Test invalid consensus HTTP port values (minimum)
  it('should reject consensus HTTP port below minimum', async () => {
    const config = { ...testConfig };
    config.consensus!.http.port = 80;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('HTTP port must be >= 1024');
      }
    }
  });

  // Test invalid consensus HTTP port values (maximum)
  it('should reject consensus HTTP port above maximum', async () => {
    const config = { ...testConfig };
    config.consensus!.http.port = 70000;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('HTTP port must be <= 65535');
      }
    }
  });

  // Test invalid consensus metrics port values (minimum)
  it('should reject consensus metrics port below minimum', async () => {
    const config = { ...testConfig };
    config.consensus!.metrics.port = 80;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Metrics port must be >= 1024');
      }
    }
  });

  // Test invalid consensus P2P port values (minimum)
  it('should reject consensus P2P port below minimum', async () => {
    const config = { ...testConfig };
    config.consensus!.p2p.port = 80;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('P2P port must be >= 1024');
      }
    }
  });

  // Test invalid validator fee recipient address
  it('should reject invalid validator fee recipient address', async () => {
    const config = { ...testConfig };
    config.validator!.feeRecipientAddress = 'invalid_address';

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Fee recipient address must be a valid Ethereum address');
      }
    }
  });

  // Test invalid validator metrics port
  it('should reject invalid validator metrics port', async () => {
    const config = { ...testConfig };
    config.validator!.metrics.port = 80;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Metrics port must be a valid port number');
      }
    }
  });

  // Test invalid execution HTTP port values (minimum)
  it('should reject execution HTTP port below minimum', async () => {
    const config = { ...testConfig };
    config.execution!.http.port = 80;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('HTTP port must be >= 1024');
      }
    }
  });

  // Test invalid execution HTTP port values (maximum)
  it('should reject execution HTTP port above maximum', async () => {
    const config = { ...testConfig };
    config.execution!.http.port = 70000;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('HTTP port must be <= 65535');
      }
    }
  });

  // Test invalid execution metrics port values (minimum)
  it('should reject execution metrics port below minimum', async () => {
    const config = { ...testConfig };
    config.execution!.metrics.port = 80;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Metrics port must be >= 1024');
      }
    }
  });

  // Test invalid execution P2P port values (minimum)
  it('should reject execution P2P port below minimum', async () => {
    const config = { ...testConfig };
    config.execution!.p2p.port = 80;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('P2P port must be >= 1024');
      }
    }
  });

  // Test invalid execution P2P max peers value (minimum)
  it('should reject execution P2P max peers below minimum', async () => {
    const config = { ...testConfig };
    config.execution!.p2p.maxPeers = 0;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Max peers must be at least 1');
      }
    }
  });

  // Test invalid execution P2P max peers value (maximum)
  it('should reject execution P2P max peers above maximum', async () => {
    const config = { ...testConfig };
    config.execution!.p2p.maxPeers = 2000;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Max peers should not exceed 1000');
      }
    }
  });

  // Test invalid execution WebSocket port values (minimum)
  it('should reject execution WebSocket port below minimum', async () => {
    const config = { ...testConfig };
    config.execution!.ws.port = 80;

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('WebSocket port must be >= 1024');
      }
    }
  });

  // Test missing required fields
  it('should reject missing required consensus client', async () => {
    const config = { ...testConfig };
    config.consensus!.client = {
      name: '' as any,
      version: ''
    };

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Missing required field: consensus');
      }
    }
  });

  // Test missing required fields
  it('should reject missing required execution client', async () => {
    const config = { ...testConfig };
    config.execution!.client = {
      name: '' as any,
      version: ''
    };

    try {
      await presetManager.validateAndApplyRules(config, 'default');
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include('Missing required field: execution');
      }
    }
  });
}); 