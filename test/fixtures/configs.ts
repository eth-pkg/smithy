import { NodeConfig, Common } from '@/types';

export const baseConfig: Common = {
  engine: {
    jwt: {
      file: '{common.dataDir}/{common.network.name}/engine.jwt',
      id: ''
    },
    api: {
      urls: ['http://localhost:8551'],
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
    builder: {
      enabled: false,
      url: '',
      userAgent: '',
      enableSSZ: false
    },
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
      listenAddress: '0.0.0.0',
      port: 30303,
      port6: 30304,
      discoveryPort: 9002,
      discoveryPort6: 9003,
      bootnodes: [],
      staticPeers: [],
      trustedPeers: [],
      targetPeers: 25,
      maxPeers: 25,
      nodiscover: false,
      localPeerDiscovery: false,
      subscribeAllSubnets: false,
      upnp: false,
      staticId: ''
    },
    ws: {
      enabled: false,
      port: 8546
    },
    checkpointSync: {
      enabled: false,
      url: '',
      block: '',
      state: '',
      ignoreWeakSubjectivityPeriod: false,
      force: false,
      wss: "block_root:epoch"
    },
    genesisSync: {
      enabled: false,
      url: '',
      state: ''
    },
    logging: {
      enabled: false,
      console: {
        enabled: false,
        level: 'info',
        format: 'json',
        color: false
      },
      file: {
        enabled: false,
        level: 'info',
        format: 'json',
        directory: '',
        name: '',
        fullPath: '{consensus.logging.file.directory}/{consensus.logging.file.name}'
      }
    }
  },
  validator: {
    isExternal: true,
    client: {
      name: 'prysm',
      version: ''
    },
    enabled: false,
    dataDir: '{common.dataDir}/{common.network.name}/{validator.client.name}',
    beaconNodes: ['http://localhost:5052'],
    suggestFeeRecipientAddress: '0x0000000000000000000000000000000000000000',
    metrics: {
      enabled: false,
      port: 8080,
      address: 'localhost'
    },
    graffiti: {
      enabled: false,
      file: "graffiti.log",
      message: 'test'
    },
    logging: {
      enabled: false,
      console: {
        enabled: false,
        level: 'info',
        format: 'json',
        color: false
      },
      file: {
        enabled: false,
        level: 'info',
        format: 'json',
        directory: '',
        name: '',
        fullPath: '{validator.logging.file.directory}/{validator.logging.file.name}'
      }
    },
    proposerConfig: {
      enabled: false,
      file: '',
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
    logging: {
      enabled: false,
      console: {
        enabled: false,
        level: 'info',
        format: 'json',
        color: false
      },
      file: {
        enabled: false,
        level: 'info',
        format: 'json',
        directory: '',
        name: '',
        fullPath: '{execution.logging.file.directory}/{execution.logging.file.name}'
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
      port: 9000,
      bootnodes: [],
      allowlist: ['localhost'],
      netrestrict: [],
      discovery: {
        enabled: false,
        port: 30303,
        v4: {
          enabled: false,
        },
        v5: {
          enabled: false,
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
    }
  }
}; 