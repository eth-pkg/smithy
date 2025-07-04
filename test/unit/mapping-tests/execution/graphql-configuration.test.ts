import { expect } from 'chai';
import { CommandClientRegistry } from '@/command/command-client-registry';
import { ExecutionClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import { deepMerge } from '@test/fixtures/deepMerge.fixture';

describe('Execution Client GraphQL Configuration Tests', () => {
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

  executionClients.forEach(client => {
    describe(`${client} GraphQL configuration`, () => {
      it('should not add GraphQL flags when disabled', () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            graphql: {
              enabled: false,
              port: 0,
              address: '',
              allowlist: []
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.not.contain('--graphql');
            expect(scriptString).to.not.contain('--graphql-http-port');
            expect(scriptString).to.not.contain('--graphql-http-host');
            expect(scriptString).to.not.contain('--graphql-http-cors-origins');
            break;
          case 'erigon':
            expect(scriptString).to.not.contain('--graphql');
            expect(scriptString).to.not.contain('--graphql.port');
            expect(scriptString).to.not.contain('--graphql.addr');
            expect(scriptString).to.not.contain('--graphql.corsdomain');
            break;
          case 'geth':
            expect(scriptString).to.not.contain('--graphql');
            expect(scriptString).to.not.contain('--graphql.port');
            expect(scriptString).to.not.contain('--graphql.corsdomain');
            break;
          case 'nethermind':
            // Nethermind doesn't support GraphQL
            break;
          case 'reth':
            // Reth doesn't support GraphQL
            break;
        }
      });

      it('should add GraphQL port flag when enabled', () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            graphql: {
              enabled: true,
              port: 8547
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--graphql');
            expect(scriptString).to.contain('--graphql-http-port=8547');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--graphql');
            expect(scriptString).to.contain('--graphql.port 8547');
            break;
          case 'geth':
            expect(scriptString).to.contain('--graphql');
            // geth doesn't have port flag
            break;
          case 'nethermind':
            // Nethermind doesn't support GraphQL
            break;
          case 'reth':
            // Reth doesn't support GraphQL
            break;
        }
      });

      it('should add GraphQL address flag when enabled', () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            graphql: {
              enabled: true,
              address: '0.0.0.0'
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--graphql');
            expect(scriptString).to.contain('--graphql-http-host=0.0.0.0');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--graphql');
            expect(scriptString).to.contain('--graphql.addr 0.0.0.0');
            break;
          case 'geth':
            expect(scriptString).to.contain('--graphql');
            // geth deosnt have address flag, it has vhosts flag
            break;
          case 'nethermind':
            // Nethermind doesn't support GraphQL
            break;
          case 'reth':
            // Reth doesn't support GraphQL
            break;
        }
      });

      it('should add GraphQL allowlist flag when enabled', () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            graphql: {
              enabled: true,
              allowlist: ['0.0.0.0/0']
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const corsDomain =  config.execution.graphql.allowlist.join(',');

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--graphql');
            expect(scriptString).to.contain(`--graphql-http-cors-origins="${corsDomain}"`);
            break;
          case 'erigon':
            expect(scriptString).to.contain('--graphql');
            expect(scriptString).to.contain(`--graphql.corsdomain "${corsDomain}"`);
            break;
          case 'geth':
            expect(scriptString).to.contain('--graphql');
            expect(scriptString).to.contain(`--graphql.corsdomain "${corsDomain}"`);
            break;
          case 'nethermind':
            // Nethermind doesn't support GraphQL
            break;
          case 'reth':
            // Reth doesn't support GraphQL
            break;
        }
      });
    });
  });
}); 