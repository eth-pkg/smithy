import { expect } from 'chai';
import { CommandClientRegistry } from '@/command/command-client-registry';
import { ExecutionClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import { deepMerge } from '@test/fixtures/deepMerge.fixture';

describe('Execution Client Transaction Pool Configuration Tests', () => {
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
    it.skip(`should correctly configure transaction pool for ${client}`, () => {
      const config = deepMerge(testConfig, {
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