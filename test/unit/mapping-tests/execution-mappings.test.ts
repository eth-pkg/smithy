import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName } from '@/lib/types';
import { testConfig } from '../preset-tests/network-preset.test-helper';
import SchemaUtils from '@/utils/schema';

describe('Execution Client Configuration Tests', () => {
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

  describe('HTTP Configuration', () => {
    executionClients.forEach(client => {
      it(`should correctly configure HTTP API for ${client}`, () => {
        const config = schemaUtils.deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            http: {
              enabled: true,
              port: 8545,
              modules: ['eth', 'net', 'web3'],
              allowlist: ['*'],
              address: 'localhost',
              tls: {
                enabled: false,
                cert: '',
                key: ''
              }
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const apiString = config.execution.http.modules.join(',');
        const allowlistString = config.execution.http.allowlist.join(',');
        const addressString = config.execution.http.address;
        const portString = config.execution.http.port;

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--rpc-http-enabled');
            expect(scriptString).to.contain(`--rpc-http-port=${portString}`);
            expect(scriptString).to.contain(`--rpc-http-api="${apiString}"`);
            expect(scriptString).to.contain(`--rpc-http-host=${addressString}`);
            expect(scriptString).to.contain(`--rpc-http-cors-origins="${allowlistString}"`);
            expect(scriptString).to.not.contain(`--rpc-http-tls-enabled`);
            expect(scriptString).to.not.contain(`--rpc-http-tls-cert`);
            expect(scriptString).to.not.contain(`--rpc-http-tls-key`);
            break;
          case 'erigon':
            expect(scriptString).to.contain('--http');
            expect(scriptString).to.contain(`--http.port ${portString}`);
            expect(scriptString).to.contain(`--http.api "${apiString}"`);
            expect(scriptString).to.contain(`--http.addr ${addressString}`);
            expect(scriptString).to.contain(`--http.corsdomain "${allowlistString}"`);
            expect(scriptString).to.not.contain(`--http.tls`);
            break;
          case 'geth':
            expect(scriptString).to.contain('--http');
            expect(scriptString).to.contain(`--http.port ${portString}`);
            expect(scriptString).to.contain(`--http.api "${apiString}"`);
            expect(scriptString).to.contain(`--http.addr ${addressString}`);
            expect(scriptString).to.contain(`--http.corsdomain "${allowlistString}"`);
            expect(scriptString).to.not.contain(`--http.tls`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--JsonRpc.Enabled');
            expect(scriptString).to.contain(`--JsonRpc.Port ${portString}`);
            expect(scriptString).to.contain(`--JsonRpc.EnabledModules "${apiString}"`);
            expect(scriptString).to.contain(`--JsonRpc.Host ${addressString}`);
            expect(scriptString).to.contain(`--JsonRpc.CorsOrigins "${allowlistString}"`);
            break;
          case 'reth':
            expect(scriptString).to.contain('--http');
            expect(scriptString).to.contain(`--http.port ${portString}`);
            expect(scriptString).to.contain(`--http.api "${apiString}"`);
            expect(scriptString).to.contain(`--http.addr ${addressString}`);
            expect(scriptString).to.contain(`--http.corsdomain "${allowlistString}"`);
            // there is no tls config for reth
            expect(scriptString).to.not.contain(`--http.tls`);
            break;
        }
      });
    });
  });

  describe('Metrics Configuration', () => {
    executionClients.forEach(client => {
      it(`should correctly configure metrics for ${client}`, () => {
        const config = schemaUtils.deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            metrics: {
              enabled: true,
              port: 6060
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--metrics-enabled');
            expect(scriptString).to.contain(`--metrics-port=${config.execution.metrics.port}`);
            break;
          case 'erigon':
            expect(scriptString).to.contain('--metrics');
            expect(scriptString).to.contain(`--metrics.port ${config.execution.metrics.port}`);
            break;
          case 'geth':
            expect(scriptString).to.contain('--metrics');
            expect(scriptString).to.contain(`--metrics.port ${config.execution.metrics.port}`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--Metrics.Enabled');
            expect(scriptString).to.contain(`--Metrics.ExposePort ${config.execution.metrics.port}`);
            break;
          case 'reth':
            expect(scriptString).to.contain('--metrics');
            expect(scriptString).to.not.contain(`--metrics.port ${config.execution.metrics.port}`);
            break;
        }
      });
    });
  });

  describe.skip('P2P Configuration', () => {
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
              dnsDiscovery: true,
              address: '127.0.0.1',
              disv4: {
                enabled: true,
                port: 30303,
                address: '127.0.0.1'
              },
              disv5: {
                enabled: true,
                port: 30303,
                address: '127.0.0.1'
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
        const disv4String = config.execution.p2p.disv4.address;
        const disv5String = config.execution.p2p.disv5.address;
        const portString = config.execution.p2p.port;
        const port6String = config.execution.p2p.port6;
        const maxPeersString = config.execution.p2p.maxPeers;
        const natString = config.execution.p2p.nat.method;
        const addressString = config.execution.p2p.address;
        const apiString = config.execution.http.modules.join(',');

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain("--rpc-http-enabled");
            expect(scriptString).to.contain(`--rpc-http-port=${portString}`);
            expect(scriptString).to.contain(`--rpc-http-api="${apiString}"`);
            expect(scriptString).to.contain(`--rpc-http-host=${addressString}`);
            expect(scriptString).to.contain(`--rpc-http-cors-origins=${allowlistString}*`);
            expect(scriptString).to.contain(`--p2p-port=${portString}`);
            expect(scriptString).to.contain(`--max-peers=${maxPeersString}`);
            expect(scriptString).to.contain(`--bootnodes=${bootnodesString}`);
            break;
          case 'erigon':
            expect(scriptString).to.contain(`--p2p.port ${portString}`);
            expect(scriptString).to.contain(`--p2p.maxpeers ${maxPeersString}`);
            expect(scriptString).to.contain(`--p2p.bootnodes ${bootnodesString}`);
            break;
          case 'geth':
            expect(scriptString).to.contain(`--p2p.port ${portString}`);
            expect(scriptString).to.contain(`--p2p.maxpeers ${maxPeersString}`);
            expect(scriptString).to.contain(`--p2p.bootnodes ${bootnodesString}`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--P2P.Port ${portString}`);
            expect(scriptString).to.contain(`--P2P.MaxPeers ${maxPeersString}`);
            expect(scriptString).to.contain(`--P2P.Bootnodes ${bootnodesString}`);
            break;
          case 'reth':
            expect(scriptString).to.contain(`--port ${portString}`);
            expect(scriptString).to.contain(`--addr ${addressString}`);
            expect(scriptString).to.contain(`--discovery.port ${disv4String}`);
            expect(scriptString).to.contain(`--discovery.addr ${disv4String}`);
            expect(scriptString).to.contain(`--discovery.v5.port ${disv5String}`);
            expect(scriptString).to.contain(`--discovery.v5.addr ${disv5String}`);
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

  describe('WebSocket Configuration', () => {
    executionClients.forEach(client => {
      it(`should correctly configure WebSocket for ${client}`, () => {
        const config = schemaUtils.deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            ws: {
              enabled: true,
              port: 8546
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--rpc-ws-enabled');
            expect(scriptString).to.contain(`--rpc-ws-port=${config.execution.ws.port}`);
            break;
          case 'erigon':
            expect(scriptString).to.contain('--ws');
            expect(scriptString).to.contain(`--ws.port ${config.execution.ws.port}`);
            break;
          case 'geth':
            expect(scriptString).to.contain('--ws');
            expect(scriptString).to.contain(`--ws.port ${config.execution.ws.port}`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--Init.WebSocketsEnabled');
            expect(scriptString).to.contain(`--JsonRpc.WebSocketsPort ${config.execution.ws.port}`);
            break;
          case 'reth':
            expect(scriptString).to.contain('--ws');
            expect(scriptString).to.contain(`--ws.port ${config.execution.ws.port}`);
            break;
        }
      });
    });
  });

  // describe('Logging Configuration', () => {
  //  describe('Transaction Pool Configuration', () => {


}); 