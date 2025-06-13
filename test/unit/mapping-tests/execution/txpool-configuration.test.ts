import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import SchemaUtils from '@/utils/schema';

describe('Execution Client Transaction Pool Configuration Tests', () => {
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
    it.skip(`should correctly configure transaction pool for ${client}`, () => {
      const config = schemaUtils.deepMerge(testConfig, {
        execution: {
          client: {
            name: client,
            version: ''
          },
          txpool: {
            maxSize: 10000,
            priceLimit: 1
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();

      expect(scriptString).to.contain('--txpool.maxsize=10000');
    });
  });
}); 