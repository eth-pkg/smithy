import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ConsensusClientName } from '@/lib/types';
import { testConfig } from '../../preset-tests/network-preset.test-helper';
import SchemaUtils from '@/utils/schema';

describe.skip('Consensus Client Metrics Configuration Tests', () => {
  let registry: CommandClientRegistry;
  const schemaUtils = new SchemaUtils('');
  const consensusClients: ConsensusClientName[] = [
    'lighthouse',
    "lodestar",
    'nimbus-eth2',
    'prysm',
    'teku',
  ];

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  consensusClients.forEach(client => {
    describe(`${client} metrics configuration`, () => {
      it('should not include any metrics flags when metrics is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            http: {
              enabled: false
            },
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
          case 'lighthouse':
            expect(scriptString).to.not.contain('--metrics-enabled');
            expect(scriptString).to.not.contain('--metrics-port=');
            expect(scriptString).to.not.contain('--metrics-host=');
            break;
          case 'lodestar':
            expect(scriptString).to.not.contain('--metrics');
            expect(scriptString).to.not.contain('--metrics.port');
            expect(scriptString).to.not.contain('--metrics.addr');
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.contain('--metrics');
            expect(scriptString).to.not.contain('--metrics.port');
            expect(scriptString).to.not.contain('--metrics.addr');
            break;
          case 'prysm':
            expect(scriptString).to.not.contain('--Metrics.Enabled');
            expect(scriptString).to.not.contain('--Metrics.ExposePort');
            expect(scriptString).to.not.contain('--Metrics.ExposeHost');
            break;
          case 'teku':
            expect(scriptString).to.not.contain('--metrics');
            break;
        }
      });
    });
  });
}); 