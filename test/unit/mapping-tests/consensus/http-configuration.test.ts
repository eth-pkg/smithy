import { expect } from 'chai';
import { CommandClientRegistry } from '@/command/command-client-registry';
import { ConsensusClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import { deepMerge } from '@test/fixtures/deepMerge.fixture';

describe('Consensus Client HTTP Configuration Tests', () => {
  let registry: CommandClientRegistry;
  const consensusClients: ConsensusClientName[] = [
    'lighthouse',
    'lodestar',
    'nimbus-eth2',
    'prysm',
    'teku',
  ];

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  consensusClients.forEach(client => {
    describe(`${client} http configuration`, () => {
      it('should include http flags when http is enabled', () => {
        const config = deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            http: {
              enabled: true,
              port: 8545,
              api: ['eth', 'net', 'web3'],
              address: 'localhost',
              allowlist: ['*'],
              vhosts: ['*'],
            },
            client: {
              name: client,
              version: ''
            },
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const httpPort = config.consensus.http.port;
        const httpApi = config.consensus.http.api.join(',');
        const httpAddress = config.consensus.http.address;
        const httpAllowlist = config.consensus.http.allowlist.join(',');
        const httpVhosts = config.consensus.http.vhosts.join(',');
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.include('--http');
            expect(scriptString).to.include(`--http-port ${httpPort}`);
            expect(scriptString).to.include(`--http-address ${httpAddress}`);
            expect(scriptString).to.include(`--http-allow-origin "${httpAllowlist}"`);
            // TODO: modules are not present in flags 
            // TODO: vhosts are not present in flags
            break;
          case 'lodestar':
            expect(scriptString).to.include('--rest');
            expect(scriptString).to.include(`--rest.port ${httpPort}`);
            expect(scriptString).to.include(`--rest.cors "${httpAllowlist}"`);
            expect(scriptString).to.include(`--rest.namespace "${httpApi}"`);
            expect(scriptString).to.include(`--rest.address ${httpAddress}`);
            // TODO: why does lodestar has two such flags? vhosts and corsdomain
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.include('--rest');
            expect(scriptString).to.include(`--rest-port ${httpPort}`);
            expect(scriptString).to.include(`--rest-address ${httpAddress}`);
            expect(scriptString).to.include(`--rest-allow-origin "${httpAllowlist}"`);
            // TODO: modules are not present in flags 
            // TODO: vhosts are not present in flags
            break;
          case 'prysm':
            expect(scriptString).to.include(`--http-port ${httpPort}`);
            expect(scriptString).to.include(`--http-cors-domain "${httpAllowlist}"`);
            expect(scriptString).to.include(`--http-host ${httpAddress}`);
            expect(scriptString).to.include(`--http-modules ${httpApi}`);
            break;
          case 'teku':
            expect(scriptString).to.include(`--rest-api-enabled`);
            expect(scriptString).to.include(`--rest-api-interface=${httpAddress}`);
            expect(scriptString).to.include(`--rest-api-port=${httpPort}`);
            // TODO: why does teku has two such flags?
            expect(scriptString).to.include(`--rest-api-host-allowlist="${httpAllowlist}"`);
            expect(scriptString).to.include(`--rest-api-cors-origins="${httpAllowlist}"`);
            break;
        }
      });

      it('should not include http flags when http is disabled', () => {
        const config = deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            http: {
              enabled: false,
              port: 8545,
              api: ['eth', 'net', 'web3'],
              address: 'localhost',
              allowlist: ['*'],
              vhosts: ['*'],
            },
            client: {
              name: client,
              version: ''
            },
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const httpPort = config.consensus.http.port;
        const httpApi = config.consensus.http.api.join(',');
        const httpAddress = config.consensus.http.address;
        const httpAllowlist = config.consensus.http.allowlist.join(',');
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.include('--http');
            expect(scriptString).to.not.include(`--http-port ${httpPort}`);
            expect(scriptString).to.not.include(`--http-address ${httpAddress}`);
            expect(scriptString).to.not.include(`--http-allow-origin "${httpAllowlist}"`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.include('--rest');
            expect(scriptString).to.not.include(`--rest.port ${httpPort}`);
            expect(scriptString).to.not.include(`--rest.cors "${httpAllowlist}"`);
            expect(scriptString).to.not.include(`--rest.namespace "${httpApi}"`);
            expect(scriptString).to.not.include(`--rest.address ${httpAddress}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.include('--rest');
            expect(scriptString).to.not.include(`--rest-port ${httpPort}`);
            expect(scriptString).to.not.include(`--rest-address ${httpAddress}`);
            expect(scriptString).to.not.include(`--rest-allow-origin "${httpAllowlist}"`);
            break;
          case 'prysm':
            expect(scriptString).to.not.include(`--http-port ${httpPort}`);
            expect(scriptString).to.not.include(`--http-cors-domain "${httpAllowlist}"`);
            expect(scriptString).to.not.include(`--http-host ${httpAddress}`);
            expect(scriptString).to.not.include(`--http-modules ${httpApi}`);
            break;
          case 'teku':
            expect(scriptString).to.not.include(`--rest-api-enabled`);
            expect(scriptString).to.not.include(`--rest-api-interface=${httpAddress}`);
            expect(scriptString).to.not.include(`--rest-api-port=${httpPort}`);
            expect(scriptString).to.not.include(`--rest-api-host-allowlist="${httpAllowlist}"`);
            expect(scriptString).to.not.include(`--rest-api-cors-origins="${httpAllowlist}"`);
            break;
        }
      });
    });
  });
}); 