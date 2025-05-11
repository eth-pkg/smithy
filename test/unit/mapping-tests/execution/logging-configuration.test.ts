import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName } from '@/lib/types';
import { testConfig } from '../../preset-tests/network-preset.test-helper';
import SchemaUtils from '@/utils/schema';

describe('Execution Client Logging Configuration Tests', () => {
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
    it.skip(`should correctly configure logging for ${client}`, () => {
      const config = schemaUtils.deepMerge(testConfig, {
        execution: {
          client: {
            name: client,
            version: ''
          },
          logging: {
            level: 'info',
            format: 'json'
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();

      expect(scriptString).to.contain('--logging-level=info');
    });
  });
}); 