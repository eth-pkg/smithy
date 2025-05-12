import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName } from '@/lib/types';
import { testConfig } from '../../preset-tests/network-preset.test-helper';
import SchemaUtils from '@/utils/schema';

describe('Execution Client Metrics Configuration Tests', () => {
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
    describe(`${client} metrics configuration`, () => {
      it('should not include any metrics flags when metrics is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            metrics: {
              enabled: false,
              port: 6060,
              address: 'localhost'
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.not.contain('--metrics-enabled');
            expect(scriptString).to.not.contain('--metrics-port=');
            expect(scriptString).to.not.contain('--metrics-host=');
            break;
          case 'erigon':
            expect(scriptString).to.not.contain('--metrics');
            expect(scriptString).to.not.contain('--metrics.port');
            expect(scriptString).to.not.contain('--metrics.addr');
            break;
          case 'geth':
            expect(scriptString).to.not.contain('--metrics');
            expect(scriptString).to.not.contain('--metrics.port');
            expect(scriptString).to.not.contain('--metrics.addr');
            break;
          case 'nethermind':
            expect(scriptString).to.not.contain('--Metrics.Enabled');
            expect(scriptString).to.not.contain('--Metrics.ExposePort');
            expect(scriptString).to.not.contain('--Metrics.ExposeHost');
            break;
          case 'reth':
            expect(scriptString).to.not.contain('--metrics');
            break;
        }
      });

      it('should include basic metrics flag when metrics is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            metrics: {
              enabled: true
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--metrics-enabled');
            break;
          case 'erigon':
          case 'geth':
            expect(scriptString).to.contain('--metrics');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--Metrics.Enabled');
            break;
          case 'reth':
            expect(scriptString).to.contain('--metrics');
            break;
        }
      });

      it('should include port configuration when metrics is enabled with port', () => {
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
            expect(scriptString).to.contain(`--metrics-port=${config.execution.metrics.port}`);
            break;
          case 'erigon':
          case 'geth':
            expect(scriptString).to.contain(`--metrics.port ${config.execution.metrics.port}`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--Metrics.ExposePort ${config.execution.metrics.port}`);
            break;
          case 'reth':
            // reth doesn't support port configuration
            expect(scriptString).to.not.contain('--metrics.port');
            break;
        }
      });

      it('should include address configuration when metrics is enabled with address', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            metrics: {
              enabled: true,
              address: 'localhost'
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain(`--metrics-host=${config.execution.metrics.address}`);
            break;
          case 'erigon':
          case 'geth':
            expect(scriptString).to.contain(`--metrics.addr ${config.execution.metrics.address}`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--Metrics.ExposeHost ${config.execution.metrics.address}`);
            break;
          case 'reth':
            // reth doesn't support address configuration
            expect(scriptString).to.not.contain('--metrics.addr');
            break;
        }
      });
    });
  });
}); 