import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import { deepMerge } from '@test/fixtures/deepMerge.fixture';

describe('Execution Client Pruning Configuration Tests', () => {
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
    it.skip(`should correctly configure pruning for ${client}`, () => {
      const config = deepMerge(testConfig, {
        execution: {
          client: {
            name: client,
            version: ''
          },
          pruning: {
            enabled: true,
            blocks: 1000
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();

      expect(scriptString).to.contain('--pruning.enabled');
    });
  });
}); 