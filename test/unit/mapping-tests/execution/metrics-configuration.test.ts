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