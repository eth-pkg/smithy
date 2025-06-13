import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ConsensusClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import SchemaUtils from '@/utils/schema';

describe('Consensus Client P2P Configuration Tests', () => {
  let registry: CommandClientRegistry;
  const schemaUtils = new SchemaUtils('');
  const consensusClients: ConsensusClientName[] = [
    'lighthouse',
    "lodestar",
    'nimbus-eth2',
    'prysm',
    'teku',
  ];

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  consensusClients.forEach(client => {
    describe(`${client} p2p configuration`, () => {

      it('should include listenaddress when p2p is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: true,
              listenAddress: '127.0.0.1',
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const listenAddress = config.consensus.p2p.listenAddress;
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain(`--listen-address ${listenAddress}`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--listenAddress ${listenAddress}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain(`--listen-address ${listenAddress}`);
            break;
          case 'prysm':
            // TODO: check if this is correct
            expect(scriptString).to.contain(`--p2p-local-ip ${listenAddress}`);
            break;
          case 'teku':
            expect(scriptString).to.contain(`--p2p-interface=${listenAddress}`);
            break;
        }
      });

      it('should not include listenaddress when p2p is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: false,
              listenAddress: '127.0.0.1',
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const listenAddress = config.consensus.p2p.listenAddress;
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.contain(`--listen-address ${listenAddress}`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.contain(`--listenAddress ${listenAddress}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.contain(`--listen-address ${listenAddress}`);
            break;
          case 'prysm':
            // TODO: check if this is correct
            expect(scriptString).to.not.contain(`--p2p-local-ip ${listenAddress}`);
            break;
          case 'teku':
            expect(scriptString).to.not.contain(`--p2p-interface=${listenAddress}`);
            break;
        }
      });
      it('should include port when p2p is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: true,
              port: 9000,
              port6: 9001,
              quicPort: 9002,
              quicPort6: 9003,
              discoveryPort: 9004,
              discoveryPort6: 9005,
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const port = config.consensus.p2p.port;
        const port6 = config.consensus.p2p.port6;
        const quicPort = config.consensus.p2p.quicPort;
        const quicPort6 = config.consensus.p2p.quicPort6;
        const discoveryPort = config.consensus.p2p.discoveryPort;
        const discoveryPort6 = config.consensus.p2p.discoveryPort6;
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain(`--port ${port}`); // both udp and tcp
            expect(scriptString).to.contain(`--port6 ${port6}`);
            expect(scriptString).to.contain(`--discovery-port ${discoveryPort}`);
            expect(scriptString).to.contain(`--discovery-port6 ${discoveryPort6}`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--port ${port}`); // both udp and tcp
            expect(scriptString).to.contain(`--port6 ${port6}`);
            expect(scriptString).to.contain(`--discoveryPort ${discoveryPort}`);
            expect(scriptString).to.contain(`--discoveryPort6 ${discoveryPort6}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain(`--tcp-port ${port}`);
            expect(scriptString).to.contain(`--udp-port ${discoveryPort}`);
            // TODO: check if nimbus supports discovery port6
            // expect(scriptString).to.contain(`--udp-port6 ${discoveryPort6}`);
            break;
          case 'prysm':
            expect(scriptString).to.contain(`--p2p-tcp-port ${port}`);
            expect(scriptString).to.contain(`--p2p-udp-port ${discoveryPort}`);
            // TODO: check if prysm supports discovery port6
            // expect(scriptString).to.contain(`--p2p-udp-port6 ${discoveryPort6}`);
            break;
          case 'teku':
            expect(scriptString).to.contain(`--p2p-port=${port}`);
            expect(scriptString).to.contain(`--p2p-port-ipv6=${port6}`);
            expect(scriptString).to.contain(`--p2p-udp-port=${discoveryPort}`);
            expect(scriptString).to.contain(`--p2p-udp-port-ipv6=${discoveryPort6}`);
            break;
        }
      });

      it('should not include port when p2p is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: false,
              port: 9000,
              port6: 9001,
              quicPort: 9002,
              quicPort6: 9003,
              discoveryPort: 9004,
              discoveryPort6: 9005,
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const port = config.consensus.p2p.port;
        const port6 = config.consensus.p2p.port6;
        const quicPort = config.consensus.p2p.quicPort;
        const quicPort6 = config.consensus.p2p.quicPort6;
        const discoveryPort = config.consensus.p2p.discoveryPort;
        const discoveryPort6 = config.consensus.p2p.discoveryPort6;
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.contain(`--port ${port}`); // both udp and tcp
            expect(scriptString).to.not.contain(`--port6 ${port6}`);
            expect(scriptString).to.not.contain(`--discovery-port ${discoveryPort}`);
            expect(scriptString).to.not.contain(`--discovery-port6 ${discoveryPort6}`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.contain(`--port ${port}`); // both udp and tcp
            expect(scriptString).to.not.contain(`--port6 ${port6}`);
            expect(scriptString).to.not.contain(`--discoveryPort ${discoveryPort}`);
            expect(scriptString).to.not.contain(`--discoveryPort6 ${discoveryPort6}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.contain(`--tcp-port ${port}`);
            expect(scriptString).to.not.contain(`--udp-port ${discoveryPort}`);
            break;
          case 'prysm':
            expect(scriptString).to.not.contain(`--p2p-tcp-port ${port}`);
            expect(scriptString).to.not.contain(`--p2p-udp-port ${discoveryPort}`);
            break;
          case 'teku':
            expect(scriptString).to.not.contain(`--p2p-port=${port}`);
            expect(scriptString).to.not.contain(`--p2p-port-ipv6=${port6}`);
            expect(scriptString).to.not.contain(`--p2p-udp-port=${discoveryPort}`);
            expect(scriptString).to.not.contain(`--p2p-udp-port-ipv6=${discoveryPort6}`);
            break;
        }
      });

      it('should include bootnodes when p2p is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: true,
              bootnodes: ['127.0.0.1:9000'],
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const bootnodes = config.consensus.p2p.bootnodes;
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain(`--boot-nodes ${bootnodes}`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--bootnodes ${bootnodes}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain(`--boot-nodes ${bootnodes}`);
            break;
          case 'prysm':
            expect(scriptString).to.contain(`--bootstrap-node ${bootnodes}`);
            break;
          case 'teku':
            expect(scriptString).to.contain(`--p2p-discovery-bootnodes=${bootnodes}`);
            break;
        }
      });

      it('should include bootnodes when p2p is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: false,
              bootnodes: ['127.0.0.1:9000'],
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const bootnodes = config.consensus.p2p.bootnodes;
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.contain(`--boot-nodes ${bootnodes}`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.contain(`--bootnodes ${bootnodes}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.contain(`--boot-nodes ${bootnodes}`);
            break;
          case 'prysm':
            expect(scriptString).to.not.contain(`--bootstrap-node ${bootnodes}`);
            break;
          case 'teku':
            expect(scriptString).to.not.contain(`--p2p-discovery-bootnodes=${bootnodes}`);
            break;
        }
      });

      it('should include peer settings when p2p is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: true,
              staticPeers: ['127.0.0.1:9000'],
              trustedPeers: ['127.0.0.1:9000'],
              targetPeers: 160,
              maxPeers: 160,
              trustedSetupFile: "/tmp/dummy/trusted_setup.txt",
              nodiscover: false,

            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const staticPeers = config.consensus.p2p.staticPeers.join(',');
        const targetPeers = config.consensus.p2p.targetPeers;
        const trustedPeers = config.consensus.p2p.trustedPeers.join(',');
        const maxPeers = config.consensus.p2p.maxPeers;
        const trustedSetupFile = config.consensus.p2p.trustedSetupFile;
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain(`--target-peers ${targetPeers}`);
            expect(scriptString).to.contain(`--trusted-peers "${trustedPeers}"`);
            // TODO: there is no maxpeers
            // expect(scriptString).to.contain(`--max-peers ${maxPeers}`);
            // TODO: check if this is actually staticpeers
            expect(scriptString).to.contain(`--libp2p-addresses "${staticPeers}"`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--targetPeers ${targetPeers}`);
            // expect(scriptString).to.contain(`--staticpeers "${staticPeers}"`);
            // expect(scriptString).to.contain(`--maxpeers ${maxPeers}`);
            // expect(scriptString).to.contain(`--trustedpeers "${trustedPeers}"`);
            // expect(scriptString).to.contain(`--trusted-setup-file ${trustedSetupFile}`);
            // expect(scriptString).to.not.contain(`--no-discover`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain(`--direct-peers ${trustedPeers}`);
            expect(scriptString).to.contain(`--max-peers ${targetPeers}`);

            // TODO: check if there is a flag for trusted-setup-file
            // expect(scriptString).to.contain(`--trusted-setup-file ${trustedSetupFile}`);
            // TODO: check if this is actually staticpeers
            // expect(scriptString).to.contain(`--static-peers ${staticPeers}`);
            break;
          case 'prysm':
            expect(scriptString).to.contain(`--p2p-max-peers ${maxPeers}`);
            expect(scriptString).to.contain(`--peer "${trustedPeers}"`);
            // could not find static-peers
            // TODO: could not find target
            // TODO could not find trusted-setup-file
            break;
          case 'teku':
            expect(scriptString).to.contain(`--p2p-peer-upper-bound=${maxPeers}`);
            expect(scriptString).to.contain(`--p2p-static-peers="${staticPeers}"`);
            // TODO: could not find trusted-peers
            // expect(scriptString).to.contain(`--p2p-trusted-peers=${trustedPeers}`);
            // TODO: could not find trusted-setup-file
            // expect(scriptString).to.contain(`--p2p-trusted-setup-file=${trustedSetupFile}`);
            break;
        }
      });

      it('should not include peer settings when p2p is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: false,
              staticPeers: ['127.0.0.1:9000'],
              trustedPeers: ['127.0.0.1:9000'],
              targetPeers: 160,
              maxPeers: 160,
              trustedSetupFile: "/tmp/dummy/trusted_setup.txt",
              nodiscover: false,

            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const staticPeers = config.consensus.p2p.staticPeers.join(',');
        const targetPeers = config.consensus.p2p.targetPeers;
        const trustedPeers = config.consensus.p2p.trustedPeers.join(',');
        const maxPeers = config.consensus.p2p.maxPeers;
        const trustedSetupFile = config.consensus.p2p.trustedSetupFile;
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.contain(`--target-peers ${targetPeers}`);
            expect(scriptString).to.not.contain(`--trusted-peers "${trustedPeers}"`);
            expect(scriptString).to.not.contain(`--libp2p-addresses "${staticPeers}"`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.contain(`--staticpeers "${staticPeers}"`);
            expect(scriptString).to.not.contain(`--maxpeers ${maxPeers}`);
            expect(scriptString).to.not.contain(`--trustedpeers "${trustedPeers}"`);
            expect(scriptString).to.not.contain(`--trusted-setup-file ${trustedSetupFile}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.contain(`--direct-peers ${trustedPeers}`);
            expect(scriptString).to.not.contain(`--max-peers ${targetPeers}`);
            break;
          case 'prysm':
            expect(scriptString).to.not.contain(`--p2p-max-peers ${maxPeers}`);
            expect(scriptString).to.not.contain(`--peer "${trustedPeers}"`);
            break;
          case 'teku':
            expect(scriptString).to.not.contain(`--p2p-peer-upper-bound=${maxPeers}`);
            expect(scriptString).to.not.contain(`--p2p-static-peers="${staticPeers}"`);
            break;
        }
      });


      // TODO: check if this is correct
      it.skip('should handle nodiscover setting when p2p is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: true,
              nodiscover: true
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'lighthouse':
            // TODO: not sure if this is correct 
            expect(scriptString).to.not.contain(`--disable-enr-auto-update`);
            break;
          case 'lodestar':
            // TODO: could not find a way to disable discovery
            expect(scriptString).to.contain(`--nodiscover`);
            expect(scriptString).to.contain(`--discv5`);
            break;
          case 'nimbus-eth2':
            // TODO: could not find a way to disable discovery
            expect(scriptString).to.contain(`--enr-auto-update`);
            expect(scriptString).to.contain(`--discv5`);
            break;
          case 'prysm':
            expect(scriptString).to.not.contain(`--no-discovery`);
            break;
          case 'teku':
            // enables discv5 
            expect(scriptString).to.contain(`--p2p-discovery-enabled`);
            break;
        }
      });

      it('should handle localPeerDiscovery setting when p2p is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: true,
              localPeerDiscovery: true
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain(`--enable-private-discovery`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--mdns`);
            break;
          case 'nimbus-eth2':
            // TODO: could not find a way to enable local discovery
            // expect(scriptString).to.contain(`--local-discovery`);
            break;
          case 'prysm':
            // TODO: could not find a way to enable local discovery
            // expect(scriptString).to.contain(`--local-discovery`);
            break;
          case 'teku':
            expect(scriptString).to.contain(`--p2p-discovery-site-local-addresses-enabled`);
            break;
        }
      });

      it('should not contain localPeerDiscovery setting when p2p is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: false,
              localPeerDiscovery: true
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.contain(`--enable-private-discovery`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.contain(`--mdns`);
            break;
          case 'nimbus-eth2':
            // TODO: could not find a way to enable local discovery
            // expect(scriptString).to.contain(`--local-discovery`);
            break;
          case 'prysm':
            // TODO: could not find a way to enable local discovery
            // expect(scriptString).to.contain(`--local-discovery`);
            break;
          case 'teku':
            expect(scriptString).to.not.contain(`--p2p-discovery-site-local-addresses-enabled`);
            break;
        }
      });

      it('should handle subscribeAllSubnets setting when p2p is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: true,
              subscribeAllSubnets: true
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain(`--subscribe-all-subnets`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--subscribeAllSubnets`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain(`--subscribe-all-subnets`);
            break;
          case 'prysm':
            expect(scriptString).to.contain(`--subscribe-all-subnets`);
            break;
          case 'teku':
            expect(scriptString).to.contain(`--p2p-subscribe-all-subnets-enabled`);
            break;
        }
      });

      it('should handle subscribeAllSubnets setting when p2p is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: false,
              subscribeAllSubnets: true
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.contain(`--subscribe-all-subnets`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.contain(`--subscribeAllSubnets`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.contain(`--subscribe-all-subnets`);
            break;
          case 'prysm':
            expect(scriptString).to.not.contain(`--subscribe-all-subnets`);
            break;
          case 'teku':
            expect(scriptString).to.not.contain(`--p2p-subscribe-all-subnets-enabled`);
            break;
        }
      });


      it('should handle nat setting when p2p is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: true,
              upnp: true
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.contain(`--disable-upnp`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--nat upnp`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain(`--nat upnp`);
            break;
          case 'prysm':
            expect(scriptString).to.contain(`--enable-upnp`);
            break;
          case 'teku':
            expect(scriptString).to.contain(`--p2p-nat-method=upnp`);
            break;
        }
      });


      it('should handle nat setting when p2p is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: false,
              upnp: true
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.contain(`--disable-upnp`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.contain(`--nat upnp`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.contain(`--nat upnp`);
            break;
          case 'prysm':
            expect(scriptString).to.not.contain(`--enable-upnp`);
            break;
          case 'teku':
            expect(scriptString).to.not.contain(`--p2p-nat-method=upnp`);
            break;
        }
      });

      it('should handle staticId setting when p2p is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: true,
              staticId: "dummy-static-id"
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const staticId = config.consensus.p2p.staticId;


        switch (client) {
          case 'lighthouse':
            // Lighthouse doesn't have a direct way to set static ID
            // expect(scriptString).to.contain(`--static-id ${staticId}`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--persistNetworkIdentity ${staticId}`);
            break;
          case 'nimbus-eth2':
            // Nimbus doesn't have a direct way to set static ID
            // Not sure if this is correct
            expect(scriptString).to.contain(`--agent-string ${staticId}`);
            break;
          case 'prysm':
            expect(scriptString).to.contain(`--p2p-static-id ${staticId}`);
            break;
          case 'teku':
            // Teku doesn't have a direct way to set static ID
            // could not find a way to set static id
            // expect(scriptString).to.not.contain(`--p2p-static-id`);
            break;
        }
      });

      it('should not handle staticId setting when p2p is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            p2p: {
              enabled: false,
              staticId: "dummy-static-id"
            }
          }
        });
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const staticId = config.consensus.p2p.staticId;


        switch (client) {
          case 'lighthouse':
            break;
          case 'lodestar':
            expect(scriptString).to.not.contain(`--persistNetworkIdentity ${staticId}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.contain(`--agent-string ${staticId}`);
            break;
          case 'prysm':
            expect(scriptString).to.not.contain(`--p2p-static-id ${staticId}`);
            break;
          case 'teku':
            break;
        }
      });
    });
  });
}); 