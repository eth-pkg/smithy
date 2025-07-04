import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import SchemaUtils from '@/nodeconfig/schema';

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

  const createTestConfig = (p2pConfig: any) => {
    return schemaUtils.deepMerge(testConfig, {
      execution: {
        client: {
          name: '',
          version: ''
        },
        p2p: p2pConfig
      }
    });
  };

  describe('P2P flags when disabled', () => {
    executionClients.forEach(client => {
      it(`should not include P2P flags when disabled for ${client}`, () => {
        const config = createTestConfig({
          enabled: false
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.not.contain('--p2p-port');
            expect(scriptString).to.not.contain('--max-peers');
            expect(scriptString).to.not.contain('--bootnodes');
            expect(scriptString).to.not.contain('--nat-method');
            expect(scriptString).to.not.contain('--p2p-host');
            break;
          case 'erigon':
            expect(scriptString).to.not.contain('--port');
            expect(scriptString).to.not.contain('--maxpeers');
            expect(scriptString).to.not.contain('--bootnodes');
            expect(scriptString).to.not.contain('--nat');
            expect(scriptString).to.not.contain('--caplin.discovery');
            break;
          case 'geth':
            expect(scriptString).to.not.contain('--port');
            expect(scriptString).to.not.contain('--maxpeers');
            expect(scriptString).to.not.contain('--nat');
            expect(scriptString).to.not.contain('--bootnodes');
            expect(scriptString).to.not.contain('--discovery');
            break;
          case 'nethermind':
            expect(scriptString).to.not.contain('--Network.P2P');
            expect(scriptString).to.not.contain('--Network.MaxActivePeers');
            expect(scriptString).to.not.contain('--Init.DiscoveryEnabled');
            expect(scriptString).to.not.contain('--Network.Bootnodes');
            expect(scriptString).to.not.contain('--Network.Discovery');
            break;
          case 'reth':
            expect(scriptString).to.not.contain('--port');
            expect(scriptString).to.not.contain('--addr');
            expect(scriptString).to.not.contain('--discovery');
            expect(scriptString).to.not.contain('--bootnodes');
            expect(scriptString).to.not.contain('--nat');
            break;
        }
      });
    });
  });

  describe('Port configuration', () => {
    executionClients.forEach(client => {
      it(`should configure port correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          port: 30303
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--p2p-port=30303');
            break;
          case 'erigon':
          case 'geth':
          case 'reth':
            expect(scriptString).to.contain('--port 30303');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--Network.P2PPort 30303');
            break;
        }
      });
    });
  });

  describe('Max peers configuration', () => {
    executionClients.forEach(client => {
      it(`should configure max peers correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          maxPeers: 50
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--max-peers=50');
            break;
          case 'erigon':
          case 'geth':
            expect(scriptString).to.contain('--maxpeers 50');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--Network.MaxActivePeers 50');
            break;
          case 'reth':
            // TODO: command line flag is not present in the Reth command mappings
            // there is a config option though (according to LLM)
            // Reth doesn't have a direct max peers flag
            break;
        }
      });
    });
  });

  describe('Bootnodes configuration', () => {
    executionClients.forEach(client => {
      it(`should configure bootnodes correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          bootnodes: ['enode://...']
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const bootnodesString = config.execution.p2p.bootnodes.join(',');

        // TODO: check how clients handle the bootnodes flag
        // check if it's a list or a string
        // if it's needs multiple flags or a single flag with multiple values
        switch (client) {
          case 'besu':
            expect(scriptString).to.contain(`--bootnodes=${bootnodesString}`);
            break;
          case 'erigon':
          case 'geth':
          case 'reth':
            expect(scriptString).to.contain(`--bootnodes ${bootnodesString}`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--Network.Bootnodes ${bootnodesString}`);
            break;
        }
      });
    });
  });

  describe('Discovery enabled configuration', () => {
    executionClients.forEach(client => {
      it(`should configure discovery enabled correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          discovery: {
            enabled: true
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'erigon':
            expect(scriptString).to.not.contain('--nodiscover');
            break;
          case 'geth':
            expect(scriptString).to.not.contain('--nodiscover');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--Init.DiscoveryEnabled true');
            break;
          case 'reth':
            expect(scriptString).to.not.contain('--disable-discovery');
            break;
          case 'besu':
            expect(scriptString).to.contain('--discovery-enabled=true');
            break;
        }
      });

      it(`should configure discovery disabled correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          discovery: {
            enabled: false
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'erigon':
            expect(scriptString).to.contain('--nodiscover');
            break;
          case 'geth':
            expect(scriptString).to.contain('--nodiscover');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--Init.DiscoveryEnabled false');
            break;
          case 'reth':
            expect(scriptString).to.contain('--disable-discovery');
            break;
          case 'besu':
            expect(scriptString).to.contain('--discovery-enabled=false');
            break;
        }
      });
    });
  });

  describe.skip('Discovery v4 configuration', () => {
    // TODO: discovery top level config and discovery v4 config are not clear 
    // need to think how to map this correctly
    executionClients.forEach(client => {
      it(`should enable discovery v4 correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          discovery: {
            v4: {
              enabled: true
            }
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'erigon':
            expect(scriptString).to.not.contain('--caplin.discovery false');
            break;
          case 'geth':
            expect(scriptString).to.contain('--discovery.v4');
            break;
          case 'nethermind':
            expect(scriptString).to.not.contain('--Network.Discovery false');
            break;
          case 'reth':
            expect(scriptString).to.not.contain('--disable-discv4-discovery');
            break;
          case 'besu':
            // Besu doesn't have specific v4 discovery flags
            break;
        }
      });

      it(`should disable discovery v4 correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          discovery: {
            v4: {
              enabled: false
            }
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'erigon':
            expect(scriptString).to.contain('--caplin.discovery false');
            break;
          case 'geth':
            expect(scriptString).to.not.contain('--discovery.v4');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--Network.Discovery false');
            break;
          case 'reth':
            expect(scriptString).to.contain('--disable-discv4-discovery');
            break;
          case 'besu':
            // Besu doesn't have specific v4 discovery flags
            break;
        }
      });

      it(`should configure discovery v4 port correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          discovery: {
            v4: {
              enabled: true,
              port: 30303
            }
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'erigon':
            expect(scriptString).to.contain('--caplin.discovery.port 30303');
            break;
          case 'geth':
            expect(scriptString).to.contain('--discovery.v4');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--Network.DiscoveryPort 30303');
            break;
          case 'reth':
            expect(scriptString).to.contain('--discovery.port 30303');
            break;
          case 'besu':
            // Besu doesn't have specific v4 discovery flags
            break;
        }
      });

      it(`should configure discovery v4 address correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          discovery: {
            v4: {
              enabled: true,
              address: '127.0.0.1'
            }
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'erigon':
            expect(scriptString).to.contain('--caplin.discovery.addr 127.0.0.1');
            break;
          case 'geth':
            expect(scriptString).to.contain('--discovery.v4');
            break;
          case 'nethermind':
            expect(scriptString).to.not.contain('--Network.DiscoveryPort');
            break;
          case 'reth':
            expect(scriptString).to.contain('--discovery.addr 127.0.0.1');
            break;
          case 'besu':
            // Besu doesn't have specific v4 discovery flags
            break;
        }
      });
    });
  });

  describe('Discovery v5 configuration', () => {
    executionClients.forEach(client => {
      it(`should enable discovery v5 correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          discovery: {
            v5: {
              enabled: true
            }
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'erigon':
            expect(scriptString).to.contain('--v5disc');
            break;
          case 'geth':
            expect(scriptString).to.contain('--discovery.v5');
            break;
          case 'reth':
            expect(scriptString).to.contain('--enable-discv5-discovery');
            break;
          case 'besu':
          case 'nethermind':
            // Besu and Nethermind don't have specific v5 discovery flags
            break;
        }
      });

      it(`should disable discovery v5 correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          discovery: {
            v5: {
              enabled: false
            }
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'erigon':
            expect(scriptString).to.not.contain('--v5disc');
            break;
          case 'geth':
            expect(scriptString).to.not.contain('--discovery.v5');
            break;
          case 'reth':
            expect(scriptString).to.not.contain('--enable-discv5-discovery');
            break;
          case 'besu':
          case 'nethermind':
            // Besu and Nethermind don't have specific v5 discovery flags
            break;
        }
      });

      it(`should configure discovery v5 port correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          discovery: {
            v5: {
              enabled: true,
              port: 30303
            }
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'erigon':
            expect(scriptString).to.contain('--caplin.discovery.port 30303');
            break;
          case 'reth':
            expect(scriptString).to.contain('--discovery.v5.port 30303');
            break;
          case 'besu':
          case 'nethermind':
          case 'geth':
            // Besu and Nethermind and Geth don't have specific v5 discovery port flags
            break;
        }
      });

      it(`should configure discovery v5 address correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          discovery: {
            v5: {
              enabled: true,
              address: '127.0.0.1'
            }
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'erigon':
            expect(scriptString).to.contain('--caplin.discovery.addr 127.0.0.1');
            break;
          case 'reth':
            expect(scriptString).to.contain('--discovery.v5.addr 127.0.0.1');
            break;
          case 'besu':
          case 'nethermind':
          case 'geth':
            // Besu and Nethermind and Geth don't have specific v5 discovery address flags
            break;
        }
      });
    });
  });

  describe.skip('DNS discovery configuration', () => {
    executionClients.forEach(client => {
      it(`should configure DNS discovery correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          discovery: {
            dns: {
              enabled: true,
              url: 'enrtree://AKA3AM6LPBYEUDMV4Y75YK5TMM6WWZPDLD5ZBTLNGR3KHANX6DPW@all.node.ethdisco.net'
            }
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'geth':
            expect(scriptString).to.contain(`--discovery.dns ${config.execution.p2p.discovery.dns.url}`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--Network.DiscoveryDns ${config.execution.p2p.discovery.dns.url}`);
            break;
          case 'reth':
            expect(scriptString).to.not.contain('--disable-dns-discovery');
            break;
          case 'besu':
          case 'erigon':
            // Besu and Erigon don't have specific DNS discovery flags
            break;
        }
      });
    });
  });

  describe.skip('NAT configuration', () => {
    executionClients.forEach(client => {
      it(`should configure NAT correctly for ${client}`, () => {
        const config = createTestConfig({
          enabled: true,
          nat: {
            enabled: true,
            method: 'upnp'
          }
        });
        config.execution.client.name = client;

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--nat-method=upnp');
            break;
          case 'erigon':
          case 'geth':
          case 'reth':
            expect(scriptString).to.contain('--nat upnp');
            break;
          case 'nethermind':
            // Nethermind doesn't have a direct NAT configuration flag
            break;
        }
      });
    });
  });
}); 