import { expect } from 'chai';
import { CommandClientRegistry } from '@/command/command-client-registry';
import { ExecutionClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import { deepMerge } from '@test/fixtures/deepMerge.fixture';

describe('Execution Client Beacon Configuration Tests', () => {
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
    it.skip(`should correctly configure beacon for ${client}`, () => {
      const config = deepMerge(testConfig, {
        execution: {
          client: {
            name: client,
            version: ''
          },
          beacon: {
            enabled: true,
            port: 8551
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();

      expect(scriptString).to.contain('--beacon-api');
    });
  });
}); 