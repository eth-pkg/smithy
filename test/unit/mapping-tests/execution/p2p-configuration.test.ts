import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName } from '@/lib/types';
import { testConfig } from '../../preset-tests/network-preset.test-helper';
import SchemaUtils from '@/utils/schema';

describe('Execution Client P2P Configuration Tests', () => {
  let registry: CommandClientRegistry;
  const schemaUtils = new SchemaUtils('');
  const executionClients: ExecutionClientName[] = [
    'besu',
    'erigon',
    'geth',
    'nethermind',
    'reth'
  ];

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  executionClients.forEach(client => {
    it(`should correctly configure P2P for ${client}`, () => {
      const config = schemaUtils.deepMerge(testConfig, {
        execution: {
          client: {
            name: client,
            version: ''
          },
          p2p: {
            enabled: true,
            port: 30303,
            port6: 30303,
            maxPeers: 50,
            bootnodes: ['enode://...'],
            enrAddress: '127.0.0.1',
            allowlist: ['*'],
            denylist: [],
            address: '127.0.0.1',
            discovery: {
              enabled: true,
              port: 30303,
              v4: {
                enabled: true,
                port: 30303,
                address: '127.0.0.1'
              },
              v5: {
                enabled: true,
                port: 30303,
                address: '127.0.0.1'
              },
              dns: {
                enabled: true,
                url: 'enrtree://AKA3AM6LPBYEUDMV4Y75YK5TMM6WWZPDLD5ZBTLNGR3KHANX6DPW@all.node.ethdisco.net'
              }
            },
            nat: {
              enabled: true,
              port: 30303,
              method: 'upnp'
            }
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();
      const allowlistString = config.execution.p2p.allowlist.join(',');
      const bootnodesString = config.execution.p2p.bootnodes.join(',');
      const disv4String = config.execution.p2p.discovery.v4.address;
      const disv5String = config.execution.p2p.discovery.v5.address;
      const portString = config.execution.p2p.port;
      const dnsDiscoveryString = config.execution.p2p.discovery.dns.url;
      const port6String = config.execution.p2p.port6;
      const maxPeersString = config.execution.p2p.maxPeers;
      const natString = config.execution.p2p.nat.method;
      const addressString = config.execution.p2p.address;

      switch (client) {
        case 'besu':
          expect(scriptString).to.contain(`--p2p-port=${portString}`);
          expect(scriptString).to.contain(`--max-peers=${maxPeersString}`);
          expect(scriptString).to.contain(`--bootnodes=${bootnodesString}`);
          expect(scriptString).to.contain(`--nat-method=${natString}`);
          expect(scriptString).to.contain(`--p2p-host=${addressString}`);
          break;
        case 'erigon':
          expect(scriptString).to.contain(`--port ${portString}`);
          expect(scriptString).to.contain(`--maxpeers ${maxPeersString}`);
          expect(scriptString).to.contain(`--bootnodes ${bootnodesString}`);
          expect(scriptString).to.contain(`--nat ${natString}`);
          expect(scriptString).to.contain(`--caplin.discovery.addr ${addressString}`);
          expect(scriptString).to.contain(`--caplin.discovery.port ${portString}`);
          expect(scriptString).to.contain(`--v5disc`);
          expect(scriptString).to.not.contain(`--nodiscover`);
          break;
        case 'geth':
          expect(scriptString).to.contain(`--port ${portString}`);
          expect(scriptString).to.contain(`--maxpeers ${maxPeersString}`);
          expect(scriptString).to.contain(`--nat ${natString}`);
          expect(scriptString).to.contain(`--bootnodes ${bootnodesString}`);
          expect(scriptString).to.contain(`--discovery.dns ${dnsDiscoveryString}`);
          expect(scriptString).to.contain(`--discovery.port ${portString}`);
          expect(scriptString).not.to.contain(`--nodiscover`);
          expect(scriptString).to.contain(`--discovery.v4`);
          expect(scriptString).to.contain(`--discovery.v5`);
          break;
        case 'nethermind':
          expect(scriptString).to.contain(`--Network.P2PPort ${portString}`);
          expect(scriptString).to.contain(`--Network.MaxActivePeers ${maxPeersString}`);
          expect(scriptString).to.contain(`--Init.DiscoveryEnabled`);
          expect(scriptString).to.contain(`--Network.Bootnodes ${bootnodesString}`);
          expect(scriptString).to.contain(`--Network.DiscoveryPort ${portString}`);
          expect(scriptString).to.contain(`--Network.DiscoveryDns ${dnsDiscoveryString}`);
          break;
        case 'reth':
          expect(scriptString).to.contain(`--port ${portString}`);
          expect(scriptString).to.contain(`--addr ${addressString}`);
          expect(scriptString).to.contain(`--discovery.port ${config.execution.p2p.discovery.v4.port}`);
          expect(scriptString).to.contain(`--discovery.addr ${config.execution.p2p.discovery.v4.address}`);
          expect(scriptString).to.contain(`--discovery.v5.port ${config.execution.p2p.discovery.v5.port}`);
          expect(scriptString).to.contain(`--discovery.v5.addr ${config.execution.p2p.discovery.v5.address}`);
          expect(scriptString).to.contain(`--bootnodes ${bootnodesString}`);
          expect(scriptString).to.contain(`--nat ${natString}`);
          expect(scriptString).to.not.contain(`--disable-discovery`);
          expect(scriptString).to.not.contain(`--disable-discv4-discovery`);
          expect(scriptString).to.not.contain(`--disable-dns-discovery`);
          expect(scriptString).to.not.contain(`--disable-nat`);
          break;
      }
    });
  });
}); 