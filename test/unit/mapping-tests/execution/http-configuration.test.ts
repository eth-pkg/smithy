import { expect } from 'chai';
import { CommandClientRegistry } from '@/command/command-client-registry';
import { ExecutionClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import { deepMerge } from '@test/fixtures/deepMerge.fixture';

describe('HTTP Configuration Tests', () => {
  let registry: CommandClientRegistry;
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

  describe('HTTP Enabled/Disabled', () => {
    executionClients.forEach(client => {
      it(`should enable HTTP when enabled flag is true for ${client}`, () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            http: {
              enabled: true
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--rpc-http-enabled');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--http');
            break;
          case 'geth':
            expect(scriptString).to.contain('--http');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--JsonRpc.Enabled');
            break;
          case 'reth':
            expect(scriptString).to.contain('--http');
            break;
        }
      });

      it(`should not add any HTTP flags when disabled for ${client}`, () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            http: {
              enabled: false,
              port: 8545,
              modules: ['eth', 'net', 'web3'],
              allowlist: ['*'],
              address: 'localhost',
              tls: {
                enabled: true,
                cert: 'cert.pem',
                key: 'key.pem'
              }
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.not.contain('--rpc-http-enabled');
            expect(scriptString).to.not.contain('--rpc-http-port');
            expect(scriptString).to.not.contain('--rpc-http-api');
            expect(scriptString).to.not.contain('--rpc-http-host');
            expect(scriptString).to.not.contain('--rpc-http-cors-origins');
            expect(scriptString).to.not.contain('--rpc-http-tls');
            break;
          case 'erigon':
            expect(scriptString).to.not.contain('--http');
            expect(scriptString).to.not.contain('--http.port');
            expect(scriptString).to.not.contain('--http.api');
            expect(scriptString).to.not.contain('--http.addr');
            expect(scriptString).to.not.contain('--http.corsdomain');
            expect(scriptString).to.not.contain('--http.tls');
            break;
          case 'geth':
            expect(scriptString).to.not.contain('--http');
            expect(scriptString).to.not.contain('--http.port');
            expect(scriptString).to.not.contain('--http.api');
            expect(scriptString).to.not.contain('--http.addr');
            expect(scriptString).to.not.contain('--http.corsdomain');
            expect(scriptString).to.not.contain('--http.tls');
            break;
          case 'nethermind':
            expect(scriptString).to.not.contain('--JsonRpc.Enabled');
            expect(scriptString).to.not.contain('--JsonRpc.Enabled true');
            expect(scriptString).to.not.contain('--JsonRpc.Port');
            expect(scriptString).to.not.contain('--JsonRpc.EnabledModules');
            expect(scriptString).to.not.contain('--JsonRpc.Host');
            expect(scriptString).to.not.contain('--JsonRpc.CorsOrigins');
            break;
          case 'reth':
            expect(scriptString).to.not.contain('--http');
            expect(scriptString).to.not.contain('--http.port');
            expect(scriptString).to.not.contain('--http.api');
            expect(scriptString).to.not.contain('--http.addr');
            expect(scriptString).to.not.contain('--http.corsdomain');
            expect(scriptString).to.not.contain('--http.tls');
            break;
        }
      });
    });
  });

  describe('HTTP Port Configuration', () => {
    executionClients.forEach(client => {
      it(`should correctly configure HTTP port for ${client}`, () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            http: {
              enabled: true,
              port: 8545
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--rpc-http-port=8545');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--http.port 8545');
            break;
          case 'geth':
            expect(scriptString).to.contain('--http.port 8545');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--JsonRpc.Port 8545');
            break;
          case 'reth':
            expect(scriptString).to.contain('--http.port 8545');
            break;
        }
      });
    });
  });

  describe('HTTP API Modules Configuration', () => {
    executionClients.forEach(client => {
      it(`should correctly configure HTTP API modules for ${client}`, () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            http: {
              enabled: true,
              modules: ['eth', 'net', 'web3']
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const apiString = config.execution.http.modules.join(',');

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain(`--rpc-http-api="${apiString}"`);
            break;
          case 'erigon':
            expect(scriptString).to.contain(`--http.api "${apiString}"`);
            break;
          case 'geth':
            expect(scriptString).to.contain(`--http.api "${apiString}"`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--JsonRpc.EnabledModules "${apiString}"`);
            break;
          case 'reth':
            expect(scriptString).to.contain(`--http.api "${apiString}"`);
            break;
        }
      });
    });
  });

  describe('HTTP Host Configuration', () => {
    executionClients.forEach(client => {
      it(`should correctly configure HTTP host address for ${client}`, () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            http: {
              enabled: true,
              address: 'localhost'
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--rpc-http-host=localhost');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--http.addr localhost');
            break;
          case 'geth':
            expect(scriptString).to.contain('--http.addr localhost');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--JsonRpc.Host localhost');
            break;
          case 'reth':
            expect(scriptString).to.contain('--http.addr localhost');
            break;
        }
      });
    });
  });

  describe('HTTP CORS Configuration', () => {
    executionClients.forEach(client => {
      it(`should correctly configure HTTP CORS for ${client}`, () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            http: {
              enabled: true,
              allowlist: ['*']
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const allowlistString = config.execution.http.allowlist.join(',');

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain(`--rpc-http-cors-origins="${allowlistString}"`);
            break;
          case 'erigon':
            expect(scriptString).to.contain(`--http.corsdomain "${allowlistString}"`);
            break;
          case 'geth':
            expect(scriptString).to.contain(`--http.corsdomain "${allowlistString}"`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--JsonRpc.CorsOrigins "${allowlistString}"`);
            break;
          case 'reth':
            expect(scriptString).to.contain(`--http.corsdomain "${allowlistString}"`);
            break;
        }
      });
    });
  });

  // TODO: add tests for TLS, and extend to other clients
  // TODO: update types to include TLS configuration all new options
  describe.skip('HTTP TLS Configuration', () => {
    executionClients.forEach(client => {
      it(`should correctly configure HTTP TLS for ${client}`, () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            http: {
              enabled: true,
              tls: {
                enabled: true,
                cert: 'cert.pem',
                key: 'key.pem'
              }
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--rpc-http-tls-enabled');
            expect(scriptString).to.contain('--rpc-http-tls-cert=cert.pem');
            expect(scriptString).to.contain('--rpc-http-tls-key=key.pem');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--http.tls');
            break;
          case 'geth':
            expect(scriptString).to.contain('--http.tls');
            break;
          case 'nethermind':
            // Nethermind handles TLS differently
            // TODO: check if this is correct
            // expect(scriptString).to.contain('--JsonRpc.Enabled');
            break;
          case 'reth':
            // Reth doesn't support TLS
            expect(scriptString).to.not.contain('--http.tls');
            break;
        }
      });
    });
  });
}); 