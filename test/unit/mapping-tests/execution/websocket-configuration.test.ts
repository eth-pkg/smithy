import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName } from '@/lib/types';
import { testConfig } from '@test/fixtures/configs';
import SchemaUtils from '@/utils/schema';

describe('Execution Client WebSocket Configuration Tests', () => {
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
    it(`should add WebSocket flags when enabled`, () => {
      const config = schemaUtils.deepMerge(testConfig, {
        execution: {
          client: {
            name: client,
            version: ''
          },
          ws: {
            enabled: true,
            port: 8546
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();

      switch (client) {
        case 'besu':
          expect(scriptString).to.contain('--rpc-ws-enabled');
          break;
        case 'erigon':
          expect(scriptString).to.contain('--ws');
          break;
        case 'geth':
          expect(scriptString).to.contain('--ws');
          break;
        case 'nethermind':
          expect(scriptString).to.contain('--Init.WebSocketsEnabled');
          break;
        case 'reth':
          expect(scriptString).to.contain('--ws');
          break;
      }
    });

    it(`should not add WebSocket flags when disabled`, () => {
      const config = schemaUtils.deepMerge(testConfig, {
        execution: {
          client: {
            name: client,
            version: ''
          },
          ws: {
            enabled: false,
            port: 8546
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();

      switch (client) {
        case 'besu':
          expect(scriptString).to.not.contain('--rpc-ws-enabled');
          break;
        case 'erigon':
          expect(scriptString).to.not.contain('--ws');
          break;
        case 'geth':
          expect(scriptString).to.not.contain('--ws');
          break;
        case 'nethermind':
          expect(scriptString).to.not.contain('--Init.WebSocketsEnabled');
          break;
        case 'reth':
          expect(scriptString).to.not.contain('--ws');
          break;
      }
    });

    it(`should not add port flag when WebSocket is disabled even if port is defined`, () => {
      const config = schemaUtils.deepMerge(testConfig, {
        execution: {
          client: {
            name: client,
            version: ''
          },
          ws: {
            enabled: false,
            port: 8546
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();

      switch (client) {
        case 'besu':
          expect(scriptString).to.not.contain('--rpc-ws-enabled');
          expect(scriptString).to.not.contain('--rpc-ws-port=');
          break;
        case 'erigon':
          expect(scriptString).to.not.contain('--ws');
          expect(scriptString).to.not.contain('--ws.port');
          break;
        case 'geth':
          expect(scriptString).to.not.contain('--ws');
          expect(scriptString).to.not.contain('--ws.port');
          break;
        case 'nethermind':
          expect(scriptString).to.not.contain('--Init.WebSocketsEnabled');
          expect(scriptString).to.not.contain('--JsonRpc.WebSocketsPort');
          break;
        case 'reth':
          expect(scriptString).to.not.contain('--ws');
          expect(scriptString).to.not.contain('--ws.port');
          break;
      }
    });
  });
}); 