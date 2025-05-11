import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName } from '@/lib/types';
import { testConfig } from '../../preset-tests/network-preset.test-helper';
import SchemaUtils from '@/utils/schema';

describe('Execution Client Miner Configuration Tests', () => {
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
    it.skip(`should correctly configure miner for ${client}`, () => {
      const config = schemaUtils.deepMerge(testConfig, {
        execution: {
          client: {
            name: client,
            version: ''
          },
          miner: {
            enabled: true,
            coinbase: '0x0000000000000000000000000000000000000000'
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();

      expect(scriptString).to.contain('--miner.enabled');
    });
  });
}); 