import { expect } from 'chai';
import { PresetManager } from '@/utils/preset';
import { NodeConfig, Common, Consensus, Execution, Validator, ExecutionClientName, ConsensusClientName, ValidatorClientName, DeepPartial } from '@/lib/types';

interface NetworkConfig {
  network: string;
  networkId: number;
  dataDir: string;
}

export const baseConfig: Common = {
  engine: {
    enabled: true,
    communication: {
      method: 'jwt',
      jwt: {
        file: '{common.dataDir}/{common.network.name}/engine.jwt',
        id: ''
      },
      ipc: { path: '' }
    },
    api: {
      url: 'http://localhost:8551',
      host: 'localhost',
      allowlist: ['localhost'],
      ip: '127.0.0.1',
      scheme: 'http',
      port: 8551
    }
  },
  network: {
    name: 'mainnet',
    id: 1
  },
  operatingSystem: 'linux',
  dataDir: '{common.dataDir}/{common.network.name}',
};

export const testConfig: NodeConfig = {
  common: {
    ...baseConfig,
    dataDir: '/test/data',
  },
  consensus: {
    client: {
      name: 'lighthouse',
      version: ''
    },
    dataDir: '{common.dataDir}/{common.network.name}/{consensus.client.name}',
    http: {
      enabled: false,
      port: 5052,
      modules: ['eth', 'net', 'web3'],
      allowlist: ['localhost'],
      address: 'localhost',
      tls: {
        enabled: false,
        cert: '',
        key: ''
      }
    },
    metrics: {
      enabled: false,
      port: 8008,
      address: 'localhost'
    },
    p2p: {
      enabled: false,
      maxPeers: 50,
      port: 9000,
      port6: 9001,
      bootnodes: [],
      enrAddress: '',
      allowlist: ['localhost'],
      denylist: [],
      discovery: {
        enabled: false,
        port: 30303,
        v4: {
          enabled: false,
          port: 30303,
          address: ''
        },
        v5: {
          enabled: false,
          port: 30303,
          address: ''
        },
        dns: {
          enabled: false,
          url: ''
        }
      },
    },
    ws: {
      enabled: false,
      port: 8546
    },
    checkpoint: {
      enabled: false,
      url: '',
      block: '',
      state: ''
    },
    graffiti: {
      enabled: false,
      message: 'test'
    },
    log: {
      enabled: false,
      file: '',
      level: 'info',
      format: 'json'
    },
  },
  validator: {
    isExternal: true,
    client: {
      name: 'prysm',
      version: ''
    },
    enabled: false,
    dataDir: '{common.dataDir}/{common.network.name}/{validator.client.name}',
    beaconRpcProvider: 'http://localhost:5052',
    numValidators: 1,
    feeRecipientAddress: '0x0000000000000000000000000000000000000000',
    metrics: {
      enabled: false,
      port: 8080,
      address: 'localhost'
    },
    graffiti: {
      enabled: false,
      message: 'test'
    },
    log: {
      enabled: false,
      file: '',
      level: 'info',
      format: 'json'
    },
    proposerConfig: {
      enabled: false,
      file: '',
      refreshEnabled: false,
      blindedBlocksEnabled: false,
      refreshInterval: 0,
      maxValidators: 0,
      maxProposerDelay: 0,
      maxProposerPriority: 0
    },
    distributed: false,
    secretsDir: '',
    validatorsDir: '',
    builderEnabled: false,
    externalSigner: {
      enabled: false,
      url: '',
      keystore: '',
      keystorePasswordFile: '',
      publicKeys: [],
      timeout: 5000,
      truststore: '',
      truststorePasswordFile: ''
    },
  },
  execution: {
    isExternal: true,
    client: {
      name: 'geth',
      version: ''
    },
    dataDir: '{common.dataDir}/{common.network.name}/{execution.client.name}',
    http: {
      enabled: true,
      port: 8545,
      modules: ['eth', 'net', 'web3'],
      allowlist: ['localhost'],
      address: 'localhost',
      tls: {
        enabled: false,
        cert: '',
        key: ''
      }
    },
    metrics: {
      enabled: false,
      port: 6060,
      address: 'localhost'
    },
    gpo: {
      enabled: false,
      blocks: 100,
      maxPrice: 500000000000,
      ignorePrice: 50,
      percentile: 60
    },
    graphql: {
      enabled: false,
      port: 8547,
      address: '0.0.0.0',
      allowlist: []
    },
    p2p: {
      enabled: false,
      maxPeers: 50,
      port: 30303,
      port6: 30304,
      bootnodes: [],
      enrAddress: '',
      allowlist: ['localhost'],
      denylist: [],
      discovery: {
        enabled: false,
        port: 30303,
        dns: {
          enabled: false,
          url: ''
        },
        v4: {
          enabled: false,
          port: 30303,
          address: ''
        },
        v5: {
          enabled: false,
          port: 30303,
          address: ''
        }
      },
    },
    ws: {
      enabled: false,
      port: 8546
    }
  }
};

export const createNetworkConfig = (config: NetworkConfig): DeepPartial<NodeConfig> => ({
  common: {
    network: {
      name: config.network,
      id: config.networkId
    },
    dataDir: config.dataDir
  },
  execution: {
    client: {
      name: 'geth',
      version: 'latest'
    }
  },
  consensus: {
    client: {
      name: 'lighthouse',
      version: 'latest'
    }
  },
  validator: {
    enabled: false,
  }
});

export const runNetworkPresetTests = (config: NetworkConfig) => {
  let presetManager: PresetManager;

  beforeEach(() => {
    presetManager = new PresetManager(true);
  });

  it('should validate a correct config', async () => {
    const testConfig = createNetworkConfig(config);
    const presetName = `combined/${config.network}-non-staker`;
    const result = await presetManager.validateAndApplyRules(testConfig, presetName);
    expect(result.common?.network.name).to.equal(config.network);
    expect(result.common?.network.id).to.equal(config.networkId);
  });

  it('should reject config with wrong network', async () => {
    const testConfig = createNetworkConfig({
      ...config,
      network: 'invalid-network'
    });

    try {
      const presetName = `combined/${config.network}-non-staker`;
      await presetManager.validateAndApplyRules(testConfig, presetName);
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include(`Network must be set to '${config.network}'`);
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });

  it('should reject config trying to override network constant', async () => {
    const testConfig = createNetworkConfig({
      ...config,
      network: 'custom'
    });

    try {
      const presetName = `combined/${config.network}-non-staker`;
      await presetManager.validateAndApplyRules(testConfig, presetName);
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include(`Network must be set to '${config.network}'`);
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });

  it('should reject config trying to override networkId constant', async () => {
    const testConfig = createNetworkConfig({
      ...config,
      networkId: 9999
    });

    try {
      const presetName = `combined/${config.network}-non-staker`;
      await presetManager.validateAndApplyRules(testConfig, presetName);
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include(`Network ID must be set to ${config.networkId}`);
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });

  it('should reject config trying to override multiple constants', async () => {
    const testConfig = createNetworkConfig({
      ...config,
      network: 'custom',
      networkId: 9999
    });

    try {
      const presetName = `combined/${config.network}-non-staker`;
      await presetManager.validateAndApplyRules(testConfig, presetName);
      expect.fail('Should have thrown an error');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.include(`Network must be set to '${config.network}'`);
        expect(error.message).to.include(`Network ID must be set to ${config.networkId}`);
      } else {
        expect.fail('Expected an Error object');
      }
    }
  });
}; 